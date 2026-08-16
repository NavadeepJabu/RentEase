import { useEffect, useState } from "react";

import {
  getExtensionRequests,
  updateExtensionStatus,
} from "../../services/orderService";

import "./Extensions.css";

function Extensions() {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // =====================================================
  // LOAD EXTENSION REQUESTS
  // =====================================================

  useEffect(() => {
    loadExtensions();
  }, []);

  const loadExtensions = async () => {
    try {
      setLoading(true);

      const data =
        await getExtensionRequests();

      setExtensions(
        data.extensions ||
          data.requests ||
          []
      );

    } catch (error) {
      console.log(
        "EXTENSION LOAD ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load extension requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE EXTENSION STATUS
  // =====================================================

  const handleStatusUpdate = async (
    id,
    status
  ) => {
    const action =
      status === "Approved"
        ? "approve"
        : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this extension request?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(id);

      const data =
        await updateExtensionStatus(
          id,
          status
        );

      alert(
        data.message ||
          `Extension request ${status.toLowerCase()} successfully`
      );

      await loadExtensions();

    } catch (error) {
      console.log(
        "EXTENSION UPDATE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update extension request"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

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

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Requested":
        return "extension-status-requested";

      case "Approved":
        return "extension-status-approved";

      case "Rejected":
        return "extension-status-rejected";

      default:
        return "";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="extensions-loading">

        <div className="extensions-spinner"></div>

        <p>
          Loading extension requests...
        </p>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-extensions-page">

      {/* Background */}

      <div className="extensions-glow extensions-glow-one"></div>

      <div className="extensions-glow extensions-glow-two"></div>


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="extensions-header">

        <div>

          <p className="extensions-label">
            ADMIN PANEL
          </p>

          <h1>
            Rental Extensions
          </h1>

          <p className="extensions-subtitle">
            Review and manage customer
            rental extension requests.
          </p>

        </div>


        <div className="extensions-count">

          <strong>
            {extensions.length}
          </strong>

          <span>
            Requests
          </span>

        </div>

      </div>


      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {extensions.length === 0 ? (

        <div className="extensions-empty">

          <div className="extensions-empty-icon">
            🔄
          </div>

          <h2>
            No Extension Requests
          </h2>

          <p>
            There are currently no rental
            extension requests from customers.
          </p>

        </div>

      ) : (

        /* =================================================
           EXTENSION GRID
        ================================================= */

        <div className="extensions-grid">

          {extensions.map((item) => {

            const customer =
              item.customer || {};

            const product =
              item.product || {};

            const status =
              item.extensionStatus ||
              "Requested";

            const requestedMonths =
              Number(
                item.extensionMonths || 0
              );

            const monthlyRent =
              Number(
                item.monthlyRent || 0
              );

            const quantity =
              Number(
                item.quantity || 1
              );

            const extensionAmount =
              Number(
                item.extensionAmount ||
                  monthlyRent *
                    requestedMonths *
                    quantity
              );

            return (

              <div
                className="extension-card"
                key={item._id}
              >

                {/* =================================================
                    CARD HEADER
                ================================================= */}

                <div className="extension-card-header">

                  <div className="extension-icon">
                    🔄
                  </div>

                  <span
                    className={`extension-status ${getStatusClass(
                      status
                    )}`}
                  >
                    {status}
                  </span>

                </div>


                {/* =================================================
                    PRODUCT
                ================================================= */}

                <div className="extension-product">

                  <span className="extension-section-label">
                    PRODUCT
                  </span>

                  <h2>
                    {product.name ||
                      "Product unavailable"}
                  </h2>

                  <p>
                    {product.brand ||
                      "Brand unavailable"}
                  </p>

                </div>


                {/* =================================================
                    CUSTOMER
                ================================================= */}

                <div className="extension-customer">

                  <span className="extension-section-label">
                    CUSTOMER
                  </span>

                  <h3>
                    {customer.fullName ||
                      "Unknown Customer"}
                  </h3>

                  <p>
                    {customer.email ||
                      "No email available"}
                  </p>

                  {customer.phone && (
                    <p>
                      {customer.phone}
                    </p>
                  )}

                </div>


                {/* =================================================
                    RENTAL DETAILS
                ================================================= */}

                <div className="extension-details">

                  <div>

                    <span>
                      Current Duration
                    </span>

                    <strong>
                      {item.months || 0}
                      {" "}
                      Months
                    </strong>

                  </div>


                  <div>

                    <span>
                      Extension
                    </span>

                    <strong>
                      {requestedMonths}
                      {" "}
                      {requestedMonths === 1
                        ? "Month"
                        : "Months"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Quantity
                    </span>

                    <strong>
                      {quantity}
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
                    RENTAL DATES
                ================================================= */}

                <div className="extension-dates">

                  <div>

                    <span>
                      Current Start
                    </span>

                    <strong>
                      {formatDate(
                        item.rentalStartDate
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Current End
                    </span>

                    <strong>
                      {formatDate(
                        item.rentalEndDate
                      )}
                    </strong>

                  </div>

                </div>


                {/* =================================================
                    REQUEST DATE
                ================================================= */}

                <div className="extension-request-date">

                  <span>
                    REQUESTED ON
                  </span>

                  <strong>
                    {formatDate(
                      item.extensionRequestedAt ||
                        item.updatedAt ||
                        item.createdAt
                    )}
                  </strong>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                {status === "Requested" && (

                  <div className="extension-actions">

                    <button
                      className="extension-reject-button"
                      disabled={
                        updatingId ===
                        item._id
                      }
                      onClick={() =>
                        handleStatusUpdate(
                          item._id,
                          "Rejected"
                        )
                      }
                    >
                      {updatingId === item._id
                        ? "Updating..."
                        : "✕ Reject"}
                    </button>


                    <button
                      className="extension-approve-button"
                      disabled={
                        updatingId ===
                        item._id
                      }
                      onClick={() =>
                        handleStatusUpdate(
                          item._id,
                          "Approved"
                        )
                      }
                    >
                      {updatingId === item._id
                        ? "Updating..."
                        : "✓ Approve"}
                    </button>

                  </div>

                )}


                {status === "Approved" && (

                  <div className="extension-approved-message">
                    ✓ Extension approved
                  </div>

                )}


                {status === "Rejected" && (

                  <div className="extension-rejected-message">
                    ✕ Extension rejected
                  </div>

                )}

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default Extensions;