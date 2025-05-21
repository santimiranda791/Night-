import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const correo = localStorage.getItem('correo'); // Asegúrate de guardar esto en login o registro
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo) {
      Swal.fire({
       imageUrl: '/logitotriste.png',
           imageWidth: 130,
           imageHeight: 130,
           background: '#000',
        color: '#fff',
        title: 'Error',
        text: 'Correo no disponible. Por favor, inicia sesión nuevamente.',
      });
      return;
    }

    console.log('Correo a verificar:', correo);
    console.log('Código a verificar:', code);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/servicio/verificar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, codigo: code }),
      });

      if (!response.ok) {
        Swal.fire({
          imageUrl: '/logitotriste.png',
           imageWidth: 130,
           imageHeight: 130,
           background: '#000',
        color: '#fff',
          title: 'Código inválido',
          text: 'El código ingresado no es correcto',
        });
        setLoading(false);
        return;
      }

      Swal.fire({ 
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff', title: '¡Verificado!',
        text: 'Código correcto, acceso autorizado',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/Login');

    } catch (err) {
      Swal.fire({
          imageUrl: '/logitotriste.png',
           imageWidth: 130,
           imageHeight: 130,
           background: '#000',
        color: '#fff',
        title: 'Error de red',
        text: 'No se pudo verificar el código',
      });
    } finally {
      setLoading(false);
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
          <button type="submit" className="user-profile" disabled={loading}>
            <div className="user-profile-inner">
              <p>{loading ? 'Verificando...' : 'Verificar'}</p>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};
