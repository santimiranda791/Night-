import React from 'react';
import '../../../../Styles/MapaDiscotecaResponsive.css';

const ZonaTooltip = ({ nombre, precio, tipo }) => {
    return (
        <div className="zona-tooltip">
            <div className="zona-tooltip-header" /> {/* El color se controla desde el CSS general o se puede pasar dinámicamente si es necesario */}
            <div className="zona-tooltip-content">
                <div className="zona-tooltip-label">Sector</div>
                <div className="zona-tooltip-name">{nombre}</div>
                <div className="zona-tooltip-type">{tipo}</div>
                <div className="zona-tooltip-price">{precio}</div>
            </div>
            <div className="zona-tooltip-arrow" />
        </div>
    );
};

export default ZonaTooltip;