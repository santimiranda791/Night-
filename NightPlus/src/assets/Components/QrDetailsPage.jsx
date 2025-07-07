import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Necesitarás react-router-dom para esto
import Swal from 'sweetalert2';

// Puedes añadir estilos específicos aquí o en tu UserProfile.css si lo prefieres
// import '../../../Styles/QrDetailsPage.css'; // Si creas un CSS específico

export const QrDetailsPage = () => {
  const location = useLocation();
  const [reservaDetails, setReservaDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'https://backendnight-production.up.railway.app';

  // Helper para obtener los encabezados de autorización (si la API de detalles lo requiere)
  // Para una página pública de detalles de QR, quizás no necesites autenticación.
  // Si tu backend requiere autenticación para obtener detalles de reservas, descomenta esto:
  /*
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Asume que el token está en localStorage
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };
  */

  useEffect(() => {
    const fetchDetails = async () => {
      const params = new URLSearchParams(location.search);
      const idReserva = params.get('idReserva');
      const idEvento = params.get('idEvento'); // Puedes usarlo si necesitas detalles específicos del evento

      if (!idReserva) {
        setError("ID de reserva no encontrado en la URL.");
        setLoading(false);
        return;
      }

      try {
        // Aquí deberías llamar a tu API de backend para obtener los detalles de la reserva
        // Asumo un endpoint como /servicio/reserva/{idReserva}
        const response = await fetch(`${BASE_URL}/servicio/reserva/${idReserva}`, {
          method: 'GET',
          // headers: getAuthHeaders(), // Descomentar si tu API requiere autenticación
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al obtener detalles de la reserva: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        setReservaDetails(data);
      } catch (err) {
        console.error("Error al cargar los detalles de la reserva:", err);
        setError(err.message || "Hubo un error al cargar los detalles de la reserva.");
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: err.message || "No se pudieron cargar los detalles de la reserva.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [location]); // Dependencia: location para recargar si los parámetros de la URL cambian

  if (loading) {
    return <div className="qr-details-container"><p>Cargando detalles de la reserva...</p></div>;
  }

  if (error) {
    return <div className="qr-details-container"><p style={{ color: 'red' }}>Error: {error}</p></div>;
  }

  if (!reservaDetails) {
    return <div className="qr-details-container"><p>No se encontraron detalles para esta reserva.</p></div>;
  }

  return (
    <div className="qr-details-container" style={{
      backgroundColor: '#1a1a1a',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
      maxWidth: '600px',
      margin: '20px auto',
      textAlign: 'center'
    }}>
      <img src="/logito.svg" alt="Logo Night" style={{ width: '100px', marginBottom: '20px' }} />
      <h1 style={{ marginBottom: '15px', fontSize: '2em' }}>Detalles de la Reserva</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>
        Este código QR está relacionado con el evento: <strong>{reservaDetails.nombreEvento || reservaDetails.evento?.nombreEvento || 'N/A'}</strong>
      </p>
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '20px'
      }}>
        <p><strong>ID de Reserva:</strong> {reservaDetails.idReserva}</p>
        <p><strong>Usuario:</strong> {reservaDetails.usuarioCliente || reservaDetails.cliente?.usuarioCliente || 'N/A'}</p>
        <p><strong>Cantidad de Tickets:</strong> {reservaDetails.cantidadTickets}</p>
        <p><strong>Fecha de Reserva:</strong> {reservaDetails.fechaReserva}</p>
        <p><strong>Estado de Pago:</strong> {reservaDetails.estadoPago}</p>
        {/* Puedes añadir más detalles del evento si los obtienes de la API */}
        {reservaDetails.descripcion && <p><strong>Descripción del Evento:</strong> {reservaDetails.descripcion}</p>}
        {reservaDetails.precio && <p><strong>Precio del Ticket:</strong> ${reservaDetails.precio?.toFixed(2)}</p>}
      </div>
      <p style={{ fontSize: '0.9em', color: '#aaa' }}>
        Para más información, contacta al soporte de NightPlus.
      </p>
    </div>
  );
};
