import React, { useEffect, useState } from "react";
import { Header } from '../../Header/Header';
import '../../../../Styles/Discotecas.css';

export const Discotecas = () => {
    const [discotecas, setDiscotecas] = useState([]);  // Estado para almacenar las discotecas
    const [error, setError] = useState(null);  // Estado para manejar errores
    const [loading, setLoading] = useState(true);  // Estado para controlar la carga de datos

    useEffect(() => {
        // ✅ URL corregida y entorno de producción
        const apiUrl = 'https://nightplusback.vercel.app/servicio/discotecas';

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener la lista de discotecas');
                }
                return response.json();
            })
            .then(data => {
                setDiscotecas(data);
                setLoading(false);  // Datos cargados
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);  // Termina la carga en caso de error
            });
    }, []);

    return (
        <>
            <Header />
            <h1>Discotecas Disponibles</h1>

            {/* Muestra un mensaje de carga mientras los datos se están obteniendo */}
            {loading && <p>Cargando...</p>}

            {/* Muestra mensaje de error si existe */}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            <div className="discotecas-container">
                {/* Verifica si existen discotecas y las muestra */}
                {discotecas.length > 0 ? (
                    discotecas.map(discoteca => (
                        <div className="card" key={discoteca.id}>
                            <img src={discoteca.imagen} alt={discoteca.nombre} className="card-image" />
                            <h2>{discoteca.nombre}</h2>
                            <p><strong>Ubicación:</strong> {discoteca.ubicacion}</p>
                            <p><strong>Capacidad:</strong> {discoteca.capacidad}</p>
                        </div>
                    ))
                ) : (
                    !loading && <p>No hay discotecas disponibles.</p>  // Solo muestra si no está cargando
                )}
            </div>
        </>
    );
};
