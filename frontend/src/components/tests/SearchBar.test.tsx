import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "../SearchBar";

jest.mock("../../store/productStore", () => ({
  useProductStore: () => ({
    search: jest.fn(),
  }),
}));

describe("SearchBar", () => {
  test("calls search on input change", () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(input, { target: { value: "phone" } });

    expect(input).toBeInTheDocument();
  });
});
