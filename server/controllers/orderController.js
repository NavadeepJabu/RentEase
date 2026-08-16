import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import asyncHandler from "../utils/asyncHandler.js";
import Notification from "../models/Notification.js";

import {
  createNotification,
} from "../services/notificationService.js";

// ==============================
// Create Order
// ==============================

// =====================================================
// CREATE ORDER(S) FROM CHECKOUT CART
// =====================================================

export const createOrder = asyncHandler(
  async (req, res) => {

    const session =
      await mongoose.startSession();

    try {

      await session.startTransaction();


      // ==========================================
      // GET CHECKOUT DATA
      // ==========================================

      const {
        items,
        deliveryAddress,
        deliveryDate,
        deliverySlot,
      } = req.body;


      // ==========================================
      // VALIDATE ITEMS
      // ==========================================

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {

        throw new Error(
          "At least one rental product is required"
        );
      }


      // ==========================================
      // VALIDATE ADDRESS
      // ==========================================

      if (
        !deliveryAddress ||
        !deliveryAddress.trim()
      ) {

        throw new Error(
          "Delivery address is required"
        );
      }


      // ==========================================
      // DELIVERY DATE
      // ==========================================

      let finalDeliveryDate = null;


      if (deliveryDate) {

        finalDeliveryDate =
          new Date(deliveryDate);


        if (
          Number.isNaN(
            finalDeliveryDate.getTime()
          )
        ) {

          throw new Error(
            "Invalid delivery date"
          );
        }
      }


      // ==========================================
      // CREATE PAYMENT GROUP
      // ==========================================

      const paymentGroupId =
        `RENTGROUP_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`;


      const createdOrders = [];

      let paymentGroupTotal = 0;


      // ==========================================
      // PROCESS EACH PRODUCT
      // ==========================================

      for (
        const item of items
      ) {

        const product =
          item.product;


        const months =
          Number(item.months);


        const quantity =
          Number(item.quantity || 1);


        // ======================================
        // VALIDATE PRODUCT
        // ======================================

        if (!product) {

          throw new Error(
            "Product is required for every cart item"
          );
        }


        if (
          !months ||
          months <= 0
        ) {

          throw new Error(
            "Valid rental duration is required for every product"
          );
        }


        if (
          quantity < 1
        ) {

          throw new Error(
            "Quantity must be at least 1"
          );
        }


        // ======================================
        // CHECK EXISTING ACTIVE ORDER
        // ======================================

        const existingOrder =
          await Order.findOne({

            customer:
              req.user.id,

            product,

            orderStatus: {
              $in: [
                "Placed",
                "Approved",
                "Shipped",
                "Delivered",
              ],
            },

          }).session(session);


        if (existingOrder) {

          throw new Error(
            `You already have an active order for this product.`
          );
        }


        // ======================================
        // FIND PRODUCT
        // ======================================

        const selectedProduct =
          await Product.findById(
            product
          ).session(session);


        if (!selectedProduct) {

          throw new Error(
            "One of the selected products was not found"
          );
        }


        // ======================================
        // CHECK PRODUCT AVAILABILITY
        // ======================================

        if (
          !selectedProduct.available
        ) {

          throw new Error(
            `${selectedProduct.name} is currently unavailable`
          );
        }


        // ======================================
        // CHECK STOCK
        // ======================================

        if (
          quantity >
          selectedProduct.quantity
        ) {

          throw new Error(
            `Only ${selectedProduct.quantity} item(s) of ${selectedProduct.name} are available in stock`
          );
        }


        // ======================================
        // VALIDATE RENTAL TENURE
        // ======================================

        const allowedTenures =
          selectedProduct.rentalTenure ||
          [];


        if (
          allowedTenures.length > 0 &&
          !allowedTenures.includes(
            months
          )
        ) {

          throw new Error(
            `Selected rental duration is not available for ${selectedProduct.name}`
          );
        }


        // ======================================
        // REDUCE INVENTORY
        // ======================================

        selectedProduct.quantity -=
          quantity;


        if (
          selectedProduct.quantity === 0
        ) {

          selectedProduct.available =
            false;
        }


        await selectedProduct.save({
          session,
        });


        // ======================================
        // CALCULATE RENT
        // ======================================

        const monthlyRent =
          Number(
            selectedProduct.monthlyRent
          );


        const securityDeposit =
          Number(
            selectedProduct.securityDeposit
          );


        const totalAmount =
          monthlyRent *
            months *
            quantity +

          securityDeposit *
            quantity;


        paymentGroupTotal +=
          totalAmount;


        // ======================================
        // RENTAL DATES
        // ======================================

        const rentalStartDate =
          new Date();


        const rentalEndDate =
          new Date(
            rentalStartDate
          );


        rentalEndDate.setMonth(
          rentalEndDate.getMonth() +
            months
        );


        // ======================================
        // CREATE ORDER
        // ======================================

        const order =
          await Order.create(
            [
              {

                customer:
                  req.user.id,

                product,

                months,

                quantity,

                monthlyRent,

                securityDeposit,

                totalAmount,

                deliveryAddress:
                  deliveryAddress.trim(),

                deliveryDate:
                  finalDeliveryDate,

                deliverySlot:
                  deliverySlot ||
                  null,

                rentalStartDate,

                rentalEndDate,


                // ==========================
                // RETURN
                // ==========================

                returnRequested:
                  false,

                returnRequestDate:
                  null,

                returnStatus:
                  "Not Requested",


                // ==========================
                // DAMAGE
                // ==========================

                damageStatus:
                  "Not Inspected",

                damageDescription:
                  "",

                damageCharge:
                  0,

                inventoryRestored:
                  false,


                // ==========================
                // PAYMENT
                // ==========================

                paymentStatus:
                  "Pending",

                cashfreeOrderId:
                  null,

                paymentGroupId,

                // Will be updated after
                // total is calculated.

                paymentGroupTotal:
                  0,


                // ==========================
                // ORDER STATUS
                // ==========================

                orderStatus:
                  "Placed",

              },
            ],
            {
              session,
            }
          );


        createdOrders.push(
          order[0]
        );
      }


      // ==========================================
      // UPDATE PAYMENT GROUP TOTAL
      // ==========================================

      await Order.updateMany(

        {
          _id: {
            $in:
              createdOrders.map(
                (order) =>
                  order._id
              ),
          },
        },

        {
          $set: {
            paymentGroupTotal:
              paymentGroupTotal,
          },
        },

        {
          session,
        }

      );


      // ==========================================
      // REMOVE ALL CHECKOUT ITEMS FROM CART
      // ==========================================

      await Cart.deleteMany(

        {
          user: req.user.id,

          product: {
            $in:
              items.map(
                (item) =>
                  item.product
              ),
          },
        },

        {
          session,
        }

      );


      // ==========================================
      // COMMIT
      // ==========================================

      await session.commitTransaction();


      // ==========================================
      // RESPONSE
      // ==========================================

      return res.status(201).json({

        success: true,

        message:
          "Rental order created successfully",

        paymentGroupId,

        paymentGroupTotal,

        orderIds:
          createdOrders.map(
            (order) =>
              order._id
          ),

        orders:
          createdOrders,

      });

    } catch (error) {

      await session.abortTransaction();


      return res.status(400).json({

        success: false,

        message:
          error.message,

      });

    } finally {

      await session.endSession();

    }
  }
);


// ==============================
// Get My Orders
// ==============================

export const getMyOrders =
  asyncHandler(async (req, res) => {

    const orders = await Order.find({
      customer: req.user.id,
    })
      .populate("product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  });


// ==============================
// Get My Active Rentals
// ==============================

export const getMyActiveRentals =
  asyncHandler(async (req, res) => {

    const rentals = await Order.find({
      customer: req.user.id,
      orderStatus: "Delivered",
      returnStatus: {
        $ne: "Completed",
      },
    })
      .populate("product")
      .sort({ rentalEndDate: 1 });

    return res.status(200).json({
      success: true,
      count: rentals.length,
      rentals,
    });
  });


// ==============================
// Cancel Order
// ==============================

export const cancelOrder =
  asyncHandler(async (req, res) => {

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.customer.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (
      [
        "Delivered",
        "Returned",
        "Cancelled",
      ].includes(order.orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order cannot be cancelled.",
      });
    }

    order.orderStatus =
  "Cancelled";

await order.save();


// =====================================================
// CANCELLATION NOTIFICATION
// =====================================================

await createOrderNotification({

  order,

  title:
    "Order Cancelled",

  message:
    "Your rental order has been cancelled successfully.",

});


return res.status(200).json({

  success: true,

  message:
    "Order cancelled successfully",

  order,

});
  });


// ==============================
// Admin - Get All Orders
// ==============================

export const getAllOrders =
  asyncHandler(async (req, res) => {

    const orders = await Order.find()
      .populate(
        "customer",
        "fullName email phone"
      )
      .populate(
        "product",
        "name brand images"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  });


// ==============================
// Admin - Update Order Status
// ==============================

export const updateOrderStatus =
  asyncHandler(async (req, res) => {

    const { orderStatus } = req.body;

    const allowedStatus = [
      "Placed",
      "Approved",
      "Shipped",
      "Delivered",
      "Returned",
      "Cancelled",
    ];

    if (
      !allowedStatus.includes(orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    // When admin marks rental as Delivered,
    // automatically start the rental period.

    if (
      orderStatus === "Delivered" &&
      !order.rentalStartDate
    ) {
      const startDate = new Date();

      const endDate = new Date(
        startDate
      );

      endDate.setMonth(
        endDate.getMonth() +
          order.months
      );

      order.rentalStartDate =
        startDate;

      order.rentalEndDate =
        endDate;
    }

    // When rental is finally returned
    if (orderStatus === "Returned") {
      order.returnStatus =
        "Completed";

      order.returnRequested = false;
    }

    // =====================================================
// SAVE ORDER
// =====================================================

await order.save();


// =====================================================
// CREATE ORDER STATUS NOTIFICATION
// =====================================================

const orderNotifications = {

  Placed: {
    title:
      "Order Placed",

    message:
      "Your rental order has been placed successfully.",
  },

  Approved: {
    title:
      "Order Approved",

    message:
      "Your rental order has been approved by RentEase.",
  },

  Shipped: {
    title:
      "Order Shipped",

    message:
      "Your rental order has been shipped and is on the way.",
  },

  Delivered: {
    title:
      "Order Delivered",

    message:
      "Your rental product has been delivered successfully.",
  },

  Returned: {
    title:
      "Order Returned",

    message:
      "Your rental order has been marked as returned.",
  },

  Cancelled: {
    title:
      "Order Cancelled",

    message:
      "Your rental order has been cancelled.",
  },

};


const notification =
  orderNotifications[orderStatus];


if (notification) {

  await createOrderNotification({

    order,

    title:
      notification.title,

    message:
      notification.message,

  });

}


// =====================================================
// RESPONSE
// =====================================================

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  });


// =====================================================
// CUSTOMER - REQUEST RENTAL EXTENSION
// =====================================================

export const requestExtension =
  asyncHandler(async (req, res) => {

    const { extensionMonths } =
      req.body;

    if (
      !extensionMonths ||
      Number(extensionMonths) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a valid extension duration",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      ).populate("product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Rental not found",
      });
    }

    // Check ownership

    if (
      order.customer.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Only active rentals can be extended

    const activeStatuses = [
      "Placed",
      "Approved",
      "Shipped",
      "Delivered",
    ];

    if (
      !activeStatuses.includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only active rentals can be extended",
      });
    }

    // Existing request

    if (
      order.extensionStatus ===
      "Requested"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "An extension request is already pending",
      });
    }

    // Maximum extension

    if (
      Number(extensionMonths) > 12
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum extension is 12 months",
      });
    }

    const extensionAmount =
      Number(order.monthlyRent) *
      Number(extensionMonths) *
      Number(order.quantity);

    order.extensionRequested = true;

    order.extensionMonths =
      Number(extensionMonths);

    order.extensionAmount =
      extensionAmount;

    order.extensionStatus =
      "Requested";

    order.extensionRequestedAt =
      new Date();

    await order.save();

    await createNotification({

  userId:
    order.customer,

  type:
    "extension",

  title:
    "Extension Request Submitted",

  message:
    `Your rental extension request for ${extensionMonths} month${
      Number(extensionMonths) > 1
        ? "s"
        : ""
    } has been submitted.`,

  orderId:
    order._id,

});

    return res.status(200).json({
      success: true,
      message:
        "Rental extension request submitted successfully",
      order,
    });
  });


// =====================================================
// ADMIN - GET EXTENSION REQUESTS
// =====================================================

export const getExtensionRequests =
  asyncHandler(async (req, res) => {

    const requests =
      await Order.find({
        extensionStatus: "Requested",
      })
        .populate(
          "customer",
          "fullName email phone"
        )
        .populate(
          "product",
          "name brand images"
        )
        .sort({
          extensionRequestedAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  });


// =====================================================
// ADMIN - UPDATE EXTENSION STATUS
// =====================================================

export const updateExtensionStatus =
  asyncHandler(async (req, res) => {

    const { status } = req.body;

    if (
      !["Approved", "Rejected"].includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid extension status",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Rental not found",
      });
    }

    if (
      order.extensionStatus !==
      "Requested"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "No pending extension request found",
      });
    }

    // =========================
    // REJECT
    // =========================

    if (status === "Rejected") {

      order.extensionStatus =
        "Rejected";

      await order.save();

      await createNotification({

  userId:
    order.customer,

  type:
    "extension",

  title:
    "Extension Request Rejected",

  message:
    "Your rental extension request has been rejected by RentEase.",

  orderId:
    order._id,

});

      return res.status(200).json({
        success: true,
        message:
          "Extension request rejected",
        order,
      });
    }

    // =========================
    // APPROVE
    // =========================

    const months =
      Number(order.extensionMonths);

    if (!months || months <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid extension duration",
      });
    }

    const currentEndDate =
      order.rentalEndDate
        ? new Date(
            order.rentalEndDate
          )
        : new Date();

    const newEndDate =
      new Date(currentEndDate);

    newEndDate.setMonth(
      newEndDate.getMonth() +
        months
    );

    order.rentalEndDate =
      newEndDate;

    order.extensionStatus =
      "Approved";

    order.extensionApprovedAt =
      new Date();

    order.totalAmount =
      Number(order.totalAmount) +
      Number(order.extensionAmount);

    await order.save();

    await createNotification({

  userId:
    order.customer,

  type:
    "extension",

  title:
    "Extension Request Approved",

  message:
    `Your rental extension request for ${months} month${
      months > 1
        ? "s"
        : ""
    } has been approved.`,

  orderId:
    order._id,

});

    return res.status(200).json({
      success: true,
      message:
        "Rental extension approved successfully",
      order,
    });
  });


// ==========================================
// Customer - Request Return
// ==========================================

export const requestReturn =
  asyncHandler(async (req, res) => {

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure this order belongs to
    // the logged-in customer

    if (
      order.customer.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Only active rentals can be returned

    const activeStatuses = [
      "Placed",
      "Approved",
      "Shipped",
      "Delivered",
    ];

    if (
      !activeStatuses.includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Return cannot be requested for this order",
      });
    }

    // Already requested

    if (
      order.returnStatus ===
      "Requested"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Return request already submitted",
      });
    }

    // Update return information

    order.returnRequested = true;

    order.returnRequestDate =
      new Date();

    order.returnStatus =
      "Requested";

    await order.save();


// =====================================================
// RETURN REQUEST NOTIFICATION
// =====================================================

const existingNotification =
  await Notification.findOne({

    user:
      order.customer,

    relatedOrder:
      order._id,

    type:
      "return",

    title:
      "Return Request Submitted",

  });


if (!existingNotification) {

  await createNotification({

    userId:
      order.customer,

    type:
      "return",

    title:
      "Return Request Submitted",

    message:
      "Your rental return request has been submitted successfully.",

    orderId:
      order._id,

  });

}


return res.status(200).json({

  success: true,

  message:
    "Return request submitted successfully",

  order,

});
  });


// ==========================================
// Admin - Get Return Requests
// ==========================================

export const getReturnRequests =
  asyncHandler(async (req, res) => {

    const orders = await Order.find({
      returnStatus: {
        $in: [
          "Requested",
          "Approved",
          "Rejected",
          "Completed",
        ],
      },
    })
      .populate(
        "customer",
        "fullName email phone"
      )
      .populate(
        "product",
        "name brand images"
      )
      .sort({
        returnRequestDate: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      returns: orders,
    });
  });


// ==========================================
// Admin - Update Return
// ==========================================

export const updateReturnStatus =
  asyncHandler(async (req, res) => {

    const {
      returnStatus,
      damageStatus,
      damageDescription,
      damageCharge,
    } = req.body;

    console.log(
      "========== UPDATE RETURN =========="
    );

    console.log(
      "ORDER ID:",
      req.params.id
    );

    console.log(
      "BODY:",
      req.body
    );

    // --------------------------------------
    // Validate return status
    // --------------------------------------

    const allowedReturnStatuses = [
      "Approved",
      "Rejected",
      "Completed",
    ];

    if (
      !allowedReturnStatuses.includes(
        returnStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid return status. Use Approved, Rejected or Completed.",
      });
    }

    // --------------------------------------
    // Validate damage status
    // --------------------------------------

    const allowedDamageStatuses = [
      "Not Inspected",
      "No Damage",
      "Damaged",
    ];

    if (
      damageStatus &&
      !allowedDamageStatuses.includes(
        damageStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid damage status.",
      });
    }

    // --------------------------------------
    // Find order
    // --------------------------------------

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log(
      "CURRENT RETURN STATUS:",
      order.returnStatus
    );

    console.log(
      "CURRENT ORDER STATUS:",
      order.orderStatus
    );

    // --------------------------------------
    // Validate return status transition
    // --------------------------------------

    /*
      Allowed workflow:

      Requested
          ↓
      Approved
          ↓
      Completed

      Requested
          ↓
      Rejected

      Once Completed or Rejected,
      no further update is allowed.
    */

    const currentStatus =
      order.returnStatus;

    const validTransition =
      (
        currentStatus === "Requested" &&
        (
          returnStatus === "Approved" ||
          returnStatus === "Rejected"
        )
      ) ||
      (
        currentStatus === "Approved" &&
        returnStatus === "Completed"
      );

    if (!validTransition) {
      return res.status(400).json({
        success: false,
        message:
          `Return request cannot be updated from "${currentStatus}" to "${returnStatus}".`,
      });
    }

    // --------------------------------------
    // DAMAGE INFORMATION
    // --------------------------------------

    if (damageStatus) {
      order.damageStatus =
        damageStatus;
    }

    order.damageDescription =
      damageDescription || "";

    order.damageCharge =
      Number(damageCharge) || 0;

    // --------------------------------------
    // REJECT RETURN
    // --------------------------------------

    if (
      returnStatus === "Rejected"
    ) {

      order.returnStatus =
        "Rejected";

      order.returnRequested =
        false;

      await order.save();

      return res.status(200).json({
        success: true,
        message:
          "Return request rejected successfully",
        order,
      });
    }

    // --------------------------------------
    // APPROVE RETURN
    // --------------------------------------

    if (
      returnStatus === "Approved"
    ) {

      order.returnStatus =
        "Approved";

      await order.save();

      return res.status(200).json({
        success: true,
        message:
          "Return request approved successfully",
        order,
      });
    }

    // --------------------------------------
    // COMPLETE RETURN
    // --------------------------------------

    if (
      returnStatus === "Completed"
    ) {

      // Restore inventory only once

      if (!order.inventoryRestored) {

        const product =
          await Product.findById(
            order.product
          );

        if (!product) {
          return res.status(404).json({
            success: false,
            message:
              "Product associated with order not found",
          });
        }

        product.quantity +=
          order.quantity;

        product.available =
          true;

        await product.save();

        order.inventoryRestored =
          true;
      }

      order.returnStatus =
        "Completed";

      order.returnRequested =
        false;

      order.orderStatus =
        "Returned";

      await order.save();

      // =====================================================
// RETURN STATUS NOTIFICATION
// =====================================================

const returnNotifications = {

  Approved: {

    title:
      "Return Request Approved",

    message:
      "Your rental return request has been approved by RentEase.",

  },

  Rejected: {

    title:
      "Return Request Rejected",

    message:
      "Your rental return request has been rejected by RentEase.",

  },

  Completed: {

    title:
      "Return Completed",

    message:
      "Your rental return has been completed successfully.",

  },

};


const notification =
  returnNotifications[
    returnStatus
  ];


if (notification) {

  const existingNotification =
    await Notification.findOne({

      user:
        order.customer,

      relatedOrder:
        order._id,

      type:
        "return",

      title:
        notification.title,

    });


  if (!existingNotification) {

    await createNotification({

      userId:
        order.customer,

      type:
        "return",

      title:
        notification.title,

      message:
        notification.message,

      orderId:
        order._id,

    });

  }

}

      return res.status(200).json({
        success: true,
        message:
          "Return completed and inventory restored successfully",
        order,
      });
    }
  });

  // =====================================================
// CREATE ORDER NOTIFICATION
// Prevent duplicate notifications
// =====================================================

const createOrderNotification = async ({
  order,
  title,
  message,
}) => {

  try {

    const existingNotification =
      await Notification.findOne({
        user: order.customer,
        relatedOrder: order._id,
        type: "order",
        title,
      });


    if (existingNotification) {
      return existingNotification;
    }


    return await createNotification({

      userId:
        order.customer,

      type:
        "order",

      title,

      message,

      orderId:
        order._id,

    });

  } catch (error) {

    console.log(
      "ORDER NOTIFICATION ERROR:",
      error
    );

    return null;
  }
};