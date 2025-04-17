import React from 'react';

const zonasVeda = [
  {
    id: 1,
    nombre: 'Zona 1 (Campeche - Yucatán)',
    descripcion: 'Veda para la pesca de especies como camarones y moluscos, aplicable en algunas temporadas y zonas.',
    coordenadas: [
      { lat: 18.65139, lng: -92.46806 }, // 18° 39' 5'' N, 92° 28' 5'' O
      { lat: 21.48889, lng: -87.53417 }, // 21° 29' 20'' N, 87° 32' 03'' O
    ]
  },
  {
    id: 2,
    nombre: 'Zona 2 (Yucatán - Quintana Roo)',
    descripcion: 'Veda para especies marinas, especialmente en áreas de pesca comercial.',
    coordenadas: [
      { lat: 21.16194, lng: -90.05083 }, // 21° 09' 43'' N, 90° 03' 03'' O
      { lat: 21.35194, lng: -89.19250 }, // 21° 21' 07'' N, 89° 11' 33'' O
    ]
  }
];

const ZonasVeda = ({ onZonaSeleccionada }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {zonasVeda.map(zona => (
          <div
            key={zona.id}
            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow cursor-pointer hover:bg-yellow-200 transition"
            onClick={() => onZonaSeleccionada(`zona${zona.id}`)}  // Pasa el identificador de la zona (zona1 o zona2)
          >
            <h3 className="text-lg font-bold">{zona.nombre}</h3>
            <p className="text-sm">{zona.descripcion}</p>
          </div>
        ))}
      </div>
    );
  };

export default ZonasVeda;
