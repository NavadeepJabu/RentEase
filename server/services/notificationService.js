import Notification from "../models/Notification.js";


// =====================================================
// CREATE NOTIFICATION
// =====================================================

export const createNotification = async ({
  userId,
  type = "system",
  title,
  message,
  orderId = null,
  maintenanceId = null,
}) => {

  try {

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (
      !userId ||
      !title ||
      !message
    ) {
      console.log(
        "NOTIFICATION ERROR: Missing required data"
      );

      return null;
    }


    // ---------------------------------------------
    // CREATE NOTIFICATION
    // ---------------------------------------------

    const notification =
      await Notification.create({
        user: userId,

        type,

        title,

        message,

        read: false,

        relatedOrder:
          orderId,

        relatedMaintenance:
          maintenanceId,
      });


    console.log(
      "NOTIFICATION CREATED:",
      notification._id.toString()
    );


    return notification;

  } catch (error) {

    console.error(
      "NOTIFICATION CREATION ERROR:",
      error
    );

    return null;
  }
};