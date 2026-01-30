import { render, screen, fireEvent } from "@testing-library/react";
import { Filters } from "../Filters";

const mockFilterByCategory = jest.fn();
const mockSortByPrice = jest.fn();

jest.mock("../../store/ProductStore", () => ({
  useProductStore: (selector: any) =>
    selector({
      categories: ["electronics", "clothing"],
      filterByCategory: mockFilterByCategory,
      sortByPrice: mockSortByPrice,
    }),
}));

describe("Filters Component", () => {
  test("renders category options dynamically", () => {
    render(<Filters />);

    fireEvent.mouseDown(screen.getByLabelText(/category/i));

    expect(screen.getByRole("option", { name: "electronics" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "clothing" })).toBeInTheDocument();
  });

  test("calls filterByCategory on change", () => {
    render(<Filters />);

    fireEvent.mouseDown(screen.getByLabelText(/category/i));
    fireEvent.click(screen.getByRole("option", { name: "electronics" }));

    expect(mockFilterByCategory).toHaveBeenCalledWith("electronics");
  });
});
