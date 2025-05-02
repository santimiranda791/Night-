import React from 'react';
import { NavLink } from 'react-router-dom'; 
import '../../../../Styles/SignInAdmin.css';

export const SignInAdmin = () => {
  return (
    <div className="page-container">
      {/* Logotipo */}
      <img src="./src/assets/Icons/logito.svg" alt="Logo" className="logo" /> {/* Imagen del logo */}

      <div className="login-container">
        <h1 className="login-title">Registrarse</h1>
        <form className="login-form">
            
          {/* Campo de documento */}
          <div className="form__group field">
            <input
              type="email"
              id="documento"
              className="form__field"
              placeholder="documento"
              required
            />
            <label htmlFor="email" className="form__label">Nro De Documento</label>
          </div>

          {/* Campo de Nombre */}
          <div className="form__group field">
            <input
              type="input"
              id="Nombre"
              className="form__field"
              placeholder="Nombre"
              required
            />
            <label htmlFor="password" className="form__label">Nombre</label>
          </div>
           {/* Campo de Edad */}
           <div className="form__group field">
            <input
              type="input"
              id="Edad"
              className="form__field"
              placeholder="Edad"
              required
            />
            <label htmlFor="password" className="form__label">Edad</label>
          </div>
           {/* Campo de Telefono */}
           <div className="form__group field">
            <input
              type="input"
              id="Telefono"
              className="form__field"
              placeholder="Telefono"
              required
            />
            <label htmlFor="password" className="form__label">Telefono</label>
          </div>
           {/* Campo de Email */}
           <div className="form__group field">
            <input
              type="Email"
              id="Email"
              className="form__field"
              placeholder="Email"
              required
            />
            <label htmlFor="password" className="form__label">Email</label>
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
              <p>Registrate</p>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div className="login-options">
            
          <NavLink to="/LogInAdmin" className="Login">
                ¿Ya tienes cuenta? Inicia Sesión
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};