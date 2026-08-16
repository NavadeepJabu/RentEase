import { useEffect, useState } from "react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";

import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const data = await updateOrderStatus(
        id,
        status
      );

      alert(data.message);

      loadOrders();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Placed":
        return "status-placed";

      case "Approved":
        return "status-approved";

      case "Shipped":
        return "status-shipped";

      case "Delivered":
        return "status-delivered";

      case "Returned":
        return "status-returned";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="orders-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">

      {/* Background decoration */}

      <div className="orders-glow orders-glow-one"></div>

      <div className="orders-glow orders-glow-two"></div>


      {/* Header */}

      <div className="orders-header">

        <div>

          <p className="orders-label">
            ADMIN PANEL
          </p>

          <h1>Manage Orders</h1>

          <p className="orders-subtitle">
            Review customer rentals and manage
            their order status.
          </p>

        </div>


        <div className="orders-count">

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

        <div className="orders-empty">

          <div className="orders-empty-icon">
            📦
          </div>

          <h2>
            No Orders Found
          </h2>

          <p>
            There are currently no customer
            orders.
          </p>

        </div>

      ) : (

        <div className="orders-grid">

          {orders.map((order, index) => (

            <div
              className="order-card"
              key={order._id}
              style={{
                animationDelay:
                  `${index * 0.08}s`,
              }}
            >

              {/* Card Header */}

              <div className="order-card-header">

                <div>

                  <span className="order-id-label">
                    ORDER ID
                  </span>

                  <p className="order-id">
                    #{order._id
                      .slice(-8)
                      .toUpperCase()}
                  </p>

                </div>


                <span
                  className={`order-status ${getStatusClass(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>

              </div>


              {/* Product */}

              <div className="order-product">

                <div className="order-product-icon">
                  📦
                </div>

                <div>

                  <span className="order-section-label">
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


              {/* Customer */}

              <div className="order-customer">

                <span className="order-section-label">
                  CUSTOMER
                </span>

                <h3>
                  {order.customer?.fullName ||
                    "Unknown Customer"}
                </h3>

                <p>
                  {order.customer?.email ||
                    "No email available"}
                </p>

              </div>


              {/* Order Details */}

              <div className="order-details">

                <div className="order-detail">

                  <span>
                    Duration
                  </span>

                  <strong>
                    {order.months} months
                  </strong>

                </div>


                <div className="order-detail">

                  <span>
                    Quantity
                  </span>

                  <strong>
                    {order.quantity}
                  </strong>

                </div>


                <div className="order-detail">

                  <span>
                    Payment
                  </span>

                  <strong
                    className={
                      order.paymentStatus ===
                      "Paid"
                        ? "payment-paid"
                        : "payment-pending"
                    }
                  >
                    {order.paymentStatus}
                  </strong>

                </div>


                <div className="order-detail">

                  <span>
                    Total
                  </span>

                  <strong className="order-total">
                    ₹{order.totalAmount}
                  </strong>

                </div>

              </div>


              {/* Delivery Address */}

              {order.deliveryAddress && (

                <div className="delivery-address">

                  <span>
                    📍 Delivery Address
                  </span>

                  <p>
                    {order.deliveryAddress}
                  </p>

                </div>

              )}


              {/* Delivery Schedule */}

              <div className="delivery-schedule">

                <div className="delivery-schedule-header">

                  <span>
                    🚚 DELIVERY SCHEDULE
                  </span>

                </div>


                <div className="delivery-schedule-grid">

                  <div>

                    <span>
                      Delivery Date
                    </span>

                    <strong>

                      {order.deliveryDate
                        ? new Date(
                            order.deliveryDate
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Not scheduled"}

                    </strong>

                  </div>


                  <div>

                    <span>
                      Time Slot
                    </span>

                    <strong>
                      {order.deliverySlot ||
                        "Not scheduled"}
                    </strong>

                  </div>

                </div>

              </div>


              {/* Rental Dates */}

              {(order.rentalStartDate ||
                order.rentalEndDate) && (

                <div className="rental-dates">

                  <span>
                    🏠 RENTAL PERIOD
                  </span>

                  <p>

                    {order.rentalStartDate
                      ? new Date(
                          order.rentalStartDate
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "-"}

                    {" → "}

                    {order.rentalEndDate
                      ? new Date(
                          order.rentalEndDate
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "-"}

                  </p>

                </div>

              )}


              {/* Status Update */}

              <div className="order-status-control">

                <label>
                  Update Order Status
                </label>

                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    handleStatusChange(
                      order._id,
                      e.target.value
                    )
                  }
                >

                  <option value="Placed">
                    Placed
                  </option>

                  <option value="Approved">
                    Approved
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Returned">
                    Returned
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminOrders;