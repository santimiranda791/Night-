    import React, { useState } from 'react';
    import ZonaTooltip from './ZonaTooltip';

    const PlanoDiscoteca = ({ onSeleccionarZona }) => {
    const [zonaActiva, setZonaActiva] = useState(null);

    const estilosZona = {
        position: 'absolute',
        color: 'white',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: '14px',
        padding: '4px',
        borderRadius: '10px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s ease',
        cursor: 'pointer'
    };

    const renderZona = (extraStyle, content, zonaInfo = null) => (
        <div
        style={{ ...estilosZona, ...extraStyle }}
        onMouseEnter={() => zonaInfo && setZonaActiva(zonaInfo)}
        onMouseLeave={() => setZonaActiva(null)}
        onClick={() => zonaInfo && onSeleccionarZona && onSeleccionarZona(zonaInfo)}
        >
        {zonaInfo && zonaActiva?.nombre === zonaInfo.nombre && (
            <ZonaTooltip {...zonaInfo} />
        )}
        {content}
        </div>
    );

    return (
        <div style={{
        position: 'relative',
        width: '600px',
        height: '800px',
        left: '10px',
        backgroundColor: '#1e1e2f',
        border: '2px solid #444',
        margin: '40px auto',
        borderRadius: '20px',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden'
        }}>
        {renderZona({
            top: '0',
            left: '0',
            width: '100%',
            height: '230px',
            backgroundColor: '#1d4ed8'
        }, 'ZONA VIP', {
            nombre: 'ZONA VIP',
            precio: '$ 120.000,00',
            tipo: 'VIP'
        })}

        {renderZona({
            position: 'absolute',
            top: '10px',
            left: '200px',
            width: '200px',
            height: '70px',
            backgroundColor: '#facc15',
            color: '#000',
            fontWeight: '600'
        }, 'TARIMA')}

        {renderZona({
            position: 'relative',
            top: '220px',
            left: '0',
            width: '100%',
            height: '300px',
            backgroundColor: '#ef4444'
        }, 'ZONA PREFERENCIAL', {
            nombre: 'ZONA PREFERENCIAL',
            precio: '$ 80.000,00',
            tipo: 'VIP'
        })}

        {renderZona({
            top: '520px',
            left: '0',
            width: '100%',
            height: '275px',
            backgroundColor: '#0ea5e9'
        }, 'ZONA GENERAL', {
            nombre: 'ZONA GENERAL',
            precio: '$ 50.000,00',
            tipo: 'GENERAL'
        })}

        {renderZona({ top: '50px', left: '10px', width: '80px', height: '80px', backgroundColor: '#7c3aed' }, 'BARRA')}
        {renderZona({ top: '300px', left: '10px', width: '80px', height: '150px', backgroundColor: '#7c3aed' }, 'BARRA')}
        {renderZona({ top: '300px', right: '10px', width: '80px', height: '150px', backgroundColor: '#7c3aed' }, 'BARRA')}

        {renderZona({
            top: '100px',
            right: '0',
            width: '80px',
            height: '80px',
            backgroundColor: '#f3f4f6',
            color: '#000',
            fontWeight: '600'
        }, <>BAÑOS<br />VIP</>)}

        {renderZona({
            bottom: '40px',
            right: '0',
            width: '90px',
            height: '100px',
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #000',
            fontWeight: '600'
        }, 'TAQUILLA')}

        <div style={{ position: 'absolute', bottom: '0', right: '35%', fontSize: '13px', color: 'white', padding: '4px' }}>
            🚪 INGRESO Y SALIDA
        </div>

        <div style={{
            position: 'absolute',
            bottom: '150px',
            left: '20px',
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#fff',
            lineHeight: '1.4'
        }}>
            DISCOTECA<br />14:14
        </div>
        </div>
    );
    };

    export default PlanoDiscoteca;
