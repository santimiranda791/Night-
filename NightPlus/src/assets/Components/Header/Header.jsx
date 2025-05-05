import React, { useState } from 'react';
import '../../../Styles/Header.css';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

export const Header = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <header>
      <img src="./src/assets/Icons/logito.svg" alt="Logo" className="logo" />
      <nav className="navbar">
        <ul className="nav-list">
          <li>
            <NavLink 
              to="/" 
              style={({ isActive }) => ({
                color: isActive ? '#a374ff' : 'white',
                textDecoration: 'none',
              })}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/Discotecas" 
              style={({ isActive }) => ({
                color: isActive ? '#a374ff' : 'white',
                textDecoration: 'none',
              })}
            >
              Discotecas
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/Eventos" 
              style={({ isActive }) => ({
                color: isActive ? '#a374ff' : 'white',
                textDecoration: 'none',
              })}
            >
              Eventos
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="user" onClick={toggleDropdown}>
        <FaUserCircle style={{ fontSize: '2rem' }} />
        <p>Iniciar Sesión</p>  

        {isDropdownVisible && (
          <div className="dropdown">
            <NavLink to="/Login" className="dropdown-item">¿Eres Cliente?</NavLink>
            <NavLink to="/LogInAdmin" className="dropdown-item">¿Eres Admin?</NavLink>
          </div>
        )}
      </div>
    </header>
  );
};