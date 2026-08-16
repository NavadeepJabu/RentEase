import express from "express";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createTestNotification,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();


// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

router.get(
  "/",
  protect,
  getMyNotifications
);


// ==========================================
// MARK ONE AS READ
// ==========================================

router.put(
  "/:id/read",
  protect,
  markNotificationAsRead
);


// ==========================================
// MARK ALL AS READ
// ==========================================

router.put(
  "/read-all",
  protect,
  markAllNotificationsAsRead
);


// ==========================================
// DELETE
// ==========================================

router.delete(
  "/:id",
  protect,
  deleteNotification
);

router.post(
  "/test",
  protect,
  createTestNotification
);


export default router;