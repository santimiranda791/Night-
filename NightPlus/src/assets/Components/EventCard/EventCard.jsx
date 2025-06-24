// src/assets/Components/EventCard/EventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../Styles/EventCard.css'; // Asegúrate de que la ruta a tus estilos sea correcta

export const EventCard = ({ date, title, description, club, image, eventId }) => {
  const navigate = useNavigate();

  const handleVerEvento = () => {
    // Este log te mostrará el ID EXACTO que EventCard está intentando usar para navegar.
    console.log(`EventCard.jsx: Navegando a /mapa/${eventId} para el evento: ${title}`);
    navigate(`/mapa/${eventId}`);
  };

  return (
    <div className="event-card">
      <div className="image-container">
        <img src={image} alt={`Evento ${title}`} className="dj-image" />
      </div>
      <div className="event-details">
        <div className="event-date">{date}</div>
        <div className="event-title">{title}</div>
        <div className="event-description">{description}</div>
        <div className="event-club">{club}</div>
        <button className="event-btn" onClick={handleVerEvento}>Ver Evento</button>
      </div>
    </div>
  );
};