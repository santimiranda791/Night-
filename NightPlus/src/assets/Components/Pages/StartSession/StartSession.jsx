import React from 'react';

import '../../../../Styles/StartSession.css';

export const StartSession = () => {
  return (
    <div className="page-container">
      {/* Logotipo */}
      <img src="./src/assets/Icons/logito.svg" alt="Logo" className="logo" /> {/* Imagen del logo */}

      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <form className="login-form">
          {/* Campo de Email */}
          <div className="form__group field">
            <input
              type="email"
              id="email"
              className="form__field"
              placeholder="Email"
              required
            />
            <label htmlFor="email" className="form__label">Email</label>
          </div>

          {/* Campo de Password */}
          <div className="form__group field">
            <input
              type="password"
              id="password"
              className="form__field"
              placeholder="Password"
              required
            />
            <label htmlFor="password" className="form__label">Password</label>
          </div>

          {/* Botón de Login */}
          <div
            aria-label="User Login Button"
            tabIndex="0"
            role="button"
            className="user-profile"
          >
            <div className="user-profile-inner">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g data-name="Layer 2" id="Layer_2">
                  {/* Puedes agregar un ícono aquí si lo necesitas */}
                </g>
              </svg>
              <p>Log In</p>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div className="login-options">
            <a href="/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
            <a href="/register" className="register">
              ¿Es tu primera vez? Regístrate
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};