// src/assets/Components/Pages/MapaZonas/MapaDiscoteca.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlanoDiscoteca from './PlanoDiscoteca'; // Asegúrate de que la ruta sea correcta

export const MapaDiscoteca = () => {
  const { idEvento } = useParams(); // Obtiene el ID del evento de la URL
  const [mostrarPrecios, setMostrarPrecios] = useState(true);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [evento, setEvento] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Este log te mostrará el ID exacto que recibió MapaDiscoteca de la URL.
    console.log(`MapaDiscoteca.jsx: idEvento obtenido de la URL: "${idEvento}" (Tipo: ${typeof idEvento})`);

    // Validamos que idEvento sea un número válido y no el string "undefined"
    // parseInt convertirá "3" a 3, pero "undefined" a NaN. Number.isNaN(NaN) es true.
    const numericId = parseInt(idEvento);

    if (idEvento && !Number.isNaN(numericId) && numericId > 0) { // Asegura que es un número positivo válido
      const apiUrl = `http://localhost:8080/servicio/evento/${numericId}`; // Usar numericId aquí
      console.log(`MapaDiscoteca.jsx: Realizando fetch a: ${apiUrl}`);

      fetch(apiUrl)
        .then(response => {
          console.log(`MapaDiscoteca.jsx: Respuesta de la API - Estado: ${response.status}`);
          if (!response.ok) {
            // Intenta leer el cuerpo de la respuesta para obtener más detalles del error del backend.
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
          // Actualiza el estado de error con el mensaje detallado.
          setError(`Error al cargar el evento: ${err.message}. Por favor, verifica los logs del servidor.`);
        });
    } else {
      console.warn("MapaDiscoteca.jsx: ID de evento inválido o no proporcionado. No se realizará la petición API.");
      setEvento(null); // Limpiar datos de evento si el ID no es válido
      setError("No se ha proporcionado un ID de evento válido para mostrar el mapa.");
    }
  }, [idEvento]); // Este efecto se re-ejecutará si el idEvento en la URL cambia

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
          height: 'calc(100vh - 40px)', // Ajustar altura para tener espacio para el margin
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between' // Para empujar los botones abajo
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
                <div style={{ fontSize: '14px' }}><strong>Precio:</strong> ${zonaSeleccionada.precio.toLocaleString()}</div>
              </div>
            </>
          ) : (
            <p style={{ fontSize: '14px' }}>No has seleccionado ninguna zona.</p>
          )}
        </div>

        {zonaSeleccionada && (
          <div style={{ marginTop: 'auto' }}> {/* Empuja esto hacia abajo */}
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
          </div>
        )}
      </div>

      {/* Plano y precios */}
      <div style={{ flex: 1, position: 'relative', paddingTop: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Mapa de la Discoteca</h2>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {/* Aquí podrías pasarle el ID del evento o los detalles del evento a PlanoDiscoteca si los necesita */}
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