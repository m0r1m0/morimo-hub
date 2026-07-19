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
