import { useEffect, useState } from "react";

import {
  getServiceAreas,
  createServiceArea,
  updateServiceArea,
  deleteServiceArea,
} from "../../services/serviceAreaService";

import "./ServiceAreas.css";

function ServiceAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    city: "",
    area: "",
    pincode: "",
    deliveryAvailable: true,
    maintenanceAvailable: true,
    status: "Active",
  });

  useEffect(() => {
    loadAreas();
  }, []);

  // ==========================================
  // LOAD SERVICE AREAS
  // ==========================================

  const loadAreas = async () => {
    try {
      setLoading(true);

      const data = await getServiceAreas();

      setAreas(data.serviceAreas || []);
    } catch (error) {
      console.log("SERVICE AREA LOAD ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load service areas"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      city: "",
      area: "",
      pincode: "",
      deliveryAvailable: true,
      maintenanceAvailable: true,
      status: "Active",
    });

    setEditingId(null);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.city.trim() ||
      !formData.area.trim() ||
      !formData.pincode.trim()
    ) {
      alert(
        "City, area and pincode are required"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        city: formData.city.trim(),
        area: formData.area.trim(),
        pincode: formData.pincode.trim(),
        deliveryAvailable:
          formData.deliveryAvailable,
        maintenanceAvailable:
          formData.maintenanceAvailable,
        status: formData.status,
      };

      let data;

      if (editingId) {
        data = await updateServiceArea(
          editingId,
          payload
        );
      } else {
        data = await createServiceArea(
          payload
        );
      }

      alert(data.message);

      resetForm();

      await loadAreas();
    } catch (error) {
      console.log(
        "SERVICE AREA SAVE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save service area"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (area) => {
    setEditingId(area._id);

    setFormData({
      city: area.city || "",
      area: area.area || "",
      pincode: area.pincode || "",
      deliveryAvailable:
        area.deliveryAvailable ?? true,
      maintenanceAvailable:
        area.maintenanceAvailable ?? true,
      status: area.status || "Active",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service area?"
    );

    if (!confirmed) return;

    try {
      const data =
        await deleteServiceArea(id);

      alert(data.message);

      await loadAreas();
    } catch (error) {
      console.log(
        "SERVICE AREA DELETE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete service area"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="service-area-loading">
        <div className="service-area-spinner"></div>

        <p>
          Loading service areas...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="service-areas-page">

      {/* Background */}

      <div className="service-areas-glow service-areas-glow-one"></div>

      <div className="service-areas-glow service-areas-glow-two"></div>

      <div className="service-areas-container">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="service-areas-header">

          <div>

            <p className="service-areas-label">
              ADMIN PANEL
            </p>

            <h1>
              Service Areas
            </h1>

            <p className="service-areas-subtitle">
              Manage cities and locations where
              RentEase provides rental delivery
              and maintenance services.
            </p>

          </div>

          <div className="service-areas-count">

            <strong>
              {areas.length}
            </strong>

            <span>
              Service Areas
            </span>

          </div>

        </div>

        {/* =====================================
            ADD / EDIT FORM
        ====================================== */}

        <div className="service-area-form-card">

          <div className="service-area-form-header">

            <div>

              <p>
                {editingId
                  ? "EDIT SERVICE AREA"
                  : "ADD SERVICE AREA"}
              </p>

              <h2>
                {editingId
                  ? "Update Location"
                  : "Add New Location"}
              </h2>

            </div>

            <span>
              📍
            </span>

          </div>

          <form onSubmit={handleSubmit}>

            {/* City + Area */}

            <div className="service-area-form-grid">

              <div className="service-area-field">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Example: Hyderabad"
                  required
                />

              </div>

              <div className="service-area-field">

                <label>
                  Area
                </label>

                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Example: Madhapur"
                  required
                />

              </div>

            </div>

            {/* Pincode */}

            <div className="service-area-field">

              <label>
                PIN Code
              </label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Example: 500081"
                maxLength="6"
                required
              />

              <small>
                Enter the PIN code where
                RentEase provides service.
              </small>

            </div>

            {/* Checkboxes */}

            <div className="service-area-checkboxes">

              <label>

                <input
                  type="checkbox"
                  name="deliveryAvailable"
                  checked={
                    formData.deliveryAvailable
                  }
                  onChange={handleChange}
                />

                Delivery Available

              </label>

              <label>

                <input
                  type="checkbox"
                  name="maintenanceAvailable"
                  checked={
                    formData.maintenanceAvailable
                  }
                  onChange={handleChange}
                />

                Maintenance Available

              </label>

            </div>

            {/* Status */}

            <div className="service-area-field">

              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

            {/* Buttons */}

            <div className="service-area-form-actions">

              <button
                type="submit"
                disabled={saving}
                className="service-area-save-btn"
              >

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Area"
                  : "Add Service Area"}

              </button>

              {editingId && (

                <button
                  type="button"
                  className="service-area-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>

        {/* =====================================
            SERVICE AREA LIST
        ====================================== */}

        <div className="service-area-list-section">

          <div className="service-area-list-header">

            <div>

              <p>
                SERVICE COVERAGE
              </p>

              <h2>
                Managed Locations
              </h2>

            </div>

          </div>

          {/* Empty */}

          {areas.length === 0 ? (

            <div className="service-area-empty">

              <div>
                📍
              </div>

              <h2>
                No Service Areas
              </h2>

              <p>
                Add your first delivery location
                above.
              </p>

            </div>

          ) : (

            <div className="service-area-grid">

              {areas.map((area) => (

                <div
                  className="service-area-card"
                  key={area._id}
                >

                  {/* Card Header */}

                  <div className="service-area-card-header">

                    <div className="service-area-location-icon">
                      📍
                    </div>

                    <span
                      className={
                        area.status === "Active"
                          ? "area-active"
                          : "area-inactive"
                      }
                    >
                      {area.status}
                    </span>

                  </div>

                  {/* Location */}

                  <h2>
                    {area.area}
                  </h2>

                  <p className="service-area-state">
                    {area.city}
                  </p>

                  <p className="service-area-pincode-text">
                    PIN: {area.pincode}
                  </p>

                  {/* Details */}

                  <div className="service-area-details">

                    <div>

                      <span>
                        Delivery
                      </span>

                      <strong>
                        {area.deliveryAvailable
                          ? "Available"
                          : "Unavailable"}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Maintenance
                      </span>

                      <strong>
                        {area.maintenanceAvailable
                          ? "Available"
                          : "Unavailable"}
                      </strong>

                    </div>

                  </div>

                  {/* Actions */}

                  <div className="service-area-actions">

                    <button
                      onClick={() =>
                        handleEdit(area)
                      }
                      className="area-edit-btn"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          area._id
                        )
                      }
                      className="area-delete-btn"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ServiceAreas;