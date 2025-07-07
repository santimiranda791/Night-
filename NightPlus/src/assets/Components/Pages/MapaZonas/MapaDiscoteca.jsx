import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PlanoDiscoteca from './PlanoDiscoteca';
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
    const [loadingUserId, setLoadingUserId] = useState(true); // Nuevo estado para indicar si se está cargando el userId

    const BASE_URL = 'https://backendnight-production.up.railway.app';

    // Función para obtener las cabeceras de autenticación
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    // useEffect para extraer el ID del usuario del token al cargar el componente
    useEffect(() => {
        console.log("MapaDiscoteca.jsx: useEffect para cargar ID de usuario - INICIO");
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // ¡¡¡ESTA ES LA LÍNEA MODIFICADA!!!
                // Antes: setCurrentUserId(decodedToken.idCliente);
                setCurrentUserId(decodedToken.idUsuario); // <-- CORRECCIÓN: Usar 'idUsuario'
                console.log("MapaDiscoteca.jsx: ID de usuario extraído del token:", decodedToken.idUsuario);
            } catch (e) {
                console.error("MapaDiscoteca.jsx: Error decodificando token JWT:", e);
                setCurrentUserId(null);
            }
        } else {
            console.warn("MapaDiscoteca.jsx: No hay token en localStorage. El usuario no está logueado.");
            setCurrentUserId(null); // Asegúrate de que el ID sea null si no hay token
        }
        setLoadingUserId(false); // Marcar que la carga del userId ha terminado
        console.log("MapaDiscoteca.jsx: useEffect para cargar ID de usuario - FIN");
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
        console.log(`MapaDiscoteca.jsx: idEvento obtained from URL: "${idEventoParam}" (Type: ${typeof idEventoParam})`);

        const numericId = parseInt(idEventoParam);

        if (idEventoParam && !Number.isNaN(numericId) && numericId > 0) {
            const apiUrl = `${BASE_URL}/servicio/evento/${numericId}`;
            console.log(`MapaDiscoteca.jsx: Fetching from: ${apiUrl}`);

            fetch(apiUrl)
                .then(response => {
                    console.log(`MapaDiscoteca.jsx: API Response - Status: ${response.status}`);
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`Could not load event with ID: ${numericId}. Status: ${response.status}. Backend message: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("MapaDiscoteca.jsx: Event data loaded successfully:", data);
                    setEvento(data);
                    setError(null);
                })
                .catch(err => {
                    console.error('MapaDiscoteca.jsx: Error loading event:', err);
                    setEvento(null);
                    setError(`Error loading event: ${err.message}. Please check server logs.`);
                });
        } else {
            console.warn("MapaDiscoteca.jsx: Invalid or missing event ID. No API request will be made.");
            setEvento(null);
            setError("No valid event ID provided to display the map.");
        }
    }, [idEventoParam]);

    const handleSeleccionarZona = (zona) => {
        if (!zona || (typeof zona.id === 'undefined' || zona.id === null)) {
            console.error("Error: Selected zone has no valid ID.", zona);
            alert("Could not select zone. Please ensure it has a unique ID.");
            return;
        }

        console.log("Zone selected received from PlanoDiscoteca:", zona);
        setZonaSeleccionada({
            ...zona,
            id: zona.id,
            nombre: zona.nombre || 'UNKNOWN ZONE',
            precio: parsearPrecio(zona.precio),
            cantidad: 1
        });
        console.log("Zone selected set in state:", { ...zona, id: zona.id, precio: parsearPrecio(zona.precio), cantidad: 1 });
    };

    const handleCantidadChange = (event) => {
        const newCantidad = parseInt(event.target.value);
        if (isNaN(newCantidad) || newCantidad < 1) {
            alert("La cantidad debe ser al menos 1.");
            return;
        }
        if (newCantidad > 3) {
            alert("Solo puedes seleccionar un máximo de 3 boletas.");
            return;
        }
        setZonaSeleccionada(prev => ({
            ...prev,
            cantidad: newCantidad
        }));
    };

    const handleEliminarCarrito = () => {
        setZonaSeleccionada(null);
    };

    const finalizarCompra = async () => {
        console.log("MapaDiscoteca.jsx: 'evento' state at start of finalizarCompra:", evento);
        console.log("MapaDiscoteca.jsx: 'evento.idEvento' value at start of finalizarCompra:", evento ? evento.idEvento : 'N/A');
        console.log("MapaDiscoteca.jsx: 'currentUserId' at start of finalizarCompra:", currentUserId);

        if (!zonaSeleccionada || typeof zonaSeleccionada.id === 'undefined' || zonaSeleccionada.id === null) {
            alert("Please select a valid zone to finalize the purchase. The zone ID is undefined.");
            console.error("MapaDiscoteca.jsx: ERROR - Invalid or missing zone ID:", zonaSeleccionada);
            return;
        }

        if (zonaSeleccionada.cantidad > 3) {
            alert("No puedes comprar más de 3 boletas por usuario.");
            return;
        }

        if (!evento || !evento.idEvento) {
            console.error("MapaDiscoteca.jsx: ERROR - 'evento' or 'evento.idEvento' are not available in finalizarCompra.");
            alert("Could not get event information to process payment. Please reload the page and try again.");
            return;
        }

        // --- VALIDACIÓN CRÍTICA: Asegurarse de que el usuario esté logueado ---
        if (currentUserId === null) {
            alert("Para finalizar la compra, debes iniciar sesión.");
            console.error("MapaDiscoteca.jsx: User ID is null. User is not logged in or token is invalid.");
            // Aquí podrías redirigir al login
            return;
        }


        let numericZonaId;
        if (typeof zonaSeleccionada.id === 'string' && ZONA_ID_FRONTEND_MAPPING[zonaSeleccionada.id.toLowerCase()]) {
            numericZonaId = ZONA_ID_FRONTEND_MAPPING[zonaSeleccionada.id.toLowerCase()];
            console.log(`MapaDiscoteca.jsx: Mapping frontend zone ID '${zonaSeleccionada.id}' to numeric '${numericZonaId}' for reservationDetails.`);
        } else {
            numericZonaId = parseInt(zonaSeleccionada.id);
            if (isNaN(numericZonaId)) {
                console.error("MapaDiscoteca.jsx: Invalid zone ID for numeric conversion. Expected a number or a mappable string.", zonaSeleccionada.id);
                alert("Internal error: The selected zone ID is not a valid number or is not mapped correctly. Check the console for more details.");
                return;
            }
        }

        const ticketsParaReserva = [{
            zonaId: numericZonaId,
            quantity: zonaSeleccionada.cantidad,
            unitPrice: zonaSeleccionada.precio,
        }];

        const reservationDetails = {
            eventId: parseInt(evento.idEvento),
            userId: currentUserId, // Usar el ID del usuario extraído del token
            tickets: ticketsParaReserva,
            totalAmount: zonaSeleccionada.precio * zonaSeleccionada.cantidad,
        };

        const itemIdForMercadoPago = String(zonaSeleccionada.id || `zone-${zonaSeleccionada.nombre.toLowerCase().replace(/ /g, '-')}-fallback`);

        const itemsParaMercadoPago = [{
            id: itemIdForMercadoPago,
            title: zonaSeleccionada.nombre,
            description: `Ticket for sector ${zonaSeleccionada.nombre} (${zonaSeleccionada.tipo || 'N/A'})`,
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

        console.log("MapaDiscoteca.jsx: Data to send to Mercado Pago:", JSON.stringify(orderData, null, 2));

        try {
            const response = await fetch(`${BASE_URL}/servicio/create-mercadopago-preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders(), 
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("MapaDiscoteca.jsx: Detailed API error creating preference:", errorText);
                throw new Error(`Error creating payment preference: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const checkoutUrl = data.checkoutUrl;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                console.error('MapaDiscoteca.jsx: No checkout URL received from Mercado Pago.');
                alert('There was a problem initiating the payment process. Please try again.');
            }

        } catch (error) {
            console.error('MapaDiscoteca.jsx: Error in finalizarCompra:', error);
            alert(`Error processing purchase: ${error.message}`);
        }
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
                            <h2>{evento.nombreEvento || 'Event name not available'}</h2>
                            <p>
                                {evento.fecha || 'Date not available'} {evento.hora || 'Time not available'}<br />
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
                            <h3>Cart ({zonaSeleccionada.cantidad})</h3>
                            <div className="selected-zone-details">
                                <div>
                                    <strong>Sector:</strong> {zonaSeleccionada.nombre}
                                </div>
                                <div><strong>Precio:</strong> {formatearPrecio(zonaSeleccionada.precio)}</div>
                                <div>
                                    <label htmlFor="cantidadBoletas"><strong>Cantidad:</strong></label>
                                    <input
                                        id="cantidadBoletas"
                                        type="number"
                                        min="1"
                                        max="3"
                                        value={zonaSeleccionada.cantidad}
                                        onChange={handleCantidadChange}
                                        style={{ width: '50px', marginLeft: '10px' }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                                <p>No hay zona seleccionada.</p>
                    )}
                </div>
                </div>

                {zonaSeleccionada && (
                    <div className="button-group">
                        <div className="total-display">
                            TOTAL: {formatearPrecio(zonaSeleccionada.precio * zonaSeleccionada.cantidad)}
                        </div>
                        <button
                            onClick={handleEliminarCarrito}
                            className="btn-remove-from-cart"
                        >
                            🗑️ Remover del carrito
                        </button>
                        <button
                            onClick={finalizarCompra}
                            className="btn-checkout"
                            // Deshabilitar si no hay evento, zona seleccionada, o si el ID del usuario no se ha cargado
                            disabled={!evento || !evento.idEvento || !zonaSeleccionada || typeof zonaSeleccionada.id === 'undefined' || zonaSeleccionada.id === null || currentUserId === null || loadingUserId}
                        >
                            Finalizar Compra
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};