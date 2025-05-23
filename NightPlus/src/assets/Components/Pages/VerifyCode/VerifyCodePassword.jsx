import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

export const VerifyCodePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const correo = location.state?.correo || '';

  const [codigo, setCodigo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  if (!correo) {
    navigate('/forgot-password');
    return null;
  }

  const handleCambiarContrasena = async () => {
    if (!codigo || !nuevaContrasena) {
      Swal.fire('Error', 'Completa todos los campos', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/servicio/cambiar-contrasena', {
        method: 'POST', // CAMBIO: aquí es POST, no PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo,
          codigo,
          nuevaContrasena,
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || 'Error al cambiar contraseña.');
      }

      const data = await response.text();
      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: '¡Éxito!',
        text: data,
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Error',
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <h1 className="login-title">Verificar Código y Cambiar Contraseña</h1>
        <div className="login-form">
          <div className="form__group field">
            <input
              type="text"
              className="form__field"
              placeholder="Código recibido"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              required
            />
            <label className="form__label">Código</label>
          </div>
          <div className="form__group field">
            <input
              type="password"
              className="form__field"
              placeholder="Nueva contraseña"
              value={nuevaContrasena}
              onChange={e => setNuevaContrasena(e.target.value)}
              required
            />
            <label className="form__label">Nueva Contraseña</label>
          </div>
          <button onClick={handleCambiarContrasena} className="user-profile" disabled={loading}>
            <div className="user-profile-inner">
              <p>{loading ? 'Procesando...' : 'Cambiar contraseña'}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
