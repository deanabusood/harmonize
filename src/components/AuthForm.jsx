import React, { useState } from "react";
import axios from "axios";

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
      console.log("ERROR");
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
    <div className="auth-container">
      <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
      {error && <p className="error-message">{error}</p>}
      <form id="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {isSignUp && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button type="submit">{isSignUp ? "Sign Up" : "Log In"}</button>
      </form>
      <p onClick={toggleMode} style={{ cursor: "pointer", color: "blue" }}>
        {isSignUp
          ? "Already have an account? Log In"
          : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
}

export default AuthForm;
