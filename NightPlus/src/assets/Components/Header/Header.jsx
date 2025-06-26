import React, { useState, useEffect } from 'react';
import '../../../Styles/Header.css'; // Asegúrate de que esta ruta CSS sea correcta
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaTimesCircle } from "react-icons/fa"; // Importa FaTimesCircle para el botón de cerrar
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

// Clave para localStorage
const NOTIFICATIONS_STORAGE_KEY = 'app_notifications';

export const Header = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [usuario, setUsuario] = useState('');
  // Inicializa las notificaciones cargándolas desde localStorage al inicio
  const [notifications, setNotifications] = useState(() => {
    try {
      const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      console.error("Header: Error al parsear notificaciones de localStorage", error);
      return [];
    }
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // useEffect para cargar la información del usuario al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // CAMBIO AQUÍ: Prioriza 'name' (como lo envía el backend), luego 'usuarioCliente', 'usuario', y finalmente 'email'
        setUsuario(decoded.name || decoded.usuarioCliente || decoded.usuario || decoded.email || '');
      } catch (e) {
        console.error("Header: Error decodificando token", e);
        setUsuario('');
        // Opcional: limpiar token inválido si hay un error
        // localStorage.removeItem('token');
      }
    } else {
      // Fallback a localStorage si no hay token o no se puede decodificar
      setUsuario(localStorage.getItem('nombre') || localStorage.getItem('usuario') || '');
    }
  }, []);

  // useEffect para escuchar el evento de creación de eventos (notificaciones)
  useEffect(() => {
    const handleNewEventNotification = (event) => {
      console.log("Header: ¡Evento 'newEventAdded' RECIBIDO! Detalle:", event.detail);

      const eventName = event.detail.eventName;
      if (eventName) {
        const message = `¡Un nuevo evento te espera: "${eventName}"!`;
        addNotification(message); // Llama a la función que también guarda en localStorage
      } else {
        console.warn("Header: eventName no encontrado en el detalle del evento.");
      }
    };

    console.log("Header: Añadiendo event listener para 'newEventAdded'.");
    window.addEventListener('newEventAdded', handleNewEventNotification);

    return () => {
      console.log("Header: Removiendo event listener para 'newEventAdded'. Componente desmontado.");
      window.removeEventListener('newEventAdded', handleNewEventNotification);
    };
  }, []);

  // useEffect para guardar las notificaciones en localStorage cada vez que cambian
  useEffect(() => {
    console.log("Header: Guardando notificaciones en localStorage:", notifications);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]); // Se ejecuta cada vez que 'notifications' cambia

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar sesión?',
      imageUrl: '/logitopensativo.webp',
      imageWidth: 130,
      imageHeight: 130,
      showCancelButton: true,
      confirmButtonColor: '#a374ff',
      background: '#000',
      color: '#fff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('nombre');
        localStorage.removeItem('currentAdmin');
        localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY); // ¡Limpia las notificaciones al cerrar sesión!
        setUsuario('');
        setNotifications([]); // Limpia el estado de notificaciones
        setDropdownVisible(false);
        Swal.fire({
          background: '#000',
          color: '#fff',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          timer: 1200,
          showConfirmButton: false
        });
        setTimeout(() => {
          navigate('/');
        }, 1200);
      }
    });
  };

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
  };

  const addNotification = (message) => {
    setNotifications((prev) => {
      const newNotification = { id: Date.now(), message, read: false }; // Añadir 'read' para futuro
      console.log("Header: Añadiendo notificación al estado:", newNotification);
      return [
        newNotification,
        ...prev, // Puedes poner el nuevo al principio o al final, según prefieras
      ];
    });
  };

  const removeNotification = (idToRemove) => {
    setNotifications((prev) => prev.filter(n => n.id !== idToRemove));
  };

  return (
    <header className="header-container">
      <img src="/logito.svg" alt="Logo" className="logo" />
      <nav className="navbar">
        <ul className="nav-list">
          <li>
            <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#a374ff' : 'white', textDecoration: 'none' })}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/Discotecas" style={({ isActive }) => ({ color: isActive ? '#a374ff' : 'white', textDecoration: 'none' })}>Discotecas</NavLink>
          </li>
          <li>
            <NavLink to="/Eventos" style={({ isActive }) => ({ color: isActive ? '#a374ff' : 'white', textDecoration: 'none' })}>Eventos</NavLink>
          </li>
        </ul>
      </nav>
      {/* Campana de notificaciones */}
      <div className="notification-bell" style={{ position: 'relative', marginRight: '1rem', cursor: 'pointer' }} onClick={handleBellClick}>
        <FaBell size={24} color="#fff" />
        {notifications.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px',
            pointerEvents: 'none'
          }}>
            {notifications.length}
          </span>
        )}
        {showNotifications && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '30px',
            background: '#222',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            minWidth: '250px', // Un poco más ancho para el botón de cerrar
            zIndex: 10,
            padding: '10px'
          }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {notifications.length === 0 ? (
                <li style={{ padding: '5px 0' }}>No hay notificaciones</li>
              ) : (
                notifications.map((n) => (
                  <li key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{n.message}</span>
                    <FaTimesCircle
                      size={16}
                      color="#d33"
                      style={{ cursor: 'pointer', marginLeft: '10px' }}
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que se cierre el dropdown al hacer clic en el ícono
                        removeNotification(n.id);
                      }}
                      title="Marcar como leída / Eliminar"
                    />
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="user" onClick={toggleDropdown}>
        <FaUserCircle style={{ fontSize: '2rem' }} />
        <p>{usuario && usuario.trim() !== '' ? `Hola, ${usuario}` : 'Iniciar Sesión'}</p>
        {isDropdownVisible && (
          <div className="dropdown">
            {usuario ? (
              <>
                <p className="dropdown-item" onClick={handleLogout}>Cerrar sesión</p>
                <NavLink to="/Perfil" className="dropdown-item">Ver perfil</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/Login" className="dropdown-item">¿Eres Cliente?</NavLink>
                <NavLink to="/LogInAdmin" className="dropdown-item">¿Eres Admin?</NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};