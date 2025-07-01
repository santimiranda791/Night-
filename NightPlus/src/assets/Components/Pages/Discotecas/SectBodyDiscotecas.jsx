import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import '../../../../Styles/Discotecas.css'; // Asegúrate de que esta ruta sea correcta

export const SectBodyDiscotecas = () => {
    const navigate = useNavigate(); // Inicializa useNavigate
    const [discotecas, setDiscotecas] = useState([]);
    const [error, setError] = useState(null);
    const [selectedDiscoteca, setSelectedDiscoteca] = useState(null);
    const [discotecaEvents, setDiscotecaEvents] = useState([]); // Nuevo estado para los eventos
    const [eventsLoading, setEventsLoading] = useState(false); // Estado para la carga de eventos
    const [eventsError, setEventsError] = useState(null); // Estado para errores de eventos

    useEffect(() => {
        // Carga inicial de todas las discotecas
        fetch('http://localhost:8080/servicio/discotecas-list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener la lista de discotecas');
                }
                return response.json();
            })
            .then(data => {
                setDiscotecas(data);
            })
            .catch(error => {
                setError(error.message);
            });
    }, []);

    // Nuevo useEffect para cargar eventos cuando se selecciona una discoteca
    useEffect(() => {
        if (selectedDiscoteca) {
            setEventsLoading(true);
            setEventsError(null);
            fetch(`http://localhost:8080/servicio/eventos-por-discoteca/${selectedDiscoteca.nit}`) // Asume 'nit' es el ID de la discoteca
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudieron obtener los eventos de esta discoteca.');
                    }
                    return response.json();
                })
                .then(data => {
                    setDiscotecaEvents(data);
                })
                .catch(error => {
                    setEventsError(error.message);
                })
                .finally(() => {
                    setEventsLoading(false);
                });
        } else {
            // Limpiar eventos cuando no hay discoteca seleccionada
            setDiscotecaEvents([]);
        }
    }, [selectedDiscoteca]); // Este efecto se ejecuta cada vez que selectedDiscoteca cambia

    // Modificación para incluir nombre del cliente en las reseñas
    useEffect(() => {
        if (selectedDiscoteca) {
            fetch(`http://localhost:8080/servicio/reseñas/discoteca/${selectedDiscoteca.nit}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudieron obtener las reseñas de esta discoteca.');
                    }
                    return response.json();
                })
                .then(data => {
                    // Aquí podrías manejar las reseñas si las quieres mostrar en esta sección
                    // Por ejemplo, console.log(data);
                    console.log('Reseñas:', data);
                })
                .catch(error => {
                    console.error('Error al cargar reseñas:', error);
                });
        }
    }, [selectedDiscoteca]);

    const handleViewDiscoteca = (discoteca) => {
        setSelectedDiscoteca(discoteca);
    };

    const handleBackToList = () => {
        setSelectedDiscoteca(null);
    };

    // Función para obtener los detalles de la discoteca, adaptando los nombres de tus propiedades
    const getDiscotecaDetails = (discoteca) => {
        return {
            title: discoteca.nombre ? discoteca.nombre.toUpperCase() : 'NOMBRE DE LA DISCOTECA',
            description: discoteca.descripcion || `Prepárate para una noche inolvidable llena de flow y buena música en ${discoteca.nombre || 'esta discoteca'}! No te pierdas la oportunidad de vivir una experiencia única.`,
            category: discoteca.categoria || "Concierto",
            minAge: discoteca.edadMinima || "18 años",
            acomodacion: discoteca.acomodacion || "Palcos y Gradería",
            aforo: discoteca.capacidad || "3000",
            ventaComida: discoteca.ventaComida ? "Sí" : "No",
            ventaLicor: discoteca.ventaLicor ? "Sí" : "No",
            reducedMobilityAccess: discoteca.accesoMovilidadReducida ? "Sí*" : "No",
            pregnantAccess: discoteca.accesoEmbarazadas ? "Sí**" : "No",
        };
    };

    return (
        <>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {selectedDiscoteca ? (
                // Vista de una sola discoteca (como la foto)
                <div className="single-discoteca-page-container"> {/* Nuevo contenedor para toda la página de detalle */}
                    <div className="single-discoteca-view">
                        <div className="single-discoteca-image-container">
                            <img src={selectedDiscoteca.imagen} alt={selectedDiscoteca.nombre} className="single-discoteca-image" />
                            <button className="back-to-list-btn" onClick={handleBackToList}>Volver a la lista</button>
                        </div>
                        <div className="single-discoteca-details">
                            <h2>{getDiscotecaDetails(selectedDiscoteca).title}</h2>
                            <p className="discoteca-description">{getDiscotecaDetails(selectedDiscoteca).description}</p>

                            <div className="discoteca-info-grid">
                                <p><strong>Categoría:</strong> {getDiscotecaDetails(selectedDiscoteca).category}</p>
                                <p><strong>Edad mínima:</strong> {getDiscotecaDetails(selectedDiscoteca).minAge}</p>
                                <p><strong>Acomodación:</strong> {getDiscotecaDetails(selectedDiscoteca).acomodacion}</p>
                                <p><strong>Aforo:</strong> {getDiscotecaDetails(selectedDiscoteca).aforo}</p>
                                <p><strong>Venta de comida:</strong> {getDiscotecaDetails(selectedDiscoteca).ventaComida}</p>
                                <p><strong>Venta de licor:</strong> {getDiscotecaDetails(selectedDiscoteca).ventaLicor}</p>
                                <p><strong>Acceso a personas con movilidad reducida:</strong> {getDiscotecaDetails(selectedDiscoteca).reducedMobilityAccess}</p>
                                <p><strong>Acceso embarazadas:</strong> {getDiscotecaDetails(selectedDiscoteca).pregnantAccess}</p>
                            </div>
                            <button className="reserve-btn">RESERVAR</button>
                        </div>
                    </div>

                    {/* SECCIÓN DE EVENTOS */}
                    <div className="discoteca-events-section">
                        <h3>Próximos Eventos en {selectedDiscoteca.nombre}</h3>
                        {eventsLoading && <p className="loading-message">Cargando eventos...</p>}
                        {eventsError && <p className="error-message">Error al cargar eventos: {eventsError}</p>}
                        {!eventsLoading && !eventsError && discotecaEvents.length === 0 && (
                            <p className="no-events-message">No hay eventos próximos programados para esta discoteca.</p>
                        )}
                        <div className="events-container">
                            {discotecaEvents.length > 0 && discotecaEvents.map(event => (
                                <div className="event-card" key={event.idEvento}> {/* Asume 'idEvento' es el ID único del evento */}
                                    <img src={event.imagen || '/placeholder-event.jpg'} alt={event.nombreEvento} className="event-image" />
                                    <div className="event-details">
                                        <h4>{event.nombreEvento}</h4>
                                        <p><strong>Fecha:</strong> {new Date(event.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p><strong>Hora:</strong> {event.hora}</p> {/* Asume 'hora' existe */}
                                        <p><strong>Precio:</strong> {event.precio ? `$${event.precio.toLocaleString('es-CO')}` : 'Gratis'}</p> {/* Asume 'precio' existe */}
                                        <button
                                            className="event-view-btn"
                                            onClick={() => navigate(`/mapa/${event.idEvento}`)} // Aquí se usa navigate
                                        >
                                            Ver Detalles del Evento
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // Vista de la lista de discotecas
                <>
                    <h1>Nuestras Discotecas</h1>
                    <div className="discotecas-container">
                        {discotecas.length > 0 ? (
                            discotecas.map(discoteca => (
                                <div className="card" key={discoteca.nit}>
                                    <img src={discoteca.imagen} alt={discoteca.nombre} className="card-image" />
                                    <h2>{discoteca.nombre}</h2>
                                    <p><strong>Ubicación:</strong> {discoteca.ubicacion}</p>
                                    <p><strong>Capacidad:</strong> {discoteca.capacidad}</p>
                                    <button
                                        className="ver-discoteca-btn"
                                        onClick={() => handleViewDiscoteca(discoteca)}
                                    >
                                        Ver Discoteca
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No hay discotecas disponibles.</p>
                        )}
                    </div>
                </>
            )}
        </>
    );
};