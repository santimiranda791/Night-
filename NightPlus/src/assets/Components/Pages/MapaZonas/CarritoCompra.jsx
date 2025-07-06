import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importa el nuevo archivo CSS
import '../../../../Styles/MapaDiscotecaResponsive.css';

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
            alert("Error: ID del evento no disponible para la compra.");
            return;
        }

        const parsedUserId = userId ? parseInt(userId) : null;
        if (userId && isNaN(parsedUserId)) {
            alert("Error: ID de usuario inválido.");
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
            userId: parsedUserId,
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
            >
                Finalizar compra
            </button>
        </div>
    );
};

// Se elimina la definición de 'boton' aquí ya que se manejará con CSS