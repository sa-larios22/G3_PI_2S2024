// src/components/NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignOutButton from './SignOutButton';

function NavBar() {

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/createTask" className="nav-link">Crear Tarea</Link>
        </li>
        <li className="nav-item">
          <Link to="/tasksList" className="nav-link">Lista de Tareas</Link>
        </li>
        <li className="nav-item">
          < SignOutButton />
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
