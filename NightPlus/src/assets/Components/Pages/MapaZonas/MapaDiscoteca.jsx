import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlanoDiscoteca from './PlanoDiscoteca';
// Importa el nuevo archivo CSS
import '../../../../Styles/MapaDiscotecaResponsive.css';

const CURRENT_USER_ID = 1; // <--- VALOR DE PRUEBA. ¡CÁMBIALO POR EL ID DEL USUARIO LOGUEADO!

// Nuevo mapeo: Convierte los IDs de zona de texto a IDs numéricos para enviar al backend
// Es crucial que estos números coincidan con los IDs de tus zonas en la base de datos o sean consistentes.
const ZONA_ID_FRONTEND_MAPPING = {
    "general": 1, // Ejemplo: "general" se mapea al ID numérico 1
    "preferencial": 2, // ¡Añadido! Asegúrate que "2" sea el ID correcto en tu DB para esta zona.
    "vip": 3,          // Ejemplo: si tienes una zona VIP con ID 3 en tu DB.
    // Agrega más mapeos aquí si tienes otras zonas con IDs de texto en tu frontend.
    // Por ejemplo: "palco": 4, etc.
};

export const MapaDiscoteca = () => {
    const { idEvento: idEventoParam } = useParams();
    const [mostrarPrecios, setMostrarPrecios] = useState(true);
    const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
    const [evento, setEvento] = useState(null);
    const [error, setError] = useState(null);

    const BASE_URL = 'https://backendnight-production.up.railway.app';

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
        // Asegúrate de que la zona tenga un ID válido antes de seleccionarla
        if (!zona || (typeof zona.id === 'undefined' || zona.id === null)) {
            console.error("Error: La zona seleccionada no tiene un ID válido.", zona);
            alert("No se pudo seleccionar la zona. Por favor, asegúrate de que tiene un ID único.");
            return;
        }

        console.log("Zona seleccionada recibida de PlanoDiscoteca:", zona);
        setZonaSeleccionada({
            ...zona,
            id: zona.id, // Asegura que el ID esté correctamente asignado (puede ser string como "general")
            nombre: zona.nombre || 'ZONA DESCONOCIDA',
            precio: parsearPrecio(zona.precio),
            cantidad: 1 // Si siempre se añade 1 al principio
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

        let numericZonaId;
        if (typeof zonaSeleccionada.id === 'string' && ZONA_ID_FRONTEND_MAPPING[zonaSeleccionada.id.toLowerCase()]) {
            numericZonaId = ZONA_ID_FRONTEND_MAPPING[zonaSeleccionada.id.toLowerCase()];
            console.log(`MapaDiscoteca.jsx: Mapeando ID de zona de frontend '${zonaSeleccionada.id}' a numérico '${numericZonaId}' para reservationDetails.`);
        } else {
            numericZonaId = parseInt(zonaSeleccionada.id);
            if (isNaN(numericZonaId)) {
                // Este es el error que estás viendo actualmente, y esta alerta se disparará.
                console.error("MapaDiscoteca.jsx: ID de zona no válido para conversión numérica. Se esperaba un número o una cadena mapeable.", zonaSeleccionada.id);
                alert("Error interno: El ID de la zona seleccionada no es un número válido o no está mapeado correctamente. Revisa la consola para más detalles.");
                return;
            }
        }

        const ticketsParaReserva = [{
            zonaId: numericZonaId, // Usa el ID numérico aquí, requerido por el backend (Integer)
            quantity: zonaSeleccionada.cantidad,
            unitPrice: zonaSeleccionada.precio,
        }];

        const reservationDetails = {
            eventId: parseInt(evento.idEvento),
            userId: CURRENT_USER_ID,
            tickets: ticketsParaReserva,
            totalAmount: zonaSeleccionada.precio * zonaSeleccionada.cantidad,
        };

        const itemIdForMercadoPago = String(zonaSeleccionada.id || `zone-${zonaSeleccionada.nombre.toLowerCase().replace(/ /g, '-')}-fallback`);

        const itemsParaMercadoPago = [{
            id: itemIdForMercadoPago, // Este ID es para Mercado Pago. Tu backend lo maneja.
            title: zonaSeleccionada.nombre,
            description: `Entrada para el sector ${zonaSeleccionada.nombre} (${zonaSeleccionada.tipo || 'N/A'})`,
            picture_url: "",
            quantity: zonaSeleccionada.cantidad,
            unit_price: zonaSeleccionada.precio,
            currency_id: "COP",
        }];

        const orderData = {
            items: itemsParaMercadoPago,
            total: zonaSeleccionada.precio * zonaSeleccionada.cantidad,
            reservationDetails: reservationDetails,
        };

        console.log("MapaDiscoteca.jsx: Datos a enviar a Mercado Pago:", JSON.stringify(orderData, null, 2));

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
        <div className="mapa-discoteca-container">
            {/* Sección del Mapa (Order 1 en móvil) */}
            <div className="map-section">
                <h2>Mapa de la Discoteca</h2>

                <div className="plano-discoteca-wrapper-outer">
                    <PlanoDiscoteca onSeleccionarZona={handleSeleccionarZona} />
                </div>

                {/* Contenedor para la leyenda de precios/botón de precios */}
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
                            {/* Hardcodeado aquí, idealmente esto vendría de una prop o un estado */}
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

            {/* Panel de Información / Carrito (Order 2 en móvil) */}
            <div className="info-panel">
                <div> {/* Contenedor para el contenido superior del panel */}
                    {error ? (
                        <p className="error-message">Error: {error}</p>
                    ) : evento ? (
                        <>
                            <h2>{evento.nombreEvento || 'Nombre de Evento no disponible'}</h2>
                            <p>
                                {evento.fecha || 'Fecha no disponible'} {evento.hora || 'Hora no disponible'}<br />
                            </p>
                            <p>La fiesta es en: {evento.discoteca?.nombre || 'Dirección no disponible'}</p>
                            <br />
                        </>
                    ) : (
                        <p>Cargando evento...</p>
                    )}

                    <div className="cart-summary">
                        {zonaSeleccionada ? (
                            <>
                                <h3>Carrito (1)</h3>
                                <div className="selected-zone-details">
                                    <div>
                                        <strong>Sector:</strong> {zonaSeleccionada.nombre}
                                    </div>
                                    <div><strong>Precio:</strong> {formatearPrecio(zonaSeleccionada.precio)}</div>
                                </div>
                            </>
                        ) : (
                            <p>No has seleccionado ninguna zona.</p>
                        )}
                    </div>
                </div>

                {zonaSeleccionada && (
                    <div className="button-group">
                        <div className="total-display">
                            TOTAL: {formatearPrecio(zonaSeleccionada.precio)}
                        </div>
                        <button
                            onClick={handleEliminarCarrito}
                            className="btn-remove-from-cart"
                        >
                            🗑️ Eliminar del carrito
                        </button>
                        <button
                            onClick={finalizarCompra}
                            className="btn-checkout"
                            disabled={!evento || !evento.idEvento || !zonaSeleccionada || typeof zonaSeleccionada.id === 'undefined' || zonaSeleccionada.id === null}
                        >
                            Finalizar compra
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};