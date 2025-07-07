import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa Swal para feedback al usuario
// Importa el nuevo archivo CSS
import '../../../../Styles/MapaDiscotecaResponsive.css';

export const CarritoCompra = ({ carrito, onEliminarZona, eventId, userId }) => {
    const navigate = useNavigate();
    const BASE_URL = 'https://backendnight-production.up.railway.app';

    const formatearPrecio = (valor) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor);

    const parsearPrecio = (precioStr) =>
        parseFloat(
            String(precioStr)
                .replace(/[^0-9,.-]+/g, '')
                .replace(/\./g, '')
                .replace(',', '.')
        );

    const [cantidades, setCantidades] = useState(
        carrito.reduce((acc, zona) => ({ ...acc, [zona.id]: 1 }), {})
    );

    const aumentarCantidad = (zonaId) => {
        setCantidades((prev) => ({ ...prev, [zonaId]: prev[zonaId] + 1 }));
    };

    const disminuirCantidad = (zonaId) => {
        if (cantidades[zonaId] > 1) {
            setCantidades((prev) => ({ ...prev, [zonaId]: prev[zonaId] - 1 }));
        }
    };

    const calcularTotalZona = (zonaId, precioUnitario) => precioUnitario * cantidades[zonaId];

    const totalGeneral = carrito.reduce((acc, zona) => {
        const precioUnitario = parsearPrecio(zona.precio);
        return acc + calcularTotalZona(zona.id, precioUnitario);
    }, 0);

    const finalizarCompra = async () => {
        if (!eventId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ID del evento no disponible para la compra.',
                background: '#000',
                color: '#fff'
            });
            return;
        }

        // --- VALIDACIÓN CRÍTICA: Asegurarse de que el usuario esté logueado ---
        if (userId === null || typeof userId === 'undefined') {
            Swal.fire({
                imageUrl: '/logitotriste.png',
                imageWidth: 130,
                imageHeight: 130,
                background: '#000',
                color: '#fff',
                title: "No Autorizado",
                text: "Para finalizar la compra, debes iniciar sesión.",
            });
            // Opcionalmente, puedes redirigir al login si lo deseas
            // navigate('/login');
            return;
        }
        
        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'ID de usuario inválido. Por favor, intenta iniciar sesión de nuevo.',
                background: '#000',
                color: '#fff'
            });
            return;
        }

        const items = carrito.map((zona) => ({
            id: String(zona.id),
            title: zona.nombre,
            description: `Entrada para el sector ${zona.nombre} (${zona.tipo})`,
            picture_url: zona.imagen || "",
            quantity: cantidades[zona.id],
            unit_price: parsearPrecio(zona.precio),
            currency_id: "COP",
        }));

        const reservationDetails = {
            eventId: parseInt(eventId),
            userId: parsedUserId, // ¡Usa el userId parseado de las props!
            tickets: carrito.map((zona) => ({
                zonaId: zona.id,
                quantity: cantidades[zona.id],
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
                    // No necesitas enviar el token aquí si MercadoPagoController no lo requiere
                    // (ya que el userId va en el body). Si tu backend lo usa para validación general, puedes añadirlo.
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al iniciar el proceso de pago. Intenta de nuevo.',
                    background: '#000',
                    color: '#fff'
                });
            }

        } catch (error) {
            console.error('Error en finalizarCompra:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al procesar la compra: ${error.message}`,
                background: '#000',
                color: '#fff'
            });
        }
    };

    return (
        <div className="carrito-compra-card"> {/* Aplica la clase principal del carrito */}
            <h3>Carrito ({carrito.length})</h3>

            {carrito.map((zona) => {
                const precioUnitario = parsearPrecio(zona.precio);
                const totalZona = calcularTotalZona(zona.id, precioUnitario);

                return (
                    <div key={zona.id} className="carrito-item"> {/* Aplica la clase para cada ítem */}
                        <div className="carrito-item-sector-label">Sector</div>
                        <div className="carrito-item-name">{zona.nombre}</div>
                        <div className="carrito-item-type">{zona.tipo}</div>
                        <div className="carrito-item-price">
                            {formatearPrecio(precioUnitario)}
                        </div>

                        <div className="cantidad-controls"> {/* Agrupa los controles de cantidad */}
                            <button onClick={() => disminuirCantidad(zona.id)} className="cantidad-btn">-</button>
                            <input
                                type="number"
                                value={cantidades[zona.id]}
                                readOnly
                                className="cantidad-input"
                            />
                            <button onClick={() => aumentarCantidad(zona.id)} className="cantidad-btn">+</button>
                        </div>

                        <div
                            className="eliminar-item"
                            onClick={() => onEliminarZona(zona.id)}
                        >
                            🗑️ Eliminar del carrito
                        </div>

                        <div className="carrito-item-total">
                            Total: {formatearPrecio(totalZona)}
                        </div>
                    </div>
                );
            })}

            <div className="total-general-section"> {/* Aplica la clase para el total general */}
                <span>Total general</span>
                <span>{formatearPrecio(totalGeneral)}</span>
            </div>

            <button
                onClick={finalizarCompra}
                className="finalizar-compra-btn" /* Aplica la clase para el botón finalizar compra */
                disabled={!eventId || !carrito.length || userId === null || typeof userId === 'undefined'} // Deshabilitar si no hay evento, carrito vacío, o ID de usuario no cargado
            >
                Finalizar compra
            </button>
        </div>
    );
};
