// src/assets/Components/Pages/MapaZonas/MapaDiscoteca.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlanoDiscoteca from './PlanoDiscoteca'; // Asegúrate de que la ruta sea correcta

export const MapaDiscoteca = () => {
  const { idEvento } = useParams();
  const [mostrarPrecios, setMostrarPrecios] = useState(true);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [evento, setEvento] = useState(null);
  const [error, setError] = useState(null);

  // Helper function to parse price strings to numbers
  const parsearPrecio = (precioStr) =>
    parseFloat(
      precioStr
        .replace(/[^0-9,.-]+/g, '') // Remove non-numeric characters except comma/dot
        .replace(/\./g, '')         // Remove thousands separators (dots)
        .replace(',', '.')          // Replace comma with dot for decimal
    );

  // Helper function to format price for display (optional, can be kept)
  const formatearPrecio = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);


  useEffect(() => {
    console.log(`MapaDiscoteca.jsx: idEvento obtenido de la URL: "${idEvento}" (Tipo: ${typeof idEvento})`);

    const numericId = parseInt(idEvento);

    if (idEvento && !Number.isNaN(numericId) && numericId > 0) {
      const apiUrl = `http://localhost:8080/servicio/evento/${numericId}`;
      console.log(`MapaDiscoteca.jsx: Realizando fetch a: ${apiUrl}`);

      fetch(apiUrl)
        .then(response => {
          console.log(`MapaDiscoteca.jsx: Respuesta de la API - Estado: ${response.status}`);
          if (!response.ok) {
            return response.text().then(text => {
              throw new Error(`No se pudo cargar el evento con ID: ${numericId}. Estado: ${response.status}. Mensaje del backend: ${text}`);
            });
          }
          return response.json();
        })
        .then(data => {
          console.log("MapaDiscoteca.jsx: Datos del evento cargados con éxito:", data);
          setEvento(data);
          setError(null);
        })
        .catch(err => {
          console.error('MapaDiscoteca.jsx: Error al cargar el evento:', err);
          setEvento(null);
          setError(`Error al cargar el evento: ${err.message}. Por favor, verifica los logs del servidor.`);
        });
    } else {
      console.warn("MapaDiscoteca.jsx: ID de evento inválido o no proporcionado. No se realizará la petición API.");
      setEvento(null);
      setError("No se ha proporcionado un ID de evento válido para mostrar el mapa.");
    }
  }, [idEvento]);

  const handleSeleccionarZona = (zona) => {
    // When a zone is selected, ensure its price is parsed and quantity is 1
    setZonaSeleccionada({
      ...zona,
      precio: parsearPrecio(zona.precio), // Store as number
      cantidad: 1 // Default quantity to 1 when selected
    });
  };

  const handleEliminarCarrito = () => {
    setZonaSeleccionada(null);
  };

  // --- Mercado Pago Integration Logic ---
  const finalizarCompra = async () => {
    if (!zonaSeleccionada) {
      alert("Por favor, selecciona una zona para finalizar la compra.");
      return;
    }
    if (!evento || !evento.id) { // Ensure event data and ID are available
      alert("No se pudo obtener la información del evento para procesar el pago.");
      return;
    }

    // Prepare items for Mercado Pago (using a single item from zonaSeleccionada)
    const items = [{
      id: zonaSeleccionada.id || `zone-${zonaSeleccionada.nombre.toLowerCase().replace(' ', '-')}`, // Use zona ID or create one
      title: zonaSeleccionada.nombre,
      description: `Entrada para el sector ${zonaSeleccionada.nombre} (${zonaSeleccionada.tipo || 'N/A'})`,
      pictureUrl: "", // Add a picture URL if available for zones
      quantity: zonaSeleccionada.cantidad, // Should be 1
      unitPrice: zonaSeleccionada.precio, // Already parsed to number
      currencyId: "COP", // Assuming Colombian Pesos
    }];

    const totalCalculated = zonaSeleccionada.precio * zonaSeleccionada.cantidad; // Recalculate based on selected zone

    // Data structure for your backend, matching MercadoPagoCreatePreferenceRequest
    const orderData = {
      items: items,
      total: totalCalculated,
      eventId: evento.id.toString(), // Send event ID as string
    };

    try {
      const response = await fetch('http://localhost:8080/servicio/create-mercadopago-preference', {
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
  // --- End Mercado Pago Integration Logic ---


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
      {/* Columna de información del evento / carrito */}
      <div
        style={{
          width: '380px',
          background: 'linear-gradient(90deg, #1a1a1a 35%, #3b1c68)',
          color: 'white',
          borderRadius: '12px',
          margin: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          height: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {error ? (
            <p style={{ color: 'red', fontSize: '14px' }}>Error: {error}</p>
          ) : evento ? (
            <>
              <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
                {evento.nombreEvento}
              </h2>
              <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                {evento.fecha} {evento.hora}<br />
              </p>
              <p>La fiesta es en: {evento.discoteca?.nombre || 'Dirección no disponible'}</p>
              <br />
            </>
          ) : (
            <p>Cargando evento...</p>
          )}

          {zonaSeleccionada ? (
            <>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '20px' }}>Carrito (1)</h3>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                  <strong>Sector:</strong> {zonaSeleccionada.nombre}
                </div>
                <div style={{ fontSize: '14px' }}><strong>Precio:</strong> {formatearPrecio(zonaSeleccionada.precio)}</div>
              </div>
            </>
          ) : (
            <p style={{ fontSize: '14px' }}>No has seleccionado ninguna zona.</p>
          )}
        </div>

        {zonaSeleccionada && (
          <div style={{ marginTop: 'auto' }}>
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
                marginBottom: '10px',
                width: '100%'
              }}
            >
              🗑️ Eliminar del carrito
            </button>

            <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
              TOTAL: {formatearPrecio(zonaSeleccionada.precio)}
            </div>

            <button
              onClick={finalizarCompra} // Hooked up to the Mercado Pago logic!
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
          </div>
        )}
      </div>

      {/* Plano y precios */}
      <div style={{ flex: 1, position: 'relative', paddingTop: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Mapa de la Discoteca</h2>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PlanoDiscoteca onSeleccionarZona={handleSeleccionarZona} />
        </div>

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