import {
  Link,
  useNavigate,useLocation
} from "react-router-dom";

import { useEffect, useState } from "react";

import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();


  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [showNotifications, setShowNotifications] =
    useState(false);

    useEffect(() => {
  if (!user) {
    setNotifications([]);
    setUnreadCount(0);
    return;
  }

  loadNotifications();
}, [user]);

const loadNotifications = async () => {
  try {
    const data =
      await getMyNotifications();

    setNotifications(
      data.notifications || []
    );

    setUnreadCount(
      data.unreadCount || 0
    );

  } catch (error) {
    console.log(
      "NOTIFICATION LOAD ERROR:",
      error
    );
  }
};

const handleNotificationClick =
  async (notification) => {

    try {

      if (!notification.read) {

        await markNotificationAsRead(
          notification._id
        );

        setNotifications(
          notifications.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  read: true,
                }
              : item
          )
        );

        setUnreadCount(
          Math.max(
            0,
            unreadCount - 1
          )
        );
      }

    } catch (error) {

      console.log(
        "NOTIFICATION READ ERROR:",
        error
      );

    }
  };

  const handleMarkAllRead =
  async () => {

    try {

      await markAllNotificationsAsRead();

      setNotifications(
        notifications.map(
          (notification) => ({
            ...notification,
            read: true,
          })
        )
      );

      setUnreadCount(0);

    } catch (error) {

      console.log(
        "MARK ALL READ ERROR:",
        error
      );

    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}

        <Link
          to="/"
          className="navbar-logo"
        >
          <span className="logo-icon">
            R
          </span>

          <span>
            RentEase
          </span>
        </Link>

        {/* Navigation */}

        <div className="navbar-links">

          {/* =========================
              ADMIN
          ========================= */}

          {user?.role === "admin" ? (
            <>
              <Link
                to="/admin/dashboard"
                className={`nav-link admin-link ${
                  isActive("/admin/dashboard")
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/admin/products"
                className={`nav-link admin-link ${
                  isActive("/admin/products")
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Products
              </Link>

              <Link
                to="/admin/service-areas"
                className={`nav-link admin-link ${
                  isActive("/admin/service-areas")
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Service Areas
              </Link>

              <Link
                to="/admin/orders"
                className={`nav-link admin-link ${
                  isActive("/admin/orders")
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Orders
              </Link>

              <Link
                to="/admin/returns"
                className={`nav-link admin-link ${
                  isActive("/admin/returns")
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Returns
              </Link>

              <Link
  to="/admin/extensions"
  className={`nav-link admin-link ${
    isActive("/admin/extensions")
      ? "nav-link-active"
      : ""
  }`}
>
  Extensions
</Link>


              <Link
                to="/admin/maintenance"
                className={`nav-link admin-link ${
                  isActive("/admin/maintenance")
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Maintenance
              </Link>

              <Link
                to="/profile"
                className={`nav-link ${
                  isActive("/profile")
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Profile
              </Link>
            </>
          ) : (

            /* =========================
               CUSTOMER
            ========================= */

            <>
              <Link
                to="/"
                className={`nav-link ${
                  isActive("/")
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Home
              </Link>

              <Link
                to="/products"
                className={`nav-link ${
                  isActive("/products")
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Products
              </Link>

              {user && (
                <>
                  <Link
                    to="/cart"
                    className={`nav-link ${
                      isActive("/cart")
                        ? "nav-link-active"
                        : ""
                    }`}
                  >
                    Cart
                  </Link>

                  <Link
                    to="/wishlist"
                    className={`nav-link ${
                      isActive("/wishlist")
                        ? "nav-link-active"
                        : ""
                    }`}
                  >
                    Wishlist
                  </Link>

                  <Link
                    to="/orders"
                    className={`nav-link ${
                      isActive("/orders")
                        ? "nav-link-active"
                        : ""
                    }`}
                  >
                    Orders
                  </Link>

                  <Link
                    to="/rentals"
                    className={`nav-link ${
                      isActive("/rentals")
                        ? "nav-link-active"
                        : ""
                    }`}
                  >
                    Rentals
                  </Link>

                  <Link
                    to="/maintenance"
                    className={`nav-link ${
                      isActive("/maintenance")
                        ? "nav-link-active"
                        : ""
                    }`}
                  >
                    Maintenance
                  </Link>

                  <Link
                    to="/profile"
                    className={`nav-link ${
                      isActive("/profile")
                        ? "nav-link-active"
                        : ""
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
            </>
          )}

          {/* =========================
              AUTH
          ========================= */}

          {!user && (
            <>
              <Link
                to="/login"
                className={`nav-link ${
                  isActive("/login")
                    ? "nav-link-active"
                    : ""
                }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="nav-register"
              >
                Register
              </Link>
            </>
          )}

          {user && (
  <div className="notification-wrapper">

    <button
      className="notification-button"
      onClick={() =>
        setShowNotifications(
          !showNotifications
        )
      }
      aria-label="Notifications"
    >
      🔔

      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99
            ? "99+"
            : unreadCount}
        </span>
      )}
    </button>


    {showNotifications && (
      <div className="notification-dropdown">

        <div className="notification-header">

          <div>
            <strong>
              Notifications
            </strong>

            {unreadCount > 0 && (
              <span>
                {unreadCount} unread
              </span>
            )}
          </div>


          {unreadCount > 0 && (
            <button
              onClick={
                handleMarkAllRead
              }
            >
              Mark all read
            </button>
          )}

        </div>


        <div className="notification-list">

          {notifications.length === 0 ? (

            <div className="notification-empty">
              <div>🔔</div>

              <p>
                No notifications yet
              </p>
            </div>

          ) : (

            notifications.map(
              (notification) => (

                <div
                  key={notification._id}
                  className={`notification-item ${
                    notification.read
                      ? "notification-read"
                      : "notification-unread"
                  }`}
                  onClick={() =>
                    handleNotificationClick(
                      notification
                    )
                  }
                >

                  <div className="notification-icon">
                    {notification.type ===
                    "payment"
                      ? "💳"
                      : notification.type ===
                        "order"
                      ? "📦"
                      : notification.type ===
                        "maintenance"
                      ? "🔧"
                      : notification.type ===
                        "return"
                      ? "↩️"
                      : "🔔"}
                  </div>


                  <div className="notification-content">

                    <strong>
                      {notification.title}
                    </strong>

                    <p>
                      {notification.message}
                    </p>

                    <small>
                      {new Date(
                        notification.createdAt
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </small>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>
    )}

  </div>
)}

          {/* Logout */}

          {user && (
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;