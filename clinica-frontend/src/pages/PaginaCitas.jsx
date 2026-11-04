import { useState } from 'react';
import FormularioCita from '../components/FormularioCita';
import ListaCitas from '../components/ListaCitas';
import DetalleCita from '../components/DetalleCita';
import ResumenCitas from '../components/ResumenCitas';
import './PaginaCitas.css';

// PaginaCitas es el padre: guarda las citas, los médicos y los pacientes
// en su estado y los reparte por props. También guarda cuál cita está
// seleccionada, para que DetalleCita (hermano de ListaCitas) la muestre.
export default function PaginaCitas({ citas, medicos, pacientes, estados, onCitaCreada, onCambiarEstadoCita }) {
  const [seleccionadaId, setSeleccionadaId] = useState(null);
  const seleccionada = citas.find((c) => c.id === seleccionadaId) || null;

  return (
    <section className="pagina-citas">
      <h2>Recepcion — Reserva de citas</h2>
      <div className="citas-columnas">
        <div>
          <FormularioCita pacientes={pacientes} medicos={medicos} onCitaCreada={onCitaCreada} />
          <h3>Citas registradas</h3>
          <ListaCitas citas={citas} onSeleccionar={setSeleccionadaId} />
        </div>
        <div>
          <DetalleCita cita={seleccionada} estados={estados} onCambiarEstado={onCambiarEstadoCita} />
          <ResumenCitas citas={citas} estados={estados} />
        </div>
      </div>
    </section>
  );
}
