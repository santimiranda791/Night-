import React, { useState } from 'react';
import Swal from 'sweetalert2';
// Asegúrate de que la ruta a tu CSS sea correcta
// import '../../../Styles/UserReservationForm.css'; 

export const UserReservationForm = ({ idEventoSeleccionado, onReservaExitosa }) => {
  const [cantidadTickets, setCantidadTickets] = useState(1);
  const [fechaReserva, setFechaReserva] = useState('');
  const [loading, setLoading] = useState(false);

  const BASE_URL = 'https://backendnight-production.up.railway.app';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!idEventoSeleccionado || !fechaReserva || cantidadTickets <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona un evento, una fecha y una cantidad de tickets válida.',
        background: '#000',
        color: '#fff'
      });
      setLoading(false);
      return;
    }

    try {
      const reservaData = {
        // Solo enviamos el ID del evento y los detalles de la reserva.
        // El ID del cliente se obtendrá del token JWT en el backend.
        evento: { idEvento: Number(idEventoSeleccionado) },
        cantidadTickets: Number(cantidadTickets),
        fechaReserva: fechaReserva, // Formato YYYY-MM-DD
        estado: 'RESERVADA', // Estado inicial por defecto
        estadoPago: 'PENDIENTE', // Estado de pago inicial por defecto
        // ¡IMPORTANTE! NO INCLUIR idCliente o usuarioCliente aquí.
        // El backend los obtiene del token automáticamente para este endpoint.
      };

      // --- ¡ESTA ES LA LLAMADA AL ENDPOINT CORRECTO PARA EL USUARIO FINAL! ---
      const response = await fetch(`${BASE_URL}/servicio/cliente/reservar`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(), // Esto envía el token JWT del usuario logueado
        },
        body: JSON.stringify(reservaData),
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
        // Aquí podrías redirigir al login si es necesario
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al registrar tu reserva: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: '¡Reserva Exitosa!',
        text: `Tu reserva para el evento ID ${data.evento.idEvento} ha sido creada. ID de Reserva: ${data.idReserva}`,
      });
      
      if (onReservaExitosa) {
        onReservaExitosa(data);
      }

      // Limpiar el formulario
      setCantidadTickets(1);
      setFechaReserva('');

    } catch (error) {
      console.error("Error al registrar la reserva:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || "Hubo un error al procesar tu reserva.",
        background: '#000',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-form-container">
      <h2>Reservar Evento</h2>
      <form onSubmit={handleSubmitForm}>
        <div className="form-group">
          <label htmlFor="idEvento">ID del Evento:</label>
          <input
            type="number"
            id="idEvento"
            value={idEventoSeleccionado || ''}
            readOnly
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cantidadTickets">Cantidad de Tickets:</label>
          <input
            type="number"
            id="cantidadTickets"
            value={cantidadTickets}
            onChange={(e) => setCantidadTickets(Number(e.target.value))}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fechaReserva">Fecha de la Reserva:</label>
          <input
            type="date"
            id="fechaReserva"
            value={fechaReserva}
            onChange={(e) => setFechaReserva(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Reservando...' : 'Confirmar Reserva'}
        </button>
      </form>
    </div>
  );
};
