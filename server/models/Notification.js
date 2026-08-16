import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // NOTIFICATION TYPE
    // ==========================================

    type: {
      type: String,
      enum: [
        "system",
        "order",
        "payment",
        "return",
        "maintenance",
        "extension",
      ],
      default: "system",
    },

    // ==========================================
    // TITLE
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // MESSAGE
    // ==========================================

    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // READ STATUS
    // ==========================================

    read: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // RELATED ORDER
    // ==========================================

    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // ==========================================
    // RELATED MAINTENANCE
    // ==========================================

    relatedMaintenance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Maintenance",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Notification",
  notificationSchema
);