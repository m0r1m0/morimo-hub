# morimo-hub 設計書

作成日: 2026-07-19

## 目的

morimo.dev のルートに置く、morimo シリーズ（自作ツール・サービス群）のハブ／ランディングページ。
採用担当者や同業者に「こんなものを作っている」と見せられるポートフォリオとして機能する。

背景: これまで morimo.dev で配信していたブログは blog.morimo.dev へ移行済みで、ルートは空いている。

## 掲載内容

### ヒーロー
- 巨大タイポグラフィの「MORIMO」（画面幅いっぱいに近いスケール）
- その下に「PERSONAL TOOLS & SERVICES」の小さなラベル
- ナビゲーションヘッダーとキャッチコピーは置かない

### サービスリスト

番号付きのテキストリスト。各行は「番号・サービス名（大きめのタイポ）・一言説明・URL」で構成し、行全体がリンク。

| # | 名前 | 一言説明 | リンク先 |
|---|------|----------|----------|
| 01 | castorimo | 画面共有をタブ切り替えで済ませる共有ツール | https://castorimo.morimo.dev |
| 02 | pomorimo | ポモドーロタイマー | https://pomorimo.morimo.dev |
| 03 | jongrimo | 麻雀の待ち牌判定ツール | https://jongrimo.morimo.dev |
| 04 | todorimo | タスク管理サービス | https://todorimo.morimo.dev |
| 05 | blog | 技術ブログ | https://blog.morimo.dev |

### フッター
- 一言プロフィール:「個人開発者 morimo — つくったものを置いておく場所」（デザインモックの文言をそのまま使う）
- GitHub リンクはデザインモックのフッターには未反映だが、本スペックではフッターに含める
- GitHub リンク: https://github.com/m0r1m0
- コピーライト表記

## デザイン

`docs/design.pen` の「Design A - Minimal Typographic」フレームを正とする。

- 白背景・モノクロ（#FFFFFF / #1A1A1A / #666666）。アクセントカラーなし
- フォント: 見出し・サービス名は Geist、ラベル・URL は Geist Mono、日本語は Noto Sans JP（いずれも Google Fonts）
- 区切り線や罫線は使わず、余白のみでセクションを分離する
- レスポンシブ対応: モバイルでは「MORIMO」タイポを画面幅に合わせて縮小し、サービス行は縦積み（番号＋名前の下に説明と URL）に切り替える

## 技術構成

- Vite + React (TypeScript) の静的 SPA（1 ページのみ、ルーティングなし）
- サービス一覧は `src/services.ts` のデータ配列で管理（名前・説明・URL・番号）
- コンポーネント構成: `App` / `Hero` / `ServiceList` / `ServiceRow` / `Footer` 程度の小さな分割
- スタイルは素の CSS。CSS フレームワークは使わない
- メタタグ: title・description・基本の OGP タグ（og:title / og:description / og:url）を `index.html` に静的記述

## デプロイ

- GitHub リポジトリ（m0r1m0/morimo-hub）を作成
- Cloudflare Pages に `wrangler pages deploy` でデプロイ
- カスタムドメイン morimo.dev を割り当て

## テスト

- Vitest + React Testing Library による smoke テスト
  - サービスデータ全件がレンダリングされ、正しい href を持つこと
  - フッターの GitHub リンクが存在すること
- それ以上の網羅的なテストは行わない（静的ページのため、ビルド成功と目視確認を基本とする）

## スコープ外

- ダークモード
- OGP 画像の動的生成（静的メタタグのみ）
- アクセス解析
- サービス詳細ページ・ブログ機能（各サービスへのリンク集に徹する）
