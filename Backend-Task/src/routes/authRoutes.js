import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
  currentUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

//user / auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/me", protect, currentUser);

export default router;
