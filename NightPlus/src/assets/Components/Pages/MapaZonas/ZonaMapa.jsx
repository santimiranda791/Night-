import React from 'react';
import MesaItem from './MesaItem';
import '../../../../Styles/ZonaMapa.css';

const ZonaMapa = ({ zona, onReservar }) => {
  return (
    <div className="zona-mapa-container" style={{ borderColor: zona.colorZona || '#000' }}>
      <h3>{zona.nombre}</h3>
      <p>Capacidad: {zona.capacidad}</p>
      <p>Disponible: {zona.disponible ? 'Sí' : 'No'}</p>
      <div className="mesas-lista">
        {zona.mesas && zona.mesas.length > 0 ? (
          zona.mesas.map((mesa) => (
            <MesaItem key={mesa.id} mesa={mesa} onReservar={onReservar} />
          ))
        ) : (
          <p>No hay mesas disponibles en esta zona.</p>
        )}
      </div>
    </div>
  );
};

export default ZonaMapa;
