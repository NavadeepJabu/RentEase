import { useEffect, useState } from "react";

import {
  getAllReturns,
  updateReturnStatus,
} from "../../services/orderService";

import "./Returns.css";

function Returns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Damage inspection state
  const [inspectionData, setInspectionData] = useState({});

  useEffect(() => {
    loadReturns();
  }, []);

  // =====================================================
  // LOAD RETURNS
  // =====================================================

  const loadReturns = async () => {
    try {
      setLoading(true);

      const data = await getAllReturns();

      const returnData = data.returns || [];

      setReturns(returnData);

      // Prepare inspection values
      const initialInspection = {};

      returnData.forEach((item) => {
        initialInspection[item._id] = {
          damageStatus:
            item.damageStatus || "Not Inspected",

          damageDescription:
            item.damageDescription || "",

          damageCharge:
            item.damageCharge || 0,
        };
      });

      setInspectionData(initialInspection);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to load return requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INSPECTION FIELD CHANGE
  // =====================================================

  const handleInspectionChange = (
    id,
    field,
    value
  ) => {
    setInspectionData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // =====================================================
  // UPDATE RETURN
  // =====================================================

  const handleStatusChange = async (
    id,
    status
  ) => {
    const inspection =
      inspectionData[id] || {
        damageStatus: "Not Inspected",
        damageDescription: "",
        damageCharge: 0,
      };

    // -----------------------------------------
    // COMPLETE VALIDATION
    // -----------------------------------------

    if (status === "Completed") {
      if (
        inspection.damageStatus ===
        "Not Inspected"
      ) {
        alert(
          "Please complete the damage inspection before completing the return."
        );

        return;
      }

      if (
        inspection.damageStatus ===
          "Damaged" &&
        Number(inspection.damageCharge) < 0
      ) {
        alert(
          "Damage charge cannot be negative."
        );

        return;
      }

      if (
        inspection.damageStatus ===
          "Damaged" &&
        !inspection.damageDescription.trim()
      ) {
        alert(
          "Please provide a damage description."
        );

        return;
      }

      const confirmed = window.confirm(
        "Complete this return?\n\nThe product will be added back to inventory."
      );

      if (!confirmed) return;
    }

    // -----------------------------------------
    // REJECT CONFIRMATION
    // -----------------------------------------

    if (status === "Rejected") {
      const confirmed = window.confirm(
        "Are you sure you want to reject this return request?"
      );

      if (!confirmed) return;
    }

    // -----------------------------------------
    // APPROVE CONFIRMATION
    // -----------------------------------------

    if (status === "Approved") {
      const confirmed = window.confirm(
        "Approve this return request?"
      );

      if (!confirmed) return;
    }

    try {
      const data =
        await updateReturnStatus(id, {
          returnStatus: status,

          damageStatus:
            inspection.damageStatus,

          damageDescription:
            inspection.damageDescription,

          damageCharge:
            Number(
              inspection.damageCharge
            ) || 0,
        });

      alert(data.message);

      await loadReturns();
    } catch (error) {
      console.log(
        "RETURN UPDATE ERROR:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to update return"
      );
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Requested":
        return "return-requested";

      case "Approved":
        return "return-approved";

      case "Rejected":
        return "return-rejected";

      case "Completed":
        return "return-completed";

      default:
        return "";
    }
  };

  // =====================================================
  // DAMAGE CLASS
  // =====================================================

  const getDamageClass = (status) => {
    switch (status) {
      case "No Damage":
        return "damage-no-damage";

      case "Damaged":
        return "damage-damaged";

      case "Not Inspected":
      default:
        return "damage-not-inspected";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="returns-loading">
        <div className="returns-spinner"></div>

        <p>
          Loading return requests...
        </p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-returns-page">

      {/* Background */}

      <div className="returns-glow returns-glow-one"></div>

      <div className="returns-glow returns-glow-two"></div>

      {/* Header */}

      <div className="returns-header">

        <div>
          <p className="returns-label">
            ADMIN PANEL
          </p>

          <h1>
            Manage Returns
          </h1>

          <p className="returns-subtitle">
            Review rental returns, inspect product
            condition and manage damage claims.
          </p>
        </div>

        <div className="returns-count">
          <strong>
            {returns.length}
          </strong>

          <span>
            Return Requests
          </span>
        </div>

      </div>

      {/* Empty */}

      {returns.length === 0 ? (

        <div className="returns-empty">

          <div className="returns-empty-icon">
            ↩️
          </div>

          <h2>
            No Return Requests
          </h2>

          <p>
            There are currently no customer
            return requests.
          </p>

        </div>

      ) : (

        <div className="returns-grid">

          {returns.map((item) => {

            const inspection =
              inspectionData[item._id] || {
                damageStatus:
                  item.damageStatus ||
                  "Not Inspected",

                damageDescription:
                  item.damageDescription ||
                  "",

                damageCharge:
                  item.damageCharge || 0,
              };

            const isRequested =
              item.returnStatus ===
              "Requested";

            const isApproved =
              item.returnStatus ===
              "Approved";

            const isCompleted =
              item.returnStatus ===
              "Completed";

            const isRejected =
              item.returnStatus ===
              "Rejected";

            return (

              <div
                className="return-card"
                key={item._id}
              >

                {/* ================================
                    CARD HEADER
                ================================= */}

                <div className="return-card-header">

                  <div>

                    <small>
                      ORDER ID
                    </small>

                    <strong>
                      #
                      {item._id
                        .slice(-8)
                        .toUpperCase()}
                    </strong>

                  </div>

                  <span
                    className={`return-status ${getStatusClass(
                      item.returnStatus
                    )}`}
                  >
                    {item.returnStatus}
                  </span>

                </div>

                {/* ================================
                    PRODUCT
                ================================= */}

                <div className="return-product">

                  <div className="return-product-icon">
                    📦
                  </div>

                  <div>

                    <small>
                      PRODUCT
                    </small>

                    <h2>
                      {item.product?.name ||
                        "Product unavailable"}
                    </h2>

                    <p>
                      {item.product?.brand ||
                        ""}
                    </p>

                  </div>

                </div>

                {/* ================================
                    CUSTOMER
                ================================= */}

                <div className="return-customer">

                  <small>
                    CUSTOMER
                  </small>

                  <h3>
                    {item.customer?.fullName ||
                      "Unknown Customer"}
                  </h3>

                  <p>
                    {item.customer?.email ||
                      "No email"}
                  </p>

                  {item.customer?.phone && (
                    <p>
                      📱{" "}
                      {item.customer.phone}
                    </p>
                  )}

                </div>

                {/* ================================
                    RENTAL DETAILS
                ================================= */}

                <div className="return-details">

                  <div>
                    <span>
                      Duration
                    </span>

                    <strong>
                      {item.months} months
                    </strong>
                  </div>

                  <div>
                    <span>
                      Quantity
                    </span>

                    <strong>
                      {item.quantity}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{item.totalAmount}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Payment
                    </span>

                    <strong>
                      {item.paymentStatus}
                    </strong>
                  </div>

                </div>

                {/* ================================
                    RETURN REQUEST
                ================================= */}

                <div className="return-request-box">

                  <span>
                    ↩ RETURN REQUESTED
                  </span>

                  <p>
                    {item.returnRequestDate
                      ? new Date(
                          item.returnRequestDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Date unavailable"}
                  </p>

                </div>

                {/* ================================
                    DELIVERY ADDRESS
                ================================= */}

                {item.deliveryAddress && (

                  <div className="return-address">

                    <span>
                      📍 DELIVERY ADDRESS
                    </span>

                    <p>
                      {item.deliveryAddress}
                    </p>

                  </div>

                )}

                {/* ================================
                    DAMAGE INSPECTION
                ================================= */}

                <div className="damage-inspection">

                  <div className="damage-inspection-header">

                    <div>

                      <span>
                        PRODUCT INSPECTION
                      </span>

                      <h3>
                        Damage Assessment
                      </h3>

                    </div>

                    <span
                      className={`damage-status-badge ${getDamageClass(
                        inspection.damageStatus
                      )}`}
                    >
                      {inspection.damageStatus}
                    </span>

                  </div>

                  {/* Damage Status */}

                  <div className="damage-field">

                    <label>
                      Product Condition
                    </label>

                    <select
                      value={
                        inspection.damageStatus
                      }
                      disabled={
                        isCompleted ||
                        isRejected
                      }
                      onChange={(e) =>
                        handleInspectionChange(
                          item._id,
                          "damageStatus",
                          e.target.value
                        )
                      }
                    >

                      <option value="Not Inspected">
                        Not Inspected
                      </option>

                      <option value="No Damage">
                        No Damage
                      </option>

                      <option value="Damaged">
                        Damaged
                      </option>

                    </select>

                  </div>

                  {/* Damage Description */}

                  <div className="damage-field">

                    <label>
                      Damage Description
                    </label>

                    <textarea
                      rows="3"
                      value={
                        inspection.damageDescription
                      }
                      disabled={
                        isCompleted ||
                        isRejected
                      }
                      onChange={(e) =>
                        handleInspectionChange(
                          item._id,
                          "damageDescription",
                          e.target.value
                        )
                      }
                      placeholder="Describe any scratches, cracks, missing parts or other damage..."
                    />

                  </div>

                  {/* Damage Charge */}

                  <div className="damage-field">

                    <label>
                      Damage Charge
                    </label>

                    <div className="damage-charge-input">

                      <span>
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={
                          inspection.damageCharge
                        }
                        disabled={
                          isCompleted ||
                          isRejected
                        }
                        onChange={(e) =>
                          handleInspectionChange(
                            item._id,
                            "damageCharge",
                            e.target.value
                          )
                        }
                        placeholder="0"
                      />

                    </div>

                    <small>
                      Enter 0 when there is no
                      damage charge.
                    </small>

                  </div>

                </div>

                {/* ================================
                    EXISTING DAMAGE SUMMARY
                ================================= */}

                {item.damageStatus &&
                  item.damageStatus !==
                    "Not Inspected" && (

                  <div className="damage-box">

                    <span>
                      SAVED INSPECTION
                    </span>

                    <strong>
                      {item.damageStatus}
                    </strong>

                    {item.damageDescription && (
                      <p>
                        {item.damageDescription}
                      </p>
                    )}

                    {Number(
                      item.damageCharge
                    ) > 0 && (
                      <p>
                        Damage Charge: ₹
                        {item.damageCharge}
                      </p>
                    )}

                  </div>

                )}

                {/* ================================
                    ACTIONS
                ================================= */}

                <div className="return-actions">

                  <label>
                    Return Action
                  </label>

                  {/* Requested */}

                  {isRequested && (

                    <div className="return-action-buttons">

                      <button
                        type="button"
                        className="return-approve-btn"
                        onClick={() =>
                          handleStatusChange(
                            item._id,
                            "Approved"
                          )
                        }
                      >
                        ✓ Approve Return
                      </button>

                      <button
                        type="button"
                        className="return-reject-btn"
                        onClick={() =>
                          handleStatusChange(
                            item._id,
                            "Rejected"
                          )
                        }
                      >
                        ✕ Reject Return
                      </button>

                    </div>

                  )}

                  {/* Approved */}

                  {isApproved && (

                    <button
                      type="button"
                      className="return-complete-btn"
                      onClick={() =>
                        handleStatusChange(
                          item._id,
                          "Completed"
                        )
                      }
                    >
                      ✓ Complete Return
                    </button>

                  )}

                  {/* Completed */}

                  {isCompleted && (

                    <div className="return-completed-message">

                      ✓ Return Completed

                      <span>
                        Inventory has been restored.
                      </span>

                    </div>

                  )}

                  {/* Rejected */}

                  {isRejected && (

                    <div className="return-rejected-message">

                      ✕ Return Rejected

                      <span>
                        This return request is closed.
                      </span>

                    </div>

                  )}

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default Returns;