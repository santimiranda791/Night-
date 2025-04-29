import React from 'react';
import '../../../../Styles/StartSession.css'; // Asegúrate de importar el CSS correcto

export const StartSession = () => {
  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form">
        <div className="wave-group">
          <input
            type="email"
            id="email"
            className="input"
            required
          />
          <label htmlFor="email" className="label">
            <span className="label-char" style={{ '--index': 0 }}>E</span>
            <span className="label-char" style={{ '--index': 1 }}>m</span>
            <span className="label-char" style={{ '--index': 2 }}>a</span>
            <span className="label-char" style={{ '--index': 3 }}>i</span>
            <span className="label-char" style={{ '--index': 4 }}>l</span>
          </label>
          <div className="bar"></div>
        </div>
        <div className="wave-group">
          <input
            type="password"
            id="password"
            className="input"
            required
          />
          <label htmlFor="password" className="label">
            <span className="label-char" style={{ '--index': 0 }}>P</span>
            <span className="label-char" style={{ '--index': 1 }}>a</span>
            <span className="label-char" style={{ '--index': 2 }}>s</span>
            <span className="label-char" style={{ '--index': 3 }}>s</span>
            <span className="label-char" style={{ '--index': 4 }}>w</span>
            <span className="label-char" style={{ '--index': 5 }}>o</span>
            <span className="label-char" style={{ '--index': 6 }}>r</span>
            <span className="label-char" style={{ '--index': 7 }}>d</span>
          </label>
          <div className="bar"></div>
        </div>
        <button type="submit" className="form-button">Login</button>
      </form>
    </div>
  );
};