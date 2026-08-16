import { useEffect, useState } from "react";

import {
  getMyActiveRentals,
  requestReturn,
  requestExtension,
} from "../../services/orderService";

import "./Rentals.css";

function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // EXTENSION STATES
  // =====================================================

  const [extensionRental, setExtensionRental] =
    useState(null);

  const [extensionMonths, setExtensionMonths] =
    useState(1);

  const [extensionLoading, setExtensionLoading] =
    useState(false);

  // =====================================================
  // LOAD RENTALS
  // =====================================================

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setLoading(true);

      const data = await getMyActiveRentals();

      setRentals(data.rentals || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to load rentals"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RETURN REQUEST
  // =====================================================

  const handleReturnRequest = async (id) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to request a return?"
    );

    if (!confirmReturn) return;

    try {
      const data = await requestReturn(id);

      alert(data.message);

      await loadRentals();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to request return"
      );
    }
  };

  // =====================================================
  // OPEN EXTENSION MODAL
  // =====================================================

  const handleOpenExtension = (rental) => {
    setExtensionRental(rental);
    setExtensionMonths(1);
  };

  // =====================================================
  // CLOSE EXTENSION MODAL
  // =====================================================

  const handleCloseExtension = () => {
    if (extensionLoading) return;

    setExtensionRental(null);
    setExtensionMonths(1);
  };

  // =====================================================
  // REQUEST EXTENSION
  // =====================================================

  const handleExtensionRequest = async () => {
    if (!extensionRental) {
      return;
    }

    const months = Number(extensionMonths);

    if (!months || months < 1) {
      alert(
        "Please select a valid extension duration"
      );

      return;
    }

    const monthlyRent = Number(
      extensionRental.monthlyRent || 0
    );

    const quantity = Number(
      extensionRental.quantity || 1
    );

    const totalExtensionAmount =
      monthlyRent *
      months *
      quantity;

    const confirmed = window.confirm(
      `Request ${months} month${
        months > 1 ? "s" : ""
      } extension?\n\n` +
        `Extension Amount: ₹${totalExtensionAmount.toLocaleString(
          "en-IN"
        )}`
    );

    if (!confirmed) {
      return;
    }

    try {
      setExtensionLoading(true);

      const data = await requestExtension(
        extensionRental._id,
        months
      );

      alert(
        data.message ||
          "Rental extension request submitted successfully"
      );

      setExtensionRental(null);
      setExtensionMonths(1);

      await loadRentals();
    } catch (error) {
      console.log(
        "EXTENSION REQUEST ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to request rental extension"
      );
    } finally {
      setExtensionLoading(false);
    }
  };

  // =====================================================
  // CALCULATE DAYS REMAINING
  // =====================================================

  const calculateDaysRemaining = (endDate) => {
    if (!endDate) {
      return 0;
    }

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

  // =====================================================
  // EXTENSION AMOUNT
  // =====================================================

  const extensionAmount = extensionRental
    ? Number(
        extensionRental.monthlyRent || 0
      ) *
      Number(extensionMonths || 0) *
      Number(
        extensionRental.quantity || 1
      )
    : 0;

  // =====================================================
  // LOADING
  // =====================================================

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

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="rentals-page">

      <div className="rentals-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="rentals-header">

          <div>

            <p className="rentals-label">
              RENTEASE
            </p>

            <h1>
              My Active Rentals
            </h1>

            <p>
              Manage your currently rented products.
            </p>

          </div>

          <div className="rentals-count">

            {rentals.length}

            <span>
              Active
            </span>

          </div>

        </div>


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {rentals.length === 0 ? (

          <div className="empty-rentals">

            <div className="empty-icon">
              🏠
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

          /* =================================================
             RENTALS GRID
          ================================================= */

          <div className="rentals-grid">

            {rentals.map((rental) => {

              const productImage =
                rental.product?.images?.length > 0
                  ? `http://localhost:8000${rental.product.images[0]}`
                  : null;

              const daysRemaining =
                calculateDaysRemaining(
                  rental.rentalEndDate
                );

              return (

                <div
                  className="rental-card"
                  key={rental._id}
                >

                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================= */}

                  <div className="rental-image">

                    {productImage ? (

                      <img
                        src={productImage}
                        alt={
                          rental.product?.name ||
                          "Product"
                        }
                      />

                    ) : (

                      <span>
                        📦
                      </span>

                    )}

                  </div>


                  {/* =================================================
                      RENTAL CONTENT
                  ================================================= */}

                  <div className="rental-content">

                    {/* STATUS */}

                    <div className="rental-status">
                      ACTIVE RENTAL
                    </div>


                    {/* PRODUCT */}

                    <h2>
                      {rental.product?.name ||
                        "Product"}
                    </h2>


                    <p className="rental-brand">
                      {rental.product?.brand ||
                        "Brand unavailable"}
                    </p>


                    {/* =================================================
                        RENTAL INFORMATION
                    ================================================= */}

                    <div className="rental-info-grid">

                      <div>

                        <span>
                          Rental Start
                        </span>

                        <strong>
                          {rental.rentalStartDate
                            ? new Date(
                                rental.rentalStartDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "Not started"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Rental End
                        </span>

                        <strong>
                          {rental.rentalEndDate
                            ? new Date(
                                rental.rentalEndDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "Not available"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Duration
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

                    </div>


                    {/* =================================================
                        DAYS REMAINING
                    ================================================= */}

                    <div className="days-remaining">

                      <span>
                        Days Remaining
                      </span>

                      <strong>
                        {daysRemaining} days
                      </strong>

                    </div>


                    {/* =================================================
                        DELIVERY ADDRESS
                    ================================================= */}

                    <div className="rental-address">

                      📍{" "}

                      <strong>
                        Delivery Address
                      </strong>

                      <p>
                        {rental.deliveryAddress}
                      </p>

                    </div>


                    {/* =================================================
                        EXTENSION INFORMATION
                    ================================================= */}

                    {rental.extensionStatus ===
                      "Requested" && (

                      <div
                        style={{
                          marginTop: "15px",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          background:
                            "#fff7ed",
                          color:
                            "#c2410c",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        ⏳ Extension request
                        submitted
                      </div>

                    )}


                    {rental.extensionStatus ===
                      "Approved" && (

                      <div
                        style={{
                          marginTop: "15px",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          background:
                            "#ecfdf5",
                          color:
                            "#047857",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        ✅ Extension approved
                      </div>

                    )}


                    {rental.extensionStatus ===
                      "Rejected" && (

                      <div
                        style={{
                          marginTop: "15px",
                          padding: "12px 14px",
                          borderRadius: "10px",
                          background:
                            "#fef2f2",
                          color:
                            "#b91c1c",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        ❌ Extension request
                        rejected
                      </div>

                    )}


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div
                      className="return-section"
                      style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        marginTop: "20px",
                      }}
                    >

                      {/* =================================================
                          EXTENSION BUTTON
                      ================================================= */}

                      {rental.extensionStatus !==
                        "Requested" && (

                        <button
                          type="button"
                          className="extension-button"
                          onClick={() =>
                            handleOpenExtension(
                              rental
                            )
                          }
                        >
                          🔄 Extend Rental
                        </button>

                      )}


                      {/* =================================================
                          RETURN BUTTON
                      ================================================= */}

                      {rental.returnStatus ===
                        "Requested" ? (

                        <div className="return-requested">
                          ↩ Return request submitted
                        </div>

                      ) : (

                        <button
                          type="button"
                          className="return-button"
                          onClick={() =>
                            handleReturnRequest(
                              rental._id
                            )
                          }
                        >
                          Request Return
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


      {/* =====================================================
          EXTENSION MODAL
      ===================================================== */}

      {extensionRental && (

        <div
          className="extension-modal-overlay"
          onClick={handleCloseExtension}
        >

          <div
            className="extension-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="extension-modal-header">

              <div>

                <p className="extension-modal-label">
                  RENTAL EXTENSION
                </p>

                <h2>
                  Extend Rental
                </h2>

                <p>
                  {extensionRental.product?.name ||
                    "Rental Product"}
                </p>

              </div>

              <button
                type="button"
                className="extension-close-button"
                onClick={
                  handleCloseExtension
                }
                disabled={
                  extensionLoading
                }
              >
                ×
              </button>

            </div>


            {/* =================================================
                CURRENT RENTAL
            ================================================= */}

            <div className="extension-current-rental">

              <div>

                <span>
                  Current End Date
                </span>

                <strong>
                  {extensionRental.rentalEndDate
                    ? new Date(
                        extensionRental.rentalEndDate
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "Not available"}
                </strong>

              </div>


              <div>

                <span>
                  Monthly Rent
                </span>

                <strong>
                  ₹
                  {Number(
                    extensionRental.monthlyRent ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Quantity
                </span>

                <strong>
                  {extensionRental.quantity ||
                    1}
                </strong>

              </div>

            </div>


            {/* =================================================
                EXTENSION MONTHS
            ================================================= */}

            <div className="extension-form-group">

              <label>
                Extension Duration
              </label>

              <select
                value={extensionMonths}
                onChange={(e) =>
                  setExtensionMonths(
                    Number(
                      e.target.value
                    )
                  )
                }
                disabled={
                  extensionLoading
                }
              >

                {Array.from(
                  {
                    length: 12,
                  },
                  (_, index) =>
                    index + 1
                ).map((month) => (

                  <option
                    key={month}
                    value={month}
                  >
                    {month}{" "}
                    {month === 1
                      ? "Month"
                      : "Months"}
                  </option>

                ))}

              </select>

            </div>


            {/* =================================================
                EXTENSION PRICE
            ================================================= */}

            <div className="extension-price-box">

              <div>

                <span>
                  Extension Duration
                </span>

                <strong>
                  {extensionMonths}{" "}
                  {extensionMonths === 1
                    ? "Month"
                    : "Months"}
                </strong>

              </div>


              <div>

                <span>
                  Extension Amount
                </span>

                <strong>
                  ₹
                  {extensionAmount.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>


            {/* =================================================
                INFORMATION
            ================================================= */}

            <div className="extension-note">

              <span>
                ℹ️
              </span>

              <p>
                Your extension request will
                be sent to the admin for
                approval. The extension is
                not active until approved.
              </p>

            </div>


            {/* =================================================
                MODAL ACTIONS
            ================================================= */}

            <div className="extension-modal-actions">

              <button
                type="button"
                className="extension-cancel-button"
                onClick={
                  handleCloseExtension
                }
                disabled={
                  extensionLoading
                }
              >
                Cancel
              </button>


              <button
                type="button"
                className="extension-submit-button"
                onClick={
                  handleExtensionRequest
                }
                disabled={
                  extensionLoading
                }
              >

                {extensionLoading
                  ? "Submitting..."
                  : "Request Extension"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Rentals;