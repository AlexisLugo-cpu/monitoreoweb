import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ setToken, setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (username.trim() === '' || password.trim() === '') {
      setErrorMsg('Por favor, completa ambos campos.');
      return;
    }

    setLoading(true);
    try {
      // Definir la URL de la API con fallback
      const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiURL}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Almacenar el token en sessionStorage
        sessionStorage.setItem("adminToken", data.token);
        // Actualizar estado en App.js
        setToken(data.token);
        setLoggedIn(true);
        navigate('/AdminPanel');
      } else {
        setErrorMsg(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setErrorMsg('Error de red o del servidor');
      console.error("❌ Error en la solicitud de login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Acceso Administrativo</h2>
      <form onSubmit={handleSubmit}>
        <label>Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;