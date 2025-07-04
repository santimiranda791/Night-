import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../../../Styles/SignInCliente.css';
import Swal from 'sweetalert2';
import { LoadingContext } from '../../../../Context/LoadingContext';
import { LoadingAlert } from '../../LoadingAlert/LoadingAlert';

export const SignInCliente = () => {
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    edad: '',
    telefono: '',
    email: '',
    password: '',
  });

  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  // Define la URL base de tu backend desplegado en Railway
  const BASE_URL = 'https://backendnight-production.up.railway.app'; // <--- ¡URL ACTUALIZADA AQUÍ!

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.email.includes('@') || formData.password.length < 6) {
      Swal.fire({
        imageUrl: '/logitopensativo.webp',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Datos inválidos',
        text: 'Verifica el correo y asegúrate que la contraseña tenga al menos 6 caracteres.',
      });
      return;
    }

    const edadParsed = formData.edad ? parseInt(formData.edad, 10) : null;

    const cliente = {
      nombre: formData.nombre,
      edad: edadParsed,
      telefono: formData.telefono,
      correo: formData.email,
      usuarioCliente: formData.documento,
      contrasenaCliente: formData.password
    };

    // Validar campos obligatorios
    if (!cliente.nombre || !cliente.correo || !cliente.usuarioCliente || !cliente.contrasenaCliente) {
      Swal.fire({
        imageUrl: '/logitopensativo.webp',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Campos faltantes',
        text: 'Por favor completa todos los campos obligatorios.'
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Enviando cliente:', cliente);

      // Usa la URL base para construir la URL completa del endpoint
      const response = await fetch(`${BASE_URL}/servicio/registrar-cliente`, { // <--- URL ACTUALIZADA
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error en el registro');
      }

      const data = await response.json();

      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: '¡Registrado!',
        text: 'Revisa tu correo para el código de verificación.',
      });

      setFormData({
        documento: '',
        nombre: '',
        edad: '',
        telefono: '',
        email: '',
        password: '',
      });

      localStorage.setItem('correo', cliente.correo);
      navigate('/VerifyCode', { state: { email: cliente.correo } });

    } catch (error) {
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
                className="form__field"
                placeholder={label}
                value={formData[id]}
                onChange={handleChange}
                required
              />
              <label htmlFor={id} className="form__label">{label}</label>
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
