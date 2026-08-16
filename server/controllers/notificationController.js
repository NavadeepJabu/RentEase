import asyncHandler from "../utils/asyncHandler.js";
import Notification from "../models/Notification.js";

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

export const getMyNotifications =
  asyncHandler(async (req, res) => {

    const notifications =
      await Notification.find({
        user: req.user.id,
      })
        .populate(
          "relatedOrder",
          "orderStatus paymentStatus totalAmount"
        )
        .sort({
          createdAt: -1,
        })
        .limit(50);

    const unreadCount =
      await Notification.countDocuments({
        user: req.user.id,
        read: false,
      });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  });


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

export const markNotificationAsRead =
  asyncHandler(async (req, res) => {

    const notification =
      await Notification.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    notification.read = true;

    await notification.save();

    return res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      notification,
    });
  });


// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllNotificationsAsRead =
  asyncHandler(async (req, res) => {

    await Notification.updateMany(
      {
        user: req.user.id,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "All notifications marked as read",
    });
  });


// ==========================================
// DELETE NOTIFICATION
// ==========================================

export const deleteNotification =
  asyncHandler(async (req, res) => {

    const notification =
      await Notification.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    await notification.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Notification deleted",
    });
  });

  // ==========================================
// TEST NOTIFICATION
// ==========================================

export const createTestNotification =
  asyncHandler(async (req, res) => {

    const notifications =
  await Notification.find({
    user: req.user.id,
  })
    .populate(
      "relatedOrder",
      "orderStatus paymentStatus totalAmount"
    )
    .populate(
      "relatedMaintenance",
      "status priority issue description"
    )
    .sort({
      createdAt: -1,
    })
    .limit(50);

    return res.status(201).json({
      success: true,
      message:
        "Test notification created",
      notification,
    });
  });