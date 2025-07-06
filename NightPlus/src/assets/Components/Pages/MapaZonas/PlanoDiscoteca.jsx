import React, { useState } from 'react';
import ZonaTooltip from './ZonaTooltip';
import '../../../../Styles/MapaDiscotecaResponsive.css';

const PlanoDiscoteca = ({ onSeleccionarZona }) => {
    const [zonaActiva, setZonaActiva] = useState(null);

    const zonasData = [
        {
            id: 'vip',
            nombre: 'ZONA VIP',
            precio: '$ 120.000,00',
            tipo: 'VIP',
            style: { top: '0', left: '0', width: '100%', height: '230px', backgroundColor: '#1d4ed8' },
            isSelectable: true
        },
        {
            id: 'tarima',
            nombre: 'TARIMA',
            style: { top: '10px', left: '200px', width: '200px', height: '70px', backgroundColor: '#facc15', color: '#000', fontWeight: '600' },
            isSelectable: false
        },
        {
            id: 'preferencial',
            nombre: 'ZONA PREFERENCIAL',
            precio: '$ 80.000,00',
            tipo: 'PREFERENCIAL',
            style: { top: '220px', left: '0', width: '100%', height: '300px', backgroundColor: '#ef4444' },
            isSelectable: true
        },
        {
            id: 'general',
            nombre: 'ZONA GENERAL',
            precio: '$ 50.000,00',
            tipo: 'GENERAL',
            style: { top: '520px', left: '0', width: '100%', height: '275px', backgroundColor: '#0ea5e9' },
            isSelectable: true
        },
        {
            id: 'barra1',
            nombre: 'BARRA',
            style: { top: '50px', left: '10px', width: '80px', height: '80px', backgroundColor: '#7c3aed' },
            isSelectable: false
        },
        {
            id: 'barra2',
            nombre: 'BARRA',
            style: { top: '300px', left: '10px', width: '80px', height: '150px', backgroundColor: '#7c3aed' },
            isSelectable: false
        },
        {
            id: 'barra3',
            nombre: 'BARRA',
            style: { top: '300px', right: '10px', width: '80px', height: '150px', backgroundColor: '#7c3aed' },
            isSelectable: false
        },
        {
            id: 'banos_vip',
            nombre: 'BAÑOS VIP',
            content: <>BAÑOS<br />VIP</>, // Contenido personalizado para los baños
            style: { top: '100px', right: '0', width: '80px', height: '80px', backgroundColor: '#f3f4f6', color: '#000', fontWeight: '600' },
            isSelectable: false
        },
        {
            id: 'taquilla',
            nombre: 'TAQUILLA',
            style: { bottom: '40px', right: '0', width: '90px', height: '100px', backgroundColor: '#fff', color: '#000', border: '1px solid #000', fontWeight: '600' },
            isSelectable: false
        }
    ];

    return (
        <div className="plano-discoteca-wrapper">
            {zonasData.map(zona => (
                <div
                    key={zona.id}
                    className={`zona ${!zona.isSelectable ? 'no-selectable' : ''} ${zonaActiva?.id === zona.id ? 'active-hover' : ''}`}
                    style={{ ...zona.style }}
                    onMouseEnter={() => zona.isSelectable && setZonaActiva(zona)}
                    onMouseLeave={() => setZonaActiva(null)}
                    onClick={() => {
                        if (zona.isSelectable && onSeleccionarZona) {
                            console.log("PlanoDiscoteca: Enviando zona a onSeleccionarZona:", zona);
                            onSeleccionarZona(zona);
                        }
                    }}
                >
                    {/* El tooltip se renderiza DENTRO de la zona */}
                    {zonaActiva?.id === zona.id && zona.isSelectable && (
                        <ZonaTooltip
                            nombre={zona.nombre}
                            precio={zona.precio}
                            tipo={zona.tipo}
                        />
                    )}
                    {zona.content || zona.nombre}
                </div>
            ))}

            <div className="entrance-exit-label">
                🚪 INGRESO Y SALIDA
            </div>

            <div className="discoteca-name-label">
                DISCOTECA<br />14:14
            </div>
        </div>
    );
};

export default PlanoDiscoteca;