import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../../../Styles/StartSession.css';
import Swal from 'sweetalert2';
import { LoadingAlert } from '../../LoadingAlert/LoadingAlert';

export const StartSession = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuarioCliente: '',
    contrasenaCliente: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      usuarioCliente: formData.usuarioCliente,
      contrasenaCliente: formData.contrasenaCliente,
    };

    try {
      const response = await fetch('http://localhost:8080/servicio/login-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Credenciales incorrectas');
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: 'Acceso denegado',
            text: 'Credenciales incorrectas',
          });
        } else {
          setError('Error al iniciar sesión');
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: 'Error',
            text: 'Error al iniciar sesión',
          });
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Login exitoso:', data);
      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: '¡Sesión iniciada!',
        text: 'Bienvenido/a',
        timer: 1500,
        showConfirmButton: false,
      });

      localStorage.setItem('usuario', data.usuario || '');
      localStorage.setItem('nombre', data.nombre || '');
      localStorage.setItem('correo', data.correo || '');
      localStorage.setItem('token', data.token || '');

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error en la conexión con el servidor');
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor',
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
        <NavLink to="/" className="back-arrow" aria-label="Volver a la página principal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </NavLink>

        <h1 className="login-title">Inicio de Sesión</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form__group field">
            <input
              type="text"
              id="usuarioCliente"
              className="form__field"
              placeholder="Usuario"
              value={formData.usuarioCliente}
              onChange={handleChange}
              required
            />
            <label htmlFor="usuarioCliente" className="form__label">Usuario</label>
          </div>

          <div className="form__group field">
            <input
              type="password"
              id="contrasenaCliente"
              className="form__field"
              placeholder="Contraseña"
              value={formData.contrasenaCliente}
              onChange={handleChange}
              required
            />
            <label htmlFor="contrasenaCliente" className="form__label">Contraseña</label>
          </div>

          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

          <button type="submit" className="user-profile" disabled={loading}>
            <div className="user-profile-inner">
              <p>{loading ? 'Iniciando...' : 'Inicia Sesión'}</p>
            </div>
          </button>

          <div className="login-options">
            <NavLink to="/ForgotPassword" className="forgot-password">
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
