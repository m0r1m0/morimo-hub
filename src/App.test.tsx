import { render, screen } from "@testing-library/react";
import { App } from "./App";

it("MORIMO の見出しを表示する", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "MORIMO" })).toBeInTheDocument();
});
