import { createContext, useMemo, useState } from 'react';

// ClinicaContext comparte información transversal (recepcionista activa y
// fecha de trabajo) para no perforar props en toda la jerarquía.
export const ClinicaContext = createContext(null);

export function ClinicaProvider({ children }) {
  const [recepcionista] = useState('Maria Fuentes');
  const [fechaTrabajo, setFechaTrabajo] = useState(() => new Date().toISOString().slice(0, 10));

  const value = useMemo(
    () => ({ recepcionista, fechaTrabajo, setFechaTrabajo }),
    [recepcionista, fechaTrabajo],
  );

  return <ClinicaContext.Provider value={value}>{children}</ClinicaContext.Provider>;
}

export default ClinicaContext;
