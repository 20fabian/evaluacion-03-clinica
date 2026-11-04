import './Boton.css';

// Componente reutilizable. Acepta texto o children, una variante visual
// y el manejador onClick que le pasa quien lo usa.
export default function Boton({ texto, variante = 'primario', tipo = 'button', onClick, disabled = false, children }) {
  return (
    <button type={tipo} className={`boton boton-${variante}`} onClick={onClick} disabled={disabled}>
      {children ?? texto}
    </button>
  );
}
