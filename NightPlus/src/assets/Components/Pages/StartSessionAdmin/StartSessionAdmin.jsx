import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../../../Styles/StartSessionAdmin.css';

export const StartSessionAdmin = () => {
  return (
    <div className="page-container">
      {/* Logotipo */}
      <img src="./src/assets/Icons/logito.svg" alt="Logo" className="logo" /> {/* Imagen del logo */}

      <div className="login-container">
        <h1 className="login-title">Inicio de Sesión Administrador</h1>
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
              <p>Iniciar Sesión</p>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div className="login-options">
            <NavLink to="/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </NavLink>
            <NavLink to="/SignInAdmin" className="SignInAdmin">
              ¿Es tu primera vez? Regístrate
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};