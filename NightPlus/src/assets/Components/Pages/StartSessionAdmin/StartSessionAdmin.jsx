import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../../../Styles/StartSessionAdmin.css';
import Swal from 'sweetalert2';
import { LoadingAlert } from '../../LoadingAlert/LoadingAlert';

export const StartSessionAdmin = () => {
  const navigate = useNavigate();

  // State para los datos del formulario de inicio de sesión del administrador
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: '',
  });

  // State para los errores de validación de cada campo
  const [errors, setErrors] = useState({});

  // State para errores generales de la API o conexión
  const [error, setError] = useState(null);
  // State para controlar el estado de carga
  const [loading, setLoading] = useState(false);

  // Define la URL base de tu backend desplegado en Railway
  const BASE_URL = 'https://backendnight-production.up.railway.app';

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    // Limpia el error específico del campo cuando el usuario empieza a escribir
    if (errors[e.target.id]) {
      setErrors(prev => ({
        ...prev,
        [e.target.id]: ''
      }));
    }
  };

  // Función para validar los campos del formulario de inicio de sesión del administrador
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validación de Usuario
    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es obligatorio.';
      isValid = false;
    } else if (formData.usuario.trim().length < 4) {
      newErrors.usuario = 'El usuario debe tener al menos 4 caracteres.';
      isValid = false;
    } else if (formData.usuario.trim().length > 20) {
      newErrors.usuario = 'El usuario no debe exceder los 20 caracteres.';
      isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.usuario)) {
      newErrors.usuario = 'El usuario solo puede contener letras y números.';
      isValid = false;
    }

    // Validación de Contraseña
    if (!formData.contrasena.trim()) {
      newErrors.contrasena = 'La contraseña es obligatoria.';
      isValid = false;
    } else if (formData.contrasena.trim().length < 8) {
      newErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
      isValid = false;
    } else if (!/[A-Z]/.test(formData.contrasena.trim())) {
      newErrors.contrasena = 'La contraseña debe contener al menos una letra mayúscula.';
      isValid = false;
    } else if (!/[a-z]/.test(formData.contrasena.trim())) {
      newErrors.contrasena = 'La contraseña debe contener al menos una letra minúscula.';
      isValid = false;
    } else if (!/\d/.test(formData.contrasena.trim())) {
      newErrors.contrasena = 'La contraseña debe contener al menos un número.';
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.contrasena.trim())) {
      newErrors.contrasena = 'La contraseña debe contener al menos un carácter especial.';
      isValid = false;
    }

    setErrors(newErrors); // Actualiza el estado de errores
    return isValid; // Retorna si el formulario es válido
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpia errores generales anteriores

    // Ejecuta la validación antes de intentar enviar
    if (!validateForm()) {
      // Si la validación falla, muestra una alerta general y detiene el envío
      Swal.fire({
        imageUrl: '/logitopensativo.webp',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Formulario inválido',
        text: 'Por favor, corrige los errores en el formulario antes de continuar.',
      });
      return;
    }

    setLoading(true); // Activa el estado de carga

    const payload = {
      usuario: formData.usuario,
      contrasena: formData.contrasena,
    };

    try {
      console.log('Intentando iniciar sesión de administrador con:', payload.usuario);

      // Usa la URL base para construir la URL completa del endpoint
      const response = await fetch(`${BASE_URL}/servicio/login-administrador`, {
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
        return; // Detiene la ejecución si hay un error en la respuesta
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
      setLoading(false); // Desactiva el estado de carga al finalizar
    }
  };

  return (
    <div className="page-container">
      {loading && <LoadingAlert />} {/* Muestra el componente de carga si loading es true */}
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
              className={`form__field ${errors.usuario ? 'input-error' : ''}`} 
              placeholder="Usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
            />
            <label htmlFor="usuario" className="form__label">Usuario</label>
            {errors.usuario && <p className="error-message">{errors.usuario}</p>} {/* Muestra el mensaje de error */}
          </div>

          <div className="form__group field">
            <input
              type="password"
              id="contrasena"
              className={`form__field ${errors.contrasena ? 'input-error' : ''}`} 
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
            <label htmlFor="contrasena" className="form__label">Contraseña</label>
            {errors.contrasena && <p className="error-message">{errors.contrasena}</p>} {/* Muestra el mensaje de error */}
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
