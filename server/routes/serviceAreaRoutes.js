import express from "express";

import {
  checkServiceAvailability,
  getServiceAreas,
  createServiceArea,
  updateServiceArea,
  deleteServiceArea,
} from "../controllers/serviceAreaController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// CUSTOMER
// CHECK SERVICE AVAILABILITY
// ==========================================

router.get(
  "/check",
  protect,
  checkServiceAvailability
);

// ==========================================
// ADMIN
// GET ALL SERVICE AREAS
// ==========================================

router.get(
  "/",
  protect,
  adminOnly,
  getServiceAreas
);

// ==========================================
// ADMIN
// CREATE SERVICE AREA
// ==========================================

router.post(
  "/",
  protect,
  adminOnly,
  createServiceArea
);

// ==========================================
// ADMIN
// UPDATE SERVICE AREA
// ==========================================

router.put(
  "/:id",
  protect,
  adminOnly,
  updateServiceArea
);

// ==========================================
// ADMIN
// DELETE SERVICE AREA
// ==========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteServiceArea
);

export default router;