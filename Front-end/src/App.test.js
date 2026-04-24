import { render, screen } from "@testing-library/react";
import App from "./App";
import ShopContextProvider from "./Context/ShopContext";

test("renders the shopper home page", () => {
  render(
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  );

  expect(
    screen.getByRole("heading", { name: /popular in women/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});
