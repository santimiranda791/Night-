import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../../../Styles/StartSession.css';
import Swal from 'sweetalert2';
import { LoadingAlert } from '../../LoadingAlert/LoadingAlert';

export const StartSession = () => {
  const navigate = useNavigate();

  // State para los datos del formulario de inicio de sesión
  const [formData, setFormData] = useState({
    usuarioCliente: '',
    contrasenaCliente: '',
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

  // Función para validar los campos del formulario de inicio de sesión
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validación de Usuario
    if (!formData.usuarioCliente.trim()) {
      newErrors.usuarioCliente = 'El usuario es obligatorio.';
      isValid = false;
    } else if (formData.usuarioCliente.trim().length < 4) {
      newErrors.usuarioCliente = 'El usuario debe tener al menos 4 caracteres.';
      isValid = false;
    } else if (formData.usuarioCliente.trim().length > 20) {
      newErrors.usuarioCliente = 'El usuario no debe exceder los 20 caracteres.';
      isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.usuarioCliente)) {
      newErrors.usuarioCliente = 'El usuario solo puede contener letras y números.';
      isValid = false;
    }

    // Validación de Contraseña
    if (!formData.contrasenaCliente.trim()) {
      newErrors.contrasenaCliente = 'La contraseña es obligatoria.';
      isValid = false;
    } else if (formData.contrasenaCliente.trim().length < 8) {
      newErrors.contrasenaCliente = 'La contraseña debe tener al menos 8 caracteres.';
      isValid = false;
    } else if (!/[A-Z]/.test(formData.contrasenaCliente)) {
      newErrors.contrasenaCliente = 'La contraseña debe contener al menos una letra mayúscula.';
      isValid = false;
    } else if (!/[a-z]/.test(formData.contrasenaCliente)) {
      newErrors.contrasenaCliente = 'La contraseña debe contener al menos una letra minúscula.';
      isValid = false;
    } else if (!/\d/.test(formData.contrasenaCliente)) {
      newErrors.contrasenaCliente = 'La contraseña debe contener al menos un número.';
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.contrasenaCliente)) {
      newErrors.contrasenaCliente = 'La contraseña debe contener al menos un carácter especial.';
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
      usuarioCliente: formData.usuarioCliente,
      contrasenaCliente: formData.contrasenaCliente,
    };

    try {
      console.log('Intentando iniciar sesión con:', payload.usuarioCliente);

      // Usa la URL base para construir la URL completa del endpoint
      const response = await fetch(`${BASE_URL}/servicio/login-cliente`, {
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
            text: 'Credenciales incorrectas. Verifica tu usuario y contraseña.',
          });
        } else {
          const errorText = await response.text();
          setError(errorText || 'Error al iniciar sesión');
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: 'Error',
            text: errorText || 'Error al iniciar sesión. Inténtalo de nuevo.',
          });
        }
        return; // Detiene la ejecución si hay un error en la respuesta
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

      // Guarda los datos del usuario en localStorage
      localStorage.setItem('usuario', data.usuario || '');
      localStorage.setItem('nombre', data.nombre || '');
      localStorage.setItem('correo', data.correo || '');
      localStorage.setItem('token', data.token || ''); // Asegúrate de manejar el token si el backend lo devuelve

      // Redirige después de un breve retraso para que la alerta sea visible
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
        text: 'No se pudo conectar con el servidor. Por favor, inténtalo más tarde.',
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
              className={`form__field ${errors.usuarioCliente ? 'input-error' : ''}`} 
              placeholder="Usuario"
              value={formData.usuarioCliente}
              onChange={handleChange}
              required
            />
            <label htmlFor="usuarioCliente" className="form__label">Usuario</label>
            {errors.usuarioCliente && <p className="error-message">{errors.usuarioCliente}</p>} {/* Muestra el mensaje de error */}
          </div>

          <div className="form__group field">
            <input
              type="password"
              id="contrasenaCliente"
              className={`form__field ${errors.contrasenaCliente ? 'input-error' : ''}`} 
              placeholder="Contraseña"
              value={formData.contrasenaCliente}
              onChange={handleChange}
              required
            />
            <label htmlFor="contrasenaCliente" className="form__label">Contraseña</label>
            {errors.contrasenaCliente && <p className="error-message">{errors.contrasenaCliente}</p>} {/* Muestra el mensaje de error */}
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