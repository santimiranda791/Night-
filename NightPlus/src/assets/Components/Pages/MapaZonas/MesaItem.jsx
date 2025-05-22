import React from 'react';
import '../../../../Styles/MesaItem.css';

export const MesaItem = ({ mesa }) => {
  return (
    <div className={`mesa-item ${mesa.disponible ? 'disponible' : 'ocupada'}`}>
      <span className="mesa-numero">Mesa {mesa.numero}</span>
      <span className="mesa-capacidad">{mesa.capacidad} personas</span>
    </div>
  );
};