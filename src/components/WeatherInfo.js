import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const CITY = 'Campeche';
const REFRESH_INTERVAL = 300000; // 5 minutos en milisegundos

const WeatherInfo = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}&lang=es`);
      setWeather(response.data);
    } catch (err) {
      setError("Error al obtener el clima.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const timer = setTimeout(fetchWeather, REFRESH_INTERVAL);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <p>Cargando clima...</p>;
  if (error) return <p>{error}</p>;

  const {
    main: { temp, feels_like, humidity, pressure },
    weather: weatherDetails,
    wind: { speed },
    visibility,
    name,
    dt,
  } = weather;

  const iconCode = weatherDetails[0].icon;
  const description = weatherDetails.map(w => w.description).join(", ");
  const fecha = new Date(dt * 1000).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="bg-white shadow-md rounded-xl p-4 max-w-md w-full dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <img src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`} alt={description} />
        <div>
          <h2 className="text-xl font-semibold dark:text-white">{name}</h2>
          <p className="text-gray-600 dark:text-gray-300">{fecha}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 dark:text-gray-200">
        <p>Estado: <strong>{description}</strong></p>
        <p>Temperatura: {temp}°C (sensación: {feels_like}°C)</p>
        <p>Humedad: {humidity}%</p>
        <p>Presión: {pressure} hPa</p>
        <p>Viento: {speed} m/s</p>
        <p>Visibilidad: {visibility / 1000} km</p>
      </div>
    </div>
  );
};

export default WeatherInfo;