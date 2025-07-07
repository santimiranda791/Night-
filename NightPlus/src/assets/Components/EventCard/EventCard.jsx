import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Importa NavLink
import Swal from 'sweetalert2'; // Importa SweetAlert2
import '../../../Styles/EventCard.css';

export const EventCard = ({ date, title, image, eventId, onClick }) => {
  const navigate = useNavigate();

  // Se hace la función handleClick asíncrona para poder usar 'await' con Swal.fire
  // Esta función ahora se adjunta directamente al NavLink
  const handleClick = async (event) => {
    const token = localStorage.getItem('token');

    // Validación: Si no hay token, el usuario no está logueado
    if (!token) {
      event.preventDefault(); // ¡IMPORTANTE! Previene la navegación por defecto del NavLink
      event.stopPropagation(); // Detiene la propagación del evento

      // Muestra una alerta informando al usuario que debe iniciar sesión.
      // Usamos 'await' para asegurar que la alerta se muestre y se cierre
      // antes de que la función continúe (aunque aquí ya hemos retornado).
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
    // Esto es útil si el componente padre (como Eventos.jsx) tiene lógica adicional
    // que debe ejecutarse ANTES de la navegación (si hay token).
    if (onClick) {
      onClick(event, eventId);
    }
    // Si hay token, y no hay un onClick personalizado que lo prevenga,
    // el NavLink seguirá su comportamiento normal de navegación a '/mapa/:eventId'.
  };

  return (
    // Ahora, EventCard es un NavLink. Su 'to' prop define a dónde navegará.
    // El 'onClick' aquí interceptará la navegación del NavLink.
    <NavLink to={`/mapa/${eventId}`} className="event-mini-card" onClick={handleClick}>
      <img src={image} alt={title} className="event-mini-img" />
      <div className="event-mini-details">
        <span className="event-mini-title">{title}</span>
        <span className="event-mini-date">{date}</span>
      </div>
    </NavLink>
  );
};
