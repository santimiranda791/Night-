import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../../Styles/UserProfile.css';
  
export const UserProfile = () => {
  const [cliente, setCliente] = useState({
    id_cliente: localStorage.getItem("id_cliente") ? Number(localStorage.getItem("id_cliente")) : null,
    nombre: localStorage.getItem("nombre") || "",
    edad: localStorage.getItem("edad") ? Number(localStorage.getItem("edad")) : "",
    telefono: localStorage.getItem("telefono") || "",
    correo: localStorage.getItem("correo") || "",
    usuario_cliente: localStorage.getItem("usuario_cliente") || "",
    contrasena_cliente: ""
  });
  
  const [activeTab, setActiveTab] = useState('cuenta');
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    setCliente({
      id_cliente: localStorage.getItem('id_cliente') || '',
      nombre: localStorage.getItem('nombre') || '',
      edad: localStorage.getItem('edad') || '',
      telefono: localStorage.getItem('telefono') || '',
      correo: localStorage.getItem('correo') || '',
      usuario_cliente: localStorage.getItem('usuario_cliente') || '',
      contrasena_cliente: '',
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
      // Elimina el usuario_cliente antes de enviar los datos
      const { usuario_cliente, ...clienteSinUsuario } = cliente;
  
      const response = await fetch('http://localhost:8080/servicio/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteSinUsuario),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar');
      }
  
      const clienteRecibido = await response.json();
  
      Swal.fire({
             imageUrl: '/logitonegro.png',
              imageWidth: 130,
              imageHeight: 130,
              background: '#000',
              color: '#fff',
            title: 'Actualizado!',
            text: 'Tus Datos han sido actualizados correctamente.',
          });
      setShowModal(false);
  
      // Actualizar localStorage con los nuevos datos (excepto usuario)
      localStorage.setItem("id_cliente", clienteRecibido.id_cliente);
      localStorage.setItem("nombre", clienteRecibido.nombre);
      localStorage.setItem("edad", clienteRecibido.edad);
      localStorage.setItem("telefono", clienteRecibido.telefono);
      localStorage.setItem("correo", clienteRecibido.correo);
  
    } catch (err) {
       Swal.fire({
            imageUrl: '/logitotriste.png',
                 imageWidth: 130,
                 imageHeight: 130,
                 background: '#000',
              color: '#fff',
            title: 'Error',
            text: error.message || 'Hubo un error al registrar el usuario.',
          });
    }
  };
  
  return (
    <div className={`user-profile-container ${showModal ? 'modal-open' : ''}`}>
      {/* Header */}
      <div className="user-header">
        <img src="/userphoto.jpg" alt="Foto de perfil" className="profile-image" />
        <h1 className="profile-name">{cliente.nombre}</h1>
        <p className="profile-email">{cliente.correo}</p>
      </div>
  
      {/* Tabs */}
      <div className="profile-tabs">
        {['cuenta',  'eventos', 'wallet', 'órdenes'].map(tab => (
          <div
            key={tab}
            className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'cuenta' && 'MI CUENTA'}
            {tab === 'eventos' && 'EVENTOS'}
            {tab === 'wallet' && 'MI WALLET'}
            {tab === 'órdenes' && 'MIS ÓRDENES'}
          </div>
        ))}
      </div>
  
      {/* Content */}
      <div className="profile-content">
        {activeTab === 'cuenta' && (
          <div className="profile-form">
            <h2>Mi Cuenta</h2>
            <p>Mira tu información personal.</p>
  
            <label>Nombre visible</label>
            <input type="text" value={cliente.nombre} disabled />
  
            <label>Correo</label>
            <input type="text" value={cliente.correo} disabled />
  
            <button className="updatee-button" onClick={openModal}>Actualizar información</button>
          </div>
        )}
  
        {activeTab !== 'cuenta' && (
          <div className="profile-placeholder">
            <h3>Contenido de la pestaña "{activeTab}" próximamente...</h3>
          </div>
        )}
      </div>
  
      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={closeModal} />
          <div className="modal-content">
            <h2>Editar Información</h2>
            <form onSubmit={handleSubmit}>
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={cliente.nombre}
                onChange={handleChange}
                required
              />
  
              <label>Edad</label>
              <input
                type="number"
                name="edad"
                value={cliente.edad}
                onChange={handleChange}
                required
                min="1"
                max="120"
              />
  
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={cliente.telefono}
                onChange={handleChange}
              />
  
              <label>Correo</label>
              <input
                type="email"
                name="correo"
                value={cliente.correo}
                onChange={handleChange}
                required
              />
  
              <label>Contraseña</label>
              <input
                type="password"
                name="contrasena_cliente"
                value={cliente.contrasena_cliente}
                onChange={handleChange}
                placeholder="Deja vacío para no cambiar"
              />
  
              <div className="buttons">
                <button type="button" className="logout-button" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="updatee-button">Guardar cambios</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};