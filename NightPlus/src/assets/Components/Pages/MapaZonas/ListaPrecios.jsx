import React from 'react';

const zonas = [
  { nombre: 'GENERAL', precio: '$ 30.000,00', color: '#f97316' },     // naranja
  { nombre: 'BACKSTAGE', precio: '$ 60.000,00', color: '#3b82f6' },   // azul
  { nombre: 'VIP', precio: '$ 80.000,00', color: '#eab308' }          // amarillo
];

const ListaPrecios = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '12px 16px',
      width: '180px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      fontSize: '14px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        marginBottom: '10px',
        cursor: 'pointer'
      }}>
        <span>Ocultar precios</span>
        <span style={{ transform: 'rotate(90deg)', fontWeight: 'normal' }}>⌄</span>
      </div>
      {zonas.map((zona) => (
        <div key={zona.nombre} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{
            width: '10px',
            height: '10px',
            backgroundColor: zona.color,
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '8px'
          }} />
          <span style={{ flex: 1, color: '#4b5563' }}>{zona.nombre}</span>
          <span style={{ fontWeight: 'bold', color: '#111827' }}>{zona.precio}</span>
        </div>
      ))}
    </div>
  );
};

export default ListaPrecios;
