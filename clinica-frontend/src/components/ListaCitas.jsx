import ItemCita from './ItemCita';
import './ListaCitas.css';

// Renderiza un ItemCita por cada cita y le pasa el callback del padre.
export default function ListaCitas({ citas, onSeleccionar }) {
  if (!citas || citas.length === 0) return <p>No hay citas registradas.</p>;
  return (
    <div className="lista-citas">
      {citas.map((c) => (
        <ItemCita key={c.id} cita={c} onSeleccionar={onSeleccionar} />
      ))}
    </div>
  );
}
