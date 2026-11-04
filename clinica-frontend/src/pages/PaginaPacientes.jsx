import { useMemo, useState } from 'react';
import BuscadorPacientes from '../components/BuscadorPacientes';
import FormularioPaciente from '../components/FormularioPaciente';
import TablaPacientes from '../components/TablaPacientes';

export default function PaginaPacientes({ pacientes, onPacienteCreado }) {
  const [texto, setTexto] = useState('');

  // Filtro en tiempo real: mientras escribo en el buscador, la tabla
  // se vuelve a calcular con useMemo sobre el texto actual.
  const filtrados = useMemo(() => {
    const t = texto.trim().toLowerCase();
    if (!t) return pacientes;
    return pacientes.filter(
      (p) => p.nombres.toLowerCase().includes(t) || String(p.dni).includes(t),
    );
  }, [pacientes, texto]);

  return (
    <section>
      <h2>Pacientes</h2>
      <FormularioPaciente onPacienteCreado={onPacienteCreado} />
      <h3>Listado de pacientes</h3>
      <BuscadorPacientes texto={texto} onChange={setTexto} />
      <TablaPacientes pacientes={filtrados} onEliminar={() => {}} />
    </section>
  );
}
