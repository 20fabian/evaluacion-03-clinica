import Boton from './Boton';
import './BuscadorPacientes.css';

// El buscador es «controlado» por el padre: recibo el texto y aviso cada
// cambio con onChange para filtrar la tabla en tiempo real.
export default function BuscadorPacientes({ texto, onChange }) {
  function limpiar() {
    onChange('');
  }

  return (
    <div className="buscador">
      <input
        type="search"
        value={texto}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o DNI..."
        aria-label="Buscar paciente por nombre o DNI"
      />
      <Boton texto="Limpiar" variante="secundario" onClick={limpiar} />
    </div>
  );
}
