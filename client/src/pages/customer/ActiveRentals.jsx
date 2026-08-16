import { useEffect, useState } from "react";

import {
  getMyActiveRentals,
  requestReturn,
  requestExtension,
} from "../../services/orderService";

import "./ActiveRentals.css";

function ActiveRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRentals();
  }, []);

  // ==========================================
  // LOAD ACTIVE RENTALS
  // ==========================================

  const loadRentals = async () => {
    try {
      const data = await getMyActiveRentals();

      setRentals(data.rentals || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to load active rentals"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REQUEST RETURN
  // ==========================================

  const handleReturn = async (id) => {
    const confirmReturn = window.confirm(
      "Do you want to request a return for this rental?"
    );

    if (!confirmReturn) return;

    try {
      const data = await requestReturn(id);

      alert(data.message);

      loadRentals();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to request return"
      );
    }
  };

  // ==========================================
  // REQUEST RENTAL EXTENSION
  // ==========================================

  const handleExtension = async (id) => {
    const months = window.prompt(
      "How many months do you want to extend?\n\nEnter a number between 1 and 12:"
    );

    if (!months) return;

    const extensionMonths = Number(months);

    if (
      !Number.isInteger(extensionMonths) ||
      extensionMonths < 1 ||
      extensionMonths > 12
    ) {
      alert(
        "Please enter a valid number between 1 and 12."
      );

      return;
    }

    try {
      const data = await requestExtension(
        id,
        extensionMonths
      );

      alert(data.message);

      loadRentals();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to request extension"
      );
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // DAYS REMAINING
  // ==========================================

  const getDaysRemaining = (endDate) => {
    if (!endDate) return 0;

    const today = new Date();
    const end = new Date(endDate);

    const difference =
      end.getTime() - today.getTime();

    return Math.max(
      0,
      Math.ceil(
        difference /
          (1000 * 60 * 60 * 24)
      )
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="rentals-loading">
        <div className="rentals-spinner"></div>

        <p>
          Loading your rentals...
        </p>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="active-rentals-page">

      {/* Background Glow */}

      <div className="rentals-glow rentals-glow-one"></div>

      <div className="rentals-glow rentals-glow-two"></div>

      <div className="active-rentals-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="rentals-header">

          <div>
            <p className="rentals-eyebrow">
              MY RENTALS
            </p>

            <h1>
              Active Rentals
            </h1>

            <p>
              Manage your currently rented
              furniture and appliances.
            </p>
          </div>

          <div className="rentals-header-icon">
            🏠
          </div>

        </div>

        {/* =====================================
            EMPTY STATE
        ====================================== */}

        {rentals.length === 0 ? (

          <div className="empty-rentals">

            <div className="empty-rentals-icon">
              📦
            </div>

            <h2>
              No Active Rentals
            </h2>

            <p>
              You don't have any active rentals
              right now.
            </p>

          </div>

        ) : (

          /* =====================================
             RENTALS GRID
          ====================================== */

          <div className="rentals-grid">

            {rentals.map((rental) => {

              const daysRemaining =
                getDaysRemaining(
                  rental.rentalEndDate
                );

              const image =
                rental.product?.images?.length > 0
                  ? `http://localhost:8000${rental.product.images[0]}`
                  : null;

              return (

                <div
                  className="rental-card"
                  key={rental._id}
                >

                  {/* =================================
                      PRODUCT IMAGE
                  ================================== */}

                  <div className="rental-image">

                    {image ? (

                      <img
                        src={image}
                        alt={
                          rental.product?.name ||
                          "Rental product"
                        }
                      />

                    ) : (

                      <span>
                        📦
                      </span>

                    )}

                    <div className="active-badge">
                      ● Active
                    </div>

                  </div>


                  {/* =================================
                      CONTENT
                  ================================== */}

                  <div className="rental-content">

                    {/* Brand */}

                    <p className="rental-brand">
                      {rental.product?.brand ||
                        "RENTAL PRODUCT"}
                    </p>


                    {/* Product Name */}

                    <h2>
                      {rental.product?.name ||
                        "Product unavailable"}
                    </h2>


                    {/* Price */}

                    <div className="rental-price">

                      <strong>
                        ₹{rental.monthlyRent}
                      </strong>

                      <span>
                        / month
                      </span>

                    </div>


                    {/* =================================
                        RENTAL INFORMATION
                    ================================== */}

                    <div className="rental-info">

                      <div>
                        <span>
                          Rental Duration
                        </span>

                        <strong>
                          {rental.months} Months
                        </strong>
                      </div>


                      <div>
                        <span>
                          Quantity
                        </span>

                        <strong>
                          {rental.quantity}
                        </strong>
                      </div>


                      <div>
                        <span>
                          Started
                        </span>

                        <strong>
                          {formatDate(
                            rental.rentalStartDate
                          )}
                        </strong>
                      </div>


                      <div>
                        <span>
                          Ends
                        </span>

                        <strong>
                          {formatDate(
                            rental.rentalEndDate
                          )}
                        </strong>
                      </div>

                    </div>


                    {/* =================================
                        DAYS REMAINING
                    ================================== */}

                    <div className="days-remaining">

                      <span>
                        ⏳
                      </span>

                      <strong>
                        {daysRemaining}
                      </strong>

                      <small>
                        days remaining
                      </small>

                    </div>


                    {/* =================================
                        DELIVERY
                    ================================== */}

                    <div className="delivery-info">

                      <strong>
                        📍 Delivery
                      </strong>

                      <p>
                        {rental.deliveryAddress ||
                          "Address not available"}
                      </p>

                    </div>


                    {/* =================================
                        EXTENSION INFORMATION
                    ================================== */}

                    {rental.extensionStatus ===
                      "Approved" && (

                      <div className="extension-approved">

                        ✓ Rental extension approved

                        {rental.extensionMonths >
                          0 && (
                          <span>
                            +{" "}
                            {
                              rental.extensionMonths
                            }{" "}
                            months
                          </span>
                        )}

                      </div>

                    )}


                    {/* =================================
                        EXTENSION PENDING
                    ================================== */}

                    {rental.extensionStatus ===
                      "Requested" && (

                      <div className="extension-pending">

                        ↻ Extension request pending

                        <small>
                          Waiting for admin approval
                        </small>

                      </div>

                    )}


                    {/* =================================
                        EXTENSION REJECTED
                    ================================== */}

                    {rental.extensionStatus ===
                      "Rejected" && (

                      <div className="extension-rejected">

                        ✕ Previous extension request
                        was rejected

                      </div>

                    )}


                    {/* =================================
                        RETURN STATUS
                    ================================== */}

                    {rental.returnStatus ===
                      "Requested" && (

                      <div className="return-pending">

                        ↻ Return request pending

                        <small>
                          Waiting for admin approval
                        </small>

                      </div>

                    )}


                    {/* =================================
                        ACTION BUTTONS
                    ================================== */}

                    <div className="rental-actions">

                      {/* EXTEND RENTAL */}

                      {rental.extensionStatus ===
                        "Requested" ? (

                        <div className="extension-pending-button">

                          ↻ Extension Pending

                        </div>

                      ) : (

                        <button
                          className="extension-btn"
                          onClick={() =>
                            handleExtension(
                              rental._id
                            )
                          }
                        >
                          📅 Extend Rental
                        </button>

                      )}


                      {/* REQUEST RETURN */}

                      {rental.returnStatus ===
                        "Requested" ? (

                        <div className="return-pending-button">

                          ↻ Return Requested

                        </div>

                      ) : (

                        <button
                          className="return-btn"
                          onClick={() =>
                            handleReturn(
                              rental._id
                            )
                          }
                        >
                          ↩ Request Return
                        </button>

                      )}

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default ActiveRentals;