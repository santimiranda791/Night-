import React, { useState, useEffect } from 'react';
import '../../../Styles/SectBodyBuzonResenas.css';

export const SectBodyBuzonResenas = ({ nitDiscoteca }) => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    puntuacion: 5,
    comentario: ''
  });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para obtener el token de autenticación del localStorage u otro almacenamiento
  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  // Obtener reseñas para la discoteca
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/servicio/reseñas/discoteca/${nitDiscoteca}`);
      if (!response.ok) {
        throw new Error('Error al obtener las reseñas');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Fallo al obtener reseñas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nitDiscoteca) {
      fetchReviews();
    }
  }, [nitDiscoteca]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'puntuacion' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.comentario) {
      setFormError('Por favor, escribe tu reseña.');
      return;
    }
    setFormError('');
    try {
      const token = getAuthToken();
      if (!token) {
        setFormError('Debes iniciar sesión para enviar una reseña.');
        return;
      }
      const response = await fetch('http://localhost:8080/servicio/reseñas/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          puntuacion: formData.puntuacion,
          comentario: formData.comentario,
          discoteca: { nit: nitDiscoteca }
        })
      });
      if (response.status === 201) {
        setFormData({ puntuacion: 5, comentario: '' });
        fetchReviews(); // Actualizar reseñas
      } else if (response.status === 401) {
        setFormError('No autorizado. Por favor inicia sesión.');
      } else {
        setFormError('Error al enviar la reseña.');
      }
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
      setFormError('Error al enviar la reseña.');
    }
  };

  return (
    <section className="buzon-resenas-container">
      <h2>Buzón de Reseñas</h2>
      <form className="buzon-resenas-form" onSubmit={handleSubmit}>
        <label>
          Puntuación:
          <select name="puntuacion" value={formData.puntuacion} onChange={handleChange}>
            {[5,4,3,2,1].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>
        <textarea
          name="comentario"
          placeholder="Escribe tu reseña aquí"
          value={formData.comentario}
          onChange={handleChange}
          required
        />
        {formError && <p className="form-error">{formError}</p>}
        <button type="submit">Enviar Reseña</button>
      </form>
      <div className="reviews-list">
        {loading ? (
          <p>Cargando reseñas...</p>
        ) : reviews.length === 0 ? (
          <p>No hay reseñas aún. Sé el primero en dejar una.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.idReseña} className="review-card">
              {/* CAMBIA ESTA LÍNEA */}
              <h4>{review.cliente?.nombre || 'Anónimo'}</h4>
              <p>⭐ {review.puntuacion}</p>
              <p>{review.comentario}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};