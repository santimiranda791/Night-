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

  // Function to get auth token from localStorage or other storage
  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  // Fetch reviews for the discoteca
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/servicio/reseñas/discoteca/${nitDiscoteca}`);
      if (!response.ok) {
        throw new Error('Error fetching reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
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
        fetchReviews(); // Refresh reviews
      } else if (response.status === 401) {
        setFormError('No autorizado. Por favor inicia sesión.');
      } else {
        setFormError('Error al enviar la reseña.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setFormError('Error al enviar la reseña.');
    }
  };

  return (
    <section className="buzon-resenas-container">
      <div className="buzon-resenas-header">
        <div className="buzon-resenas-icon">💬</div>
        <h2>¡Déjanos tu opinión!</h2>
        <p className="buzon-resenas-desc">
          Tu comentario ayuda a otros a elegir mejor. ¡Queremos saber qué piensas!
        </p>
      </div>
      <form className="buzon-resenas-form" onSubmit={handleSubmit}>
        <label className="buzon-label">
          <span>Puntuación:</span>
          <div className="buzon-stars">
            {[1,2,3,4,5].map(num => (
              <span
                key={num}
                className={`buzon-star${formData.puntuacion >= num ? ' filled' : ''}`}
                onClick={() => setFormData(f => ({ ...f, puntuacion: num }))}
                role="button"
                tabIndex={0}
                aria-label={`Puntuar con ${num} estrella${num > 1 ? 's' : ''}`}
              >★</span>
            ))}
          </div>
        </label>
        <textarea
          name="comentario"
          placeholder="Escribe tu comentario aquí"
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
          <p className="no-reviews">No hay reseñas aún. ¡Sé el primero en comentar!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.idReseña} className="review-card">
              <div className="review-avatar">
                {review.cliente?.nombreCliente
                  ? review.cliente.nombreCliente.charAt(0).toUpperCase()
                  : "?"}
              </div>
              <div className="review-content">
                <div className="review-header">
                  <strong>{review.cliente?.nombreCliente || 'Anónimo'}</strong>
                  <div className="buzon-stars-static">
                    {[1,2,3,4,5].map(num => (
                      <span
                        key={num}
                        className={`buzon-star${review.puntuacion >= num ? ' filled' : ''}`}
                      >★</span>
                    ))}
                  </div>
                </div>
                <p>{review.comentario}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
