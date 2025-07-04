import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../../Styles/SignInCliente.css'; // Reutilizamos estilos
import { LoadingAlert } from '../../LoadingAlert/LoadingAlert';

export const SignInAdmin = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    nombre: '',
    telefono: '',
    correo: '',
    contrasena: '',
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

    const admin = {
      nombreAdmin: formData.nombre,
      telefonoAdmin: formData.telefono,
      correoAdmin: formData.correo,
      usuarioAdmin: formData.usuario,
      contrasenaAdmin: formData.contrasena,
    };

    // Validación
    if (!admin.nombreAdmin || !admin.correoAdmin || !admin.usuarioAdmin || !admin.contrasenaAdmin) {
      Swal.fire({
        imageUrl: '/logitopensativo.webp',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos obligatorios.'
      });
      return;
    }

    setLoading(true);

    try {
      // Usa la URL base para construir la URL completa del endpoint
      const response = await fetch(`${BASE_URL}/servicio/registrar-administrador`, { // <--- URL ACTUALIZADA
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admin),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al registrar administrador');
      }

      await response.json();

      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: '¡Administrador registrado!',
        text: 'Ahora puedes iniciar sesión.',
      });

      setFormData({
        usuario: '',
        nombre: '',
        telefono: '',
        correo: '',
        contrasena: '',
      });

      navigate('/LoginAdmin');

    } catch (error) {
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
