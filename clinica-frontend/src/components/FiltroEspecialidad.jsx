import { useEffect, useState } from 'react';
import { getEspecialidades, getMedicos } from '../services/api';
import TarjetaMedico from './TarjetaMedico';
import Boton from './Boton';
import './FiltroEspecialidad.css';

// Filtra médicos por especialidad consumiendo /api/medicos/?especialidad=<id>
// y muestra el contador de médicos resultantes.
export default function FiltroEspecialidad() {
  const [especialidades, setEspecialidades] = useState([]);
  const [elegida, setElegida] = useState('');
  const [medicos, setMedicos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getEspecialidades().then(setEspecialidades).catch(() => setEspecialidades([]));
  }, []);

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    getMedicos(elegida || undefined)
      .then((datos) => { if (vigente) setMedicos(datos); })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [elegida]);

  return (
    <section className="filtro-especialidad">
      <h2>Medicos por especialidad</h2>
      <div className="filtro-controles">
        <label>
          Especialidad
          <select value={elegida} onChange={(e) => setElegida(e.target.value)}>
            <option value="">Todas</option>
            {especialidades.map((es) => (
              <option key={es.id} value={es.id}>{es.nombre}</option>
            ))}
          </select>
        </label>
        <Boton texto="Limpiar filtro" variante="secundario" onClick={() => setElegida('')} />
        <span aria-live="polite">Medicos mostrados: {medicos.length}</span>
      </div>

      {cargando ? <p>Cargando...</p> : (
        <div className="rejilla-medicos">
          {medicos.map((m) => (
            <TarjetaMedico
              key={m.id}
              nombres={m.nombres}
              cmp={m.cmp}
              especialidad={m.especialidad}
              especialidad_nombre={m.especialidad_nombre}
              foto={m.foto}
            />
          ))}
        </div>
      )}
    </section>
  );
}
