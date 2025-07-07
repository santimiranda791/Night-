import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../../Styles/UserProfile.css';
import { QRCode } from 'qrcode.react'; // ¡Esta línea es crucial y debe estar así!

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
  const [showQrModal, setShowQrModal] = useState(false); // Nuevo estado para el modal QR
  const [currentQrData, setCurrentQrData] = useState(null); // Estado para almacenar los datos del QR de la reserva

  const [misReservas, setMisReservas] = useState([]);
  const [loadingMisReservas, setLoadingMisReservas] = useState(false);
  const [errorMisReservas, setErrorMisReservas] = useState(null);

  const BASE_URL = 'https://backendnight-production.up.railway.app';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  useEffect(() => {
    setCliente({
      nombre: localStorage.getItem('nombre') || '',
      edad: localStorage.getItem('edad') || '',
      telefono: localStorage.getItem('telefono') || '',
      correo: localStorage.getItem('correo') || '',
      contrasenaCliente: '',
    });
  }, []);

  useEffect(() => {
    const fetchMisReservas = async () => {
      if (activeTab === 'mis reservas') {
        setLoadingMisReservas(true);
        setErrorMisReservas(null);
        try {
          const response = await fetch(`${BASE_URL}/servicio/cliente/mis-reservas`, {
            headers: getAuthHeaders(),
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
  }, [activeTab]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Función para abrir el modal QR con datos específicos de la reserva
  const openQrModal = (reservaData) => {
    setCurrentQrData(reservaData); // Almacena los datos de la reserva para el QR
    setShowQrModal(true);
  };
  const closeQrModal = () => {
    setShowQrModal(false);
    setCurrentQrData(null); // Limpia los datos del QR al cerrar el modal
  };

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
        const requestBody = {
            nombre: cliente.nombre,
            edad: cliente.edad === '' ? null : Number(cliente.edad),
            telefono: cliente.telefono === '' ? null : cliente.telefono,
            correo: cliente.correo,
            usuarioCliente: localStorage.getItem('usuarioCliente') || null,
            contrasenaCliente: cliente.contrasenaCliente === '' ? null : cliente.contrasenaCliente,
        };

        const response = await fetch(`${BASE_URL}/servicio/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(requestBody),
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
    <div className={`user-profile-container ${showModal || showQrModal ? 'modal-open' : ''}`}>
      <div className="user-header">
        <img src="/logito.svg" alt="Logo Night" className="profile-image" />
        <h1>{cliente.nombre}</h1>
        <p>{cliente.correo}</p>
      </div>

      <div className="profile-tabs">
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
                    <th>USUARIO</th>
                    <th>Tickets</th>
                    <th>Fecha Reserva</th>
                    <th>Estado Pago</th>
                    <th>QR</th> {/* Nueva columna para el QR */}
                  </tr>
                </thead>
                <tbody>
                  {misReservas.map((reserva) => (
                    <tr key={reserva.idReserva}>
                      <td data-label="ID Reserva">{reserva.idReserva}</td>
                      <td data-label="Evento">{reserva.nombreEvento || 'N/A'}</td>
                      <td data-label="Usuario">{reserva.usuarioCliente || reserva.cliente?.usuarioCliente || 'N/A'}</td>
                      <td data-label="Tickets">{reserva.cantidadTickets}</td>
                      <td data-label="Fecha Reserva">{reserva.fechaReserva}</td>
                      <td data-label="Estado Pago">{reserva.estadoPago}</td>
                      <td data-label="QR">
                        {/* Botón "Ver QR" para cada reserva */}
                        <button onClick={() => openQrModal(reserva)} className="qr-button">Ver QR</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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

      {/* Nuevo Modal para el Código QR */}
      {showQrModal && (
        <>
          <div className="modal-overlay" onClick={closeQrModal} />
          <div className="modal-content qr-modal">
            <h2>Código QR de la Reserva</h2>
            {currentQrData ? (
              <div className="qr-code-wrapper">
                {/* El valor del QR ahora es un JSON string con datos de la reserva */}
                <QRCode
                  value={JSON.stringify({
                    idReserva: currentQrData.idReserva,
                    evento: currentQrData.nombreEvento,
                    usuario: currentQrData.usuarioCliente || currentQrData.cliente?.usuarioCliente || currentQrData.nombreCliente, // Mejorado para obtener el usuario
                    tickets: currentQrData.cantidadTickets
                  })}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
                <p className="qr-info">
                  Este QR contiene los detalles de la reserva: ID {currentQrData.idReserva}, Evento {currentQrData.nombreEvento}.
                </p>
              </div>
            ) : (
              <p>No se pueden generar los datos del QR para esta reserva.</p>
            )}
            <button type="button" className="logout-button" onClick={closeQrModal}>Cerrar</button>
          </div>
        </>
      )}
    </div>
  );
};
