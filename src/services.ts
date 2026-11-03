export interface Service {
  index: string;
  name: string;
  description: string;
  url: string;
  /** サービス名アクセント色（固有部分に着色） */
  accent: string;
  /** 色を付ける部分を明示する場合に指定（省略時は "rimo" の手前まで） */
  accentPrefix?: string;
}

export const services: Service[] = [
  {
    index: "01",
    name: "castorimo",
    description: "画面共有をタブ切り替えで済ませる共有ツール",
    url: "https://castorimo.morimo.dev",
    accent: "#2F6FED",
  },
  {
    index: "02",
    name: "pomorimo",
    description: "ポモドーロタイマー",
    url: "https://pomorimo.morimo.dev",
    accent: "#E0453E",
  },
  {
    index: "03",
    name: "jongrimo",
    description: "麻雀の待ち牌判定ツール",
    url: "https://jongrimo.morimo.dev",
    accent: "#1FA463",
  },
  {
    index: "04",
    name: "todorimo",
    description: "タスク管理サービス",
    url: "https://todorimo.morimo.dev",
    accent: "#6C4CE0",
  },
  {
    index: "05",
    name: "kiritorimo",
    description: "音声からクリップを切り出すツール",
    url: "https://kiritorimo.morimo.dev",
    accent: "#2F8F83",
    accentPrefix: "kiritori",
  },
  {
    index: "06",
    name: "blog",
    description: "技術ブログ",
    url: "https://blog.morimo.dev",
    accent: "#E5793B",
  },
];

/**
 * サービス名を「固有部分」と共通サフィックス "rimo" に分割する。
 * 案A（固有部分にアクセント色）のための分割。
 * "rimo" を持たない名前（blog 等）は全体を固有部分として返す。
 * accentPrefix を渡した場合（kiritorimo → "kiritori" 等）はそこで分割する。
 */
export function splitServiceName(
  name: string,
  accentPrefix?: string,
): { prefix: string; suffix: string } {
  if (accentPrefix && name.startsWith(accentPrefix)) {
    return { prefix: accentPrefix, suffix: name.slice(accentPrefix.length) };
  }
  if (name.endsWith("rimo") && name.length > "rimo".length) {
    return { prefix: name.slice(0, -"rimo".length), suffix: "rimo" };
  }
  return { prefix: name, suffix: "" };
}
