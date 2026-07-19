import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { services } from "./services";

it("ヒーロー・全サービス・フッターを表示する", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "MORIMO" })).toBeInTheDocument();
  for (const s of services) {
    expect(screen.getByRole("link", { name: new RegExp(s.name) })).toBeInTheDocument();
  }
  expect(screen.getByRole("link", { name: /GITHUB/ })).toBeInTheDocument();
});
