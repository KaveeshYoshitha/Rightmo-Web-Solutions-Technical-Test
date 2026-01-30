import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import type { Product } from "../types/Product";
import { api } from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!product) {
    return (
      <Container className="py-20 text-center">
        <Typography variant="h5" className="mb-4">
          Product not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <Container maxWidth="lg" className="py-4">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
            Back to Products
          </Button>
        </Container>
      </header>

      <Container maxWidth="lg" className="py-8">
        <Card className="overflow-hidden">
          <Grid container spacing={2}>
            {/* Product Image  */}
            <Grid size={{ xs: 6, md: 4 }}>
              <Box
                className="bg-gray-100 p-8 flex items-center justify-center max-h-3/6"
                style={{ minHeight: "600px" }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-w-full max-h-125 object-contain"
                />
              </Box>
            </Grid>

            {/* Product Information */}
            <Grid size={{ xs: 6, md: 8 }}>
              <Box className="p-8">
                <Stack spacing={3}>
                  {/* Category */}
                  <Box>
                    <Chip
                      label={product.category}
                      color="primary"
                      size="medium"
                    />
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h4"
                    component="h1"
                    className="font-bold text-gray-900"
                  >
                    {product.title}
                  </Typography>

                  {/* Rating */}
                  <Box className="flex items-center gap-3">
                    <Rating
                      value={product.rating.rate}
                      precision={0.1}
                      readOnly
                      size="large"
                    />
                    <Typography
                      variant="body1"
                      className="text-gray-600 font-medium"
                    >
                      {product.rating.rate.toFixed(1)} ({product.rating.count}{" "}
                      reviews)
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Price */}
                  <Box className="bg-blue-50 p-4 rounded-lg">
                    <Typography
                      variant="h3"
                      className="font-bold text-blue-600"
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Description */}
                  <Box>
                    <Typography
                      variant="h6"
                      className="font-semibold mb-3 text-gray-900"
                    >
                      Product Description
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-gray-700 leading-relaxed"
                    >
                      {product.description ||
                        "No description available for this product."}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      variant="h6"
                      className="font-semibold mb-3 text-gray-900"
                    >
                      Specifications
                    </Typography>
                    <Stack spacing={2}>
                      <Box className="flex justify-between py-2">
                        <Typography variant="body1" className="text-gray-600">
                          Product ID:
                        </Typography>
                        <Typography
                          variant="body1"
                          className="font-medium text-gray-900"
                        >
                          #{product.id}
                        </Typography>
                      </Box>
                      <Box className="flex justify-between py-2">
                        <Typography variant="body1" className="text-gray-600">
                          Category:
                        </Typography>
                        <Typography
                          variant="body1"
                          className="font-medium text-gray-900"
                        >
                          {product.category}
                        </Typography>
                      </Box>
                      <Box className="flex justify-between py-2">
                        <Typography variant="body1" className="text-gray-600">
                          Average Rating:
                        </Typography>
                        <Typography
                          variant="body1"
                          className="font-medium text-gray-900"
                        >
                          {product.rating.rate.toFixed(1)} / 5.0
                        </Typography>
                      </Box>
                      <Box className="flex justify-between py-2">
                        <Typography variant="body1" className="text-gray-600">
                          Total Reviews:
                        </Typography>
                        <Typography
                          variant="body1"
                          className="font-medium text-gray-900"
                        >
                          {product.rating.count}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </div>
  );
}
