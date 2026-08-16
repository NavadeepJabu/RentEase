import express from "express";

import {
  createCashfreeOrder,
  verifyCashfreePayment,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();


// =====================================================
// CREATE CASHFREE PAYMENT ORDER
// =====================================================

router.post(
  "/create-order/:orderId",
  protect,
  createCashfreeOrder
);

// =====================================================
// VERIFY CASHFREE PAYMENT
// =====================================================

router.get(
  "/verify/:orderId",
  protect,
  verifyCashfreePayment
);

export default router;