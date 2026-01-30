import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ProductCard } from "../ProductCard";
import type { Product } from "../../types/Product";

const mockProduct: Product = {
  id: 1,
  title: "Test Product",
  price: 99.99,
  category: "electronics",
  image: "test.jpg",
  rating: { rate: 4.5, count: 120 },
  description: "Test description",
};

describe("ProductCard", () => {
  test("renders product details", () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("electronics")).toBeInTheDocument();
  });
});
