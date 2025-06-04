import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../../Styles/UserProfile.css';

export const UserProfile = () => {
  const [cliente, setCliente] = useState({
    nombre: '',
    edad: '',
    telefono: '',
    correo: '',
    contrasenaCliente: '', // CAMBIO aquí para coincidir con el backend
  });

  const [activeTab, setActiveTab] = useState('cuenta');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setCliente({
      nombre: localStorage.getItem('nombre') || '',
      edad: localStorage.getItem('edad') || '',
      telefono: localStorage.getItem('telefono') || '',
      correo: localStorage.getItem('correo') || '',
      contrasenaCliente: '',
    });
  }, []);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/servicio/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) throw new Error(await response.text());

      const actualizado = await response.json();

      localStorage.setItem("nombre", actualizado.nombre);
      localStorage.setItem("edad", actualizado.edad);
      localStorage.setItem("telefono", actualizado.telefono);
      localStorage.setItem("correo", actualizado.correo);

      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'Tus datos fueron guardados correctamente.',
        background: '#000',
        color: '#fff'
      });

      closeModal();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        background: '#000',
        color: '#fff'
      });
    }
  };

  return (
    <div className={`user-profile-container ${showModal ? 'modal-open' : ''}`}>
      <div className="user-header">
        <img src="/userphoto.jpg" alt="Foto" className="profile-image" />
        <h1>{cliente.nombre}</h1>
        <p>{cliente.correo}</p>
      </div>

      <div className="profile-tabs">
        {['cuenta', 'eventos', 'wallet', 'órdenes'].map(tab => (
          <div
            key={tab}
            className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </div>
        ))}
      </div>

      <div className="profile-content">
        {activeTab === 'cuenta' ? (
          <div className="profile-form">
            <h2>Mi Cuenta</h2>
            <p>Información personal</p>
            <label>Nombre</label>
            <input type="text" value={cliente.nombre} disabled />
            <label>Correo</label>
            <input type="text" value={cliente.correo} disabled />
            <button onClick={openModal} className="updatee-button">Actualizar</button>
          </div>
        ) : (
          <div className="profile-placeholder">
            <h3>Contenido de {activeTab} próximamente...</h3>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" onClick={closeModal} />
          <div className="modal-content">
            <h2>Editar Información</h2>
            <form onSubmit={handleSubmit}>
              <label>Nombre</label>
              <input type="text" name="nombre" value={cliente.nombre} onChange={handleChange} required />
              <label>Edad</label>
              <input type="number" name="edad" value={cliente.edad} onChange={handleChange} required />
              <label>Teléfono</label>
              <input type="text" name="telefono" value={cliente.telefono} onChange={handleChange} />
              <label>Correo</label>
              <input type="email" name="correo" value={cliente.correo} onChange={handleChange} required />
              <label>Nueva Contraseña</label>
              <input type="password" name="contrasenaCliente" value={cliente.contrasenaCliente} onChange={handleChange} placeholder="Deja vacío para no cambiar" />
              <div className="buttons">
                <button type="button" className="logout-button" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="updatee-button">Guardar</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
