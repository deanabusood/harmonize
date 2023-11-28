import React, { useState } from "react";
import axios from "axios";
import "../css/AuthForm.css";

function AuthForm({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const endpoint = isSignUp ? "/user/register" : "/user/login";
      const response = await axios.post(`http://localhost:8000${endpoint}`, {
        username,
        password,
      });
      onClose();
      if (!isSignUp) {
        const token = response.data.token;
        onLoginSuccess(token, username);
      }
    } catch (error) {
      setError(
        `Error ${isSignUp ? "signing up" : "logging in"}. Please try again.`
      );
    }
  };

  //reset values when switching between sign-up and log-in
  const toggleMode = () => {
    setIsSignUp(!isSignUp);

    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-form-container">
        <span className="auth-close-button" onClick={onClose}>
          &times;
        </span>

        <div className="auth-container">
          <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
          {error && <p className="error-message">{error}</p>}
          <form id="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {isSignUp && (
              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            <div className="auth-lower-container">
              <button type="submit">{isSignUp ? "Sign Up" : "Log In"}</button>
              <p
                onClick={toggleMode}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {isSignUp
                  ? "Already have an account? Log In"
                  : "Don't have an account? Sign Up"}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
