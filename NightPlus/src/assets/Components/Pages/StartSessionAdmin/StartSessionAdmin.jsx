import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../../../Styles/StartSessionAdmin.css';
import Swal from 'sweetalert2';
import { LoadingAlert } from '../../LoadingAlert/LoadingAlert';

export const StartSessionAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Define la URL base de tu backend desplegado en Railway
  const BASE_URL = 'https://backendnight-production.up.railway.app'; // <--- ¡URL ACTUALIZADA AQUÍ!

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      usuario: formData.usuario,
      contrasena: formData.contrasena,
    };

    try {
      // Usa la URL base para construir la URL completa del endpoint
      const response = await fetch(`${BASE_URL}/servicio/login-administrador`, { // <--- URL ACTUALIZADA
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Leer el mensaje de error del backend si está disponible
        const errorData = await response.text(); // Lee como texto para manejar cualquier tipo de error (no solo JSON)
        console.error("Error response from server:", errorData);
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: 'Error de inicio',
          text: errorData || 'Credenciales inválidas o error del servidor', // Muestra el error del backend
        });
        setLoading(false);
        return;
      }

      const data = await response.json();

      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: '¡Bienvenido!',
        text: 'Inicio de sesión exitoso',
        timer: 1500,
        showConfirmButton: false
      });

      // Después de obtener 'data' en el handleSubmit:
      const currentAdmin = {
          id: data.idAdmin, // <-- CORREGIDO: Usar data.idAdmin que viene del backend
          usuario: data.usuario || '',
          nombre: data.nombre || '',
          correo: data.correo || '',
          token: data.token || '',
      };

      localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));

      setTimeout(() => {
        navigate('/PrincipalAdmin');
      }, 1500);

    } catch (err) {
      console.error("Error en el login (conexión o parseo):", err);
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        title: 'Error de conexión',
        text: 'No se pudo conectar al servidor: ' + err.message, // Muestra el mensaje de error de conexión
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {loading && <LoadingAlert />}
      <img src="/logito.svg" alt="Logo" className="logo" />
      <div className="login-container">
        <NavLink to="/" className="back-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </NavLink>

        <h1 className="login-title-admin">Iniciar Sesión - Admin</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form__group field">
            <input
              type="text"
              id="usuario"
              className="form__field"
              placeholder="Usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
            />
            <label htmlFor="usuario" className="form__label">Usuario</label>
          </div>

          <div className="form__group field">
            <input
              type="password"
              id="contrasena"
              className="form__field"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
            <label htmlFor="contrasena" className="form__label">Contraseña</label>
          </div>

          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className="user-profile" disabled={loading}>
            <div className="user-profile-inner">
              <p>{loading ? 'Iniciando...' : 'Inicia Sesión'}</p>
            </div>
          </button>

          <div className="login-options">
            <NavLink to="/SignInAdmin" className="SignInAdmin">
              ¿No tienes cuenta? Regístrate
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};
