import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CarritoCompra = ({ carrito, onEliminarZona }) => {
  const navigate = useNavigate();

  const formatearPrecio = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);

  const parsearPrecio = (precioStr) =>
    parseFloat(
      precioStr
        .replace(/[^0-9,.-]+/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
    );

  const [cantidades, setCantidades] = useState(
    carrito.reduce((acc, zona, i) => ({ ...acc, [i]: 1 }), {})
  );

  const aumentarCantidad = (index) => {
    setCantidades((prev) => ({ ...prev, [index]: prev[index] + 1 }));
  };

  const disminuirCantidad = (index) => {
    if (cantidades[index] > 1) {
      setCantidades((prev) => ({ ...prev, [index]: prev[index] - 1 }));
    }
  };

  const calcularTotalZona = (index, precioUnitario) => precioUnitario * cantidades[index];

  const totalGeneral = carrito.reduce((acc, zona, i) => {
    const precioUnitario = parsearPrecio(zona.precio);
    return acc + calcularTotalZona(i, precioUnitario);
  }, 0);

  const finalizarCompra = async () => {
    // Prepare items for Mercado Pago
    const items = carrito.map((zona, index) => ({
      title: zona.nombre,
      unit_price: parsearPrecio(zona.precio),
      quantity: cantidades[index],
      currency_id: "COP", // Assuming Colombian Pesos
      picture_url: zona.imagen || "", // Add an image if available
      description: `Entrada para el sector ${zona.nombre} (${zona.tipo})`,
    }));

    // Example of data structure for your backend
    const orderData = {
      items: items,
      total: totalGeneral,
      // You might also want to send buyer info, event ID, etc.
      // buyer_info: { email: 'user@example.com' },
      // event_id: 'some-event-id',
    };

    try {
      const response = await fetch('http://localhost:8080/servicio/create-mercadopago-preference', { // <-- Endpoint en tu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear preferencia de pago: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const checkoutUrl = data.checkoutUrl; // Assuming your backend returns a 'checkoutUrl'

      if (checkoutUrl) {
        window.location.href = checkoutUrl; // Redirect to Mercado Pago
      } else {
        console.error('No se recibió una URL de checkout de Mercado Pago.');
        alert('Hubo un problema al iniciar el proceso de pago. Intenta de nuevo.');
      }

    } catch (error) {
      console.error('Error en finalizarCompra:', error);
      alert(`Error al procesar la compra: ${error.message}`);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '20px',
      marginTop: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      width: '320px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3>Carrito ({carrito.length})</h3>

      {carrito.map((zona, index) => {
        const precioUnitario = parsearPrecio(zona.precio);
        const totalZona = calcularTotalZona(index, precioUnitario);

        return (
          <div key={index} style={{ borderLeft: '4px solid orange', paddingLeft: '10px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#555' }}>Sector</div>
            <div style={{ fontWeight: 'bold' }}>{zona.nombre}</div>
            <div style={{ marginTop: '5px', fontSize: '12px', color: '#777' }}>{zona.tipo}</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>
              {formatearPrecio(precioUnitario)}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => disminuirCantidad(index)} style={boton}>-</button>
              <input
                type="number"
                value={cantidades[index]}
                readOnly
                style={{ width: '60px', textAlign: 'center' }}
              />
              <button onClick={() => aumentarCantidad(index)} style={boton}>+</button>
            </div>

            <div
              style={{ marginTop: '10px',  color: "#18122B", cursor: 'pointer' }}
              onClick={() => onEliminarZona(index)}
            >
              🗑️ Eliminar del carrito
            </div>

            <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
              Total: {formatearPrecio(totalZona)}
            </div>
          </div>
        );
      })}

      <hr style={{ margin: '20px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
        <span>Total general</span>
        <span>{formatearPrecio(totalGeneral)}</span>
      </div>

      <button
        onClick={finalizarCompra}
        style={{
          marginTop: '10px',
          width: '100%',
          backgroundColor: 'black',
          color: '#fff',
          padding: '10px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
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
  backgroundColor: 'black',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer'
};