import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  CardActionArea,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductCard({
  product,
  onEdit = () => {},
  onDelete = () => {},
}: ProductCardProps) {
  const priceValue = Number(product.price);
  const formattedPrice = Number.isFinite(priceValue)
    ? priceValue.toFixed(2)
    : "0.00";

  const ratingValue = Number(product.rating?.rate ?? 0);
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardActionArea component={Link} to={`/product/${product.id}`}>
        {/* Product Image */}
        <CardMedia
          component="div"
          className="aspect-square bg-gray-100 p-6 flex items-center justify-center"
        >
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
          />
        </CardMedia>

        <CardContent>
          {/* Category Badge */}
          <Box className="mb-2">
            <Chip
              label={product.category}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>

          {/* Product Name */}
          <Typography
            variant="h6"
            component="h3"
            className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-12"
          >
            {product.title}
          </Typography>

          {/* Rating */}
          <Box className="flex items-center gap-2 mb-3">
            <Rating
              value={Number.isFinite(ratingValue) ? ratingValue : 0}
              precision={0.1}
              size="small"
              readOnly
            />
            <Typography variant="body2" className="text-gray-600">
              ({product.rating.count})
            </Typography>
          </Box>

          {/* Price */}
          <Typography variant="h5" className="font-bold text-gray-900">
            ${formattedPrice}
          </Typography>
        </CardContent>
      </CardActionArea>

      <Box className="px-4 pb-4 flex items-center justify-end gap-2">
        <Button size="small" variant="outlined" onClick={() => onEdit(product)}>
          Edit
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          onClick={() => onDelete(product)}
        >
          Delete
        </Button>
      </Box>
    </Card>
  );
}
