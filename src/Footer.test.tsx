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
