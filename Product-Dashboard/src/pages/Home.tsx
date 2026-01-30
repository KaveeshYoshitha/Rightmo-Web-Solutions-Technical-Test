import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
  TextField,
} from "@mui/material";
import { SearchBar } from "../components/SearchBar";
import { ProductCard } from "../components/ProductCard";
import { useProductStore } from "../store/ProductStore";
import { Filters } from "../components/Filters";
import { api } from "../services/api";
import { useAuthStore } from "../store/AuthStore";
import type { Product } from "../types/Product";

type ProductFormState = {
  title: string;
  price: string;
  description: string;
  category: string;
  image: string;
  rate: string;
  rate_count: string;
};

const emptyForm: ProductFormState = {
  title: "",
  price: "",
  description: "",
  category: "",
  image: "",
  rate: "",
  rate_count: "",
};

export default function ProductDashboard() {
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { user, logout } = useAuthStore();

  const { filteredProducts, setProducts, currentPage, itemsPerPage, setPage } =
    useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/get-products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setFormError(null);
    setDialogMode("create");
    setActiveProductId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setFormError(null);
    setDialogMode("edit");
    setActiveProductId(product.id);
    setForm({
      title: product.title ?? "",
      price: String(product.price ?? ""),
      description: product.description ?? "",
      category: product.category ?? "",
      image: product.image ?? "",
      rate: String(product.rating?.rate ?? ""),
      rate_count: String(product.rating?.count ?? ""),
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
  };

  const submitDialog = async () => {
    setFormError(null);

    if (!user?.id) {
      setFormError("You must be logged in to manage products.");
      return;
    }

    const title = form.title.trim();
    const description = form.description.trim();
    const category = form.category.trim();
    const image = form.image.trim();

    const price = Number(form.price);
    const rate = Number(form.rate);
    const rate_count = Number(form.rate_count);

    if (!title || !description || !category || !image) {
      setFormError("Please fill all fields.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Price must be a positive number.");
      return;
    }

    if (!Number.isFinite(rate) || rate < 0 || rate > 5) {
      setFormError("Rating must be between 0 and 5.");
      return;
    }

    if (!Number.isFinite(rate_count) || rate_count < 0) {
      setFormError("Rating count must be 0 or greater.");
      return;
    }

    const payload = {
      title,
      price,
      description,
      category,
      image,
      rate,
      rate_count,
    };

    try {
      setSaving(true);
      if (dialogMode === "create") {
        await api.post(`/products/add-product/${user.id}`, payload);
      } else {
        if (!activeProductId) {
          setFormError("No product selected for editing.");
          return;
        }
        await api.put(
          `/products/edit-product/${user.id}/${activeProductId}`,
          payload,
        );
      }

      setDialogOpen(false);
      await fetchProducts();
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product: Product) => {
    if (!user?.id) return;

    const ok = window.confirm(`Delete "${product.title}"?`);
    if (!ok) return;

    try {
      await api.delete(`/products/delete-product/${user.id}/${product.id}`);
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Product Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Browse and filter products from our collection
              </p>
              {user && (
                <p className="mt-1 text-sm text-gray-500">
                  Signed in as{" "}
                  <span className="font-medium">{user.username}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="contained"
                onClick={openCreateDialog}
                sx={{ whiteSpace: "nowrap" }}
              >
                Add Product
              </Button>

              <Button
                variant="outlined"
                onClick={() => logout()}
                sx={{ whiteSpace: "nowrap" }}
              >
                Logout
              </Button>
            </div>
          </div>
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
                    <ProductCard
                      key={p.id}
                      product={p}
                      onEdit={openEditDialog}
                      onDelete={deleteProduct}
                    />
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

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogMode === "create" ? "Add Product" : "Edit Product"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} className="pt-2">
            {formError && <Alert severity="error">{formError}</Alert>}

            <TextField
              label="Title"
              value={form.title}
              onChange={(e) =>
                setForm((s) => ({ ...s, title: e.target.value }))
              }
              disabled={saving}
              required
              fullWidth
            />

            <TextField
              label="Price"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={form.price}
              onChange={(e) =>
                setForm((s) => ({ ...s, price: e.target.value }))
              }
              disabled={saving}
              required
              fullWidth
            />

            <TextField
              label="Category"
              value={form.category}
              onChange={(e) =>
                setForm((s) => ({ ...s, category: e.target.value }))
              }
              disabled={saving}
              required
              fullWidth
            />

            <TextField
              label="Image URL"
              value={form.image}
              onChange={(e) =>
                setForm((s) => ({ ...s, image: e.target.value }))
              }
              disabled={saving}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm((s) => ({ ...s, description: e.target.value }))
              }
              disabled={saving}
              required
              fullWidth
              multiline
              minRows={3}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Rating (0-5)"
                type="number"
                inputProps={{ min: 0, max: 5, step: "0.1" }}
                value={form.rate}
                onChange={(e) =>
                  setForm((s) => ({ ...s, rate: e.target.value }))
                }
                disabled={saving}
                required
                fullWidth
              />
              <TextField
                label="Rating count"
                type="number"
                inputProps={{ min: 0, step: "1" }}
                value={form.rate_count}
                onChange={(e) =>
                  setForm((s) => ({ ...s, rate_count: e.target.value }))
                }
                disabled={saving}
                required
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={submitDialog} disabled={saving}>
            {dialogMode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
