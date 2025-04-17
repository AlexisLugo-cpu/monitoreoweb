import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const city = 'Campeche,mx';
const units = 'metric';

const WeatherComponent = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}&lang=es`);
        setWeather(response.data);
      } catch (err) {
        setError("Error al obtener los datos meteorológicos.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); // Actualizar cada 60 segundos

    return () => clearInterval(interval); // Limpieza al desmontar el componente
  }, []);

  if (loading) return <p>Cargando clima...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white p-4 rounded shadow-md w-full max-w-md mx-auto mt-4 dark:bg-gray-800 text-gray-800 dark:text-white">
      <h2 className="text-xl font-bold mb-2">Clima actual en {weather.name}</h2>
      <p><strong>Condición:</strong> {weather.weather.map(w => w.description).join(", ")}</p>
      <p><strong>Temperatura:</strong> {weather.main.temp}°C</p>
      <p><strong>Sensación térmica:</strong> {weather.main.feels_like}°C</p>
      <p><strong>Humedad:</strong> {weather.main.humidity}%</p>
      <p><strong>Presión:</strong> {weather.main.pressure} hPa</p>
      <p><strong>Visibilidad:</strong> {weather.visibility / 1000} km</p>
      <p><strong>Viento:</strong> {weather.wind.speed} m/s</p>
    </div>
  );
};

export default WeatherComponent;