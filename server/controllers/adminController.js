import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  // =====================================================
  // BASIC COUNTS
  // =====================================================

  const totalUsers = await User.countDocuments();

  const totalProducts = await Product.countDocuments();

  const totalOrders = await Order.countDocuments();


  // =====================================================
  // ORDER COUNTS
  // =====================================================

  const pendingOrders = await Order.countDocuments({
    orderStatus: "Placed",
  });

  const activeRentals = await Order.countDocuments({
    orderStatus: {
      $in: [
        "Placed",
        "Approved",
        "Shipped",
        "Delivered",
      ],
    },
  });

  const approvedOrders = await Order.countDocuments({
    orderStatus: "Approved",
  });

  const shippedOrders = await Order.countDocuments({
    orderStatus: "Shipped",
  });

  const deliveredOrders = await Order.countDocuments({
    orderStatus: "Delivered",
  });

  const returnedOrders = await Order.countDocuments({
    orderStatus: "Returned",
  });

  const cancelledOrders = await Order.countDocuments({
    orderStatus: "Cancelled",
  });


  // =====================================================
  // INVENTORY
  // =====================================================

  const inventoryResult = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalInventory: {
          $sum: "$quantity",
        },
      },
    },
  ]);

  const totalInventory =
    inventoryResult.length > 0
      ? inventoryResult[0].totalInventory
      : 0;


  const availableProducts = await Product.countDocuments({
    available: true,
    quantity: {
      $gt: 0,
    },
  });


  const outOfStockProducts = await Product.countDocuments({
    $or: [
      {
        quantity: 0,
      },
      {
        available: false,
      },
    ],
  });


  // =====================================================
  // RENTAL / RETURN REQUESTS
  // =====================================================

  const pendingReturns = await Order.countDocuments({
    returnStatus: "Requested",
  });


  // =====================================================
  // EXTENSION REQUESTS
  // =====================================================

  const pendingExtensions = await Order.countDocuments({
    extensionStatus: "Requested",
  });


  // =====================================================
  // DAMAGE
  // =====================================================

  const damagedOrders = await Order.countDocuments({
    damageStatus: "Damaged",
  });


  // =====================================================
  // REVENUE
  // =====================================================

  const revenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: "Paid",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

  const totalRevenue =
    revenue.length > 0
      ? revenue[0].totalRevenue
      : 0;


  // =====================================================
  // PAID ORDERS
  // =====================================================

  const paidOrders = await Order.countDocuments({
    paymentStatus: "Paid",
  });

  const pendingPayments = await Order.countDocuments({
    paymentStatus: "Pending",
  });


  // =====================================================
  // PRODUCT UTILIZATION
  // =====================================================

  let productUtilization = 0;

  if (totalInventory > 0) {
    const rentedInventoryResult =
      await Order.aggregate([
        {
          $match: {
            orderStatus: {
              $in: [
                "Placed",
                "Approved",
                "Shipped",
                "Delivered",
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            rentedQuantity: {
              $sum: "$quantity",
            },
          },
        },
      ]);

    const rentedInventory =
      rentedInventoryResult.length > 0
        ? rentedInventoryResult[0].rentedQuantity
        : 0;

    productUtilization = Math.round(
      (rentedInventory / totalInventory) * 100
    );
  }


  // =====================================================
  // RECENT ORDERS
  // =====================================================

  const recentOrders = await Order.find()
    .populate(
      "customer",
      "fullName email"
    )
    .populate(
      "product",
      "name brand images"
    )
    .sort({
      createdAt: -1,
    })
    .limit(5);


  // =====================================================
  // RESPONSE
  // =====================================================

  return res.status(200).json({
    success: true,

    dashboard: {
      // Basic
      totalUsers,
      totalProducts,
      totalOrders,

      // Orders
      pendingOrders,
      activeRentals,
      approvedOrders,
      shippedOrders,
      deliveredOrders,
      returnedOrders,
      cancelledOrders,

      // Inventory
      totalInventory,
      availableProducts,
      outOfStockProducts,

      // Returns / extensions
      pendingReturns,
      pendingExtensions,

      // Damage
      damagedOrders,

      // Payments
      paidOrders,
      pendingPayments,

      // Revenue
      totalRevenue,

      // KPI
      productUtilization,

      // Recent orders
      recentOrders,
    },
  });
});