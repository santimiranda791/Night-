import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../../Styles/VerifyCode.css';
export const VerifyCode = () => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);
  const correo = localStorage.getItem('correo');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = digits.join('');
    if (code.length !== 6 || !correo) {
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Error',
        text: 'Código incompleto o correo no disponible.',
      });
      return;
    }

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
        return;
      }

      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: '¡Verificado!',
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
          <div className="code-input-container">
            {digits.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="code-input-box"
              />
            ))}
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
