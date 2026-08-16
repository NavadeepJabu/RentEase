import express from "express";

import {
  createOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,

  requestReturn,
  getReturnRequests,
  updateReturnStatus,

  requestExtension,
  getExtensionRequests,
  updateExtensionStatus,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// =====================================================
// CUSTOMER
// =====================================================

// Place Order
router.post(
  "/",
  protect,
  createOrder
);

// Get My Orders
router.get(
  "/my",
  protect,
  getMyOrders
);

// Cancel Order
router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

// =====================================================
// RENTAL EXTENSION - CUSTOMER
// =====================================================

// Request Rental Extension
router.put(
  "/:id/extension",
  protect,
  requestExtension
);

// =====================================================
// RETURN - CUSTOMER
// =====================================================

// Request Return
router.put(
  "/:id/return",
  protect,
  requestReturn
);

// =====================================================
// ADMIN
// =====================================================

// -----------------------------------------------------
// ADMIN - EXTENSION MANAGEMENT
// -----------------------------------------------------

// Get Extension Requests
router.get(
  "/admin/extensions",
  protect,
  adminOnly,
  getExtensionRequests
);

// Approve / Reject Extension
router.put(
  "/admin/:id/extension",
  protect,
  adminOnly,
  updateExtensionStatus
);

// -----------------------------------------------------
// ADMIN - RETURN MANAGEMENT
// -----------------------------------------------------

// Get Return Requests
router.get(
  "/admin/returns",
  protect,
  adminOnly,
  getReturnRequests
);

// Update Return
router.put(
  "/admin/:id/return",
  protect,
  adminOnly,
  updateReturnStatus
);

// -----------------------------------------------------
// ADMIN - ORDERS
// -----------------------------------------------------

// Get All Orders
router.get(
  "/admin",
  protect,
  adminOnly,
  getAllOrders
);

// Update Order Status
router.put(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

export default router;