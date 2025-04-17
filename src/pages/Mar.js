import React, { useState, useCallback } from 'react';
import MapComponent from '../components/Mapcomponent';
import WeatherInfo from '../components/WeatherInfo';
import ZonasVeda from '../components/VedaZones';

const Mar = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState("zona1");

  const handleZonaSeleccionada = useCallback((coordenadas) => {
    if (!coordenadas || coordenadas.length === 0) {
      console.error("Zona seleccionada inválida");
      return;
    }
    setZonaSeleccionada(coordenadas);
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-semibold mb-4">Monitoreo del Mar</h1>

      {/* Información del clima */}
      <WeatherInfo />

      {/* Zonas de Veda */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Zonas de Veda</h2>
        <ZonasVeda onZonaSeleccionada={handleZonaSeleccionada} />
      </div>

      {/* Mapa con la zona de veda seleccionada */}
      <div className="my-4">
        <MapComponent zonaSeleccionada={zonaSeleccionada} />
      </div>
    </div>
  );
};

export default Mar;