import './TarjetaMedico.css';

const FOTO_DEFECTO = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="#dff0e8"/><circle cx="60" cy="46" r="22" fill="#0b5e50"/><rect x="30" y="76" width="60" height="34" rx="16" fill="#0b5e50"/></svg>',
);

// Props desestructuradas: recibo justo los datos que necesito renderizar.
export default function TarjetaMedico({ nombres, cmp, especialidad, especialidad_nombre, foto }) {
  return (
    <article className="tarjeta-medico">
      <img src={foto || FOTO_DEFECTO} alt={`Foto de ${nombres}`} width="72" height="72" />
      <h3>{nombres}</h3>
      <p>CMP: {cmp}</p>
      <p>Especialidad: {especialidad_nombre ?? especialidad}</p>
    </article>
  );
}
