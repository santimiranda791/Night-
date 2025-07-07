import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import '../../../Styles/EventCard.css';

export const EventCard = ({ date, title, image, eventId, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    // Si se proporciona una función onClick desde el padre, la usamos
    if (onClick) {
      onClick(event, eventId);
    } else {
      // Si no se proporciona onClick (como podría ser en la página principal),
      // realizamos la validación de token aquí directamente.
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: 'Debes iniciar sesión primero',
          text: 'Para acceder a este evento, necesitas tener una sesión activa.',
        });
        return; // Previene la navegación si no hay token
      } else {
        // Si hay token, navega al mapa
        navigate(`/mapa/${eventId}`);
      }
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