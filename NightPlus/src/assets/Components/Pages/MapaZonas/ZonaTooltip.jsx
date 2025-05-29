import React from 'react';

const ZonaTooltip = ({ nombre, precio, tipo }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '-120px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      width: '180px',
      zIndex: 10,
      fontFamily: 'Arial, sans-serif',
      textAlign: 'left',
    }}>
      <div style={{
        height: '6px',
        backgroundColor: '#1d4ed8',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px'
      }} />

      <div style={{ padding: '10px' }}>
        <div style={{ fontSize: '12px', color: '#444' }}>Sector</div>
        <div style={{ fontSize: '15px', fontWeight: 'bold' }}>{nombre}</div>
        <div style={{ fontSize: '12px', marginTop: '8px' }}>{tipo}</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>{precio}</div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderTop: '10px solid white',
      }} />
    </div>
  );
};

export default ZonaTooltip;
