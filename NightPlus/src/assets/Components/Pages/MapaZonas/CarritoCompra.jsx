// src/components/CarritoCompra.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CarritoCompra = ({ carrito, onEliminarZona, eventId, userId }) => {
  const navigate = useNavigate();

  const BASE_URL = 'https://backendnight-production.up.railway.app';

  const formatearPrecio = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);

  const parsearPrecio = (precioStr) =>
    parseFloat(
      precioStr
        .replace(/[^0-9,.-]+/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
    );

  // *** CAMBIO CLAVE 1: Inicializa 'cantidades' usando zona.id como clave ***
  const [cantidades, setCantidades] = useState(
    carrito.reduce((acc, zona) => ({ ...acc, [zona.id]: 1 }), {})
  );

  // *** CAMBIO CLAVE 2: Las funciones de cantidad ahora usan zonaId ***
  const aumentarCantidad = (zonaId) => {
    setCantidades((prev) => ({ ...prev, [zonaId]: prev[zonaId] + 1 }));
  };

  // *** CAMBIO CLAVE 3: Las funciones de cantidad ahora usan zonaId ***
  const disminuirCantidad = (zonaId) => {
    if (cantidades[zonaId] > 1) {
      setCantidades((prev) => ({ ...prev, [zonaId]: prev[zonaId] - 1 }));
    }
  };

  // *** CAMBIO CLAVE 4: Calcular total de zona usando zonaId ***
  const calcularTotalZona = (zonaId, precioUnitario) => precioUnitario * cantidades[zonaId];

  // *** CAMBIO CLAVE 5: Total general usa zona.id para calcular ***
  const totalGeneral = carrito.reduce((acc, zona) => {
    const precioUnitario = parsearPrecio(zona.precio);
    return acc + calcularTotalZona(zona.id, precioUnitario);
  }, 0);

  const finalizarCompra = async () => {
    if (!eventId) {
      alert("Error: ID del evento no disponible para la compra.");
      return;
    }

    const parsedUserId = userId ? parseInt(userId) : null;
    if (userId && isNaN(parsedUserId)) {
        alert("Error: ID de usuario inválido.");
        return;
    }
    
    const items = carrito.map((zona) => ({ // Eliminado 'index' de aquí
      id: String(zona.id), // Asegúrate de que id sea string para Mercado Pago
      title: zona.nombre,
      description: `Entrada para el sector ${zona.nombre} (${zona.tipo})`,
      picture_url: zona.imagen || "",
      quantity: cantidades[zona.id], // *** CAMBIO CLAVE 6: Usar zona.id para la cantidad ***
      unit_price: parsearPrecio(zona.precio),
      currency_id: "COP",
    }));

    const reservationDetails = {
      eventId: parseInt(eventId),
      userId: parsedUserId,
      tickets: carrito.map((zona) => ({ // Eliminado 'index' de aquí
        zonaId: zona.id,
        quantity: cantidades[zona.id], // *** CAMBIO CLAVE 7: Usar zona.id para la cantidad ***
        unitPrice: parsearPrecio(zona.precio),
      })),
      totalAmount: totalGeneral,
    };

    const orderData = {
      items: items,
      total: totalGeneral,
      reservationDetails: reservationDetails,
    };

    console.log("Datos enviados al backend:", JSON.stringify(orderData, null, 2));

    try {
      const response = await fetch(`${BASE_URL}/servicio/create-mercadopago-preference`, {
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
      const checkoutUrl = data.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
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

      {/* *** CAMBIO CLAVE 8: Usar zona.id como key en el map *** */}
      {carrito.map((zona) => { // Eliminar 'index' de aquí
        const precioUnitario = parsearPrecio(zona.precio);
        const totalZona = calcularTotalZona(zona.id, precioUnitario); // Usar zona.id aquí también

        return (
          <div key={zona.id} style={{ borderLeft: '4px solid orange', paddingLeft: '10px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#555' }}>Sector</div>
            <div style={{ fontWeight: 'bold' }}>{zona.nombre}</div>
            <div style={{ marginTop: '5px', fontSize: '12px', color: '#777' }}>{zona.tipo}</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>
              {formatearPrecio(precioUnitario)}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* *** CAMBIO CLAVE 9: Pasar zona.id a las funciones de cantidad *** */}
              <button onClick={() => disminuirCantidad(zona.id)} style={boton}>-</button>
              <input
                type="number"
                value={cantidades[zona.id]} // *** CAMBIO CLAVE 10: Leer cantidad usando zona.id ***
                readOnly
                style={{ width: '60px', textAlign: 'center' }}
              />
              {/* *** CAMBIO CLAVE 11: Pasar zona.id a las funciones de cantidad *** */}
              <button onClick={() => aumentarCantidad(zona.id)} style={boton}>+</button>
            </div>

            <div
              style={{ marginTop: '10px', color: "#18122B", cursor: 'pointer' }}
              onClick={() => onEliminarZona(zona.id)} // *** CAMBIO CLAVE 12: Pasar zona.id para eliminar ***
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
  color: 'white', /* Agregado para que se vea bien en los botones */
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer'
};