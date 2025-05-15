import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../../../Styles/SignInCliente.css';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../../../../firebaseConfig/config';

export const SignInCliente = () => {
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    edad: '',
    telefono: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cliente = {
      nombre: formData.nombre,
      edad: parseInt(formData.edad, 10),
      telefono: formData.telefono,
      correo: formData.email,
      usuarioCliente: formData.documento,
      contrasenaCliente: formData.password  // CORREGIDO (sin ñ)
    };

    try {
      const response = await fetch('http://localhost:8080/servicio/registrar-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);
      alert('Usuario registrado con éxito');
      // Limpiar el formulario:
      setFormData({
        documento: '',
        nombre: '',
        edad: '',
        telefono: '',
        email: '',
        password: '',
      });

    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Hubo un error al registrar el usuario.');
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error con Google Sign-In', error);
    }
  };

  return (
    <div className="page-container">
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
            { id: 'documento', label: 'Nro De Documento', type: 'text' },
            { id: 'nombre', label: 'Nombre', type: 'text' },
            { id: 'edad', label: 'Edad', type: 'number' },
            { id: 'telefono', label: 'Telefono', type: 'tel' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'password', label: 'Password', type: 'password' }
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

          <button type="submit" className="user-profile">
            <div className="user-profile-inner">
              <p>Registrate</p>
            </div>
          </button>
        </form>

        <div
          role="button"
          className="user-profile google-signin-button"
          onClick={signInWithGoogle}
        >
          <div className="user-profile-inner">
            <img src="/google.webp" alt="Google Icon" className="google-icon" />
            <p>Iniciar con Google</p>
          </div>
        </div>

        <div className="login-options">
          <NavLink to="/Login" className="Login">
            ¿Ya tienes cuenta? Inicia Sesión
          </NavLink>
        </div>
      </div>
    </div>
  );
};
