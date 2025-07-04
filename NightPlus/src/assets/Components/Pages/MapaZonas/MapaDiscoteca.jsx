import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlanoDiscoteca from './PlanoDiscoteca'; // Asegúrate de que la ruta sea correcta
// Importa CarritoCompra (si aún no lo haces, aunque no lo veo en este archivo, es el que usa CarritoCompra)
// import { CarritoCompra } from './CarritoCompra'; 

// --- ¡IMPORTANTE! REEMPLAZA ESTO CON EL ID REAL DEL USUARIO LOGUEADO ---
// Esto debe venir de tu sistema de autenticación (contexto, Redux, local storage, etc.)
const CURRENT_USER_ID = 1; // <--- VALOR DE PRUEBA. ¡CÁMBIALO POR EL ID DEL USUARIO LOGUEADO!

export const MapaDiscoteca = () => {
  const { idEvento: idEventoParam } = useParams();
  const [mostrarPrecios, setMostrarPrecios] = useState(true);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null); // Esto es para una sola zona seleccionada, no para el carrito múltiple
  const [evento, setEvento] = useState(null);
  const [error, setError] = useState(null);

  // Define la URL base de tu backend desplegado en Railway
  const BASE_URL = 'https://backendnight-production.up.railway.app'; // <--- ¡URL ACTUALIZADA AQUÍ!

  // Helper function to parse price strings to numbers
  const parsearPrecio = (precioStr) => {
    if (typeof precioStr === 'number') {
      return precioStr; // Ya es un número, devolverlo directamente
    }
    // Si es un string, intentar parsearlo
    return parseFloat(
      String(precioStr) // Asegúrate de que sea un string para .replace
        .replace(/[^0-9,.-]+/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
    );
  };

  // Helper function to format price for display
  const formatearPrecio = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);

  useEffect(() => {
    console.log(`MapaDiscoteca.jsx: idEvento obtenido de la URL: "${idEventoParam}" (Tipo: ${typeof idEventoParam})`);

    const numericId = parseInt(idEventoParam);

    if (idEventoParam && !Number.isNaN(numericId) && numericId > 0) {
      const apiUrl = `${BASE_URL}/servicio/evento/${numericId}`; // <--- URL ACTUALIZADA
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
  }, [idEventoParam]);

  const handleSeleccionarZona = (zona) => {
    // Es CRUCIAL que 'zona' que viene de PlanoDiscoteca tenga un 'id' numérico válido.
    console.log("Zona seleccionada recibida de PlanoDiscoteca:", zona);
    if (!zona || typeof zona.id === 'undefined' || zona.id === null) {
      console.error("Error: La zona seleccionada no tiene un ID válido.", zona);
      alert("No se pudo seleccionar la zona. Por favor, asegúrate de que tiene un ID.");
      return;
    }
    setZonaSeleccionada({
      ...zona,
      id: zona.id, // <--- Asegúrate que 'zona.id' NO ES UNDEFINED/NULL AQUÍ
      nombre: zona.nombre || 'ZONA DESCONOCIDA', // Fallback por si acaso
      precio: parsearPrecio(zona.precio), // Convertir a número
      cantidad: 1 // Default quantity to 1 when selected
    });
    console.log("Zona seleccionada establecida en estado:", { ...zona, id: zona.id, precio: parsearPrecio(zona.precio), cantidad: 1 });
  };

  const handleEliminarCarrito = () => {
    setZonaSeleccionada(null);
  };

  const finalizarCompra = async () => {
    console.log("MapaDiscoteca.jsx: Estado 'evento' al iniciar finalizarCompra:", evento);
    console.log("MapaDiscoteca.jsx: Valor de 'evento.idEvento' al iniciar finalizarCompra:", evento ? evento.idEvento : 'N/A');

    if (!zonaSeleccionada || typeof zonaSeleccionada.id === 'undefined' || zonaSeleccionada.id === null) {
      alert("Por favor, selecciona una zona válida para finalizar la compra. El ID de la zona no está definido.");
      console.error("MapaDiscoteca.jsx: ERROR - Zona seleccionada inválida o sin ID:", zonaSeleccionada);
      return;
    }

    if (!evento || !evento.idEvento) {
      console.error("MapaDiscoteca.jsx: ERROR - 'evento' o 'evento.idEvento' no están disponibles en finalizarCompra.");
      alert("No se pudo obtener la información del evento para procesar el pago. Por favor, recarga la página e intenta de nuevo.");
      return;
    }

    // --- CAMBIOS CRÍTICOS INICIO ---

    // 1. Define los tickets para la reserva, incluyendo zonaId
    const ticketsParaReserva = [{
        zonaId: zonaSeleccionada.id, // <-- ¡AHORA INCLUYE EL ID DE LA ZONA!
        quantity: zonaSeleccionada.cantidad,
        unitPrice: zonaSeleccionada.precio,
    }];

    // 2. Construye el objeto reservationDetails con todos los campos esperados por el backend
    const reservationDetails = {
        eventId: parseInt(evento.idEvento), // Convertir a Integer si es necesario para el backend
        userId: CURRENT_USER_ID, // Usar el ID del usuario logueado (CÁMBIALO!)
        tickets: ticketsParaReserva,
        totalAmount: zonaSeleccionada.precio * zonaSeleccionada.cantidad,
    };

    // 3. Construye el objeto items para Mercado Pago, asegurando un ID válido
    // Si zonaSeleccionada.id es numérico, lo usa. Si no, usa un fallback basado en el nombre.
    const itemId = String(zonaSeleccionada.id || `zone-${zonaSeleccionada.nombre.toLowerCase().replace(/ /g, '-')}-fallback`);

    const itemsParaMercadoPago = [{
        id: itemId, // <-- ¡AHORA SIEMPRE TENDRÁ UN VALOR DE STRING VÁLIDO!
        title: zonaSeleccionada.nombre,
        description: `Entrada para el sector ${zonaSeleccionada.nombre} (${zonaSeleccionada.tipo || 'N/A'})`,
        picture_url: "", // Usar snake_case
        quantity: zonaSeleccionada.cantidad,
        unit_price: zonaSeleccionada.precio, // Usar snake_case
        currency_id: "COP", // Usar snake_case
    }];

    // 4. Construye el objeto orderData que se envía al backend
    const orderData = {
      items: itemsParaMercadoPago,
      total: zonaSeleccionada.precio * zonaSeleccionada.cantidad,
      reservationDetails: reservationDetails, // <-- ESTE ES EL CAMPO QUE NECESITA TU BACKEND
    };

    // --- CAMBIOS CRÍTICOS FIN ---

    console.log("MapaDiscoteca.jsx: Datos a enviar a Mercado Pago:", JSON.stringify(orderData, null, 2));

    try {
      const response = await fetch(`${BASE_URL}/servicio/create-mercadopago-preference`, { // <--- URL ACTUALIZADA
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("MapaDiscoteca.jsx: Error detallado de la API al crear preferencia:", errorText);
        throw new Error(`Error al crear preferencia de pago: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const checkoutUrl = data.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error('MapaDiscoteca.jsx: No se recibió una URL de checkout de Mercado Pago.');
        alert('Hubo un problema al iniciar el proceso de pago. Intenta de nuevo.');
      }

    } catch (error) {
      console.error('MapaDiscoteca.jsx: Error en finalizarCompra:', error);
      alert(`Error al procesar la compra: ${error.message}`);
    }
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
                {evento.nombreEvento || 'Nombre de Evento no disponible'}
              </h2>
              <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                {evento.fecha || 'Fecha no disponible'} {evento.hora || 'Hora no disponible'}<br />
              </p>
              <p>La fiesta es en: {evento.discoteca?.nombre || 'Dirección no disponible'}</p>
              <br />
            </>
          ) : (
            <p>Cargando evento...</p>
          )}

          {/* Si usaras CarritoCompra aquí, lo pasarías el 'carrito' state y un onEliminarZona adecuado */}
          {/* Por ahora, mantengo tu lógica de zonaSeleccionada */}
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
              onClick={finalizarCompra}
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
              // Deshabilitar si no hay evento o if la zona seleccionada no tiene un ID válido
              disabled={!evento || !evento.idEvento || !zonaSeleccionada || typeof zonaSeleccionada.id === 'undefined' || zonaSeleccionada.id === null}
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
          {/* Aquí PlanoDiscoteca DEBE pasar un objeto 'zona' con un 'id' numérico */}
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

            {/* Estos son los datos de las zonas estáticas para mostrar precios.
                Asegúrate de que tus zonas en la base de datos (y las que carga PlanoDiscoteca)
                coincidan con estos colores y nombres/precios para una experiencia consistente.
            */}
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