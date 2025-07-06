import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../../Styles/UserProfile.css';

export const UserProfile = () => {
  const [cliente, setCliente] = useState({
    nombre: '',
    edad: '',
    telefono: '',
    correo: '',
    contrasenaCliente: '',
  });

  const [activeTab, setActiveTab] = useState('cuenta');
  const [showModal, setShowModal] = useState(false);

  // Nuevo estado para las reservas del cliente
  const [misReservas, setMisReservas] = useState([]);
  const [loadingMisReservas, setLoadingMisReservas] = useState(false);
  const [errorMisReservas, setErrorMisReservas] = useState(null);

  // URL base de tu backend en Railway.app
  const BASE_URL = 'https://backendnight-production.up.railway.app'; 

  // Función para obtener el token de autenticación (asumiendo que lo guardas en localStorage)
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Asume que el token se guarda aquí
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Carga inicial de los datos del cliente desde localStorage
  useEffect(() => {
    setCliente({
      nombre: localStorage.getItem('nombre') || '',
      edad: localStorage.getItem('edad') || '',
      telefono: localStorage.getItem('telefono') || '',
      correo: localStorage.getItem('correo') || '',
      contrasenaCliente: '', // La contraseña nunca debe cargarse aquí por seguridad
    });
  }, []);

  // --- LÓGICA CLAVE PARA LAS RESERVAS ---
  // Efecto para cargar las reservas cuando la pestaña "Mis Reservas" está activa
  useEffect(() => {
    const fetchMisReservas = async () => {
      if (activeTab === 'mis reservas') { // Solo carga si esta pestaña está activa
        setLoadingMisReservas(true);
        setErrorMisReservas(null);
        try {
          // Endpoint para obtener las reservas del cliente autenticado
          const response = await fetch(`${BASE_URL}/servicio/cliente/mis-reservas`, {
            headers: getAuthHeaders(), // Envía el token JWT
          });

          if (response.status === 401 || response.status === 403) {
            Swal.fire({
              imageUrl: '/logitotriste.png',
              imageWidth: 130,
              imageHeight: 130,
              background: '#000',
              color: '#fff',
              title: "Error de Autenticación",
              text: "Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión de nuevo.",
            });
            // Aquí podrías redirigir al login si tienes una función handleLogout global
            // window.location.href = '/login'; 
            return;
          }
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al obtener tus reservas: ${response.status} ${response.statusText} - ${errorText}`);
          }
          const data = await response.json();
          setMisReservas(data);
        } catch (err) {
          console.error("Error fetching mis reservas:", err);
          setErrorMisReservas(err.message);
        } finally {
          setLoadingMisReservas(false);
        }
      }
    };

    fetchMisReservas();
  }, [activeTab]); // Este useEffect se ejecuta cada vez que activeTab cambia
  // --- FIN LÓGICA CLAVE ---

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cliente.correo) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El correo es necesario para actualizar tu perfil.',
            background: '#000',
            color: '#fff'
        });
        return;
    }

    try {
      const response = await fetch(`${BASE_URL}/servicio/update`, { 
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          nombre: cliente.nombre,
          edad: Number(cliente.edad),
          telefono: cliente.telefono,
          correo: cliente.correo,
          usuarioCliente: localStorage.getItem('usuarioCliente') || '',
          contrasenaCliente: cliente.contrasenaCliente || undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            Swal.fire({
                imageUrl: '/logitotriste.png',
                imageWidth: 130,
                imageHeight: 130,
                background: '#000',
                color: '#fff',
                title: "Error de Autenticación",
                text: "Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión de nuevo.",
            });
            return;
        }
        const errorText = await response.text();
        throw new Error(`Error al actualizar: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const actualizado = await response.json();

      localStorage.setItem("nombre", actualizado.nombre);
      localStorage.setItem("edad", actualizado.edad);
      localStorage.setItem("telefono", actualizado.telefono);
      localStorage.setItem("correo", actualizado.correo);
      localStorage.setItem("usuarioCliente", actualizado.usuarioCliente);

      setCliente(prevCliente => ({
          ...prevCliente,
          nombre: actualizado.nombre,
          edad: actualizado.edad,
          telefono: actualizado.telefono,
          correo: actualizado.correo,
          contrasenaCliente: '',
      }));

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
        {/* Pestañas actualizadas */}
        {['cuenta', 'mis reservas'].map(tab => (
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
        ) : activeTab === 'mis reservas' ? (
          // --- RENDERIZADO DE LAS RESERVAS ---
          <div className="reservas-section">
            <h2>Mis Reservas</h2>
            {loadingMisReservas ? (
              <p>Cargando tus reservas...</p>
            ) : errorMisReservas ? (
              <p>Error al cargar reservas: {errorMisReservas}</p>
            ) : misReservas.length === 0 ? (
              <p>Aún no tienes reservas.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID Reserva</th>
                    <th>Evento</th>
                    <th>Tickets</th>
                    <th>Fecha Reserva</th>
                    <th>Estado Pago</th>
                    {/* Puedes añadir más columnas si tu DTO de reserva tiene más datos relevantes para el usuario */}
                  </tr>
                </thead>
                <tbody>
                  {misReservas.map((reserva) => (
                    <tr key={reserva.idReserva}>
                      <td data-label="ID Reserva">{reserva.idReserva}</td>
                      {/* Asume que el DTO de Reserva tiene nombreEvento o accedes a reserva.evento.nombreEvento */}
                      <td data-label="Evento">{reserva.nombreEvento || reserva.evento?.nombreEvento || 'N/A'}</td>
                      <td data-label="Tickets">{reserva.cantidadTickets}</td>
                      <td data-label="Fecha Reserva">{reserva.fechaReserva}</td>
                      <td data-label="Estado Pago">{reserva.estadoPago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          // --- FIN RENDERIZADO DE LAS RESERVAS ---
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
