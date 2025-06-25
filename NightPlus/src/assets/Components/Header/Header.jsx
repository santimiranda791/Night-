import React, { useState, useEffect, useRef } from 'react';
import '../../../Styles/Header.css'; // Asegúrate de que esta ruta CSS sea correcta
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaTimesCircle } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

// Clave para localStorage
const NOTIFICATIONS_STORAGE_KEY = 'app_notifications';

export const Header = () => {
    const [isUserDropdownVisible, setUserDropdownVisible] = useState(false);
    const [usuario, setUsuario] = useState('');
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

    const navigate = useNavigate();

    // Refs to detect clicks outside dropdowns/menus
    const userDropdownRef = useRef(null);
    const notificationsDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null); // Ref for the mobile navbar itself
    const menuToggleRef = useRef(null); // Ref for the hamburger icon

    // Close dropdowns/menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target) &&
                !(event.target.closest('.user') || event.target.closest('.dropdown-item'))) {
                setUserDropdownVisible(false);
            }
            if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target) &&
                !event.target.closest('.notification-bell')) {
                setShowNotifications(false);
            }
            // Close mobile menu if clicked outside
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
                menuToggleRef.current && !menuToggleRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // useEffect para cargar la información del usuario al montar el componente
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsuario(decoded.name || decoded.usuarioCliente || decoded.usuario || decoded.email || '');
            } catch (e) {
                console.error("Header: Error decodificando token", e);
                setUsuario('');
            }
        } else {
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
                addNotification(message);
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
    }, [notifications]);

    const toggleUserDropdown = () => {
        setUserDropdownVisible((prev) => !prev);
        setShowNotifications(false); // Close notifications if user dropdown opens
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
                localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
                setUsuario('');
                setNotifications([]);
                setUserDropdownVisible(false);
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
        setUserDropdownVisible(false); // Close user dropdown if notifications open
    };

    const addNotification = (message) => {
        setNotifications((prev) => {
            const newNotification = { id: Date.now(), message, read: false };
            return [newNotification, ...prev];
        });
    };

    const removeNotification = (idToRemove) => {
        setNotifications((prev) => prev.filter(n => n.id !== idToRemove));
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
        setUserDropdownVisible(false); // Close user dropdown when mobile menu opens/closes
        setShowNotifications(false); // Close notifications when mobile menu opens/closes
    };

    // Handler for NavLink clicks inside the mobile menu
    const handleNavLinkClick = () => {
        setIsMobileMenuOpen(false); // Close mobile menu when a navigation link is clicked
    };

    return (
        <header className="header-container">
            <img src="/logito.svg" alt="Logo" className="logo" />
            <h1>NightLine</h1> {/* Added back the h1 title */}

            {/* Hamburger menu toggle button */}
            <div className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu} ref={menuToggleRef}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            {/* Navigation Bar */}
            <nav className={`navbar ${isMobileMenuOpen ? 'active' : ''}`} ref={mobileMenuRef}>
                <ul className="nav-list">
                    <li>
                        <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#a374ff' : 'white', textDecoration: 'none' })} onClick={handleNavLinkClick}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/Discotecas" style={({ isActive }) => ({ color: isActive ? '#a374ff' : 'white', textDecoration: 'none' })} onClick={handleNavLinkClick}>Discotecas</NavLink>
                    </li>
                    <li>
                        <NavLink to="/Eventos" style={({ isActive }) => ({ color: isActive ? '#a374ff' : 'white', textDecoration: 'none' })} onClick={handleNavLinkClick}>Eventos</NavLink>
                    </li>
                </ul>
            </nav>

            {/* Notification Bell */}
            <div className="notification-bell" style={{ position: 'relative', cursor: 'pointer', zIndex: 10 }} onClick={handleBellClick}>
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
                    <div className="notifications-dropdown" style={{
                        position: 'absolute',
                        right: 0,
                        top: '30px',
                        background: '#222',
                        color: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        minWidth: '250px',
                        zIndex: 100, /* Higher z-index than navbar */
                        padding: '10px'
                    }} ref={notificationsDropdownRef}>
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
                                                e.stopPropagation();
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

            {/* User Profile / Login Section */}
            <div className="user" onClick={toggleUserDropdown} ref={userDropdownRef}>
                <FaUserCircle style={{ fontSize: '2rem' }} />
                <p>{usuario && usuario.trim() !== '' ? `Hola, ${usuario}` : 'Iniciar Sesión'}</p>
                {isUserDropdownVisible && (
                    <div className="dropdown">
                        {usuario ? (
                            <>
                                <p className="dropdown-item" onClick={handleLogout}>Cerrar sesión</p>
                                <NavLink to="/Perfil" className="dropdown-item" onClick={() => setUserDropdownVisible(false)}>Ver perfil</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/Login" className="dropdown-item" onClick={() => setUserDropdownVisible(false)}>¿Eres Cliente?</NavLink>
                                <NavLink to="/LogInAdmin" className="dropdown-item" onClick={() => setUserDropdownVisible(false)}>¿Eres Admin?</NavLink>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};