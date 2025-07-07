import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../../../Styles/SignInCliente.css';
import Swal from 'sweetalert2';
import { LoadingContext } from '../../../../Context/LoadingContext';
import { LoadingAlert } from '../../LoadingAlert/LoadingAlert';

export const SignInCliente = () => {
  // State para los datos del formulario
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    edad: '',
    telefono: '',
    email: '',
    password: '',
  });

  // State para los errores de validación de cada campo
  const [errors, setErrors] = useState({});

  // Contexto de carga para mostrar el LoadingAlert
  const { loading, setLoading } = useContext(LoadingContext);
  // Hook para la navegación programática
  const navigate = useNavigate();

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

  // Función para validar todos los campos del formulario
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validación de Documento (Usuario)
    if (!formData.documento.trim()) {
      newErrors.documento = 'El usuario es obligatorio.';
      isValid = false;
    } else if (formData.documento.trim().length < 4) {
      newErrors.documento = 'El usuario debe tener al menos 4 caracteres.';
      isValid = false;
    } else if (formData.documento.trim().length > 20) {
      newErrors.documento = 'El usuario no debe exceder los 20 caracteres.';
      isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.documento)) {
      newErrors.documento = 'El usuario solo puede contener letras y números.';
      isValid = false;
    }

    // Validación de Nombre
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

    // Validación de Edad
    const edadParsed = parseInt(formData.edad, 10);
    if (!formData.edad.trim()) {
      newErrors.edad = 'La edad es obligatoria.';
      isValid = false;
    } else if (isNaN(edadParsed)) {
      newErrors.edad = 'La edad debe ser un número válido.';
      isValid = false;
    } else if (edadParsed < 18) { // Asumiendo una edad mínima de 18 para la aplicación
      newErrors.edad = 'Debes tener al menos 18 años.';
      isValid = false;
    } else if (edadParsed > 120) {
      newErrors.edad = 'La edad no puede ser mayor a 120 años.';
      isValid = false;
    }

    // Validación de Teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.telefono)) { // Asumiendo 10 dígitos para números de Colombia
      newErrors.telefono = 'El teléfono debe ser numérico y tener 10 dígitos.';
      isValid = false;
    }

    // Validación de Email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido.';
      isValid = false;
    }

    // Validación de Contraseña
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria.';
      isValid = false;
    } else if (formData.password.trim().length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra mayúscula.';
      isValid = false;
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra minúscula.';
      isValid = false;
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos un número.';
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos un carácter especial.';
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

    // Prepara los datos del cliente para el envío
    const edadParsed = formData.edad ? parseInt(formData.edad, 10) : null;
    const cliente = {
      nombre: formData.nombre,
      edad: edadParsed,
      telefono: formData.telefono,
      correo: formData.email,
      usuarioCliente: formData.documento,
      contrasenaCliente: formData.password
    };

    setLoading(true); // Activa el estado de carga

    try {
      console.log('Enviando cliente:', cliente);

      // Realiza la petición POST al backend
      const response = await fetch(`${BASE_URL}/servicio/registrar-cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });

      // Manejo de errores de respuesta del servidor
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error en el registro');
      }

      const data = await response.json(); // Parsea la respuesta JSON

      // Muestra alerta de éxito
      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: '¡Registrado!',
        text: 'Revisa tu correo para el código de verificación.',
      });

      // Limpia el formulario después del envío exitoso
      setFormData({
        documento: '',
        nombre: '',
        edad: '',
        telefono: '',
        email: '',
        password: '',
      });
      setErrors({}); // Limpia los errores también

      // Guarda el correo en localStorage y navega a la página de verificación
      localStorage.setItem('correo', cliente.correo);
      navigate('/VerifyCode', { state: { email: cliente.correo } });

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
        text: error.message || 'Hubo un error al registrar el usuario.',
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

        <h1 className="login-title">Registrarse</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {[
            { id: 'documento', label: 'Usuario', type: 'text' },
            { id: 'nombre', label: 'Nombre', type: 'text' },
            { id: 'edad', label: 'Edad', type: 'number' },
            { id: 'telefono', label: 'Teléfono', type: 'tel' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'password', label: 'Contraseña', type: 'password' }
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
              <p>{loading ? 'Registrando...' : 'Regístrate'}</p>
            </div>
          </button>
        </form>

        <div className="login-options">
          <NavLink to="/Login" className="Login">
            ¿Ya tienes cuenta? Inicia Sesión
          </NavLink>
        </div>
      </div>
    </div>
  );
};