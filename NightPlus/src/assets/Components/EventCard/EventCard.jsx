import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../Styles/EventCard.css';

export const EventCard = ({ date, title, description, club, image, mapRoute }) => {
  const navigate = useNavigate();

  const handleVerEvento = () => {
    navigate(mapRoute);
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
