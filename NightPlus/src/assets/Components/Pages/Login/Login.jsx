import React from 'react';
import '../../../Styles/Login.css'; 

export const LogIn = () => {
  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="form-button">Login</button>
      </form>
    </div>
  );
};