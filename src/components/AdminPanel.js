import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./adminPanel.css"; // Importar el archivo CSS para los estilos

const AdminPanel = () => {
  const navigate = useNavigate();

  // Estado para el listado de lanchas y mensajes
  const [lanchas, setLanchas] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Estados para el formulario/modal de registro/edición
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [nuevaLancha, setNuevaLancha] = useState({
    nombre: "",
    curp: "",
    fechaNacimiento: "", // Autocompletado con CURP, no modificable
    estadoNacimiento: "", // Autocompletado con CURP, no modificable
    matricula: "",
    numeroSerieMotor: "",
    marcaMotor: "",
    modelo: "",
    colorLancha: "",
  });

  // Estado para generar reporte
  const [tipoReporte, setTipoReporte] = useState("diario");

  // Al montar el componente, verificamos la sesión y obtenemos las lanchas
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      setErrorMsg("No se encontró el token, redirigiendo al login...");
      setTimeout(() => navigate("/login"), 500);
    } else {
      obtenerLanchas(token);
    }
  }, [navigate]);

  // Función para obtener lanchas
  const obtenerLanchas = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/lanchas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Asignar la respuesta correctamente sin marcarla como error
      setLanchas(response.data);
      setErrorMsg(""); // Borrar mensajes de error en caso de éxito
    } catch (error) {
      console.error("❌ Error al obtener lanchas:", error);
      setErrorMsg("Hubo un error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const [lanchaSeleccionada, setLanchaSeleccionada] = useState(null);

const cerrarDetalles = () => {
  setLanchaSeleccionada(null);
};


  // Función para registrar o editar una lancha
  const registrarLancha = async () => {
    console.log("Datos enviados:", nuevaLancha);
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      if (modoEdicion) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/lanchas/${idEditando}`,
          nuevaLancha,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/lanchas/registro`,
          nuevaLancha,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      obtenerLanchas(token);
      cancelarFormulario();
    } catch (error) {
      console.error("Error al registrar/editar lancha:", error);
      setErrorMsg("Error al registrar/editar lancha.");
    }
  };

  // Función para eliminar una lancha
  const eliminarLancha = async (id) => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/lanchas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      obtenerLanchas(token);
    } catch (error) {
      console.error("Error al eliminar lancha:", error);
      setErrorMsg("Error al eliminar lancha.");
    }
  };

  // Función para iniciar edición
  const prepararEdicion = (lancha) => {
    setModoEdicion(true);
    setIdEditando(lancha._id);
    setNuevaLancha({ ...lancha });
    setMostrarFormulario(true);
  };

  // Función para cancelar formulario
  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setModoEdicion(false);
    setIdEditando(null);
    setNuevaLancha({
      nombre: "",
      curp: "",
      fechaNacimiento: "", // Se autocompleta con CURP
      estadoNacimiento: "", // Se autocompleta con CURP
      matricula: "",
      numeroSerieMotor: "",
      marcaMotor: "",
      modelo: "",
      colorLancha: "",
    });
  };

  // Función para autocompletar datos con la CURP
  const autocompletarCURP = (curp) => {
    if (curp.length >= 13) {
      const fechaPart = curp.substring(4, 10); // YYMMDD
      const yy = parseInt(fechaPart.substring(0, 2), 10);
      const century = yy > 50 ? "19" : "20";
      const year = century + fechaPart.substring(0, 2);
      const month = fechaPart.substring(2, 4);
      const day = fechaPart.substring(4, 6);
      const fechaNacimiento = `${year}-${month}-${day}`;

      // Extraer estado de nacimiento
      const estadoCode = curp.substring(11, 13).toUpperCase();
      const estados = {
        "AG": "Aguascalientes",
        "BC": "Baja California",
        "BS": "Baja California Sur",
        "CC": "Campeche",
        "CS": "Chiapas",
        "DF": "Ciudad de México",
        "GR": "Guerrero",
        "MC": "Estado de México",
        "NL": "Nuevo León",
        "QR": "Quintana Roo",
        "TL": "Tlaxcala",
        "VZ": "Veracruz",
        "YN": "Yucatán",
      };
      const estadoNacimiento = estados[estadoCode] || "Desconocido";

      setNuevaLancha((prev) => ({
        ...prev,
        fechaNacimiento,
        estadoNacimiento,
      }));
    }
  };

  return (
    <div className="admin-panel">
      <h2>Panel de Administración</h2>

      {loading && <p>Cargando datos...</p>}
      {errorMsg && <p className="error">{errorMsg}</p>}

      {!loading && !errorMsg && (
        <>
          <button onClick={() => setMostrarFormulario(true)}>Registrar Nueva Lancha</button>

          {mostrarFormulario && (
  <div className="modal-overlay">
    <div className="modal-container">
      <h3>{modoEdicion ? "Editar Lancha" : "Registrar Nueva Lancha"}</h3>
      <form onSubmit={(e) => { e.preventDefault(); registrarLancha(); }} className="lancha-form">
        
        {/* Sección de datos personales */}
        <div className="form-section">
          <h4>Datos del Propietario</h4>
          <input type="text" placeholder="Nombre" value={nuevaLancha.nombre} onChange={(e) => setNuevaLancha({ ...nuevaLancha, nombre: e.target.value })} required />
          <input type="text" placeholder="CURP" value={nuevaLancha.curp} onChange={(e) => setNuevaLancha({ ...nuevaLancha, curp: e.target.value })} onBlur={(e) => autocompletarCURP(e.target.value)} required />
          <input type="text" placeholder="Fecha de Nacimiento" value={nuevaLancha.fechaNacimiento} readOnly disabled />
          <input type="text" placeholder="Estado de Nacimiento" value={nuevaLancha.estadoNacimiento} readOnly disabled />
        </div>

        {/* Sección de datos de la lancha */}
        <div className="form-section">
          <h4>Información de la Lancha</h4>
          <input type="text" placeholder="Matrícula" value={nuevaLancha.matricula} onChange={(e) => setNuevaLancha({ ...nuevaLancha, matricula: e.target.value })} required />
          <input type="text" placeholder="Número de Serie del Motor" value={nuevaLancha.numeroSerieMotor} onChange={(e) => setNuevaLancha({ ...nuevaLancha, numeroSerieMotor: e.target.value })} required />
          <input type="text" placeholder="Marca del Motor" value={nuevaLancha.marcaMotor} onChange={(e) => setNuevaLancha({ ...nuevaLancha, marcaMotor: e.target.value })} required />
          <input type="text" placeholder="Modelo" value={nuevaLancha.modelo} onChange={(e) => setNuevaLancha({ ...nuevaLancha, modelo: e.target.value })} required />
          <input type="text" placeholder="Color de la Lancha" value={nuevaLancha.colorLancha} onChange={(e) => setNuevaLancha({ ...nuevaLancha, colorLancha: e.target.value })} required />
        </div>

        {/* Botones del formulario */}
        <button type="submit">{modoEdicion ? "Actualizar Lancha" : "Registrar Lancha"}</button>
        <button type="button" onClick={cancelarFormulario}>Cancelar</button>
      </form>
    </div>
  </div>
)}
          <div className="lancha-lista">
            {lanchas.map((lancha) => (
              <div className="lancha-item" key={lancha._id}>
                <p>
                  {lancha.nombre} - {lancha.curp}
                </p>
                <button className="edit-btn" onClick={() => prepararEdicion(lancha)}>
                  Editar
                </button>
                <button className="delete-btn" onClick={() => eliminarLancha(lancha._id)}>
                  Eliminar
                </button>
                <button
                  className="details-btn"
                  onClick={() => setLanchaSeleccionada(lancha)}
                >
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {lanchaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Detalles de la Lancha</h3>
            <p>
              <strong>Nombre:</strong> {lanchaSeleccionada.nombre}
            </p>
            <p>
              <strong>CURP:</strong> {lanchaSeleccionada.curp}
            </p>
            <p>
              <strong>Matrícula:</strong> {lanchaSeleccionada.matricula}
            </p>
            <p>
              <strong>Número de Serie del Motor:</strong>{" "}
              {lanchaSeleccionada.numeroSerieMotor}
            </p>
            <p>
              <strong>Marca del Motor:</strong> {lanchaSeleccionada.marcaMotor}
            </p>
            <p>
              <strong>Modelo:</strong> {lanchaSeleccionada.modelo}
            </p>
            <p>
              <strong>Color:</strong> {lanchaSeleccionada.colorLancha}
            </p>
            <button onClick={cerrarDetalles}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
