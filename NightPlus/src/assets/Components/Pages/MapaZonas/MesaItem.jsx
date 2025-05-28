    import React from 'react';
    import '../../../../Styles/MesaItem.css';

    const MesaItem = ({ mesa, onReservar }) => {
    const handleClick = () => {
        if (!mesa.disponible) {
        alert('Esta mesa no está disponible.');
        return;
        }
        onReservar(mesa);
    };

    return (
        <button className={`mesa-button ${mesa.disponible ? 'disponible' : 'no-disponible'}`} onClick={handleClick}>
        Mesa {mesa.numero} ({mesa.capacidad} personas)
        </button>
    );
    };

    export default MesaItem;
