import express from "express";
import {
  createRental,
  getMyRentals,
} from "../controllers/rentalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRental);

router.get("/my", protect, getMyRentals);

export default router;