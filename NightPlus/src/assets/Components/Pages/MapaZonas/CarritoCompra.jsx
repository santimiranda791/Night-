import React, { useState } from 'react';

export const CarritoCompra = ({ zona, onEliminar }) => {
  const [cantidad, setCantidad] = useState(1);

  // Extraer número de la cadena de precio y convertirlo a número
const precioUnitario = parseFloat(
  zona.precio
    .replace(/[^0-9,.-]+/g, '') // elimina símbolos de moneda y espacios
    .replace(/\./g, '')         // elimina punto de separador de miles
    .replace(',', '.')          // convierte la coma decimal en punto
);
  const total = precioUnitario * cantidad;

  const formatearPrecio = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);

  const aumentarCantidad = () => {
    setCantidad(cantidad + 1);
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '20px',
      marginTop: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      width: '300px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3>Carrito (1)</h3>

      <div style={{ borderLeft: '4px solid orange', paddingLeft: '10px' }}>
        <div style={{ fontSize: '12px', color: '#555' }}>Sector</div>
        <div style={{ fontWeight: 'bold' }}>{zona.nombre}</div>
        <div style={{ marginTop: '5px', fontSize: '12px', color: '#777' }}>{zona.tipo}</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>
          {formatearPrecio(precioUnitario)}
        </div>

        <div style={{
          marginTop: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <button onClick={disminuirCantidad} style={boton}>-</button>
          <input
            type="number"
            value={cantidad}
            readOnly
            style={{ width: '60px', textAlign: 'center' }}
          />
          <button onClick={aumentarCantidad} style={boton}>+</button>
        </div>

        <div
          style={{ marginTop: '10px', color: 'red', cursor: 'pointer' }}
          onClick={onEliminar}
        >
          🗑️ Eliminar del carrito
        </div>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
        <span>Total</span>
        <span>{formatearPrecio(total)}</span>
      </div>

      <button style={{
        marginTop: '10px',
        width: '100%',
        backgroundColor: '#f50057',
        color: '#fff',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Finalizar compra
      </button>
    </div>
  );
};

const boton = {
  width: '32px',
  height: '32px',
  fontSize: '18px',
  fontWeight: 'bold',
  backgroundColor: '#f3f4f6',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer'
};
