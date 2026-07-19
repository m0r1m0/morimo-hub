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
