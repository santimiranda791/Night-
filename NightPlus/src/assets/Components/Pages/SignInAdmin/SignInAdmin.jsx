import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../../Styles/SignInCliente.css'; // Reutilizamos estilos
import { LoadingAlert } from '../../LoadingAlert/LoadingAlert';

export const SignInAdmin = () => {
  // State para los datos del formulario
  const [formData, setFormData] = useState({
    usuario: '',
    nombre: '',
    telefono: '',
    correo: '',
    contrasena: '',
  });

  // State para los errores de validación de cada campo
  const [errors, setErrors] = useState({});

  // Hook para la navegación programática
  const navigate = useNavigate();
  // State para controlar el estado de carga
  const [loading, setLoading] = useState(false);

  // Define la URL base de tu backend desplegado en Railway
  const BASE_URL = 'https://backendnight-production.up.railway.app';

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Limpia el error específico del campo cuando el usuario empieza a escribir
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // Función para validar todos los campos del formulario de administrador
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validación de Usuario (Admin)
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

    // Validación de Nombre (Admin)
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
      isValid = false;
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres.';
      isValid = false;
    } else if (formData.nombre.trim().length > 50) {
      newErrors.nombre = 'El nombre no debe exceder los 50 caracteres.';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.nombre)) {
      newErrors.nombre = 'El nombre solo puede contener letras y espacios.';
      isValid = false;
    }

    // Validación de Teléfono (Admin)
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.telefono)) { // Asumiendo 10 dígitos para números de Colombia
      newErrors.telefono = 'El teléfono debe ser numérico y tener 10 dígitos.';
      isValid = false;
    }

    // Validación de Correo (Admin)
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El correo no tiene un formato válido.';
      isValid = false;
    }

    // Validación de Contraseña (Admin)
    if (!formData.contrasena.trim()) {
      newErrors.contrasena = 'La contraseña es obligatoria.';
      isValid = false;
    } else if (formData.contrasena.trim().length < 8) {
      newErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres.';
      isValid = false;
    } else if (!/[A-Z]/.test(formData.contrasena)) {
      newErrors.contrasena = 'La contraseña debe contener al menos una letra mayúscula.';
      isValid = false;
    } else if (!/[a-z]/.test(formData.contrasena)) {
      newErrors.contrasena = 'La contraseña debe contener al menos una letra minúscula.';
      isValid = false;
    } else if (!/\d/.test(formData.contrasena)) {
      newErrors.contrasena = 'La contraseña debe contener al menos un número.';
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.contrasena)) {
      newErrors.contrasena = 'La contraseña debe contener al menos un carácter especial.';
      isValid = false;
    }

    setErrors(newErrors); // Actualiza el estado de errores
    return isValid; // Retorna si el formulario es válido
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // Prepara los datos del administrador para el envío
    const admin = {
      nombreAdmin: formData.nombre,
      telefonoAdmin: formData.telefono,
      correoAdmin: formData.correo,
      usuarioAdmin: formData.usuario,
      contrasenaAdmin: formData.contrasena,
    };

    setLoading(true); // Activa el estado de carga

    try {
      console.log('Enviando administrador:', admin);

      // Realiza la petición POST al backend
      const response = await fetch(`${BASE_URL}/servicio/registrar-administrador`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admin),
      });

      // Manejo de errores de respuesta del servidor
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al registrar administrador');
      }

      await response.json(); // Parsea la respuesta JSON

      // Muestra alerta de éxito
      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: '¡Administrador registrado!',
        text: 'Ahora puedes iniciar sesión.',
      });

      // Limpia el formulario después del envío exitoso
      setFormData({
        usuario: '',
        nombre: '',
        telefono: '',
        correo: '',
        contrasena: '',
      });
      setErrors({}); // Limpia los errores también

      // Navega a la página de inicio de sesión de administrador
      navigate('/LoginAdmin');

    } catch (error) {
      // Manejo de errores durante la petición
      console.error('Error al registrar:', error);
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Error',
        text: error.message || 'Error al registrar.',
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

        <h1 className="login-title">Registro de Administrador</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {[
            { id: 'usuario', label: 'Usuario', type: 'text' },
            { id: 'nombre', label: 'Nombre', type: 'text' },
            { id: 'telefono', label: 'Teléfono', type: 'tel' },
            { id: 'correo', label: 'Correo', type: 'email' },
            { id: 'contrasena', label: 'Contraseña', type: 'password' }
          ].map(({ id, label, type }) => (
            <div className="form__group field" key={id}>
              <input
                type={type}
                id={id}
                className={`form__field ${errors[id] ? 'input-error' : ''}`} 
                placeholder={label}
                value={formData[id]}
                onChange={handleChange}
                required // Mantener required para validación HTML5 básica, pero la JS es más robusta
              />
              <label htmlFor={id} className="form__label">{label}</label>
              {errors[id] && <p className="error-message">{errors[id]}</p>} {/* Muestra el mensaje de error */}
            </div>
          ))}

          <button type="submit" className="user-profile" disabled={loading}>
            <div className="user-profile-inner">
              <p>{loading ? 'Registrando...' : 'Registrar'}</p>
            </div>
          </button>
        </form>

        <div className="login-options">
          <NavLink to="/LoginAdmin" className="Login">
            ¿Ya tienes cuenta? Inicia Sesión
          </NavLink>
        </div>
      </div>
    </div>
  );
};