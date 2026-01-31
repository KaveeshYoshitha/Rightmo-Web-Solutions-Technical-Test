import { useProductStore } from "../ProductStore";

describe("ProductStore", () => {
  test("sets products and categories", () => {
    const products = [
      {
        id: 1,
        title: "A",
        category: "cat1",
        price: 10,
        rating: { rate: 4, count: 1 },
      },
      {
        id: 2,
        title: "B",
        category: "cat2",
        price: 20,
        rating: { rate: 5, count: 2 },
      },
    ] as any;

    useProductStore.getState().setProducts(products);

    const state = useProductStore.getState();
    expect(state.products.length).toBe(2);
    expect(state.categories).toEqual(["cat1", "cat2"]);
  });
});
