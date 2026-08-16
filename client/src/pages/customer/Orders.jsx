import { useEffect, useState } from "react";

import {
  getMyOrders,
  cancelOrder,
} from "../../services/orderService";

import {
  createPaymentOrder,
  verifyPayment,
} from "../../services/paymentService";

import { load } from "@cashfreepayments/cashfree-js";

import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [payingOrderId, setPayingOrderId] =
  useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      const data = await cancelOrder(id);

      alert(data.message);

      loadOrders();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to cancel order"
      );
    }
  };

  const handlePayment = async (orderId) => {
  try {
    setPayingOrderId(orderId);

    // Remember the page where payment started
    sessionStorage.setItem(
      "paymentReturnPath",
      window.location.pathname
    );

    const data =
      await createPaymentOrder(orderId);

    if (
      !data.success ||
      !data.paymentSessionId
    ) {
      throw new Error(
        data.message ||
          "Unable to create payment session"
      );
    }

    const cashfree = await load({
      mode: "sandbox",
    });

    if (!cashfree) {
      throw new Error(
        "Cashfree SDK could not be loaded"
      );
    }

    await cashfree.checkout({
      paymentSessionId:
        data.paymentSessionId,

      redirectTarget: "_self",
    });

  } catch (error) {
    console.log(
      "PAYMENT ERROR:",
      error
    );

    alert(
      error.response?.data?.message ||
        error.message ||
        "Failed to start payment"
    );

    setPayingOrderId(null);
  }
};

  const getStatusClass = (status) => {
    switch (status) {
      case "Placed":
        return "customer-status-placed";

      case "Approved":
        return "customer-status-approved";

      case "Shipped":
        return "customer-status-shipped";

      case "Delivered":
        return "customer-status-delivered";

      case "Returned":
        return "customer-status-returned";

      case "Cancelled":
        return "customer-status-cancelled";

      default:
        return "";
    }
  };

  const getReturnStatusClass = (status) => {
    switch (status) {
      case "Requested":
        return "customer-return-requested";

      case "Approved":
        return "customer-return-approved";

      case "Rejected":
        return "customer-return-rejected";

      case "Completed":
        return "customer-return-completed";

      default:
        return "customer-return-default";
    }
  };

  const getDamageStatusClass = (status) => {
    switch (status) {
      case "No Damage":
        return "customer-damage-no";

      case "Damaged":
        return "customer-damage-yes";

      case "Not Inspected":
      default:
        return "customer-damage-pending";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="customer-orders-loading">
        <div className="customer-orders-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="customer-orders-page">

      {/* Background decoration */}

      <div className="customer-orders-glow customer-orders-glow-one"></div>

      <div className="customer-orders-glow customer-orders-glow-two"></div>

      {/* Header */}

      <div className="customer-orders-header">

        <div>

          <p className="customer-orders-label">
            RENTAL HISTORY
          </p>

          <h1>
            My Orders
          </h1>

          <p className="customer-orders-subtitle">
            Track your rentals, delivery status and
            order history.
          </p>

        </div>

        <div className="customer-orders-count">

          <span>
            {orders.length}
          </span>

          <small>
            Total Orders
          </small>

        </div>

      </div>

      {/* Empty State */}

      {orders.length === 0 ? (

        <div className="customer-orders-empty">

          <div className="customer-orders-empty-icon">
            📦
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any rental orders yet.
          </p>

        </div>

      ) : (

        <div className="customer-orders-grid">

          {orders.map((order, index) => (

            <div
              className="customer-order-card"
              key={order._id}
              style={{
                animationDelay:
                  `${index * 0.08}s`,
              }}
            >

              {/* Card Header */}

              <div className="customer-order-card-header">

                <div>

                  <span className="customer-order-id-label">
                    ORDER ID
                  </span>

                  <p className="customer-order-id">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>

                </div>

                <span
                  className={`customer-order-status ${getStatusClass(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>

              </div>

              {/* Product */}

              <div className="customer-order-product">

                <div className="customer-order-product-icon">
                  📦
                </div>

                <div>

                  <span className="customer-order-section-label">
                    PRODUCT
                  </span>

                  <h2>
                    {order.product?.name ||
                      "Product unavailable"}
                  </h2>

                  {order.product?.brand && (
                    <p>
                      {order.product.brand}
                    </p>
                  )}

                </div>

              </div>

              {/* Order Details */}

              <div className="customer-order-details">

                <div className="customer-order-detail">

                  <span>
                    Duration
                  </span>

                  <strong>
                    {order.months} months
                  </strong>

                </div>

                <div className="customer-order-detail">

                  <span>
                    Quantity
                  </span>

                  <strong>
                    {order.quantity}
                  </strong>

                </div>

                <div className="customer-order-detail">

                  <span>
                    Payment
                  </span>

                  <strong
                    className={
                      order.paymentStatus === "Paid"
                        ? "customer-payment-paid"
                        : "customer-payment-pending"
                    }
                  >
                    {order.paymentStatus}
                  </strong>

                </div>

                {order.paymentStatus === "Pending" &&
  order.orderStatus !== "Cancelled" &&
  order.orderStatus !== "Returned" && (

    <div className="customer-payment-action">

      <button
        className="customer-pay-now-btn"
        onClick={() =>
          handlePayment(order._id)
        }
        disabled={
          payingOrderId === order._id
        }
      >
        {payingOrderId === order._id
          ? "Opening Payment..."
          : `Pay ₹${Number(
              order.totalAmount || 0
            ).toLocaleString("en-IN")}`}
      </button>

    </div>
)}

                <div className="customer-order-detail">

                  <span>
                    Total
                  </span>

                  <strong className="customer-order-total">
                    ₹{order.totalAmount}
                  </strong>

                </div>

              </div>

              {/* Rental Information */}

              <div className="customer-rental-info">

                <div className="customer-rental-info-title">
                  🔑 Rental Information
                </div>

                <div className="customer-rental-grid">

                  <div>

                    <span>
                      Monthly Rent
                    </span>

                    <strong>
                      ₹{order.monthlyRent}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Security Deposit
                    </span>

                    <strong>
                      ₹{order.securityDeposit}
                    </strong>

                  </div>

                </div>

              </div>

              {/* Delivery Address */}

              {order.deliveryAddress && (

                <div className="customer-delivery-address">

                  <span>
                    📍 Delivery Address
                  </span>

                  <p>
                    {order.deliveryAddress}
                  </p>

                </div>

              )}

              {/* Delivery Schedule */}

              {(order.deliveryDate ||
                order.deliverySlot) && (

                <div className="customer-delivery-schedule">

                  <div className="customer-delivery-title">
                    🚚 Delivery Schedule
                  </div>

                  <div className="customer-delivery-grid">

                    {order.deliveryDate && (

                      <div>

                        <span>
                          Delivery Date
                        </span>

                        <strong>
                          {formatDate(
                            order.deliveryDate
                          )}
                        </strong>

                      </div>

                    )}

                    {order.deliverySlot && (

                      <div>

                        <span>
                          Time Slot
                        </span>

                        <strong>
                          {order.deliverySlot}
                        </strong>

                      </div>

                    )}

                  </div>

                </div>

              )}

              {/* Rental Dates */}

              {(order.rentalStartDate ||
                order.rentalEndDate) && (

                <div className="customer-rental-dates">

                  <div className="customer-rental-dates-title">
                    📅 Rental Period
                  </div>

                  <div className="customer-rental-date-grid">

                    {order.rentalStartDate && (

                      <div>

                        <span>
                          Start Date
                        </span>

                        <strong>
                          {formatDate(
                            order.rentalStartDate
                          )}
                        </strong>

                      </div>

                    )}

                    {order.rentalEndDate && (

                      <div>

                        <span>
                          End Date
                        </span>

                        <strong>
                          {formatDate(
                            order.rentalEndDate
                          )}
                        </strong>

                      </div>

                    )}

                  </div>

                </div>

              )}

              {/* ============================
                  RETURN & DAMAGE MANAGEMENT
              ============================ */}

              {(order.returnRequested ||
                (order.returnStatus &&
                  order.returnStatus !== "Not Requested")) && (

                <div className="customer-return-section">

                  {/* Return Header */}

                  <div className="customer-return-section-header">

                    <div>

                      <p>
                        RETURN MANAGEMENT
                      </p>

                      <h3>
                        🔄 Return Status
                      </h3>

                    </div>

                    <span
                      className={`customer-return-badge ${getReturnStatusClass(
                        order.returnStatus
                      )}`}
                    >
                      {order.returnStatus ||
                        "Not Requested"}
                    </span>

                  </div>

                  {/* Return Timeline */}

                  <div className="customer-return-timeline">

                    <div
                      className={
                        order.returnRequested
                          ? "return-step completed"
                          : "return-step"
                      }
                    >

                      <span>
                        1
                      </span>

                      <div>
                        <strong>
                          Request Submitted
                        </strong>

                        <small>
                          {order.returnRequestDate
                            ? formatDate(
                                order.returnRequestDate
                              )
                            : "Not requested"}
                        </small>
                      </div>

                    </div>

                    <div
                      className={
                        order.returnStatus === "Approved" ||
                        order.returnStatus === "Completed"
                          ? "return-step completed"
                          : "return-step"
                      }
                    >

                      <span>
                        2
                      </span>

                      <div>
                        <strong>
                          Return Approved
                        </strong>

                        <small>
                          {order.returnStatus === "Approved" ||
                          order.returnStatus === "Completed"
                            ? "Approved by RentEase"
                            : "Waiting for approval"}
                        </small>
                      </div>

                    </div>

                    <div
                      className={
                        order.returnStatus === "Completed"
                          ? "return-step completed"
                          : "return-step"
                      }
                    >

                      <span>
                        3
                      </span>

                      <div>
                        <strong>
                          Return Completed
                        </strong>

                        <small>
                          {order.returnStatus === "Completed"
                            ? "Product successfully returned"
                            : "Awaiting product return"}
                        </small>
                      </div>

                    </div>

                  </div>

                  {/* Rejected Message */}

                  {order.returnStatus === "Rejected" && (

                    <div className="customer-return-rejected-box">

                      <span>
                        ⚠️ Return Request Rejected
                      </span>

                      <p>
                        Your return request was not
                        approved. Please contact RentEase
                        support if you need assistance.
                      </p>

                    </div>

                  )}

                  {/* Damage Inspection */}

                  {(order.returnStatus === "Approved" ||
                    order.returnStatus === "Completed" ||
                    order.damageStatus !== "Not Inspected") && (

                    <div className="customer-damage-section">

                      <div className="customer-damage-header">

                        <div>

                          <p>
                            PRODUCT INSPECTION
                          </p>

                          <h3>
                            🔍 Damage Assessment
                          </h3>

                        </div>

                        <span
                          className={`customer-damage-badge ${getDamageStatusClass(
                            order.damageStatus
                          )}`}
                        >
                          {order.damageStatus ||
                            "Not Inspected"}
                        </span>

                      </div>

                      {/* No Damage */}

                      {order.damageStatus === "No Damage" && (

                        <div className="customer-no-damage">

                          <span>
                            ✓
                          </span>

                          <div>

                            <strong>
                              No Damage Detected
                            </strong>

                            <p>
                              The returned product passed
                              the inspection successfully.
                            </p>

                          </div>

                        </div>

                      )}

                      {/* Damaged */}

                      {order.damageStatus === "Damaged" && (

                        <div className="customer-damage-result">

                          <div className="damage-warning-icon">
                            ⚠️
                          </div>

                          <div className="damage-result-content">

                            <strong>
                              Damage Reported
                            </strong>

                            {order.damageDescription && (

                              <div className="damage-description">

                                <span>
                                  Description
                                </span>

                                <p>
                                  {order.damageDescription}
                                </p>

                              </div>

                            )}

                            {Number(order.damageCharge) > 0 && (

                              <div className="damage-charge">

                                <span>
                                  Damage Charge
                                </span>

                                <strong>
                                  ₹{order.damageCharge}
                                </strong>

                              </div>

                            )}

                          </div>

                        </div>

                      )}

                      {/* Inspection Pending */}

                      {(!order.damageStatus ||
                        order.damageStatus ===
                          "Not Inspected") && (

                        <div className="customer-inspection-pending">

                          <span>
                            🔍
                          </span>

                          <div>

                            <strong>
                              Inspection Pending
                            </strong>

                            <p>
                              Our team will inspect the
                              returned product and update
                              the assessment here.
                            </p>

                          </div>

                        </div>

                      )}

                    </div>

                  )}

                  {/* Return Help */}

                  {order.returnStatus === "Approved" && (

                    <div className="customer-return-help">

                      <span>
                        💡
                      </span>

                      <p>
                        Your return has been approved.
                        Please make sure the product and
                        accessories are ready for collection.
                      </p>

                    </div>

                  )}

                  {order.returnStatus === "Completed" && (

                    <div className="customer-return-completed-box">

                      <span>
                        ✓
                      </span>

                      <div>

                        <strong>
                          Return Completed
                        </strong>

                        <p>
                          This rental has been successfully
                          returned and closed.
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              )}

              {/* Cancel Button */}

              {order.orderStatus !== "Cancelled" &&
                order.orderStatus !== "Returned" && (

                <button
                  className="customer-cancel-order-btn"
                  onClick={() =>
                    handleCancel(order._id)
                  }
                >
                  Cancel Order
                </button>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Orders;