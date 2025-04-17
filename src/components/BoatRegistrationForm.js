import React, { useState } from 'react';
import axios from 'axios';

const BoatRegistrationForm = () => {
  const [formData, setFormData] = useState({
    numeroSerie: '',
    propietario: '',
    curp: '',
    marca: '',
    descripcion: '',
    latitud: '',
    longitud: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarCURP = (curp) => /^[A-Z0-9]{18}$/.test(curp);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones antes de enviar
    if (!validarCURP(formData.curp)) {
      alert("El CURP debe tener 18 caracteres válidos.");
      return;
    }
    if (isNaN(formData.latitud) || isNaN(formData.longitud)) {
      alert("La latitud y longitud deben ser valores numéricos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/lanchas', formData);
      if (response.status === 200) {
        alert('Lancha registrada exitosamente');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al registrar la lancha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Registro de Lancha</h2>
      <form onSubmit={handleSubmit}>
        {["numeroSerie", "propietario", "curp", "marca", "descripcion", "latitud", "longitud"].map((campo) => (
          <div key={campo}>
            <label htmlFor={campo}>{campo.replace(/([A-Z])/g, " $1")}:</label>
            <input
              type={campo.includes("latitud") || campo.includes("longitud") ? "number" : "text"}
              id={campo}
              name={campo}
              value={formData[campo]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Lancha"}
        </button>
      </form>
    </div>
  );
};

export default BoatRegistrationForm;