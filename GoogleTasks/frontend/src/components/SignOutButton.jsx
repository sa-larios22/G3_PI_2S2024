// src/components/SignOutButton.jsx
import React from 'react';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';

function SignOutButton() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      navigate('/');
    });
  };

  return (
    <button className="btn btn-signout" onClick={handleSignOut}>
      Cerrar Sesión
    </button>
  );
}

export default SignOutButton;
