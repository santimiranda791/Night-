import React, { useState } from 'react'
import { Header } from '../../Header/Header'
import { NavLink } from 'react-router-dom'
import '../../../../Styles/ViewEvent.css'

export const ViewEvent = () => {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nombre: '', correo: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Redirigiendo a la pasarela de pago...')
  }

  return (
    <>
      <Header />
      <div className="background-blur"></div>
      <div className="centered-container">
        <div className="event-card">
          <div className="event-info">
            <h1 className="event-title">Detalles del Evento</h1>
            <h2 className="event-name">NOCHE DE CHICAS</h2>
            <p className="event-offer">¡Combo de 5 Amigas NO SE COBRA COVER!</p>
            <p className="event-desc">Ven a encontrar una experiencia inolvidable</p>
            <div className="animated-arrow">
              <span className="arrow-body"></span>
              <span className="arrow-head"></span>
            </div>
            {!showForm && (
              <button className="btnReservar" onClick={() => setShowForm(true)}>
                Reservar
              </button>
            )}
            {showForm && (
              <form className="formReserva" onSubmit={handleSubmit}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Correo:
                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    required
                  />
                </label>
                <NavLink to="/mapa">
                  <button type="button" className="btnPagar">
                    Pagar
                  </button>
                </NavLink>
              </form>
            )}
          </div>
          <div className="imgViewEvent">
            <img src="/card.png" alt="Evento" className="ViewEventImg" />
          </div>
        </div>
      </div>
    </>
  )
}