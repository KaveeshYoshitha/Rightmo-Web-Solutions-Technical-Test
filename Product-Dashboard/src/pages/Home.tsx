import { useState, useEffect } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import { SearchBar } from "../components/SearchBar";
import { ProductCard } from "../components/ProductCard";
import { useProductStore } from "../store/ProductStore";
import { Filters } from "../components/Filters";
import { api } from "../services/api";

export default function ProductDashboard() {
  const [loading, setLoading] = useState(true);

  const { filteredProducts, setProducts, currentPage, itemsPerPage, setPage } =
    useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and filter products from our collection
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="w-full lg:w-auto lg:flex-1">
              <Filters />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </p>
        </div>

        {/* Spinner */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <CircularProgress size={40} />
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">
                  No products found matching your criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setPage(page)}
                    color="primary"
                    shape="rounded"
                    className="flex justify-center mt-6"
                    showFirstButton
                    showLastButton
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
