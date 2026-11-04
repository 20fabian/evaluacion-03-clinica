import { useState } from 'react';
import { crearPaciente } from '../services/api';
import Boton from './Boton';
import './FormularioPaciente.css';

const VACIO = { dni: '', nombres: '', fecha_nacimiento: '', telefono: '', correo: '' };

export default function FormularioPaciente({ onPacienteCreado }) {
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Un único manejador para todos los campos: leo el name y el value
  // del evento y actualizo el estado con una clave dinámica.
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
    setExito('');
  }

  function validar() {
    const e = {};
    if (!form.dni) e.dni = 'El DNI es obligatorio.';
    else if (!/^\d{8}$/.test(form.dni)) e.dni = 'El DNI debe tener exactamente 8 digitos.';
    if (!form.nombres.trim()) e.nombres = 'Los nombres son obligatorios.';
    if (!form.fecha_nacimiento) e.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.';
    if (!form.telefono.trim()) e.telefono = 'El telefono es obligatorio.';
    else if (!/^\d{9}$/.test(form.telefono)) e.telefono = 'El telefono debe tener 9 digitos.';
    if (!form.correo) e.correo = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = 'Ingrese un correo valido (ej: nombre@mail.pe).';
    return e;
  }

  async function handleSubmit(event) {
    event.preventDefault(); // evito que el navegador recargue la página
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    setEnviando(true);
    try {
      const nuevo = await crearPaciente(form);
      setExito(`Paciente registrado correctamente: ${nuevo.nombres} (DNI ${nuevo.dni}).`);
      setForm(VACIO);
      onPacienteCreado?.(nuevo);
    } catch (err) {
      setErrores({ general: err?.data?.error || err?.data?.dni?.[0] || err?.data?.correo?.[0] || 'No se pudo registrar el paciente.' });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="form-paciente" onSubmit={handleSubmit} noValidate>
      <h2>Registrar paciente</h2>
      {exito && <p className="form-ok" role="status">{exito}</p>}
      {errores.general && <p className="form-ok form-error" role="alert">{errores.general}</p>}

      <label>
        DNI
        <input name="dni" value={form.dni} onChange={handleChange} placeholder="Ej: 45678912" />
        {errores.dni && <span className="error">{errores.dni}</span>}
      </label>
      <label>
        Nombres completos
        <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Ej: Ana Torres Vega" />
        {errores.nombres && <span className="error">{errores.nombres}</span>}
      </label>
      <label>
        Fecha de nacimiento
        <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
        {errores.fecha_nacimiento && <span className="error">{errores.fecha_nacimiento}</span>}
      </label>
      <label>
        Telefono
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Ej: 987654321" />
        {errores.telefono && <span className="error">{errores.telefono}</span>}
      </label>
      <label>
        Correo electronico
        <input type="email" name="correo" value={form.correo} onChange={handleChange} placeholder="Ej: ana@mail.pe" />
        {errores.correo && <span className="error">{errores.correo}</span>}
      </label>

      <Boton texto={enviando ? 'Registrando...' : 'Registrar paciente'} variante="primario" tipo="submit" disabled={enviando} />
    </form>
  );
}
