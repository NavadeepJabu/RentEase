import express from "express";
import { addToCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getCart } from "../controllers/cartController.js";
import { removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:id", protect, removeFromCart);

export default router;