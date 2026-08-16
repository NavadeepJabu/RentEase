import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await getDashboardStats();

      setStats(data.dashboard);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Placed":
        return "dashboard-status-placed";

      case "Approved":
        return "dashboard-status-approved";

      case "Shipped":
        return "dashboard-status-shipped";

      case "Delivered":
        return "dashboard-status-delivered";

      case "Returned":
        return "dashboard-status-returned";

      case "Cancelled":
        return "dashboard-status-cancelled";

      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>

        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-error">
        <div className="dashboard-error-icon">
          ⚠️
        </div>

        <h2>
          Unable to load dashboard
        </h2>

        <p>
          Please try refreshing the page.
        </p>

        <button
          onClick={loadDashboard}
          className="dashboard-refresh-btn"
        >
          Refresh Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div className="dashboard-glow dashboard-glow-one"></div>

      <div className="dashboard-glow dashboard-glow-two"></div>


      {/* =========================================
          HEADER
      ========================================= */}

      <div className="dashboard-header">

        <div>

          <p className="dashboard-label">
            ADMIN PANEL
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Monitor your RentEase platform
            from one place.
          </p>

        </div>

        <div className="dashboard-status">

          <span className="status-dot"></span>

          System Active

        </div>

      </div>


      {/* =========================================
          PRIMARY KPI CARDS
      ========================================= */}

      <div className="dashboard-stats">

        {/* USERS */}

        <div className="dashboard-card users-card">

          <div className="card-top">

            <div className="stat-icon">
              👥
            </div>

            <span className="card-badge">
              USERS
            </span>

          </div>

          <p>Total Users</p>

          <h2>
            {stats.totalUsers}
          </h2>

          <span className="card-description">
            Registered customers
          </span>

        </div>


        {/* PRODUCTS */}

        <div className="dashboard-card products-card">

          <div className="card-top">

            <div className="stat-icon">
              📦
            </div>

            <span className="card-badge">
              PRODUCTS
            </span>

          </div>

          <p>Total Products</p>

          <h2>
            {stats.totalProducts}
          </h2>

          <span className="card-description">
            Listed products
          </span>

        </div>


        {/* ORDERS */}

        <div className="dashboard-card orders-card">

          <div className="card-top">

            <div className="stat-icon">
              🛒
            </div>

            <span className="card-badge">
              ORDERS
            </span>

          </div>

          <p>Total Orders</p>

          <h2>
            {stats.totalOrders}
          </h2>

          <span className="card-description">
            Orders placed
          </span>

        </div>


        {/* ACTIVE RENTALS */}

        <div className="dashboard-card">

          <div className="card-top">

            <div className="stat-icon">
              🏠
            </div>

            <span className="card-badge">
              RENTALS
            </span>

          </div>

          <p>Active Rentals</p>

          <h2>
            {stats.activeRentals}
          </h2>

          <span className="card-description">
            Currently rented
          </span>

        </div>


        {/* PENDING ORDERS */}

        <div className="dashboard-card pending-card">

          <div className="card-top">

            <div className="stat-icon">
              ⏳
            </div>

            <span className="card-badge">
              ACTION
            </span>

          </div>

          <p>Pending Orders</p>

          <h2>
            {stats.pendingOrders}
          </h2>

          <span className="card-description">
            Need your attention
          </span>

        </div>


        {/* AVAILABLE PRODUCTS */}

        <div className="dashboard-card">

          <div className="card-top">

            <div className="stat-icon">
              ✅
            </div>

            <span className="card-badge">
              STOCK
            </span>

          </div>

          <p>Available Products</p>

          <h2>
            {stats.availableProducts}
          </h2>

          <span className="card-description">
            Currently in stock
          </span>

        </div>


        {/* RETURNS */}

        <div className="dashboard-card">

          <div className="card-top">

            <div className="stat-icon">
              ↩️
            </div>

            <span className="card-badge">
              RETURNS
            </span>

          </div>

          <p>Pending Returns</p>

          <h2>
            {stats.pendingReturns}
          </h2>

          <span className="card-description">
            Return requests
          </span>

        </div>


        {/* EXTENSIONS */}

        <div className="dashboard-card">

          <div className="card-top">

            <div className="stat-icon">
              🔄
            </div>

            <span className="card-badge">
              EXTENSIONS
            </span>

          </div>

          <p>Pending Extensions</p>

          <h2>
            {stats.pendingExtensions}
          </h2>

          <span className="card-description">
            Extension requests
          </span>

        </div>

      </div>


      {/* =========================================
          REVENUE + UTILIZATION
      ========================================= */}

      <div className="dashboard-highlight-grid">

        {/* REVENUE */}

        <div className="revenue-card">

          <div className="revenue-content">

            <div className="revenue-icon">
              ₹
            </div>

            <div>

              <p className="revenue-label">
                TOTAL REVENUE
              </p>

              <h2>
                ₹{formatCurrency(
                  stats.totalRevenue
                )}
              </h2>

              <span>
                Revenue from paid orders
              </span>

            </div>

          </div>

          <div className="revenue-decoration">
            ₹
          </div>

        </div>


        {/* UTILIZATION */}

        <div className="utilization-card">

          <div className="utilization-header">

            <div>

              <p>
                INVENTORY UTILIZATION
              </p>

              <h2>
                {stats.productUtilization || 0}%
              </h2>

            </div>

            <div className="utilization-icon">
              📊
            </div>

          </div>

          <div className="utilization-bar">

            <div
              className="utilization-progress"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    stats.productUtilization || 0
                  )
                )}%`,
              }}
            ></div>

          </div>

          <span>
            Rental inventory currently in use
          </span>

        </div>

      </div>


      {/* =========================================
          BUSINESS KPIs
      ========================================= */}

      <div className="dashboard-overview">

        <div className="overview-header">

          <div>

            <p className="dashboard-label">
              BUSINESS KPIs
            </p>

            <h2>
              Platform at a glance
            </h2>

          </div>

        </div>


        <div className="overview-grid">

          <div className="overview-item">
            <span className="overview-number">
              {stats.totalInventory}
            </span>

            <span className="overview-text">
              Total Inventory
            </span>
          </div>


          <div className="overview-item">
            <span className="overview-number">
              {stats.outOfStockProducts}
            </span>

            <span className="overview-text">
              Out of Stock
            </span>
          </div>


          <div className="overview-item">
            <span className="overview-number">
              {stats.returnedOrders}
            </span>

            <span className="overview-text">
              Returned Rentals
            </span>
          </div>


          <div className="overview-item">
            <span className="overview-number">
              {stats.cancelledOrders}
            </span>

            <span className="overview-text">
              Cancelled Orders
            </span>
          </div>


          <div className="overview-item">
            <span className="overview-number">
              {stats.paidOrders}
            </span>

            <span className="overview-text">
              Paid Orders
            </span>
          </div>


          <div className="overview-item">
            <span className="overview-number">
              {stats.pendingPayments}
            </span>

            <span className="overview-text">
              Pending Payments
            </span>
          </div>


          <div className="overview-item">
            <span className="overview-number">
              {stats.damagedOrders}
            </span>

            <span className="overview-text">
              Damaged Rentals
            </span>
          </div>


          <div className="overview-item">
            <span className="overview-number">
              {stats.productUtilization || 0}%
            </span>

            <span className="overview-text">
              Inventory Utilization
            </span>
          </div>

        </div>

      </div>


      {/* =========================================
          ORDER LIFECYCLE
      ========================================= */}

      <div className="dashboard-overview">

        <div className="overview-header">

          <div>

            <p className="dashboard-label">
              ORDER STATUS
            </p>

            <h2>
              Rental lifecycle
            </h2>

          </div>

        </div>


        <div className="order-lifecycle-grid">

          <div className="lifecycle-item lifecycle-placed">

            <span className="lifecycle-icon">
              🛒
            </span>

            <div>

              <strong>
                {stats.pendingOrders}
              </strong>

              <span>
                Placed
              </span>

            </div>

          </div>


          <div className="lifecycle-item lifecycle-approved">

            <span className="lifecycle-icon">
              ✓
            </span>

            <div>

              <strong>
                {stats.approvedOrders}
              </strong>

              <span>
                Approved
              </span>

            </div>

          </div>


          <div className="lifecycle-item lifecycle-shipped">

            <span className="lifecycle-icon">
              🚚
            </span>

            <div>

              <strong>
                {stats.shippedOrders}
              </strong>

              <span>
                Shipped
              </span>

            </div>

          </div>


          <div className="lifecycle-item lifecycle-delivered">

            <span className="lifecycle-icon">
              📍
            </span>

            <div>

              <strong>
                {stats.deliveredOrders}
              </strong>

              <span>
                Delivered
              </span>

            </div>

          </div>


          <div className="lifecycle-item lifecycle-returned">

            <span className="lifecycle-icon">
              ↩️
            </span>

            <div>

              <strong>
                {stats.returnedOrders}
              </strong>

              <span>
                Returned
              </span>

            </div>

          </div>


          <div className="lifecycle-item lifecycle-cancelled">

            <span className="lifecycle-icon">
              ✕
            </span>

            <div>

              <strong>
                {stats.cancelledOrders}
              </strong>

              <span>
                Cancelled
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          ATTENTION REQUIRED
      ========================================= */}

      <div className="dashboard-overview">

        <div className="overview-header">

          <div>

            <p className="dashboard-label">
              ATTENTION REQUIRED
            </p>

            <h2>
              Items that need action
            </h2>

          </div>

        </div>


        <div className="attention-grid">

          <div className="attention-card">

            <span className="attention-icon">
              ⏳
            </span>

            <div>

              <strong>
                {stats.pendingOrders}
              </strong>

              <span>
                Pending Orders
              </span>

            </div>

          </div>


          <div className="attention-card">

            <span className="attention-icon">
              ↩️
            </span>

            <div>

              <strong>
                {stats.pendingReturns}
              </strong>

              <span>
                Return Requests
              </span>

            </div>

          </div>


          <div className="attention-card">

            <span className="attention-icon">
              🔄
            </span>

            <div>

              <strong>
                {stats.pendingExtensions}
              </strong>

              <span>
                Extension Requests
              </span>

            </div>

          </div>


          <div className="attention-card">

            <span className="attention-icon">
              🔧
            </span>

            <div>

              <strong>
                {stats.damagedOrders}
              </strong>

              <span>
                Damaged Rentals
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          RECENT ORDERS
      ========================================= */}

      <div className="dashboard-overview recent-orders-section">

        <div className="overview-header">

          <div>

            <p className="dashboard-label">
              RECENT ACTIVITY
            </p>

            <h2>
              Recent Orders
            </h2>

          </div>

        </div>


        {!stats.recentOrders ||
        stats.recentOrders.length === 0 ? (

          <div className="dashboard-empty-orders">

            <div>
              📦
            </div>

            <h3>
              No orders yet
            </h3>

            <p>
              Customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="dashboard-orders-list">

            {stats.recentOrders.map(
              (order) => (

                <div
                  className="dashboard-order-item"
                  key={order._id}
                >

                  <div className="dashboard-order-product">

                    {order.product?.images?.length >
                    0 ? (

                      <img
                        src={`http://localhost:8000${order.product.images[0]}`}
                        alt={
                          order.product.name
                        }
                      />

                    ) : (

                      <div className="dashboard-order-placeholder">
                        📦
                      </div>

                    )}

                    <div>

                      <strong>
                        {order.product?.name ||
                          "Product unavailable"}
                      </strong>

                      <span>
                        {order.customer?.fullName ||
                          "Unknown Customer"}
                      </span>

                    </div>

                  </div>


                  <div className="dashboard-order-info">

                    <span>
                      ₹
                      {formatCurrency(
                        order.totalAmount
                      )}
                    </span>

                    <small>
                      {formatDate(
                        order.createdAt
                      )}
                    </small>

                  </div>


                  <span
                    className={`dashboard-order-status ${getStatusClass(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;