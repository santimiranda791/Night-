// src/pages/clientes/Autenticacion/VerifyCode.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const VerifyCode = () => {
  const [code, setCode] = useState('');
  const correo = localStorage.getItem('correo'); // guarda esto en login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/servicio/verificar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, codigo: code }),
      });

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Código inválido',
          text: 'El código ingresado no es correcto',
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: '¡Verificado!',
        text: 'Código correcto, acceso autorizado',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/');

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'No se pudo verificar el código',
      });
    }
  };

  return (
    <div className="page-container">
      <img src="/logito.svg" alt="Logo" className="logo" />
      <div className="login-container">
        <h1 className="login-title">Verifica tu código</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form__group field">
            <input
              type="text"
              className="form__field"
              placeholder="Código de verificación"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
            />
            <label className="form__label">Código</label>
          </div>
          <button type="submit" className="user-profile">
            <div className="user-profile-inner">
              <p>Verificar</p>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};
