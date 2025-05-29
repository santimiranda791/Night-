import React, { useState } from 'react';
import PlanoDiscoteca from './PlanoDiscoteca';
import { CarritoCompra } from './CarritoCompra';

export const MapaDiscoteca = () => {
  const [mostrarPrecios, setMostrarPrecios] = useState(true);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  const handleSeleccionarZona = (zona) => {
    setZonaSeleccionada(zona);
  };

  const handleEliminarCarrito = () => {
    setZonaSeleccionada(null);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: 'white' }}>Mapa de la Discoteca</h2>

      <PlanoDiscoteca onSeleccionarZona={handleSeleccionarZona} />

      {zonaSeleccionada && (
        <div style={{ position: 'fixed', bottom: '100px', right: '40px', zIndex: 1000 }}>
          <CarritoCompra zona={zonaSeleccionada} onEliminar={handleEliminarCarrito} />
        </div>
      )}

      {mostrarPrecios ? (
        <div style={{
          position: 'fixed',
          bottom: '87px',
          left: '350px',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '10px 14px',
          width: '259px',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          fontSize: '14px',
          zIndex: 1000
        }}>
          <div
            onClick={() => setMostrarPrecios(false)}
            style={{
              fontWeight: 'bold',
              marginBottom: '10px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Ocultar precios</span>
            <span>⌄</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#0ea5e9', borderRadius: '50%', marginRight: '8px' }}></span>
            <span style={{ flex: 1 }}>ZONA GENERAL</span>
            <span style={{ fontWeight: 'bold' }}>$ 50.000</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', marginRight: '8px' }}></span>
            <span style={{ flex: 1 }}>ZONA PREFERENCIAL</span>
            <span style={{ fontWeight: 'bold' }}>$ 80.000</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: '#1d4ed8', borderRadius: '50%', marginRight: '8px' }}></span>
            <span style={{ flex: 1 }}>ZONA VIP</span>
            <span style={{ fontWeight: 'bold' }}>$ 120.000</span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setMostrarPrecios(true)}
          style={{
            position: 'fixed',
            bottom: '87px',
            left: '350px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 1000
          }}
        >
          Mostrar precios <span style={{ transform: 'rotate(180deg)' }}>⌄</span>
        </button>
      )}
    </div>
  );
};
