import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Polygon, InfoWindow } from "@react-google-maps/api";
import axios from 'axios';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 19.8,  
  lng: -90.55, 
};

const zonasVeda = {
  zona1: [{ lat: 18.65139, lng: -92.46806 }, { lat: 21.48889, lng: -87.53417 }],
  zona2: [{ lat: 21.16194, lng: -90.05083 }, { lat: 21.35194, lng: -89.19250 }],
};

const MapComponent = ({ zonaSeleccionada }) => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/lanchas`)
      .then(response => {
        const coordinates = response.data.map((lancha, index) => ({
          lat: parseFloat(lancha.latitud),
          lng: parseFloat(lancha.longitud),
          id: `Lancha ${index + 1}`,
          descripcion: `Información de la lancha ${index + 1}`,
          curp: lancha.curp,
          nombrePropietario: lancha.propietario,
          numeroSerieMotor: lancha.numeroSerie,
          marca: lancha.marca,
        }));
        setMarkers(coordinates);
      })
      .catch(error => console.error('Error al cargar las coordenadas:', error));
  }, []);

  if (!isLoaded) return <p>Cargando mapa...</p>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker}
          label={marker.id}
          onClick={() => setSelectedMarker(marker)}
        />
      ))}

      {zonaSeleccionada && zonasVeda[zonaSeleccionada] && (
        <Polygon
          paths={zonasVeda[zonaSeleccionada]}
          options={{
            fillColor: 'rgba(255, 0, 0, 0.2)',
            fillOpacity: 0.5,
            strokeColor: '#FF0000',
            strokeOpacity: 1,
            strokeWeight: 2,
          }}
        />
      )}

      {selectedMarker && (
        <InfoWindow position={selectedMarker} onCloseClick={() => setSelectedMarker(null)}>
          <div>
            <h3>{selectedMarker.id}</h3>
            <p>{selectedMarker.descripcion}</p>
            <p><strong>CURP:</strong> {selectedMarker.curp}</p>
            <p><strong>Nombre del propietario:</strong> {selectedMarker.nombrePropietario}</p>
            <p><strong>Número de serie del motor:</strong> {selectedMarker.numeroSerieMotor}</p>
            <p><strong>Marca del motor:</strong> {selectedMarker.marca}</p>
            <p><strong>Latitud:</strong> {selectedMarker.lat}</p>
            <p><strong>Longitud:</strong> {selectedMarker.lng}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapComponent;