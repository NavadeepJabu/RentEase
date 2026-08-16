import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      setLoading(true);

      const { data } = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem("token", data.token);

      login(data.user);

      alert("Login Successful!");

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background decoration */}
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      <div className="login-container">

        {/* Left side */}
        <div className="login-brand-section">

          <div className="login-brand-logo">
            🏠
          </div>

          <p className="login-brand-label">
            WELCOME TO
          </p>

          <h1>
            Rent<span>Ease</span>
          </h1>

          <p className="login-brand-description">
            Rent what you need.
            <br />
            Live the way you want.
          </p>

          <div className="login-features">

            <div>
              <span>✓</span>
              <p>Quality products</p>
            </div>

            <div>
              <span>✓</span>
              <p>Flexible rental plans</p>
            </div>

            <div>
              <span>✓</span>
              <p>Reliable maintenance</p>
            </div>

          </div>

        </div>


        {/* Login card */}
        <div className="login-card">

          <div className="login-card-header">

            <div className="login-icon">
              🔐
            </div>

            <h2>
              Welcome Back
            </h2>

            <p>
              Sign in to continue to RentEase
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="login-field">

              <label>
                Email Address
              </label>

              <div className="login-input-wrapper">

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


            {/* Password */}
            <div className="login-field">

              <label>
                Password
              </label>

              <div className="login-input-wrapper">

                <span>🔒</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {/* Register */}
          <div className="login-register">

            <p>
              Don't have an account?
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Create an account
            </button>

          </div>


          <div className="login-security">
            🔒 Secure & trusted by RentEase
            users
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;