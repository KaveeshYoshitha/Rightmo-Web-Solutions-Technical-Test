import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProducts,
  getProductsById,
} from "../controllers/productsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/get-products", protect, getProducts);
router.get("/get-product/:id", protect, getProductsById);
router.post("/add-product/:userId", protect, addProduct);
router.put("/edit-product/:userId/:id", protect, editProduct);
router.delete("/delete-product/:userId/:id", protect, deleteProduct);
export default router;
