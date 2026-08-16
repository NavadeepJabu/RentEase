import { useEffect, useState } from "react";

import { getProducts } from "../../services/productService";

import {
  createMaintenanceRequest,
  getMyMaintenanceRequests,
} from "../../services/maintenanceService";

import "./Maintenance.css";


function Maintenance() {

  const [products, setProducts] = useState([]);

  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
    product: "",
    issue: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);


  // =====================================================
  // LOAD CUSTOMER MAINTENANCE DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {

    try {

      setLoading(true);

      const [
        productsData,
        requestsData,
      ] = await Promise.all([
        getProducts(),
        getMyMaintenanceRequests(),
      ]);


      // ---------------------------------------------
      // PRODUCTS
      // ---------------------------------------------

      setProducts(
        productsData.products || []
      );


      // ---------------------------------------------
      // MAINTENANCE REQUESTS
      // ---------------------------------------------

      setRequests(
        requestsData.requests || []
      );

    } catch (error) {

      console.log(
        "MAINTENANCE LOAD ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load maintenance data"
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =====================================================
  // SUBMIT MAINTENANCE REQUEST
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (
      !formData.product ||
      !formData.issue.trim() ||
      !formData.description.trim()
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }


    try {

      setSubmitting(true);


      const data =
        await createMaintenanceRequest({
          product:
            formData.product,

          issue:
            formData.issue.trim(),

          description:
            formData.description.trim(),

          priority:
            "Medium",
        });


      alert(
        data.message ||
          "Maintenance request created successfully"
      );


      // ---------------------------------------------
      // RESET FORM
      // ---------------------------------------------

      setFormData({
        product: "",
        issue: "",
        description: "",
      });


      // ---------------------------------------------
      // REFRESH REQUESTS
      // ---------------------------------------------

      await loadData();

    } catch (error) {

      console.log(
        "MAINTENANCE CREATE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to create maintenance request"
      );

    } finally {

      setSubmitting(false);

    }
  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Pending":
        return "maintenance-status-pending";

      case "In Progress":
        return "maintenance-status-progress";

      case "Resolved":
        return "maintenance-status-resolved";

      default:
        return "";

    }
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "Unavailable";
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
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="maintenance-loading">

        <div className="maintenance-spinner"></div>

        <p>
          Loading maintenance support...
        </p>

      </div>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="maintenance-page">

      {/* ==========================================
          BACKGROUND
      ========================================== */}

      <div
        className="maintenance-glow maintenance-glow-one"
      ></div>

      <div
        className="maintenance-glow maintenance-glow-two"
      ></div>


      <div className="maintenance-container">


        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="maintenance-header">

          <div>

            <p className="maintenance-label">
              RENT EASE
            </p>

            <h1>
              Maintenance Support
            </h1>

            <p>
              We're here to help keep your
              rented products running smoothly.
            </p>

          </div>


          <div className="maintenance-icon">
            🔧
          </div>

        </div>


        {/* ==========================================
            CREATE REQUEST
        ========================================== */}

        <div className="maintenance-form-card">

          <div className="section-heading">

            <div className="section-icon">
              🛠️
            </div>

            <div>

              <h2>
                Report a Problem
              </h2>

              <p>
                Tell us what's wrong and our
                support team will take care of it.
              </p>

            </div>

          </div>


          <form
            onSubmit={handleSubmit}
          >


            {/* ======================================
                PRODUCT
            ====================================== */}

            <div className="maintenance-field">

              <label>
                Product
              </label>

              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Product
                </option>

                {products.map(
                  (product) => (

                    <option
                      key={product._id}
                      value={product._id}
                    >
                      {product.name}
                      {" - "}
                      {product.brand}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* ======================================
                ISSUE
            ====================================== */}

            <div className="maintenance-field">

              <label>
                Issue
              </label>

              <input
                type="text"
                name="issue"
                placeholder="Example: Machine making unusual noise"
                value={formData.issue}
                onChange={handleChange}
                required
              />

            </div>


            {/* ======================================
                DESCRIPTION
            ====================================== */}

            <div className="maintenance-field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                rows="5"
                placeholder="Describe the problem in detail..."
                value={formData.description}
                onChange={handleChange}
                required
              />

            </div>


            {/* ======================================
                SUBMIT
            ====================================== */}

            <button
              type="submit"
              disabled={submitting}
              className="maintenance-submit-btn"
            >

              {submitting ? (

                <>
                  <span className="button-spinner"></span>

                  Submitting...
                </>

              ) : (

                <>
                  Submit Request

                  <span>
                    →
                  </span>
                </>

              )}

            </button>

          </form>

        </div>


        {/* ==========================================
            MY REQUESTS
        ========================================== */}

        <div className="my-maintenance-section">


          {/* ----------------------------------------
              HEADING
          ---------------------------------------- */}

          <div className="requests-heading">

            <div>

              <p className="small-heading">
                SUPPORT HISTORY
              </p>

              <h2>
                My Maintenance Requests
              </h2>

              <p>
                Track the status of your reported
                issues.
              </p>

            </div>


            <div className="request-count">

              <strong>
                {requests.length}
              </strong>

              <span>
                {requests.length === 1
                  ? "Request"
                  : "Requests"}
              </span>

            </div>

          </div>


          {/* ========================================
              EMPTY
          ======================================== */}

          {requests.length === 0 ? (

            <div className="empty-maintenance">

              <div className="empty-maintenance-icon">
                🔧
              </div>

              <h3>
                No maintenance requests
              </h3>

              <p>
                You haven't reported any product
                issues yet.
              </p>

            </div>

          ) : (


            /* ======================================
               REQUEST LIST
            ====================================== */

            <div className="maintenance-requests">

              {requests.map(
                (request, index) => (

                  <div
                    className="maintenance-request-card"
                    key={request._id}
                    style={{
                      animationDelay:
                        `${index * 0.08}s`,
                    }}
                  >


                    {/* ==================================
                        TOP
                    ================================== */}

                    <div className="request-top">

                      <div className="request-product">

                        <div className="request-product-icon">
                          🔧
                        </div>


                        <div>

                          <p>
                            PRODUCT
                          </p>

                          <h3>
                            {request.product?.name ||
                              "Product unavailable"}
                          </h3>

                          <span>
                            {request.product?.brand ||
                              "Brand unavailable"}
                          </span>

                        </div>

                      </div>


                      <div
                        className={`maintenance-status ${getStatusClass(
                          request.status
                        )}`}
                      >

                        <span></span>

                        {request.status}

                      </div>

                    </div>


                    {/* ==================================
                        DETAILS
                    ================================== */}

                    <div className="request-details">


                      {/* ISSUE */}

                      <div className="request-detail">

                        <span>
                          ISSUE
                        </span>

                        <strong>
                          {request.issue}
                        </strong>

                      </div>


                      {/* DESCRIPTION */}

                      <div className="request-detail">

                        <span>
                          DESCRIPTION
                        </span>

                        <p>
                          {request.description}
                        </p>

                      </div>


                    </div>


                    {/* ==================================
                        ASSIGNED TECHNICIAN
                    ================================== */}

                    <div className="request-assignment">

                      <span>
                        ASSIGNED TO
                      </span>


                      {request.assignedTo ? (

                        <strong>
                          👨‍🔧{" "}
                          {request.assignedTo.fullName}
                        </strong>

                      ) : (

                        <p>
                          Not assigned yet
                        </p>

                      )}

                    </div>


                    {/* ==================================
                        ADMIN NOTES
                    ================================== */}

                    {request.adminNotes && (

                      <div className="request-admin-notes">

                        <span>
                          📝 ADMIN NOTES
                        </span>

                        <p>
                          {request.adminNotes}
                        </p>

                      </div>

                    )}


                    {/* ==================================
                        RESOLUTION NOTES
                    ================================== */}

                    {request.resolutionNotes && (

                      <div className="request-resolution-notes">

                        <span>
                          ✅ RESOLUTION
                        </span>

                        <p>
                          {request.resolutionNotes}
                        </p>

                      </div>

                    )}


                    {/* ==================================
                        DATES
                    ================================== */}

                    <div className="request-footer">

                      <span>

                        Requested on{" "}

                        <strong>
                          {formatDate(
                            request.createdAt
                          )}
                        </strong>

                      </span>


                      {request.resolvedAt && (

                        <span>

                          Resolved on{" "}

                          <strong>
                            {formatDate(
                              request.resolvedAt
                            )}
                          </strong>

                        </span>

                      )}

                    </div>


                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}


export default Maintenance;