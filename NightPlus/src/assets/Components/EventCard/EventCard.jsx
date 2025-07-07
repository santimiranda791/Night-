import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import '../../../Styles/EventCard.css';

export const EventCard = ({ date, title, image, eventId, onClick }) => {
  const navigate = useNavigate();

  // Se hace la función handleClick asíncrona para poder usar 'await' con Swal.fire
  const handleClick = async (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del enlace
    event.stopPropagation(); // Detiene la propagación del evento para evitar clics duplicados

    const token = localStorage.getItem('token');

    // Validación: Si no hay token, el usuario no está logueado
    if (!token) {
      // Muestra una alerta informando al usuario que debe iniciar sesión.
      // Usamos 'await' para asegurar que la alerta se muestre y se cierre
      // antes de que la función continúe.
      await Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: 'Debes iniciar sesión primero',
        text: 'Para acceder a este evento, necesitas tener una sesión activa.',
      });
      return; // Detiene la ejecución de la función después de mostrar la alerta
    }

    // Si un 'onClick' personalizado fue proporcionado desde el padre, lo llamamos.
    // Esto es útil si el componente padre (como Eventos.jsx) tiene lógica adicional.
    if (onClick) {
      onClick(event, eventId);
    } else {
      // Si no se proporcionó un 'onClick' personalizado y hay token,
      // navega directamente a la página del mapa del evento.
      navigate(`/mapa/${eventId}`);
    }
  };

  return (
    <div className="event-mini-card" onClick={handleClick}>
      <img src={image} alt={title} className="event-mini-img" />
      <div className="event-mini-details">
        <span className="event-mini-title">{title}</span>
        <span className="event-mini-date">{date}</span>
      </div>
    </div>
  );
};
