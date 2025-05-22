import React from 'react';
import { MesaItem } from './MesaItem';
import '../../../../Styles/ZonaMapa.css';

export const ZonaMapa = ({ zona }) => {
  return (
    <div className="zona-card">
      <h3 className="zona-title">{zona.nombre}</h3>
      <p className="zona-desc">{zona.descripcion}</p>
      <p><strong>Capacidad:</strong> {zona.capacidad} personas</p>
   <p><strong>Precio Reserva:</strong> ${zona.precioReserva}</p>


      <div className="mesas-grid">
        {zona.mesas && zona.mesas.map((mesa) => (
          <MesaItem key={mesa.id} mesa={mesa} />
        ))}
      </div>
    </div>
  );
};