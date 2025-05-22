import React from 'react';
import MesaItem from './MesaItem';
import '../../../../Styles/ZonaMapa.css';

const ZonaMapa = ({ zona }) => {
  return (
    <div className="zona-card">
      <h3>{zona.nombre}</h3>
      <p>{zona.descripcion}</p>
      <p><strong>Capacidad:</strong> {zona.capacidad} personas</p>
      <p><strong>Precio Reserva:</strong> ${zona.precioReserva}</p>
      <div className="mesas-grid">
        {zona.mesas && zona.mesas.map((mesa) => (
          <MesaItem key={mesa.idMesa || mesa.id} mesa={mesa} />
        ))}
      </div>
    </div>
  );
};

export default ZonaMapa;