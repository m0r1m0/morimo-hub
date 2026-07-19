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
