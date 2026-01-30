import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  CardActionArea,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardActionArea>
        <Link to={`/product/${product.id}`}>
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
                value={product.rating.rate}
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
              ${product.price.toFixed(2)}
            </Typography>
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  );
}
