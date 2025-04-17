import reportWebVitals from './reportWebVitals';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <<--- ¡ESTO ES CRUCIAL!
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';  // Asegúrate de importar BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>  {/* Envuelve App con Router */}
      <App />
    </Router>
  </React.StrictMode>
);

// Si deseas empezar a medir el rendimiento de tu app, pasa una función para registrar los resultados
// (por ejemplo: reportWebVitals(console.log)) o envíalos a un endpoint de análisis.
reportWebVitals();
