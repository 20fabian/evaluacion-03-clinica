import { eliminarPaciente } from '../services/api';
import Boton from './Boton';
import './TablaPacientes.css';

export default function TablaPacientes({ pacientes, onEliminar }) {
  async function handleEliminar(id) {
    // Uso la función flecha en el onClick para pasar el id sin ejecutarlo:
    // onClick={() => handleEliminar(p.id)} (no onClick={handleEliminar(p.id)}).
    const ok = window.confirm('¿Confirma que desea eliminar este paciente?');
    if (!ok) return;
    await eliminarPaciente(id);
    onEliminar?.(id);
  }

  return (
    <div className="tabla-wrap">
      <table className="tabla">
        <thead>
          <tr><th>DNI</th><th>Nombres</th><th>Nacimiento</th><th>Telefono</th><th>Correo</th><th>Accion</th></tr>
        </thead>
        <tbody>
          {pacientes.length === 0 && (
            <tr><td colSpan="6">Sin pacientes para mostrar.</td></tr>
          )}
          {pacientes.map((p) => (
            <tr key={p.id}>
              <td>{p.dni}</td>
              <td>{p.nombres}</td>
              <td>{p.fecha_nacimiento}</td>
              <td>{p.telefono}</td>
              <td>{p.correo}</td>
              <td><Boton texto="Eliminar" variante="peligro" onClick={() => handleEliminar(p.id)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
