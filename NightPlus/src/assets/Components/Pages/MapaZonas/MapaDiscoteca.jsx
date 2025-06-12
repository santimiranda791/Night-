import React, { useState } from 'react';
import PlanoDiscoteca from './PlanoDiscoteca';
import  {CarritoCompra}  from './CarritoCompra';
import { ResumenCompra } from './ResumenCompra';


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
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'linear-gradient(to right, #121212, #2a0845)',
        fontFamily: 'Poppins, sans-serif',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      {/* Carrito a la izquierda */}
      <div
        style={{
          width: '380px',
          background: 'linear-gradient(90deg, #1a1a1a 35%, #3b1c68)',
          color: 'white',
          borderRadius: '12px',
          margin: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          height: '100%'
        }}
      >
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Pa' Que Retozen - DJ Tian</h2>
        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
          13 de jun de 2025, 9:00 p. m. - 14 de jun de 2025, 5:00 a. m.<br />
          Neiva, Carrera 16 #4156, Comuna 2, Neiva, Huila, Colombia
        </p>

        {zonaSeleccionada ? (
          <>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '80px' }}>Carrito (1)</h3>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                <strong>Sector:</strong> {zonaSeleccionada.nombre}
              </div>
              <div style={{ fontSize: '14px' }}><strong>Precio:</strong> ${zonaSeleccionada.precio.toLocaleString()}</div>
            </div>

            <button
              onClick={handleEliminarCarrito}
              style={{
                backgroundColor: '#500073',
                color: 'white',
                padding: '6px 10px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '30px',
                marginTop: '490px',
              }}
            >
              🗑️ Eliminar del carrito
            </button>

          

            <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              TOTAL: ${zonaSeleccionada.precio.toLocaleString()}
            </div>

            <button
              style={{
                backgroundColor: '#500073',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '6px',    
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              Finalizar compra
            </button>
          </>
        ) : (
          <p style={{ fontSize: '14px' }}>No has seleccionado ninguna zona.</p>
        )}
      </div>

      {/* Plano y precios */}
      <div style={{ flex: 1, position: 'relative', paddingTop: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', }}>Mapa de la Discoteca</h2>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PlanoDiscoteca onSeleccionarZona={handleSeleccionarZona} />
        </div>

        {/* Cuadro de precios */}
        {mostrarPrecios ? (
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '12px',
              padding: '14px 18px',
              width: '260px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              fontSize: '14px'
            }}
          >
            <div
              onClick={() => setMostrarPrecios(false)}
              style={{
                fontWeight: 'bold',
                marginBottom: '12px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>Ocultar precios</span>
              <span>⌄</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#0ea5e9', borderRadius: '50%', marginRight: '8px' }}></span>
              <span style={{ flex: 1 }}>ZONA GENERAL</span>
              <span style={{ fontWeight: 'bold' }}>$ 50.000</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
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
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Mostrar precios <span style={{ transform: 'rotate(180deg)' }}>⌄</span>
          </button>
        )}
      </div>
    </div>
  );
};
