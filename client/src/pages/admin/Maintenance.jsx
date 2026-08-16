import { useEffect, useState } from "react";

import {
  getAllMaintenanceRequests,
  getMaintenanceStats,
  getAssignableStaff,
  updateMaintenanceRequest,
} from "../../services/maintenanceService";

import "./Maintenance.css";


function AdminMaintenance() {

  // =====================================================
  // STATE
  // =====================================================

  const [requests, setRequests] = useState([]);

  const [staff, setStaff] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0,
    high: 0,
  });

  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [editData, setEditData] =
    useState({});

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {

    try {

      setLoading(true);

      const [
        requestsData,
        statsData,
        staffData,
      ] = await Promise.all([

        getAllMaintenanceRequests(),

        getMaintenanceStats(),

        getAssignableStaff(),

      ]);


      // ---------------------------------------------
      // REQUESTS
      // ---------------------------------------------

      setRequests(
        requestsData.requests || []
      );


      // ---------------------------------------------
      // STATS
      // ---------------------------------------------

      setStats(
        statsData.stats || {
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          urgent: 0,
          high: 0,
        }
      );


      // ---------------------------------------------
      // STAFF
      // ---------------------------------------------

      setStaff(
  staffData.staff || []
);

    } catch (error) {

      console.log(
        "ADMIN MAINTENANCE LOAD ERROR:",
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
  // START EDIT
  // =====================================================

  const startEdit = (request) => {

    setEditData({

      [request._id]: {

        status:
          request.status ||
          "Pending",

        priority:
          request.priority ||
          "Medium",

        assignedTo:
          request.assignedTo?._id ||
          "",

        adminNotes:
          request.adminNotes ||
          "",

        resolutionNotes:
          request.resolutionNotes ||
          "",

      },

    });

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {

    setEditData({});

  };


  // =====================================================
  // CHANGE EDIT FIELD
  // =====================================================

  const handleEditChange = (
    id,
    field,
    value
  ) => {

    setEditData((previous) => ({

      ...previous,

      [id]: {

        ...previous[id],

        [field]: value,

      },

    }));

  };


  // =====================================================
  // SAVE UPDATE
  // =====================================================

  const handleUpdate = async (id) => {

    const data = editData[id];

    if (!data) {
      return;
    }


    try {

      setUpdatingId(id);


      const payload = {

        status:
          data.status,

        priority:
          data.priority,

        assignedTo:
          data.assignedTo ||
          null,

        adminNotes:
          data.adminNotes ||
          "",

        resolutionNotes:
          data.resolutionNotes ||
          "",

      };


      const response =
        await updateMaintenanceRequest(
          id,
          payload
        );


      alert(
        response.message ||
          "Maintenance request updated successfully"
      );


      setEditData({});


      await loadData();

    } catch (error) {

      console.log(
        "MAINTENANCE UPDATE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update maintenance request"
      );

    } finally {

      setUpdatingId(null);

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
  // PRIORITY CLASS
  // =====================================================

  const getPriorityClass = (priority) => {

    switch (priority) {

      case "Low":
        return "priority-low";

      case "Medium":
        return "priority-medium";

      case "High":
        return "priority-high";

      case "Urgent":
        return "priority-urgent";

      default:
        return "";

    }

  };


  // =====================================================
  // DATE FORMAT
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
  // FILTER REQUESTS
  // =====================================================

  const filteredRequests =
    requests.filter((request) => {

      const search =
        searchTerm
          .trim()
          .toLowerCase();


      const customerName =
        request.customer?.fullName ||
        "";

      const customerEmail =
        request.customer?.email ||
        "";

      const productName =
        request.product?.name ||
        "";

      const productBrand =
        request.product?.brand ||
        "";

      const issue =
        request.issue ||
        "";


      const matchesSearch =
        !search ||

        customerName
          .toLowerCase()
          .includes(search) ||

        customerEmail
          .toLowerCase()
          .includes(search) ||

        productName
          .toLowerCase()
          .includes(search) ||

        productBrand
          .toLowerCase()
          .includes(search) ||

        issue
          .toLowerCase()
          .includes(search);


      const matchesStatus =
        statusFilter === "All" ||
        request.status ===
          statusFilter;


      const matchesPriority =
        priorityFilter === "All" ||
        request.priority ===
          priorityFilter;


      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );

    });


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="maintenance-loading">

        <div className="maintenance-spinner"></div>

        <p>
          Loading maintenance requests...
        </p>

      </div>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="admin-maintenance-page">


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
              ADMIN PANEL
            </p>

            <h1>
              Maintenance Management
            </h1>

            <p className="maintenance-subtitle">
              Monitor customer issues, assign
              technicians and manage resolutions.
            </p>

          </div>


          <div className="maintenance-count">

            <span>
              {stats.total}
            </span>

            <small>
              Total Requests
            </small>

          </div>

        </div>


        {/* ==========================================
            STATISTICS
        ========================================== */}

        <div className="maintenance-stats">


          {/* TOTAL */}

          <div className="maintenance-stat-card">

            <div className="maintenance-stat-icon">
              📋
            </div>

            <div>

              <span>
                Total
              </span>

              <strong>
                {stats.total}
              </strong>

            </div>

          </div>


          {/* PENDING */}

          <div className="maintenance-stat-card">

            <div className="maintenance-stat-icon">
              ⏳
            </div>

            <div>

              <span>
                Pending
              </span>

              <strong>
                {stats.pending}
              </strong>

            </div>

          </div>


          {/* IN PROGRESS */}

          <div className="maintenance-stat-card">

            <div className="maintenance-stat-icon">
              🔧
            </div>

            <div>

              <span>
                In Progress
              </span>

              <strong>
                {stats.inProgress}
              </strong>

            </div>

          </div>


          {/* RESOLVED */}

          <div className="maintenance-stat-card">

            <div className="maintenance-stat-icon">
              ✅
            </div>

            <div>

              <span>
                Resolved
              </span>

              <strong>
                {stats.resolved}
              </strong>

            </div>

          </div>


          {/* URGENT */}

          <div className="maintenance-stat-card">

            <div className="maintenance-stat-icon">
              🚨
            </div>

            <div>

              <span>
                Urgent
              </span>

              <strong>
                {stats.urgent}
              </strong>

            </div>

          </div>


          {/* HIGH */}

          <div className="maintenance-stat-card">

            <div className="maintenance-stat-icon">
              ⚠️
            </div>

            <div>

              <span>
                High Priority
              </span>

              <strong>
                {stats.high}
              </strong>

            </div>

          </div>

        </div>


        {/* ==========================================
            FILTER BAR
        ========================================== */}

        <div className="maintenance-filter-bar">


          {/* SEARCH */}

          <div className="maintenance-search">

            <span>
              🔎
            </span>

            <input
              type="text"
              placeholder="Search customer, product or issue..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>


          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Resolved">
              Resolved
            </option>

          </select>


          {/* PRIORITY */}

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Priority
            </option>

            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>

            <option value="Urgent">
              Urgent
            </option>

          </select>


          {/* CLEAR */}

          {(searchTerm ||
            statusFilter !== "All" ||
            priorityFilter !== "All") && (

            <button
              className="maintenance-clear-btn"
              onClick={() => {

                setSearchTerm("");

                setStatusFilter("All");

                setPriorityFilter("All");

              }}
            >
              Clear
            </button>

          )}

        </div>


        {/* ==========================================
            RESULT COUNT
        ========================================== */}

        <div className="maintenance-result-info">

          Showing{" "}

          <strong>
            {filteredRequests.length}
          </strong>{" "}

          of{" "}

          <strong>
            {requests.length}
          </strong>{" "}

          maintenance requests

        </div>


        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {requests.length === 0 ? (

          <div className="maintenance-empty">

            <div className="maintenance-empty-icon">
              🔧
            </div>

            <h2>
              No Maintenance Requests
            </h2>

            <p>
              There are currently no maintenance
              requests from customers.
            </p>

          </div>

        ) : filteredRequests.length === 0 ? (

          <div className="maintenance-empty">

            <div className="maintenance-empty-icon">
              🔎
            </div>

            <h2>
              No Matching Requests
            </h2>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        ) : (


          /* ========================================
             REQUEST GRID
          ======================================== */

          <div className="maintenance-grid">

            {filteredRequests.map(
              (request, index) => {

                const editing =
                  editData[
                    request._id
                  ];


                return (

                  <div
                    className="maintenance-card"
                    key={request._id}
                    style={{
                      animationDelay:
                        `${index * 0.06}s`,
                    }}
                  >


                    {/* ==================================
                        CARD HEADER
                    ================================== */}

                    <div className="maintenance-card-header">

                      <div className="maintenance-icon">
                        🔧
                      </div>


                      <div className="maintenance-card-statuses">

                        <span
                          className={`maintenance-status ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>


                        <span
                          className={`maintenance-priority ${getPriorityClass(
                            request.priority
                          )}`}
                        >
                          {request.priority}
                        </span>

                      </div>

                    </div>


                    {/* ==================================
                        PRODUCT
                    ================================== */}

                    <div className="maintenance-product">

                      <span className="maintenance-section-label">
                        PRODUCT
                      </span>

                      <h2>
                        {request.product?.name ||
                          "Product unavailable"}
                      </h2>

                      <p>
                        {request.product?.brand ||
                          "Brand unavailable"}
                      </p>

                    </div>


                    {/* ==================================
                        CUSTOMER
                    ================================== */}

                    <div className="maintenance-customer">

                      <span className="maintenance-section-label">
                        CUSTOMER
                      </span>

                      <h3>
                        {request.customer?.fullName ||
                          "Unknown Customer"}
                      </h3>

                      <p>
                        {request.customer?.email ||
                          "Email unavailable"}
                      </p>

                      {request.customer?.phone && (

                        <p>
                          📞{" "}
                          {request.customer.phone}
                        </p>

                      )}

                    </div>


                    {/* ==================================
                        ISSUE
                    ================================== */}

                    <div className="maintenance-issue">

                      <span className="maintenance-section-label">
                        ISSUE
                      </span>

                      <h3>
                        {request.issue ||
                          "No issue provided"}
                      </h3>

                    </div>


                    {/* ==================================
                        DESCRIPTION
                    ================================== */}

                    <div className="maintenance-description">

                      <span className="maintenance-section-label">
                        DESCRIPTION
                      </span>

                      <p>
                        {request.description ||
                          "No description provided"}
                      </p>

                    </div>


                    {/* ==================================
                        ASSIGNED STAFF
                    ================================== */}

                    <div className="maintenance-assignment">

                      <span className="maintenance-section-label">
                        ASSIGNED TO
                      </span>


                      {request.assignedTo ? (

                        <div className="assigned-user">

                          <strong>
                            👨‍🔧{" "}
                            {request.assignedTo.fullName}
                          </strong>

                          {request.assignedTo.email && (

                            <small>
                              {request.assignedTo.email}
                            </small>

                          )}

                        </div>

                      ) : (

                        <p>
                          Not assigned
                        </p>

                      )}

                    </div>


                    {/* ==================================
                        DATE
                    ================================== */}

                    <div className="maintenance-date">

                      <div>

                        <span>
                          📅 Created
                        </span>

                        <strong>
                          {formatDate(
                            request.createdAt
                          )}
                        </strong>

                      </div>


                      {request.resolvedAt && (

                        <div>

                          <span>
                            ✅ Resolved
                          </span>

                          <strong>
                            {formatDate(
                              request.resolvedAt
                            )}
                          </strong>

                        </div>

                      )}

                    </div>


                    {/* ==================================
                        ADMIN NOTES
                    ================================== */}

                    {request.adminNotes && (

                      <div className="maintenance-notes">

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

                      <div className="maintenance-resolution">

                        <span>
                          ✅ RESOLUTION NOTES
                        </span>

                        <p>
                          {request.resolutionNotes}
                        </p>

                      </div>

                    )}


                    {/* ==================================
                        MANAGE BUTTON
                    ================================== */}

                    {!editing && (

                      <button
                        className="maintenance-edit-btn"
                        onClick={() =>
                          startEdit(request)
                        }
                      >
                        Manage Request
                      </button>

                    )}


                    {/* ==================================
                        EDIT PANEL
                    ================================== */}

                    {editing && (

                      <div className="maintenance-edit-panel">

                        <div className="maintenance-edit-title">
                          Manage Maintenance Request
                        </div>


                        {/* STATUS */}

                        <div className="maintenance-edit-field">

                          <label>
                            Status
                          </label>

                          <select
                            value={
                              editing.status
                            }
                            onChange={(e) =>
                              handleEditChange(
                                request._id,
                                "status",
                                e.target.value
                              )
                            }
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="In Progress">
                              In Progress
                            </option>

                            <option value="Resolved">
                              Resolved
                            </option>

                          </select>

                        </div>


                        {/* PRIORITY */}

                        <div className="maintenance-edit-field">

                          <label>
                            Priority
                          </label>

                          <select
                            value={
                              editing.priority
                            }
                            onChange={(e) =>
                              handleEditChange(
                                request._id,
                                "priority",
                                e.target.value
                              )
                            }
                          >

                            <option value="Low">
                              Low
                            </option>

                            <option value="Medium">
                              Medium
                            </option>

                            <option value="High">
                              High
                            </option>

                            <option value="Urgent">
                              Urgent
                            </option>

                          </select>

                        </div>


                        {/* ASSIGN STAFF */}

                        <div className="maintenance-edit-field">

                          <label>
  Assign Staff
</label>

                          <select
                            value={
                              editing.assignedTo
                            }
                            onChange={(e) =>
                              handleEditChange(
                                request._id,
                                "assignedTo",
                                e.target.value
                              )
                            }
                          >

                            <option value="">
                              Not Assigned
                            </option>


                            {staff.map(
                              (person) => (

                                <option
                                  key={person._id}
                                  value={person._id}
                                >
                                  {person.fullName}

                                  {person.role
                                    ? ` (${person.role})`
                                    : ""}
                                </option>

                              )
                            )}

                          </select>

                          <small>
  Select an admin or vendor responsible
  for handling this request.
</small>

                        </div>


                        {/* ADMIN NOTES */}

                        <div className="maintenance-edit-field">

                          <label>
                            Admin Notes
                          </label>

                          <textarea
                            rows="3"
                            value={
                              editing.adminNotes
                            }
                            onChange={(e) =>
                              handleEditChange(
                                request._id,
                                "adminNotes",
                                e.target.value
                              )
                            }
                            placeholder="Add internal notes..."
                          />

                        </div>


                        {/* RESOLUTION NOTES */}

                        <div className="maintenance-edit-field">

                          <label>
                            Resolution Notes
                          </label>

                          <textarea
                            rows="3"
                            value={
                              editing.resolutionNotes
                            }
                            onChange={(e) =>
                              handleEditChange(
                                request._id,
                                "resolutionNotes",
                                e.target.value
                              )
                            }
                            placeholder="Describe how the issue was resolved..."
                          />

                        </div>


                        {/* ACTIONS */}

                        <div className="maintenance-edit-actions">

                          <button
                            className="maintenance-save-btn"
                            disabled={
                              updatingId ===
                              request._id
                            }
                            onClick={() =>
                              handleUpdate(
                                request._id
                              )
                            }
                          >

                            {updatingId ===
                            request._id
                              ? "Saving..."
                              : "Save Changes"}

                          </button>


                          <button
                            className="maintenance-cancel-btn"
                            disabled={
                              updatingId ===
                              request._id
                            }
                            onClick={
                              cancelEdit
                            }
                          >
                            Cancel
                          </button>

                        </div>

                      </div>

                    )}

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>

  );

}


export default AdminMaintenance;