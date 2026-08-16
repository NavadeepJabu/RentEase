import axios from "axios";
import mongoose from "mongoose";

import asyncHandler from "../utils/asyncHandler.js";

import Order from "../models/Order.js";
import User from "../models/User.js";

// =====================================================
// CREATE CASHFREE PAYMENT ORDER
// =====================================================

export const createCashfreeOrder = asyncHandler(
  async (req, res) => {
    const { orderId } = req.params;

    // =================================================
    // FIND RENT EASE ORDER
    // =================================================

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // =================================================
    // CHECK CUSTOMER OWNERSHIP
    // =================================================

    if (
      order.customer.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to pay for this order",
      });
    }

    // =================================================
    // CHECK ORDER STATUS
    // =================================================

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled orders cannot be paid",
      });
    }

    if (order.orderStatus === "Returned") {
      return res.status(400).json({
        success: false,
        message:
          "Returned orders cannot be paid",
      });
    }

    // =================================================
    // CHECK PAYMENT GROUP
    // =================================================

    const paymentGroupId =
      order.paymentGroupId;

    if (!paymentGroupId) {
      return res.status(400).json({
        success: false,
        message:
          "Payment group not found for this order",
      });
    }

    // =================================================
    // GET ALL ORDERS IN SAME PAYMENT GROUP
    // =================================================

    const orders = await Order.find({
      paymentGroupId,
      customer: req.user.id,
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Payment group orders not found",
      });
    }

    // =================================================
    // CHECK WHETHER EVERYTHING IS ALREADY PAID
    // =================================================

    const allPaid = orders.every(
      (item) =>
        item.paymentStatus === "Paid"
    );

    if (allPaid) {
      return res.status(400).json({
        success: false,
        message:
          "This payment group is already paid",
      });
    }

    // =================================================
    // CHECK INVALID ORDERS
    // =================================================

    const invalidOrder = orders.find(
      (item) =>
        item.orderStatus === "Cancelled" ||
        item.orderStatus === "Returned"
    );

    if (invalidOrder) {
      return res.status(400).json({
        success: false,
        message:
          "One or more orders cannot be paid",
      });
    }

    // =================================================
    // CALCULATE COMBINED PAYMENT AMOUNT
    // =================================================

    const amount = orders.reduce(
      (sum, item) =>
        sum + Number(item.totalAmount || 0),
      0
    );

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment amount",
      });
    }

    // =================================================
    // GET CUSTOMER
    // =================================================

    const customer = await User.findById(
      req.user.id
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message:
          "Customer not found",
      });
    }

    // =================================================
    // VALIDATE CUSTOMER PHONE
    // =================================================

    if (!customer.phone) {
      return res.status(400).json({
        success: false,
        message:
          "Customer phone number is required",
      });
    }

    // =================================================
    // VALIDATE CASHFREE CREDENTIALS
    // =================================================

    if (
      !process.env.CASHFREE_APP_ID ||
      !process.env.CASHFREE_SECRET_KEY
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Cashfree credentials are not configured",
      });
    }

    // =================================================
    // CREATE UNIQUE CASHFREE ORDER ID
    // =================================================

    /*
     * IMPORTANT:
     *
     * We previously used:
     *
     * RENTEASE_GROUP_<paymentGroupId>
     *
     * That caused Cashfree:
     *
     * 409 order_already_exists
     *
     * because the same ID was sent again.
     *
     * Now every payment attempt gets a unique
     * Cashfree order ID.
     */

    const uniqueSuffix =
      `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

    const cashfreeOrderId =
      `RENTEASE_GROUP_${paymentGroupId}_${uniqueSuffix}`;

    console.log(
      "=========================================="
    );

    console.log(
      "CREATING CASHFREE PAYMENT ORDER"
    );

    console.log(
      "Payment Group:",
      paymentGroupId
    );

    console.log(
      "Cashfree Order ID:",
      cashfreeOrderId
    );

    console.log(
      "Amount:",
      amount
    );

    console.log(
      "=========================================="
    );

    // =================================================
    // CASHFREE CREATE ORDER REQUEST
    // =================================================

    let response;

    try {
      response = await axios.post(
        "https://sandbox.cashfree.com/pg/orders",

        {
          order_id:
            cashfreeOrderId,

          order_amount:
            amount,

          order_currency:
            "INR",

          customer_details: {
            customer_id:
              req.user.id.toString(),

            customer_name:
              customer.fullName ||
              "RentEase Customer",

            customer_email:
              customer.email,

            customer_phone:
              customer.phone,
          },

          order_meta: {
            return_url:
              `${process.env.FRONTEND_URL}/payment-success?order_id={order_id}`,
          },

          order_note:
            `RentEase payment group ${paymentGroupId}`,
        },

        {
          headers: {
            "x-client-id":
              process.env.CASHFREE_APP_ID,

            "x-client-secret":
              process.env.CASHFREE_SECRET_KEY,

            "x-api-version":
              "2025-01-01",

            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },
        }
      );
    } catch (error) {
      console.error(
        "=========================================="
      );

      console.error(
        "CASHFREE CREATE ORDER ERROR"
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "=========================================="
      );

      return res.status(
        error.response?.status === 409
          ? 409
          : 500
      ).json({
        success: false,

        message:
          error.response?.data?.message ||
          "Failed to create Cashfree payment order",

        cashfreeError:
          error.response?.data || null,
      });
    }

    // =================================================
    // SAVE CASHFREE ORDER ID
    // TO ALL ORDERS IN PAYMENT GROUP
    // =================================================

    await Order.updateMany(
      {
        paymentGroupId,
        customer: req.user.id,
      },
      {
        $set: {
          cashfreeOrderId:
            response.data.order_id,
        },
      }
    );

    // =================================================
    // RETURN PAYMENT INFORMATION
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Cashfree payment order created",

      paymentGroupId,

      cashfreeOrderId:
        response.data.order_id,

      paymentSessionId:
        response.data.payment_session_id,

      amount,

      orderIds:
        orders.map(
          (item) => item._id
        ),
    });
  }
);


// =====================================================
// VERIFY CASHFREE PAYMENT
// =====================================================

// =====================================================
// VERIFY CASHFREE PAYMENT
// =====================================================

export const verifyCashfreePayment = asyncHandler(
  async (req, res) => {
    const { orderId } = req.params;

    console.log("==========================================");
    console.log("PAYMENT VERIFICATION STARTED");
    console.log("Received ID:", orderId);
    console.log("Customer:", req.user.id);
    console.log("==========================================");

    // =================================================
    // FIND RENT EASE ORDER
    // =================================================

    let order = null;

    // -------------------------------------------------
    // 1. Try MongoDB Order ID
    // -------------------------------------------------

    if (
      mongoose.Types.ObjectId.isValid(orderId)
    ) {
      order = await Order.findOne({
        _id: orderId,
        customer: req.user.id,
      });
    }

    // -------------------------------------------------
    // 2. Try Cashfree Order ID
    // -------------------------------------------------

    if (!order) {
      order = await Order.findOne({
        cashfreeOrderId: orderId,
        customer: req.user.id,
      });
    }

    // -------------------------------------------------
    // 3. Extract Payment Group ID
    //
    // Cashfree ID format:
    //
    // RENTEASE_GROUP_<paymentGroupId>_<timestamp>_<random>
    //
    // Example:
    //
    // RENTEASE_GROUP_RENTGROUP_12345_98765_ABC123
    // -------------------------------------------------

    let paymentGroupId = null;

    if (
      orderId &&
      orderId.startsWith("RENTEASE_GROUP_")
    ) {
      const remaining =
        orderId.replace(
          "RENTEASE_GROUP_",
          ""
        );

      const parts =
        remaining.split("_");

      /*
       * Our paymentGroupId itself may contain
       * underscores.
       *
       * The last two values are:
       *
       * timestamp
       * random suffix
       *
       * Therefore remove the final 2 values.
       */

      if (parts.length >= 3) {
        parts.pop();
        parts.pop();

        paymentGroupId =
          parts.join("_");
      }
    }

    console.log(
      "Extracted Payment Group:",
      paymentGroupId
    );

    // -------------------------------------------------
    // 4. If direct order lookup failed,
    //    find using paymentGroupId
    // -------------------------------------------------

    if (!order && paymentGroupId) {
      order = await Order.findOne({
        paymentGroupId,
        customer: req.user.id,
      });
    }

    // =================================================
    // ORDER STILL NOT FOUND
    // =================================================

    if (!order) {
      console.error(
        "NO RENT EASE ORDER FOUND"
      );

      console.error(
        "Cashfree ID:",
        orderId
      );

      console.error(
        "Payment Group:",
        paymentGroupId
      );

      return res.status(404).json({
        success: false,
        paid: false,
        message:
          "Order or payment information not found",
      });
    }

    // =================================================
    // CHECK CUSTOMER OWNERSHIP
    // =================================================

    if (
      order.customer.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        paid: false,
        message:
          "You are not allowed to verify this payment",
      });
    }

    // =================================================
    // GET PAYMENT GROUP
    // =================================================

    paymentGroupId =
      order.paymentGroupId ||
      paymentGroupId;

    if (!paymentGroupId) {
      return res.status(400).json({
        success: false,
        paid: false,
        message:
          "Payment group not found",
      });
    }

    // =================================================
    // GET ALL ORDERS IN PAYMENT GROUP
    // =================================================

    const orders = await Order.find({
      paymentGroupId,
      customer: req.user.id,
    });

    if (
      !orders ||
      orders.length === 0
    ) {
      return res.status(404).json({
        success: false,
        paid: false,
        message:
          "Payment group orders not found",
      });
    }

    console.log(
      "Orders in payment group:",
      orders.length
    );

    // =================================================
    // CHECK IF ALREADY PAID
    // =================================================

    const allPaid = orders.every(
      (item) =>
        item.paymentStatus === "Paid"
    );

    if (allPaid) {
      return res.status(200).json({
        success: true,
        paid: true,
        paymentGroupId,
        message:
          "Payment already completed",
        paymentStatus: "Paid",
      });
    }

    // =================================================
    // USE THE CASHFREE ORDER ID
    // =================================================

    const cashfreeOrderId =
      orderId.startsWith("RENTEASE_")
        ? orderId
        : order.cashfreeOrderId;

    if (!cashfreeOrderId) {
      return res.status(400).json({
        success: false,
        paid: false,
        message:
          "Cashfree payment order has not been created",
      });
    }

    console.log(
      "Cashfree Order ID:",
      cashfreeOrderId
    );

    // =================================================
    // EXPECTED PAYMENT AMOUNT
    // =================================================

    const expectedAmount =
      orders.reduce(
        (sum, item) =>
          sum +
          Number(
            item.totalAmount || 0
          ),
        0
      );

    console.log(
      "Expected Amount:",
      expectedAmount
    );

    // =================================================
    // GET PAYMENTS FROM CASHFREE
    // =================================================

    let response;

    try {
      response = await axios.get(
        `https://sandbox.cashfree.com/pg/orders/${cashfreeOrderId}/payments`,
        {
          headers: {
            "x-client-id":
              process.env.CASHFREE_APP_ID,

            "x-client-secret":
              process.env.CASHFREE_SECRET_KEY,

            "x-api-version":
              "2025-01-01",

            Accept:
              "application/json",
          },
        }
      );
    } catch (error) {
      console.error(
        "=========================================="
      );

      console.error(
        "CASHFREE VERIFICATION ERROR"
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "=========================================="
      );

      return res.status(500).json({
        success: false,
        paid: false,
        message:
          error.response?.data?.message ||
          "Failed to verify payment with Cashfree",
      });
    }

    // =================================================
    // CASHFREE PAYMENTS
    // =================================================

    const payments =
      Array.isArray(response.data)
        ? response.data
        : [];

    console.log(
      "Cashfree Payments:",
      payments
    );

    // =================================================
    // FIND SUCCESSFUL PAYMENT
    // =================================================

    const successfulPayment =
      payments.find(
        (payment) =>
          payment.payment_status ===
          "SUCCESS"
      );

    // =================================================
    // PAYMENT SUCCESS
    // =================================================

    if (successfulPayment) {
      const paidAmount =
        Number(
          successfulPayment.payment_amount
        );

      console.log(
        "Paid Amount:",
        paidAmount
      );

      // ------------------------------------------------
      // VERIFY AMOUNT
      // ------------------------------------------------

      if (
        paidAmount !==
        expectedAmount
      ) {
        return res.status(400).json({
          success: false,
          paid: false,
          message:
            "Payment amount does not match order total",
          expectedAmount,
          paidAmount,
        });
      }

      // ------------------------------------------------
      // MARK ALL ORDERS IN GROUP AS PAID
      // ------------------------------------------------

      await Order.updateMany(
        {
          paymentGroupId,
          customer: req.user.id,
        },
        {
          $set: {
            paymentStatus: "Paid",
            cashfreeOrderId,
          },
        }
      );

      console.log(
        "ALL ORDERS MARKED AS PAID"
      );

      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      return res.status(200).json({
        success: true,

        paid: true,

        paymentGroupId,

        message:
          "Payment verified successfully",

        paymentStatus:
          "Paid",

        paymentId:
          successfulPayment.cf_payment_id ||
          successfulPayment.payment_id ||
          null,

        paidAmount,

        orderIds:
          orders.map(
            (item) => item._id
          ),
      });
    }

    // =================================================
    // PAYMENT NOT SUCCESSFUL
    // =================================================

    return res.status(200).json({
      success: true,

      paid: false,

      paymentGroupId,

      message:
        "Payment has not been completed",

      paymentStatus:
        "Pending",
    });
  }
);