import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../Styles/EventCard.css';

export const EventCard = ({ date, title, description, club, image, mapRoute }) => {
  const navigate = useNavigate();

  const handleVerEvento = () => {
    navigate(mapRoute); // Navega a la ruta pasada como prop
  };

  return (
    <div className="event-card">
      <div className="event-banner">
        <span className="event-date">{date}</span>
        <div className="image-container">
          <img src={image} alt={`Evento ${title}`} className="dj-image" />
        </div>
      </div>
      <div className="event-details">
        <h2 className="event-title">{title}</h2>
        <p className="event-description">
          {description}
        </p>
        <p className="event-club">{club}</p>
        <button className="event-btn" onClick={handleVerEvento}>Ver Evento</button>
        
      </div>
    </div>
  );
};
