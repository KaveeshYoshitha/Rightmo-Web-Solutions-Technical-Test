import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useProductStore } from "../store/ProductStore";

export function Filters() {
  const categories = useProductStore((s) => s.categories);
  const filterByCategory = useProductStore((s) => s.filterByCategory);
  const sortByPrice = useProductStore((s) => s.sortByPrice);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <FormControl className="flex-1" size="small">
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          label="Category"
          defaultValue="all"
          onChange={(e) => filterByCategory(e.target.value as string)}
        >
          <MenuItem value="all">All Categories</MenuItem>

          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl className="flex-1" size="small">
        <InputLabel id="sort-label">Sort By Price</InputLabel>
        <Select
          labelId="sort-label"
          label="Sort By Price"
          defaultValue="default"
          onChange={(e) => {
            const value = e.target.value as "default" | "asc" | "desc";
            if (value) sortByPrice(value);
          }}
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="asc">Price: Low to High</MenuItem>
          <MenuItem value="desc">Price: High to Low</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
