import { useState } from 'react';
import { actualizarEstadoCita } from '../services/api';
import Boton from './Boton';
import './DetalleCita.css';

const ES_FINAL = ['atendida', 'cancelada'];

// Muestra el detalle de la cita seleccionada y permite cambiar su estado.
// El cambio se envía por PATCH y se avisa al padre con onCambiarEstado.
export default function DetalleCita({ cita, estados, onCambiarEstado }) {
  const [aviso, setAviso] = useState('');
  if (!cita) return <p>Seleccione una cita con «Ver detalle» para ver su informacion.</p>;

  const final = ES_FINAL.includes(String(cita.estado_nombre).toLowerCase());
  const estadoId = (nombre) => estados.find((e) => e.nombre === nombre)?.id;

  async function cambiar(nombre) {
    const id = estadoId(nombre);
    if (!id) return;
    const actualizada = await actualizarEstadoCita(cita.id, id);
    setAviso(`Estado actualizado a «${actualizada.estado_nombre}».`);
    onCambiarEstado?.(actualizada);
  }

  return (
    <section className="detalle-cita">
      <h2>Detalle de la cita</h2>
      {aviso && <p className="form-ok" role="status">{aviso}</p>}
      <dl>
        <dt>Paciente</dt><dd>{cita.paciente_nombre}</dd>
        <dt>Medico</dt><dd>{cita.medico_nombre}</dd>
        <dt>Especialidad</dt><dd>{cita.especialidad || '—'}</dd>
        <dt>Fecha</dt><dd>{cita.fecha}</dd>
        <dt>Hora</dt><dd>{String(cita.hora).slice(0, 5)}</dd>
        <dt>Motivo</dt><dd>{cita.motivo || '—'}</dd>
        <dt>Estado</dt><dd>{cita.estado_nombre}</dd>
      </dl>
      <div className="detalle-acciones">
        <Boton texto="Confirmar" variante="primario" disabled={final} onClick={() => cambiar('confirmada')} />
        <Boton texto="Marcar como atendida" variante="secundario" disabled={final} onClick={() => cambiar('atendida')} />
        <Boton texto="Cancelar" variante="peligro" disabled={final} onClick={() => cambiar('cancelada')} />
      </div>
      {final && <p className="nota-final">Cita en estado final: los botones estan deshabilitados.</p>}
    </section>
  );
}
