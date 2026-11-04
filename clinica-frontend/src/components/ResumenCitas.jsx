// Calcula los totales por estado a partir de las props `citas`.
// Como el padre actualiza su estado, el resumen se recalcula solo.
export default function ResumenCitas({ citas, estados }) {
  const contar = (nombre) => (citas || []).filter((c) => c.estado_nombre === nombre).length;
  return (
    <section className="resumen-citas">
      <h2>Resumen de citas</h2>
      <p>Total: {(citas || []).length} citas</p>
      <ul>
        {estados.map((e) => (
          <li key={e.id}>{e.nombre}: {contar(e.nombre)}</li>
        ))}
      </ul>
    </section>
  );
}
