import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    months: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    monthlyRent: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // DELIVERY
    // =========================

    deliveryDate: {
      type: Date,
      default: null,
    },

    deliverySlot: {
      type: String,
      enum: [
        "9:00 AM - 12:00 PM",
        "12:00 PM - 3:00 PM",
        "3:00 PM - 6:00 PM",
        "6:00 PM - 9:00 PM",
      ],
      default: null,
    },

    // =========================
    // RENTAL DATES
    // =========================

    rentalStartDate: {
      type: Date,
      default: null,
    },

    rentalEndDate: {
      type: Date,
      default: null,
    },

    // =========================
    // RENTAL EXTENSION
    // =========================

    extensionRequested: {
      type: Boolean,
      default: false,
    },

    extensionMonths: {
      type: Number,
      default: 0,
    },

    extensionAmount: {
      type: Number,
      default: 0,
    },

    extensionStatus: {
      type: String,
      enum: [
        "Not Requested",
        "Requested",
        "Approved",
        "Rejected",
      ],
      default: "Not Requested",
    },

    extensionRequestedAt: {
      type: Date,
      default: null,
    },

    extensionApprovedAt: {
      type: Date,
      default: null,
    },

    // =========================
    // RETURN
    // =========================

    returnRequested: {
      type: Boolean,
      default: false,
    },

    returnRequestDate: {
      type: Date,
      default: null,
    },

    returnStatus: {
      type: String,
      enum: [
        "Not Requested",
        "Requested",
        "Approved",
        "Rejected",
        "Completed",
      ],
      default: "Not Requested",
    },

    // =========================
    // DAMAGE HANDLING
    // =========================

    damageStatus: {
      type: String,
      enum: [
        "Not Inspected",
        "No Damage",
        "Damaged",
      ],
      default: "Not Inspected",
    },

    damageDescription: {
      type: String,
      default: "",
      trim: true,
    },

    damageCharge: {
      type: Number,
      default: 0,
    },

    // Prevent inventory restoration twice
    inventoryRestored: {
      type: Boolean,
      default: false,
    },

    // =========================
    // PAYMENT
    // =========================

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    cashfreeOrderId: {
  type: String,
  default: null,
},

// =========================
// MULTI-PRODUCT PAYMENT GROUP
// =========================

paymentGroupId: {
  type: String,
  default: null,
  index: true,
},

paymentGroupTotal: {
  type: Number,
  default: 0,
},

    // =========================
    // ORDER STATUS
    // =========================

    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Approved",
        "Shipped",
        "Delivered",
        "Returned",
        "Cancelled",
      ],
      default: "Placed",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);