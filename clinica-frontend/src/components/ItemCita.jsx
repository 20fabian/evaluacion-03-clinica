import Boton from './Boton';

// Una fila de la lista de citas. Al hacer clic en «Ver detalle» notifica
// al padre con onSeleccionar(id): el estado de selección vive en el padre
// (elevación del estado) para que el hermano DetalleCita pueda mostrarla.
export default function ItemCita({ cita, onSeleccionar }) {
  return (
    <article className="item-cita">
      <p><strong>{cita.paciente_nombre}</strong> con {cita.medico_nombre}</p>
      <p>{cita.fecha} · {String(cita.hora).slice(0, 5)} · {cita.estado_nombre}</p>
      <Boton texto="Ver detalle" variante="secundario" onClick={() => onSeleccionar(cita.id)} />
    </article>
  );
}
