import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlanoDiscoteca from './PlanoDiscoteca';
import { CarritoCompra } from './CarritoCompra'; // Importa el componente CarritoCompra
import '../../../../Styles/MapaDiscotecaResponsive.css';
import { jwtDecode } from 'jwt-decode'; // Importa jwt-decode

// IMPORTANT: Ensure these numeric IDs match your database zone IDs.
const ZONA_ID_FRONTEND_MAPPING = {
    "general": 1,
    "preferencial": 2,
    "vip": 3,
    // Add more mappings here for any other text-based zone IDs from PlanoDiscoteca.
};

export const MapaDiscoteca = () => {
    const { idEvento: idEventoParam } = useParams();
    const [mostrarPrecios, setMostrarPrecios] = useState(true);
    const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
    const [evento, setEvento] = useState(null);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null); // Estado para el ID del usuario logueado

    const BASE_URL = 'https://backendnight-production.up.railway.app';

    // Efecto para extraer el ID del usuario del token al cargar el componente
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Asegúrate de que el campo en tu token sea 'id_cliente' o 'idCliente' o 'idUsuario'
                // Basado en tu log de login, el campo es 'idCliente'
                setCurrentUserId(decodedToken.idCliente); 
                console.log("MapaDiscoteca.jsx: ID de usuario extraído del token:", decodedToken.idCliente);
            } catch (e) {
                console.error("MapaDiscoteca.jsx: Error decodificando token JWT:", e);
                setCurrentUserId(null);
            }
        } else {
            console.warn("MapaDiscoteca.jsx: No hay token en localStorage. El usuario no está logueado.");
            setCurrentUserId(null); // Asegúrate de que el ID sea null si no hay token
        }
    }, []); // Se ejecuta solo una vez al montar el componente

    const parsearPrecio = (precioStr) => {
        if (typeof precioStr === 'number') {
            return precioStr;
        }
        return parseFloat(
            String(precioStr)
                .replace(/[^0-9,.-]+/g, '')
                .replace(/\./g, '')
                .replace(',', '.')
        );
    };

    const formatearPrecio = (valor) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);

    useEffect(() => {
        console.log(`MapaDiscoteca.jsx: idEvento obtenido de la URL: "${idEventoParam}" (Tipo: ${typeof idEventoParam})`);

        const numericId = parseInt(idEventoParam);

        if (idEventoParam && !Number.isNaN(numericId) && numericId > 0) {
            const apiUrl = `${BASE_URL}/servicio/evento/${numericId}`;
            console.log(`MapaDiscoteca.jsx: Obteniendo datos de: ${apiUrl}`);

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
                    console.log("MapaDiscoteca.jsx: Datos del evento cargados exitosamente:", data);
                    setEvento(data);
                    setError(null);
                })
                .catch(err => {
                    console.error('MapaDiscoteca.jsx: Error al cargar el evento:', err);
                    setEvento(null);
                    setError(`Error al cargar el evento: ${err.message}. Por favor, revisa los logs del servidor.`);
                });
        } else {
            console.warn("MapaDiscoteca.jsx: ID de evento inválido o faltante. No se realizará ninguna solicitud a la API.");
            setEvento(null);
            setError("No se proporcionó un ID de evento válido para mostrar el mapa.");
        }
    }, [idEventoParam]);

    const handleSeleccionarZona = (zona) => {
        if (!zona || (typeof zona.id === 'undefined' || zona.id === null)) {
            console.error("Error: La zona seleccionada no tiene un ID válido.", zona);
            alert("No se pudo seleccionar la zona. Asegúrate de que tenga un ID único.");
            return;
        }

        console.log("Zona seleccionada recibida de PlanoDiscoteca:", zona);
        setZonaSeleccionada({
            ...zona,
            id: zona.id,
            nombre: zona.nombre || 'ZONA DESCONOCIDA',
            precio: parsearPrecio(zona.precio),
            cantidad: 1
        });
        console.log("Zona seleccionada establecida en el estado:", { ...zona, id: zona.id, precio: parsearPrecio(zona.precio), cantidad: 1 });
    };

    const handleEliminarCarrito = () => {
        setZonaSeleccionada(null);
    };

    return (
        <div className="mapa-discoteca-container">
            <div className="map-section">
                <h2>Mapa de la Discoteca</h2>

                <div className="plano-discoteca-wrapper-outer">
                    <PlanoDiscoteca onSeleccionarZona={handleSeleccionarZona} />
                </div>

                <div className="map-legend-controls">
                    {mostrarPrecios ? (
                        <div className="price-legend-panel">
                            <div
                                onClick={() => setMostrarPrecios(false)}
                                className="toggle-button"
                            >
                                <span>Ocultar precios</span>
                                <span>⌄</span>
                            </div>
                            <div className="price-item">
                                <span className="color-dot" style={{ backgroundColor: '#0ea5e9' }}></span>
                                <span className="zone-name">ZONA GENERAL</span>
                                <span className="zone-price">$ 50.000</span>
                            </div>
                            <div className="price-item">
                                <span className="color-dot" style={{ backgroundColor: '#ef4444' }}></span>
                                <span className="zone-name">ZONA PREFERENCIAL</span>
                                <span className="zone-price">$ 80.000</span>
                            </div>
                            <div className="price-item">
                                <span className="color-dot" style={{ backgroundColor: '#1d4ed8' }}></span>
                                <span className="zone-name">ZONA VIP</span>
                                <span className="zone-price">$ 120.000</span>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setMostrarPrecios(true)}
                            className="show-prices-button"
                        >
                            Mostrar precios <span style={{ transform: 'rotate(180deg)' }}>⌄</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="info-panel">
                <div>
                    {error ? (
                        <p className="error-message">Error: {error}</p>
                    ) : evento ? (
                        <>
                            <h2>{evento.nombreEvento || 'Nombre del evento no disponible'}</h2>
                            <p>
                                {evento.fecha || 'Fecha no disponible'} {evento.hora || 'Hora no disponible'}<br />
                            </p>
                            <p>La fiesta es en: {evento.discoteca?.nombre || 'Dirección no disponible'}</p>
                            <br />
                        </>
                    ) : (
                        <p>Cargando evento...</p>
                    )}

                    {/* Renderiza CarritoCompra y pasa las props necesarias */}
                    {zonaSeleccionada ? (
                        <CarritoCompra
                            carrito={[zonaSeleccionada]} // Pasa la zona seleccionada como un array al carrito
                            onEliminarZona={handleEliminarCarrito}
                            eventId={evento ? evento.idEvento : null}
                            userId={currentUserId} // <-- ¡PASANDO EL currentUserId AQUÍ!
                        />
                    ) : (
                        <p>No hay zona seleccionada.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
