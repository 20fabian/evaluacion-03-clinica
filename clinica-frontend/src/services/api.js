// api.js — Capa de servicio para la API de Django REST Framework.
// La URL base apunta al backend de la Pregunta 1; el modo demo («demo»)
// se usa solo cuando el backend no responde, para capturar la UI.

const BASE = 'http://localhost:8000/api/';

// Datos de demostración (reflejan lo registrado en la Pregunta 1).
const DEMO = {
  especialidades: [
    { id: 1, nombre: 'Medicina General', descripcion: 'Atención primaria y prevención' },
    { id: 2, nombre: 'Pediatria', descripcion: 'Salud de ninos y adolescentes' },
    { id: 3, nombre: 'Cardiologia', descripcion: 'Corazon y circulacion' },
    { id: 4, nombre: 'Dermatologia', descripcion: 'Piel, cabello y unas' },
    { id: 5, nombre: 'Traumatologia', descripcion: 'Huesos y articulaciones' },
    { id: 6, nombre: 'Odontologia', descripcion: 'Salud bucal y dental' },
  ],
  medicos: [
    { id: 1, nombres: 'Dra. Rosa Quispe', cmp: 'CMP-1001', especialidad: 1, especialidad_nombre: 'Medicina General', telefono: '987654321', correo: 'rosa.quispe@clinica.pe', foto: '' },
    { id: 2, nombres: 'Dr. Juan Perez', cmp: 'CMP-1002', especialidad: 1, especialidad_nombre: 'Medicina General', telefono: '987654322', correo: 'juan.perez@clinica.pe', foto: '' },
    { id: 3, nombres: 'Dra. Maria Torres', cmp: 'CMP-1003', especialidad: 2, especialidad_nombre: 'Pediatria', telefono: '987654323', correo: 'maria.torres@clinica.pe', foto: '' },
    { id: 4, nombres: 'Dr. Luis Ramos', cmp: 'CMP-1004', especialidad: 3, especialidad_nombre: 'Cardiologia', telefono: '987654324', correo: 'luis.ramos@clinica.pe', foto: '' },
    { id: 5, nombres: 'Dra. Ana Flores', cmp: 'CMP-1005', especialidad: 3, especialidad_nombre: 'Cardiologia', telefono: '987654325', correo: 'ana.flores@clinica.pe', foto: '' },
    { id: 6, nombres: 'Dr. Pedro Suarez', cmp: 'CMP-1006', especialidad: 5, especialidad_nombre: 'Traumatologia', telefono: '987654326', correo: 'pedro.suarez@clinica.pe', foto: '' },
  ],
  pacientes: [
    { id: 1, dni: '45678912', nombres: 'Carlos Mamani', fecha_nacimiento: '1990-05-12', telefono: '912345678', correo: 'carlos.mamani@mail.pe' },
    { id: 2, dni: '78945612', nombres: 'Lucia Fernandez', fecha_nacimiento: '1985-03-04', telefono: '923456789', correo: 'lucia.fernandez@mail.pe' },
    { id: 3, dni: '12345678', nombres: 'Jorge Medina', fecha_nacimiento: '1978-11-30', telefono: '934567890', correo: 'jorge.medina@mail.pe' },
    { id: 4, dni: '87654321', nombres: 'Elena Vargas', fecha_nacimiento: '1995-07-21', telefono: '945678901', correo: 'elena.vargas@mail.pe' },
    { id: 5, dni: '10293847', nombres: 'Pedro Rojas', fecha_nacimiento: '2001-01-15', telefono: '956789012', correo: 'pedro.rojas@mail.pe' },
  ],
  citas: [
    { id: 1, paciente: 1, paciente_nombre: 'Carlos Mamani', medico: 1, medico_nombre: 'Dra. Rosa Quispe', especialidad: 'Medicina General', fecha: '2026-11-10', hora: '09:00:00', motivo: 'Control anual', estado: 1, estado_nombre: 'pendiente' },
    { id: 2, paciente: 2, paciente_nombre: 'Lucia Fernandez', medico: 3, medico_nombre: 'Dra. Maria Torres', especialidad: 'Pediatria', fecha: '2026-11-10', hora: '10:30:00', motivo: 'Vacunacion', estado: 2, estado_nombre: 'confirmada' },
    { id: 3, paciente: 3, paciente_nombre: 'Jorge Medina', medico: 4, medico_nombre: 'Dr. Luis Ramos', especialidad: 'Cardiologia', fecha: '2026-11-11', hora: '11:00:00', motivo: 'Electrocardiograma', estado: 1, estado_nombre: 'pendiente' },
  ],
  estados: [
    { id: 1, nombre: 'pendiente', es_final: false },
    { id: 2, nombre: 'confirmada', es_final: false },
    { id: 3, nombre: 'atendida', es_final: true },
    { id: 4, nombre: 'cancelada', es_final: true },
  ],
};

// Estado en memoria para las operaciones de escritura en modo demo.
let pacientesDemo = [...DEMO.pacientes];
let citasDemo = [...DEMO.citas];

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let data = null;
    try { data = await res.json(); } catch { /* sin cuerpo JSON */ }
    const err = new Error('HTTP ' + res.status);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

function clasificarError(error) {
  if (!error || !error.message || error.message.startsWith('HTTP')) return error;
  const msg = String(error.message);
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch')) return { demo: true };
  return error;
}

function demoDelay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getEspecialidades() {
  try { return await request('especialidades/'); }
  catch (e) { if (clasificarError(e).demo) { await demoDelay(1200); return DEMO.especialidades; } throw e; }
}

export async function getMedicos(especialidadId) {
  try {
    return await request('medicos/' + (especialidadId ? `?especialidad=${especialidadId}` : ''));
  } catch (e) {
    if (clasificarError(e).demo) {
      await demoDelay(700);
      return especialidadId
        ? DEMO.medicos.filter((m) => String(m.especialidad) === String(especialidadId))
        : DEMO.medicos;
    }
    throw e;
  }
}

export async function getPacientes() {
  try { return await request('pacientes/'); }
  catch (e) { if (clasificarError(e).demo) { await demoDelay(700); return pacientesDemo; } throw e; }
}

export async function getCitas() {
  try { return await request('citas/'); }
  catch (e) { if (clasificarError(e).demo) { await demoDelay(700); return citasDemo; } throw e; }
}

export async function getEstados() {
  try { return await request('citas/estados/'); }
  catch (e) { if (clasificarError(e).demo) { await demoDelay(300); return DEMO.estados; } throw e; }
}

export async function crearPaciente(datos) {
  try { return await request('pacientes/', { method: 'POST', body: JSON.stringify(datos) }); }
  catch (e) {
    if (clasificarError(e).demo) {
      await demoDelay(600);
      const nuevo = { id: Math.max(0, ...pacientesDemo.map((p) => p.id)) + 1, ...datos };
      pacientesDemo = [nuevo, ...pacientesDemo];
      return nuevo;
    }
    throw e;
  }
}

export async function eliminarPaciente(id) {
  try { return await request(`pacientes/${id}/`, { method: 'DELETE' }); }
  catch (e) {
    if (clasificarError(e).demo) { await demoDelay(400); pacientesDemo = pacientesDemo.filter((p) => p.id !== id); return null; }
    throw e;
  }
}

export async function crearCita(datos) {
  try { return await request('citas/', { method: 'POST', body: JSON.stringify(datos) }); }
  catch (e) {
    if (clasificarError(e).demo) {
      await demoDelay(600);
      // Validación redundante en «backend» demo: el médico no puede
      // tener dos citas en la misma fecha y hora (respuesta 400).
      const ocupada = citasDemo.some(
        (c) => String(c.medico) === String(datos.medico) && c.fecha === datos.fecha && String(c.hora).slice(0, 5) === String(datos.hora).slice(0, 5),
      );
      if (ocupada) {
        const err = new Error('HTTP 400');
        err.status = 400;
        err.data = { error: 'El medico ya tiene una cita en esa fecha y hora. Elija otro horario.' };
        throw err;
      }
      if (datos.fecha && datos.fecha < new Date().toISOString().slice(0, 10)) {
        const err = new Error('HTTP 400');
        err.status = 400;
        err.data = { error: 'La fecha de la cita no puede ser anterior a hoy.' };
        throw err;
      }
      const medico = DEMO.medicos.find((m) => String(m.id) === String(datos.medico));
      const paciente = pacientesDemo.find((p) => String(p.id) === String(datos.paciente));
      const nueva = {
        id: Math.max(0, ...citasDemo.map((c) => c.id)) + 1,
        ...datos,
        paciente_nombre: paciente?.nombres || 'Paciente',
        medico_nombre: medico?.nombres || 'Medico',
        especialidad: medico?.especialidad_nombre || '',
        estado: datos.estado || 1,
        estado_nombre: 'pendiente',
      };
      citasDemo = [nueva, ...citasDemo];
      return nueva;
    }
    throw e;
  }
}

export async function actualizarEstadoCita(id, estadoId) {
  try { return await request(`citas/${id}/`, { method: 'PATCH', body: JSON.stringify({ estado: estadoId }) }); }
  catch (e) {
    if (clasificarError(e).demo) {
      await demoDelay(500);
      const estado = DEMO.estados.find((x) => String(x.id) === String(estadoId));
      citasDemo = citasDemo.map((c) => (c.id === id ? { ...c, estado: estadoId, estado_nombre: estado?.nombre || c.estado_nombre } : c));
      return citasDemo.find((c) => c.id === id);
    }
    throw e;
  }
}

export default { getEspecialidades, getMedicos, getPacientes, getCitas, getEstados, crearPaciente, eliminarPaciente, crearCita, actualizarEstadoCita };
