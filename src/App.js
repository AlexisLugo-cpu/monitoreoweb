import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import axios from "axios";

// Páginas
import Inicio from "./pages/Inicio";
import Mar from "./pages/Mar";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

// Componente del logo
const Logo = () => (
  <div className="logo-container">
    <img src="/logo.png" alt="Logo" className="logo" />
  </div>
);

const App = () => {
  // Estado del modo nocturno
  const [isNightMode, setIsNightMode] = useState(localStorage.getItem("nightMode") === "true");
  // Token guardado en sessionStorage (debe estar allí tras iniciar sesión)
  const [token, setToken] = useState(sessionStorage.getItem("adminToken"));
  // Estado de autenticación basado en la existencia del token
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [authError, setAuthError] = useState("");
  // Datos del usuario (para mostrar perfil, etc.)
  const [user, setUser] = useState({ name: "", email: "", profilePic: "" });
  const navigate = useNavigate();

  // Función que valida el token obtenido de sessionStorage
  const validateToken = useCallback(async () => {
    const storedToken = sessionStorage.getItem("adminToken");
    if (!storedToken) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/validate-token`,
        null,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      if (response.status === 200) {
        setIsLoggedIn(true);
        fetchUserData(storedToken);
      } else {
        setAuthError("❌ Token inválido o expirado.");
        handleLogout();
      }
    } catch (error) {
      setAuthError("Hubo un problema al validar el token.");
      handleLogout();
    }
  }, []);

  useEffect(() => {
    // Al cargar la app, se valida automáticamente el token
    validateToken();
  }, [validateToken]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/admin/data`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("❌ Error al obtener los datos del usuario:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setToken(null);
    setIsLoggedIn(false);
    setUser({ name: "", email: "", profilePic: "" });
    navigate("/login");
  };

  const toggleNightMode = useCallback(() => {
    const newMode = !isNightMode;
    setIsNightMode(newMode);
    localStorage.setItem("nightMode", newMode);
  }, [isNightMode]);

  return (
    <div className={`App ${isNightMode ? "night-mode" : ""}`}>
      <header className="header">
        <Logo />
        <div className="header-right">
          <button className="toggle-mode-btn" onClick={toggleNightMode}>
            {isNightMode ? <FaSun /> : <FaMoon />}
          </button>
          {isLoggedIn ? (
            <div className="profile">
              <img
                src={
                  user.profilePic ||
                  "https://randomuser.me/api/portraits/men/1.jpg"
                }
                alt="Perfil"
                className="profile-pic"
              />
              <div className="profile-details">
                <p>{user.name}</p>
                <p>{user.email}</p>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">
                <button>Iniciar sesión</button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Menú de navegación */}
      <nav className="navbar">
        <Link to="/" className="navbar-item">Inicio</Link>
        <Link
          to="/suelo"
          className="navbar-item disabled"
          style={{ pointerEvents: "none" }}
        >
          Suelo
        </Link>
        <Link to="/mar" className="navbar-item">Mar</Link>
        <Link to="/AdminPanel" className="navbar-item">Administrador</Link>
      </nav>

      {authError && <p className="text-red-500">{authError}</p>}

      {/* Definición de rutas. Nota: usamos '/admin' para la ruta del panel */}
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/mar" element={<Mar />} />
        <Route
          path="/login"
          element={<AdminLogin setToken={setToken} setLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/AdminPanel"
          element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;