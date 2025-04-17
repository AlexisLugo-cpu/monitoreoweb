import React, { useState, useEffect } from 'react';
import { FaShip, FaMapMarkedAlt, FaBell } from 'react-icons/fa';
import axios from 'axios';

const Inicio = () => {
  // Datos simulados del usuario
  const usuario = {
    nombre: 'Alexis Lugo',
    correo: 'alex@correo.com',
  };

  // Estado para el número de lanchas registradas
  const [numLanchas, setNumLanchas] = useState(0);
  // Estado para la alerta del clima
  const [weatherAlert, setWeatherAlert] = useState("");

  // Obtención de lanchas desde el backend
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    const fetchLanchas = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/lanchas`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (Array.isArray(response.data)) {
          setNumLanchas(response.data.length);
        }
      } catch (error) {
        console.error("Error al obtener las lanchas:", error);
      }
    };

    fetchLanchas();
  }, []);

  // Obtención de alerta del clima desde OpenWeather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
        const lat = process.env.REACT_APP_LAT || "19.432608";
        const lon = process.env.REACT_APP_LON || "-99.133209";
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

        const response = await axios.get(url);
        if (response.data.alerts && response.data.alerts.length > 0) {
          setWeatherAlert(response.data.alerts[0].event);
        } else {
          setWeatherAlert("Sin alertas climáticas");
        }
      } catch (error) {
        console.error("Error al obtener alertas del clima:", error);
        setWeatherAlert("No disponible");
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="p-6 text-white-800 dark:text-white-100">
      <h1 className="text-3xl font-bold mb-4">¡Bienvenido, {usuario.nombre}!</h1>
      <p className="mb-6 text-lg">
        Este es el sistema de monitoreo inteligente para lanchas y embarcaciones.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lanchas registradas */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 flex items-center space-x-4">
          <FaShip className="text-3xl text-blue-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Lanchas registradas</p>
            <p className="text-xl font-semibold">{numLanchas}</p>
          </div>
        </div>

        {/* Lanchas activas */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 flex items-center space-x-4">
          <FaMapMarkedAlt className="text-3xl text-green-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Lanchas activas</p>
            <p className="text-xl font-semibold">4</p>
          </div>
        </div>

        {/* Alerta del clima */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4 flex items-center space-x-4">
          <FaBell className="text-3xl text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Última alerta</p>
            <p className="text-xl font-semibold">{weatherAlert}</p>
          </div>
        </div>
      </div>

      {/* Sección del mapa de Google */}
      <div className="mt-10 bg-white dark:bg-gray-800 shadow-md rounded-2xl p-4">
        <h2 className="text-2xl font-semibold mb-2">Ubicación general</h2>
        <div className="w-full h-64 rounded-lg overflow-hidden">
        <iframe
          title="Mapa de lanchas"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=Campeche+City&zoom=6`}
          allowFullScreen
        ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Inicio;