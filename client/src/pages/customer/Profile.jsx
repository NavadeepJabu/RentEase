import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/profileService";
import { getImageUrl } from "../../utils/imageUrl";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();

      setUser(data.user);

      setFormData({
        fullName: data.user.fullName || "",
        phone: data.user.phone || "",
        city: data.user.city || "",
        address: data.user.address || "",
      });
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = await updateProfile(formData);

      setUser(data.user);

      alert(data.message);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageData = new FormData();

    imageData.append("profileImage", file);

    try {
      setUploading(true);

      const data =
        await uploadProfileImage(imageData);

      setUser((previousUser) => ({
        ...previousUser,
        profileImage: data.profileImage,
      }));

      alert(data.message);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to upload profile image"
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>

        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <div>👤</div>

        <h2>Unable to load profile</h2>

        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* Background effects */}
      <div className="profile-glow profile-glow-one"></div>
      <div className="profile-glow profile-glow-two"></div>

      <div className="profile-container">

        {/* Header */}
        <div className="profile-header">

          <div>
            <p className="profile-label">
              RENT EASE
            </p>

            <h1>My Profile</h1>

            <p>
              Manage your account information
              and personal details.
            </p>
          </div>

          <div className="profile-header-icon">
            👤
          </div>

        </div>


        {/* Profile card */}
        <div className="profile-card">

          {/* Profile image section */}
          <div className="profile-hero">

            <div className="profile-avatar-wrapper">

              {user.profileImage ? (
                <img
  src={getImageUrl(user.profileImage)}
  alt="Profile"
  className="profile-avatar"
/>
              ) : (
                <div className="profile-avatar profile-avatar-placeholder">
                  👤
                </div>
              )}

              <div className="profile-online-dot"></div>

            </div>


            <div className="profile-identity">

              <h2>
                {user.fullName || "User"}
              </h2>

              <p>
                {user.email}
              </p>

              <span className="profile-role">
                {user.role === "admin"
                  ? "Administrator"
                  : "Customer"}
              </span>

            </div>


            <label className="change-photo-btn">

              {uploading
                ? "Uploading..."
                : "📷 Change Photo"}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
              />

            </label>

          </div>


          {/* Divider */}
          <div className="profile-divider"></div>


          {/* Personal information */}
          <form
            onSubmit={handleUpdate}
            className="profile-form"
          >

            <div className="profile-section-title">

              <div className="profile-section-icon">
                ✨
              </div>

              <div>
                <h3>
                  Personal Information
                </h3>

                <p>
                  Keep your details up to date.
                </p>
              </div>

            </div>


            <div className="profile-grid">

              {/* Email */}
              <div className="profile-field">

                <label>
                  Email Address
                </label>

                <div className="profile-input-wrapper disabled">

                  <span>✉️</span>

                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                  />

                  <small>
                    Verified
                  </small>

                </div>

              </div>


              {/* Full Name */}
              <div className="profile-field">

                <label>
                  Full Name
                </label>

                <div className="profile-input-wrapper">

                  <span>👤</span>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />

                </div>

              </div>


              {/* Phone */}
              <div className="profile-field">

                <label>
                  Phone Number
                </label>

                <div className="profile-input-wrapper">

                  <span>📱</span>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />

                </div>

              </div>


              {/* City */}
              <div className="profile-field">

                <label>
                  City
                </label>

                <div className="profile-input-wrapper">

                  <span>🏙️</span>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />

                </div>

              </div>


              {/* Address */}
              <div className="profile-field profile-field-full">

                <label>
                  Address
                </label>

                <div className="profile-input-wrapper profile-textarea-wrapper">

                  <span>📍</span>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter your complete address"
                  />

                </div>

              </div>


              {/* Account Type */}
              <div className="profile-field">

                <label>
                  Account Type
                </label>

                <div className="profile-input-wrapper disabled">

                  <span>🛡️</span>

                  <input
                    type="text"
                    value={
                      user.role === "admin"
                        ? "Administrator"
                        : "Customer"
                    }
                    disabled
                  />

                </div>

              </div>

            </div>


            {/* Save */}
            <div className="profile-actions">

              <p>
                🔒 Your account information
                is securely stored.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="save-profile-btn"
              >
                {saving ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    Save Changes
                    <span>✓</span>
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Profile;