import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      alert(data.message);

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* Animated background */}
      <div className="register-glow register-glow-one"></div>
      <div className="register-glow register-glow-two"></div>

      <div className="register-container">

        {/* Left branding section */}
        <div className="register-brand-section">

          <div className="register-brand-logo">
            🏠
          </div>

          <p className="register-brand-label">
            JOIN THE COMMUNITY
          </p>

          <h1>
            Rent<span>Ease</span>
          </h1>

          <p className="register-brand-description">
            Everything you need,
            <br />
            available when you need it.
          </p>

          <div className="register-features">

            <div>
              <span>✓</span>
              <p>Affordable rentals</p>
            </div>

            <div>
              <span>✓</span>
              <p>Simple & secure</p>
            </div>

            <div>
              <span>✓</span>
              <p>Easy maintenance support</p>
            </div>

          </div>

        </div>


        {/* Registration card */}
        <div className="register-card">

          <div className="register-card-header">

            <div className="register-icon">
              ✨
            </div>

            <h2>
              Create Account
            </h2>

            <p>
              Start renting with RentEase today
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="register-field">

              <label>
                Full Name
              </label>

              <div className="register-input-wrapper">

                <span>👤</span>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Email */}
            <div className="register-field">

              <label>
                Email Address
              </label>

              <div className="register-input-wrapper">

                <span>✉️</span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Phone */}
            <div className="register-field">

              <label>
                Phone Number
              </label>

              <div className="register-input-wrapper">

                <span>📱</span>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Password */}
            <div className="register-field">

              <label>
                Password
              </label>

              <div className="register-input-wrapper">

                <span>🔒</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Confirm Password */}
            <div className="register-field">

              <label>
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <span>🔐</span>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Register button */}
            <button
              type="submit"
              disabled={loading}
              className="register-button"
            >

              {loading ? (
                <>
                  <span className="register-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {/* Login link */}
          <div className="register-login">

            <p>
              Already have an account?
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in to RentEase
            </button>

          </div>


          <div className="register-security">
            🔒 Your information is securely protected
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;