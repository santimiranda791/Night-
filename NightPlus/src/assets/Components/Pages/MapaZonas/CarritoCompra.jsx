import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CarritoCompra = ({ carrito, onEliminarZona, eventId, userId }) => { // userId debe venir de tu contexto de usuario
  const navigate = useNavigate();

  // Define la URL base de tu backend desplegado en Railway
  const BASE_URL = 'https://backendnight-production.up.railway.app'; // <--- ¡URL ACTUALIZADA AQUÍ!

  const formatearPrecio = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);

  const parsearPrecio = (precioStr) =>
    parseFloat(
      precioStr
        .replace(/[^0-9,.-]+/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
    );

  // *** CAMBIO CLAVE AQUÍ: Usar zona.id como clave para cantidades ***
  const [cantidades, setCantidades] = useState(
    carrito.reduce((acc, zona) => ({ ...acc, [zona.id]: 1 }), {})
  );

  // *** CAMBIO CLAVE AQUÍ: Aceptar zonaId en lugar de index ***
  const aumentarCantidad = (zonaId) => {
    setCantidades((prev) => ({ ...prev, [zonaId]: prev[zonaId] + 1 }));
  };

  // *** CAMBIO CLAVE AQUÍ: Aceptar zonaId en lugar de index ***
  const disminuirCantidad = (zonaId) => {
    if (cantidades[zonaId] > 1) {
      setCantidades((prev) => ({ ...prev, [zonaId]: prev[zonaId] - 1 }));
    }
  };

  // *** CAMBIO CLAVE AQUÍ: Aceptar zonaId en lugar de index ***
  const calcularTotalZona = (zonaId, precioUnitario) => precioUnitario * cantidades[zonaId];

  const totalGeneral = carrito.reduce((acc, zona) => {
    const precioUnitario = parsearPrecio(zona.precio);
    // *** CAMBIO CLAVE AQUÍ: Usar zona.id para calcularTotalZona ***
    return acc + calcularTotalZona(zona.id, precioUnitario);
  }, 0);

  const finalizarCompra = async () => {
    // Validar que el eventId y userId no sean undefined/null antes de usarlos
    if (!eventId) {
      alert("Error: ID del evento no disponible para la compra.");
      return;
    }

    // Convertir userId a Integer o null si no existe.
    // Esto es crucial para evitar parseInt(undefined) -> NaN
    const parsedUserId = userId ? parseInt(userId) : null;
    if (userId && isNaN(parsedUserId)) { // Solo si userId no es null/undefined pero parseo falló
        alert("Error: ID de usuario inválido.");
        return;
    }
    
    // Detalles para Mercado Pago (items)
    const items = carrito.map((zona, index) => ({
      id: zona.id, // Asegúrate de que zona.id sea una cadena o número único y estable
      title: zona.nombre,
      description: `Entrada para el sector ${zona.nombre} (${zona.tipo})`,
      picture_url: zona.imagen || "",
      quantity: cantidades[zona.id], // Usar zona.id para la cantidad
      unit_price: parsearPrecio(zona.precio),
      currency_id: "COP",
    }));

    // Detalles para tu sistema de reservas (reservationDetails)
    const reservationDetails = {
      eventId: parseInt(eventId), // Aseguramos que sea un número
      userId: parsedUserId,       // Usamos el userId ya parseado o null
      tickets: carrito.map((zona) => ({ // Eliminar index de aquí
        zonaId: zona.id,
        quantity: cantidades[zona.id], // Usar zona.id para la cantidad
        unitPrice: parsearPrecio(zona.precio),
      })),
      totalAmount: totalGeneral,
    };

    const orderData = {
      items: items,
      total: totalGeneral,
      reservationDetails: reservationDetails,
    };

    console.log("Datos enviados al backend:", JSON.stringify(orderData, null, 2)); // Log más legible

    try {
      // Usa la URL base para construir la URL completa del endpoint
      const response = await fetch(`${BASE_URL}/servicio/create-mercadopago-preference`, { // <--- URL ACTUALIZADA
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

      {/* *** CAMBIO CLAVE AQUÍ: Usar zona.id como key *** */}
      {carrito.map((zona) => { // Eliminar index de aquí
        const precioUnitario = parsearPrecio(zona.precio);
        // *** CAMBIO CLAVE AQUÍ: Usar zona.id para calcularTotalZona ***
        const totalZona = calcularTotalZona(zona.id, precioUnitario);

        return (
          <div key={zona.id} style={{ borderLeft: '4px solid orange', paddingLeft: '10px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#555' }}>Sector</div>
            <div style={{ fontWeight: 'bold' }}>{zona.nombre}</div>
            <div style={{ marginTop: '5px', fontSize: '12px', color: '#777' }}>{zona.tipo}</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>
              {formatearPrecio(precioUnitario)}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* *** CAMBIO CLAVE AQUÍ: Pasa zona.id a las funciones *** */}
              <button onClick={() => disminuirCantidad(zona.id)} style={boton}>-</button>
              <input
                type="number"
                value={cantidades[zona.id]} // Usar zona.id para la cantidad
                readOnly
                style={{ width: '60px', textAlign: 'center' }}
              />
              {/* *** CAMBIO CLAVE AQUÍ: Pasa zona.id a las funciones *** */}
              <button onClick={() => aumentarCantidad(zona.id)} style={boton}>+</button>
            </div>

            <div
              style={{ marginTop: '10px', color: "#18122B", cursor: 'pointer' }}
              onClick={() => onEliminarZona(zona.id)} // Pasa el ID de la zona para eliminar
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