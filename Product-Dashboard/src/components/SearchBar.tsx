import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useProductStore } from "../store/ProductStore";

export function SearchBar() {
  const search = useProductStore((state) => state.search);

  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
      onChange={(e) => search(e.target.value)}
      placeholder="Search products by name or category..."
    />
  );
}
