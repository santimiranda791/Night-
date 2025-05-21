import React, { useState } from 'react'
import Swal from 'sweetalert2'
import '../../../Styles/ForgotPassword.css'
import { NavLink, useNavigate } from 'react-router-dom'

export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.includes('@')) {
      Swal.fire({
        imageUrl: '/logitopensativo.webp',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Correo inválido',
        text: 'Por favor ingresa un correo válido.',
      })
      return
    }
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/servicio/recuperar-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email }),
      })
      if (!response.ok) {
        throw new Error('No se pudo enviar el correo de recuperación.')
      }
      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: '¡Correo enviado!',
        text: 'Revisa tu correo para instrucciones de recuperación.',
        timer: 2000,
        showConfirmButton: false,
      })
      setTimeout(() => {
        navigate('/Login')
      }, 2000)
    } catch (error) {
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Error',
        text: error.message || 'No se pudo enviar el correo.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <img src="/logito.svg" alt="Logo" className="logo" />
      <div className="login-container">
        <NavLink to="/Login" className="back-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </NavLink>
        <h1 className="login-title">Recuperar Contraseña</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form__group field">
            <input
              type="email"
              id="email"
              className="form__field"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className="form__label">Correo electrónico</label>
          </div>
          <button type="submit" className="user-profile" disabled={loading}>
            <div className="user-profile-inner">
              <p>{loading ? 'Enviando...' : 'Enviar correo'}</p>
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}