import { useContext } from 'react';
import { ClinicaContext } from '../context/ClinicaContext';
import './Encabezado.css';

export default function Encabezado() {
  // Leo la información transversal por contexto, sin recibir props.
  const { recepcionista, fechaTrabajo } = useContext(ClinicaContext);
  const hoy = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="encabezado">
      <div className="encabezado-marca">
        <span className="encabezado-logo" aria-hidden="true">+</span>
        <div>
          <h1>Clinica San Gabriel</h1>
          <p>Sistema de gestion de citas medicas</p>
        </div>
      </div>
      {/* La fecha actual se inyecta con una expresión JSX {} */}
      <div className="encabezado-meta">
        <span>{hoy}</span>
        <span>Recepcionista: {recepcionista}</span>
        <span>Fecha de trabajo: {fechaTrabajo}</span>
      </div>
    </header>
  );
}
