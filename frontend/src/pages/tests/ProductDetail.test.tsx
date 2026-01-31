import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductDetail from "../ProductDetail";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  useNavigate: () => jest.fn(),
}));

jest.mock("../../services/api", () => ({
  api: {
    get: jest.fn(() =>
      Promise.resolve({
        data: {
          id: 1,
          title: "Test Product",
          price: 100,
          category: "electronics",
          image: "img",
          description: "desc",
          rating: { rate: 4.5, count: 50 },
        },
      }),
    ),
  },
}));

describe("ProductDetail Page", () => {
  test("renders product details", async () => {
    render(
      <BrowserRouter>
        <ProductDetail />
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Test Product")).toBeInTheDocument(),
    );

    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getAllByText("electronics").length).toBeGreaterThan(0);
  });
});
