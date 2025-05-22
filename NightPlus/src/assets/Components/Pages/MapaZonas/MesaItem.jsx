import React from 'react';
import '../../../../Styles/MesaItem.css';

const MesaItem = ({ mesa }) => {
  return (
    <button className="mesa-button">
      Mesa {mesa.numeroMesa} ({mesa.capacidad} personas)
    </button>
  );
};

export default MesaItem;