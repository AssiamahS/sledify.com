import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";

// Example test file - delete this and add your own tests
describe("Example Test Suite", () => {
  it("should render correctly", () => {
    render(<div data-testid="example">Hello World</div>);
    expect(screen.getByTestId("example")).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("should demonstrate async testing", async () => {
    render(
      <button onClick={() => console.log("clicked")}>Click me</button>
    );
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
});
