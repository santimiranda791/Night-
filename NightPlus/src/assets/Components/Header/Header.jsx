import React from 'react';
import '../../../Styles/Header.css';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

export const Header = () => {
  return (
    <header>
      <img src="./src/assets/Icons/logito.svg" alt="Logo" className="logo" /> {/* Imagen del logo */}
      <nav className="navbar">
        <ul className="nav-list">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/Discotecas">Discotecas</NavLink></li>
          <li><NavLink to="/PrincipalPage">Eventos</NavLink></li>
        </ul>
      </nav>

      <NavLink to="/Login">
      <div className='user'>
      
      <FaUserCircle style={{ fontSize: '2rem' }} /> 
      <p>Iniciar Sesión</p>  
          
      </div>
      </NavLink> 
    </header>
  );
};