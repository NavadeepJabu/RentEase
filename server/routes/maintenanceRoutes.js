import express from "express";

import {
  createMaintenanceRequest,
  getMyMaintenanceRequests,
  getAllMaintenanceRequests,
  updateMaintenanceRequest,
  getMaintenanceStats,
  getAssignableStaff,
} from "../controllers/maintenanceController.js";

import { adminOnly } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// CUSTOMER
// =====================================================

// Create maintenance request
router.post(
  "/",
  protect,
  createMaintenanceRequest
);

// Get my maintenance requests
router.get(
  "/my",
  protect,
  getMyMaintenanceRequests
);

// =====================================================
// ADMIN
// =====================================================

// Get maintenance statistics
router.get(
  "/admin/stats",
  protect,
  adminOnly,
  getMaintenanceStats
);

// Get all maintenance requests
router.get(
  "/admin",
  protect,
  adminOnly,
  getAllMaintenanceRequests
);

// =====================================================
// ADMIN - GET ASSIGNABLE STAFF
// =====================================================

router.get(
  "/admin/staff",
  protect,
  adminOnly,
  getAssignableStaff
);

// Update maintenance request
router.put(
  "/admin/:id",
  protect,
  adminOnly,
  updateMaintenanceRequest
);

export default router;