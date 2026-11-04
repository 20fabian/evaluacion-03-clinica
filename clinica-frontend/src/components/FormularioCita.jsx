import { useContext, useState } from 'react';
import { ClinicaContext } from '../context/ClinicaContext';
import { crearCita } from '../services/api';
import Boton from './Boton';
import './FormularioCita.css';

const VACIO = { paciente: '', medico: '', fecha: '', hora: '09:00', motivo: '' };

// Formulario de citas. Recibe por props los catálogos y el callback
// `onCitaCreada` para avisar al padre cuando la API responde 201.
export default function FormularioCita({ pacientes, medicos, onCitaCreada }) {
  // La fecha de trabajo llega por Context API, no por props.
  const { fechaTrabajo } = useContext(ClinicaContext);
  const [form, setForm] = useState({ ...VACIO, fecha: fechaTrabajo });
  const [errorApi, setErrorApi] = useState('');
  const [ok, setOk] = useState('');
  const [enviando, setEnviando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorApi('');
    setOk('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setEnviando(true);
    try {
      const cita = await crearCita(form);
      setOk(`Cita registrada: ${cita.paciente_nombre} con ${cita.medico_nombre} el ${cita.fecha} a las ${cita.hora}.`);
      setForm({ ...VACIO, fecha: fechaTrabajo });
      // Callback hijo -> padre: el padre agrega la cita a su estado.
      onCitaCreada?.(cita);
    } catch (err) {
      // El backend responde HTTP 400 si el horario está ocupado o la
      // fecha es pasada; muestro ese mensaje dentro del formulario.
      setErrorApi(
        err?.data?.error || err?.data?.detail || 'No se pudo registrar la cita. Revise la fecha y la hora.',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="form-cita" onSubmit={handleSubmit}>
      <h2>Reservar cita</h2>
      {ok && <p className="form-ok" role="status">{ok}</p>}
      {errorApi && <p className="form-ok form-error" role="alert">{errorApi}</p>}
      <label>
        Paciente
        <select name="paciente" value={form.paciente} onChange={handleChange} required>
          <option value="">Seleccione...</option>
          {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nombres}</option>)}
        </select>
      </label>
      <label>
        Medico
        <select name="medico" value={form.medico} onChange={handleChange} required>
          <option value="">Seleccione...</option>
          {medicos.map((m) => <option key={m.id} value={m.id}>{m.nombres} — {m.especialidad_nombre}</option>)}
        </select>
      </label>
      <label>
        Fecha
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
      </label>
      <label>
        Hora
        <input type="time" name="hora" value={form.hora} onChange={handleChange} required />
      </label>
      <label>
        Motivo
        <input name="motivo" value={form.motivo} onChange={handleChange} placeholder="Ej: Control anual" required />
      </label>
      <Boton texto={enviando ? 'Registrando...' : 'Registrar cita'} variante="primario" tipo="submit" disabled={enviando} />
    </form>
  );
}
