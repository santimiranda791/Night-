import React from 'react';
import { NavLink } from 'react-router-dom'; // Importamos NavLink

import '../../../../Styles/StartSession.css';

export const StartSession = () => {
  return (
    <div className="page-container">
      {/* Logotipo */}
      <img src="/logito.svg" alt="Logo" className="logo" />

      <div className="login-container">
        <NavLink to="/" className="back-arrow" aria-label="Back to Principal Page">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </NavLink>
        <h1 className="login-title">Inicio de Sesión</h1>
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
              <p>Inicia Sesión</p>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div className="login-options">
            <NavLink to="/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </NavLink>
            <NavLink to="/SignInCliente" className="SignInCliente">
              ¿Es tu primera vez? Regístrate
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};
