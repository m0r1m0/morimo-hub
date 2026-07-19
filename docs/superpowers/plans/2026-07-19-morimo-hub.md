# morimo-hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** morimo.dev のルートに置く morimo シリーズのポートフォリオハブ（1 ページの静的サイト）を作り、Cloudflare Pages にデプロイする。

**Architecture:** Vite + React (TypeScript) の単一ページ SPA。サービス一覧は `src/services.ts` のデータ配列で管理し、`Hero` / `ServiceList` / `ServiceRow` / `Footer` の小さなコンポーネントで構成する。スタイルは素の CSS 1 ファイル。ビルド成果物 `dist/` を `wrangler pages deploy` で配信する。

**Tech Stack:** pnpm / Vite / React 19 / TypeScript (strict) / Vitest + React Testing Library / Cloudflare Pages (wrangler)

**Spec:** `docs/superpowers/specs/2026-07-19-morimo-hub-design.md`

## Global Constraints

- デザインは `docs/design.pen` の「Design A - Minimal Typographic」を正とする
- 使用色は `#FFFFFF` / `#1A1A1A` / `#666666` のみ。アクセントカラー・罫線・区切り線は使わない（分離は余白のみ）
- フォント: 見出し・サービス名 = Geist、ラベル・URL・フッター = Geist Mono、日本語 = Noto Sans JP（Google Fonts）
- ナビゲーションヘッダーとキャッチコピーは置かない。フッターにプロフィール文は置かない
- サービスは 5 件・この順序: castorimo / pomorimo / jongrimo / todorimo / blog（説明文はスペックの表を一字一句使用）
- GitHub リンクは https://github.com/m0r1m0
- パッケージマネージャは pnpm。コミットは日本語 or Conventional Commits 形式（`feat:` / `docs:` など）

---

### Task 1: プロジェクトのスキャフォールド

Vite + React + TypeScript + Vitest の骨組みを作り、smoke テストとビルドが通る状態にする。

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `.gitignore`
- Create: `src/main.tsx`, `src/App.tsx`, `src/App.test.tsx`, `src/test-setup.ts`, `src/styles.css`（空でよい）

**Interfaces:**
- Produces: `App` コンポーネント（named export `App`）、`pnpm test` / `pnpm build` コマンド

- [ ] **Step 1: 依存関係をセットアップ**

```bash
cd /home/yukiw/repos/morimo-hub
pnpm init
pnpm add react react-dom
pnpm add -D vite @vitejs/plugin-react typescript @types/react @types/react-dom vitest jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: 設定ファイルを作成**

`package.json` に追記（`pnpm init` の生成内容へマージ。`"type": "module"` を必ず入れる）:

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  }
}
```

`vite.config.ts`:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
  },
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "vite.config.ts"]
}
```

`.gitignore`:

```
node_modules/
dist/
```

`src/test-setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

`index.html`（メタタグ・フォントは Task 5 で入れるので最小限）:

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>morimo.dev</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/styles.css` は空ファイルで作成。

- [ ] **Step 3: 失敗するテストを書く**

`src/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { App } from "./App";

it("MORIMO の見出しを表示する", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "MORIMO" })).toBeInTheDocument();
});
```

- [ ] **Step 4: テストが失敗することを確認**

Run: `pnpm test`
Expected: FAIL（`./App` が存在しない）

- [ ] **Step 5: 最小実装**

`src/App.tsx`:

```tsx
export function App() {
  return <h1>MORIMO</h1>;
}
```

- [ ] **Step 6: テストとビルドが通ることを確認**

Run: `pnpm test && pnpm build`
Expected: テスト 1 件 PASS、`dist/` が生成される

- [ ] **Step 7: コミット**

```bash
git add -A
git commit -m "feat: Vite + React + Vitest のプロジェクト骨組みを追加"
```

---

### Task 2: サービスデータモジュール

**Files:**
- Create: `src/services.ts`
- Test: `src/services.test.ts`

**Interfaces:**
- Produces: `interface Service { index: string; name: string; description: string; url: string }` と `const services: Service[]`（named exports）

- [ ] **Step 1: 失敗するテストを書く**

`src/services.test.ts`:

```ts
import { services } from "./services";

it("5 件のサービスをスペックの順序で持つ", () => {
  expect(services.map((s) => s.name)).toEqual([
    "castorimo",
    "pomorimo",
    "jongrimo",
    "todorimo",
    "blog",
  ]);
});

it("すべて https の URL と連番 index を持つ", () => {
  services.forEach((s, i) => {
    expect(s.url).toMatch(/^https:\/\/[a-z.]+morimo\.dev$/);
    expect(s.index).toBe(String(i + 1).padStart(2, "0"));
    expect(s.description.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `pnpm test`
Expected: FAIL（`./services` が存在しない）

- [ ] **Step 3: 実装**

`src/services.ts`:

```ts
export interface Service {
  index: string;
  name: string;
  description: string;
  url: string;
}

export const services: Service[] = [
  {
    index: "01",
    name: "castorimo",
    description: "画面共有をタブ切り替えで済ませる共有ツール",
    url: "https://castorimo.morimo.dev",
  },
  {
    index: "02",
    name: "pomorimo",
    description: "ポモドーロタイマー",
    url: "https://pomorimo.morimo.dev",
  },
  {
    index: "03",
    name: "jongrimo",
    description: "麻雀の待ち牌判定ツール",
    url: "https://jongrimo.morimo.dev",
  },
  {
    index: "04",
    name: "todorimo",
    description: "タスク管理サービス",
    url: "https://todorimo.morimo.dev",
  },
  {
    index: "05",
    name: "blog",
    description: "技術ブログ",
    url: "https://blog.morimo.dev",
  },
];
```

- [ ] **Step 4: テストが通ることを確認**

Run: `pnpm test`
Expected: 全件 PASS

- [ ] **Step 5: コミット**

```bash
git add src/services.ts src/services.test.ts
git commit -m "feat: サービス一覧データを追加"
```

---

### Task 3: ServiceRow / ServiceList コンポーネント

**Files:**
- Create: `src/ServiceRow.tsx`, `src/ServiceList.tsx`
- Test: `src/ServiceList.test.tsx`

**Interfaces:**
- Consumes: `Service` / `services`（Task 2）
- Produces: `ServiceRow({ service }: { service: Service })`、`ServiceList()`（引数なし、named exports）

- [ ] **Step 1: 失敗するテストを書く**

`src/ServiceList.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { ServiceList } from "./ServiceList";
import { services } from "./services";

it("全サービスを行リンクとして表示する", () => {
  render(<ServiceList />);
  for (const s of services) {
    const link = screen.getByRole("link", { name: new RegExp(s.name) });
    expect(link).toHaveAttribute("href", s.url);
    expect(link).toHaveTextContent(s.description);
    expect(link).toHaveTextContent(s.index);
  }
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `pnpm test`
Expected: FAIL（`./ServiceList` が存在しない）

- [ ] **Step 3: 実装**

`src/ServiceRow.tsx`:

```tsx
import type { Service } from "./services";

export function ServiceRow({ service }: { service: Service }) {
  return (
    <li>
      <a className="service-row" href={service.url}>
        <span className="service-index">{service.index}</span>
        <span className="service-name">{service.name}</span>
        <span className="service-meta">
          <span className="service-desc">{service.description}</span>
          <span className="service-url">{new URL(service.url).host} ↗</span>
        </span>
      </a>
    </li>
  );
}
```

`src/ServiceList.tsx`:

```tsx
import { services } from "./services";
import { ServiceRow } from "./ServiceRow";

export function ServiceList() {
  return (
    <ul className="services">
      {services.map((s) => (
        <ServiceRow key={s.name} service={s} />
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `pnpm test`
Expected: 全件 PASS

- [ ] **Step 5: コミット**

```bash
git add src/ServiceRow.tsx src/ServiceList.tsx src/ServiceList.test.tsx
git commit -m "feat: サービス一覧コンポーネントを追加"
```

---

### Task 4: Hero / Footer コンポーネント

**Files:**
- Create: `src/Hero.tsx`, `src/Footer.tsx`
- Test: `src/Footer.test.tsx`

**Interfaces:**
- Produces: `Hero()`、`Footer()`（引数なし、named exports）

- [ ] **Step 1: 失敗するテストを書く**

`src/Footer.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

it("GitHub リンクとコピーライトを表示する", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: /GITHUB/ })).toHaveAttribute(
    "href",
    "https://github.com/m0r1m0",
  );
  expect(screen.getByText(/© 2026 morimo/)).toBeInTheDocument();
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `pnpm test`
Expected: FAIL（`./Footer` が存在しない）

- [ ] **Step 3: 実装**

`src/Hero.tsx`:

```tsx
export function Hero() {
  return (
    <header className="hero">
      <h1>MORIMO</h1>
      <p className="hero-label">PERSONAL TOOLS &amp; SERVICES</p>
    </header>
  );
}
```

`src/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="footer">
      <a href="https://github.com/m0r1m0">GITHUB ↗</a>
      <span>© 2026 morimo</span>
    </footer>
  );
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `pnpm test`
Expected: 全件 PASS

- [ ] **Step 5: コミット**

```bash
git add src/Hero.tsx src/Footer.tsx src/Footer.test.tsx
git commit -m "feat: Hero と Footer コンポーネントを追加"
```

---

### Task 5: App 組み立て・スタイル・メタタグ

**Files:**
- Modify: `src/App.tsx`, `src/App.test.tsx`, `src/styles.css`, `index.html`

**Interfaces:**
- Consumes: `Hero` / `ServiceList` / `Footer`（Task 3, 4）

- [ ] **Step 1: App のテストを更新（先に失敗させる）**

`src/App.test.tsx` を全置換:

```tsx
import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { services } from "./services";

it("ヒーロー・全サービス・フッターを表示する", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "MORIMO" })).toBeInTheDocument();
  expect(screen.getByText("PERSONAL TOOLS & SERVICES")).toBeInTheDocument();
  for (const s of services) {
    expect(screen.getByRole("link", { name: new RegExp(s.name) })).toBeInTheDocument();
  }
  expect(screen.getByRole("link", { name: /GITHUB/ })).toBeInTheDocument();
});
```

- [ ] **Step 2: テストが失敗することを確認**

Run: `pnpm test`
Expected: App.test.tsx が FAIL（App は h1 しか描画していない）

- [ ] **Step 3: App を組み立てる**

`src/App.tsx` を全置換:

```tsx
import { Hero } from "./Hero";
import { ServiceList } from "./ServiceList";
import { Footer } from "./Footer";

export function App() {
  return (
    <>
      <Hero />
      <ServiceList />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: テストが通ることを確認**

Run: `pnpm test`
Expected: 全件 PASS

- [ ] **Step 5: スタイルを実装**

`src/styles.css` を全置換:

```css
:root {
  --color-bg: #ffffff;
  --color-ink: #1a1a1a;
  --color-muted: #666666;
  --font-display: "Geist", sans-serif;
  --font-mono: "Geist Mono", monospace;
  --font-jp: "Noto Sans JP", sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-jp);
  overflow-x: hidden;
}

.hero {
  padding: 72px 0 16px;
  text-align: center;
}

.hero h1 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: min(23.5vw, 340px);
  letter-spacing: -0.05em;
  line-height: 1;
  white-space: nowrap;
}

.hero-label {
  margin-top: 24px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--color-muted);
}

.services {
  list-style: none;
  padding: 64px 160px;
}

.service-row {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 36px 0;
  text-decoration: none;
  color: inherit;
}

.service-row:hover .service-name {
  text-decoration: underline;
}

.service-index {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-muted);
}

.service-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 44px;
  letter-spacing: -0.02em;
}

.service-meta {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: right;
}

.service-desc {
  font-size: 14px;
}

.service-url {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-muted);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 56px;
}

.footer a,
.footer span {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--color-muted);
  text-decoration: none;
}

@media (max-width: 720px) {
  .services {
    padding: 40px 24px;
  }

  .service-row {
    flex-wrap: wrap;
    gap: 12px 16px;
    padding: 28px 0;
  }

  .service-name {
    font-size: 32px;
  }

  .service-meta {
    margin-left: 0;
    width: 100%;
    text-align: left;
  }

  .footer {
    padding: 32px 24px;
  }
}
```

- [ ] **Step 6: index.html にメタタグとフォントを追加**

`index.html` の `<head>` を全置換:

```html
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>morimo.dev</title>
    <meta name="description" content="morimo シリーズ — 自作ツール・サービスのハブ" />
    <meta property="og:title" content="morimo.dev" />
    <meta property="og:description" content="morimo シリーズ — 自作ツール・サービスのハブ" />
    <meta property="og:url" content="https://morimo.dev" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geist:wght@700;800&family=Geist+Mono&family=Noto+Sans+JP:wght@400;500&display=swap"
      rel="stylesheet"
    />
  </head>
```

- [ ] **Step 7: テスト・ビルド・目視確認**

Run: `pnpm test && pnpm build`
Expected: 全件 PASS、ビルド成功

Run: `pnpm dev` を起動し、ブラウザで `docs/design.pen` の Design A と見比べる（巨大 MORIMO・サービス 5 行・フッター両端配置・モバイル幅での縦積み）。確認後にサーバーを止める。

- [ ] **Step 8: コミット**

```bash
git add -A
git commit -m "feat: ページ組み立てとスタイル・メタタグを実装"
```

---

### Task 6: 旧ブログ URL のリダイレクト

**Files:**
- Create: `public/_redirects`

**Interfaces:**
- Produces: Cloudflare Pages が解釈する `_redirects`（ビルドで `dist/_redirects` にコピーされる）

- [ ] **Step 1: `_redirects` を作成**

`public/_redirects`:

```
/posts/*  https://blog.morimo.dev/posts/:splat  301
/rss.xml  https://blog.morimo.dev/rss.xml  301
/tools  https://blog.morimo.dev/tools  301
```

- [ ] **Step 2: ビルド成果物に含まれることを確認**

Run: `pnpm build && cat dist/_redirects`
Expected: 上記 3 行が表示される

- [ ] **Step 3: コミット**

```bash
git add public/_redirects
git commit -m "feat: 旧ブログ URL を blog.morimo.dev へ 301 リダイレクト"
```

---

### Task 7: GitHub リポジトリ作成と Cloudflare Pages デプロイ

**Files:** なし（外部サービスの操作）

**Interfaces:**
- Consumes: `dist/`（Task 6 までのビルド成果物）

- [ ] **Step 1: GitHub リポジトリを作成して push**

```bash
gh repo create m0r1m0/morimo-hub --public --source . --push
```

Expected: リポジトリが作成され main が push される

- [ ] **Step 2: Cloudflare Pages プロジェクトを作成してデプロイ**

```bash
pnpm build
npx wrangler pages project create morimo-hub --production-branch main
npx wrangler pages deploy dist --project-name morimo-hub
```

Expected: `https://morimo-hub.pages.dev`（または類似の URL）が出力される

- [ ] **Step 3: デプロイ結果を確認**

Run: `curl -s https://morimo-hub.pages.dev | grep -o "<title>morimo.dev</title>"`
Expected: `<title>morimo.dev</title>` が出力される（本文は React がクライアントで描画するため HTML には含まれない。ページ全体はブラウザで目視確認する）

- [ ] **Step 4: 完了報告**

デプロイ URL をユーザーに報告し、目視確認を依頼する。

---

### Task 8: カスタムドメイン morimo.dev の付け替え

**Files:** なし（Cloudflare ダッシュボード操作が中心）

⚠️ このタスクは本番ドメインの付け替えを含むため、実行前に必ずユーザーの確認を取ること。ダッシュボード操作はユーザーに依頼する。

- [ ] **Step 1: ユーザーに付け替えの実施を確認**

morimo-hub.pages.dev の表示確認が済んでいることを確認してから進める。

- [ ] **Step 2: ブログ側から morimo.dev の割り当てを解除（ユーザー操作）**

Cloudflare ダッシュボード → ブログの Pages プロジェクト → Custom domains → `morimo.dev` を削除（`blog.morimo.dev` は残す）。

- [ ] **Step 3: morimo-hub に morimo.dev を割り当て（ユーザー操作）**

Cloudflare ダッシュボード → morimo-hub プロジェクト → Custom domains → `morimo.dev` を追加。

- [ ] **Step 4: 動作確認**

```bash
curl -sI https://morimo.dev | head -5
curl -sI https://morimo.dev/posts/101 | grep -i location
curl -sI https://blog.morimo.dev | head -3
```

Expected: morimo.dev が 200（新ハブ）、`/posts/101` の Location が `https://blog.morimo.dev/posts/101`、blog.morimo.dev が引き続き 200

- [ ] **Step 5: 完了報告**

すべての URL の確認結果をユーザーに報告する。
