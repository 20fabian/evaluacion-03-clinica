import { useEffect, useState } from 'react';
import Encabezado from './components/Encabezado';
import PiePagina from './components/PiePagina';
import FiltroEspecialidad from './components/FiltroEspecialidad';
import Boton from './components/Boton';
import PaginaPacientes from './pages/PaginaPacientes';
import PaginaCitas from './pages/PaginaCitas';
import { getCitas, getEspecialidades, getEstados, getMedicos, getPacientes } from './services/api';
import './App.css';

// App.jsx (Pregunta 2) carga las especialidades con useState + useEffect
// y las renderiza con map() usando key. En las Preguntas 3 y 4 centraliza
// el estado de pacientes, médicos y citas que comparte con las páginas.
export default function App() {
  const [especialidades, setEspecialidades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [citas, setCitas] = useState([]);
  const [estados, setEstados] = useState([]);
  const [vista, setVista] = useState('inicio');

  useEffect(() => {
    async function cargar() {
      try {
        const [es, pac, med, cit, est] = await Promise.all([
          getEspecialidades(), getPacientes(), getMedicos(), getCitas(), getEstados(),
        ]);
        setEspecialidades(es);
        setPacientes(pac);
        setMedicos(med);
        setCitas(cit);
        setEstados(est);
      } catch {
        setError('No se pudo conectar con la API de la clinica. Verifique que Django este corriendo en http://localhost:8000.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  function handlePacienteCreado(nuevo) {
    setPacientes((prev) => [nuevo, ...prev]);
  }
  function handlePacienteEliminado(id) {
    setPacientes((prev) => prev.filter((p) => p.id !== id));
  }
  function handleCitaCreada(nueva) {
    setCitas((prev) => [nueva, ...prev]);
  }
  function handleCambiarEstado(actualizada) {
    setCitas((prev) => prev.map((c) => (c.id === actualizada.id ? actualizada : c)));
  }

  return (
    <div className="app">
      <Encabezado />
      <nav className="nav">
        <Boton texto="Inicio" variante={vista === 'inicio' ? 'primario' : 'secundario'} onClick={() => setVista('inicio')} />
        <Boton texto="Pacientes" variante={vista === 'pacientes' ? 'primario' : 'secundario'} onClick={() => setVista('pacientes')} />
        <Boton texto="Medicos" variante={vista === 'medicos' ? 'primario' : 'secundario'} onClick={() => setVista('medicos')} />
        <Boton texto="Citas" variante={vista === 'citas' ? 'primario' : 'secundario'} onClick={() => setVista('citas')} />
      </nav>

      <main className="contenido">
        {error && <p className="form-ok form-error">{error}</p>}

        {vista === 'inicio' && (
          <section>
            <h2>Especialidades</h2>
            {/* Renderizado condicional: mientras llegan los datos muestro «Cargando...» */}
            {cargando ? (
              <p>Cargando...</p>
            ) : especialidades.length === 0 ? (
              <p>No se encontraron especialidades.</p>
            ) : (
              <ul className="lista-especialidades">
                {/* key = id estable de cada elemento: React lo usa para
                    saber qué fila cambió sin confundirlas. Usar el índice
                    rompería el orden al insertar o eliminar elementos. */}
                {especialidades.map((es) => (
                  <li key={es.id}>
                    <strong>{es.nombre}</strong>
                    <span>{es.descripcion}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {vista === 'pacientes' && (
          <PaginaPacientes
            pacientes={pacientes}
            onPacienteCreado={handlePacienteCreado}
          />
        )}

        {vista === 'medicos' && <FiltroEspecialidad />}

        {vista === 'citas' && (
          <PaginaCitas
            citas={citas}
            medicos={medicos}
            pacientes={pacientes}
            estados={estados}
            onCitaCreada={handleCitaCreada}
            onCambiarEstadoCita={handleCambiarEstado}
          />
        )}
      </main>

      <PiePagina />
    </div>
  );
}
