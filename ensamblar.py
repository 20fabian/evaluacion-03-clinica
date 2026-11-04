# -*- coding: utf-8 -*-
import docx
from docx.shared import Pt, Cm, RGBColor
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

BASE = r'C:\Users\Desarrollador\Documents\Proyecto predeterminado'
DOC = os.path.join(BASE, '_orig.docx')
OUT = os.path.join(BASE, 'Evaluacion-03-A - 2026 - Grupo 01 - Desarrollo de Aplicaciones Empresariales.docx')
CAP = os.path.join(BASE, 'capturas')
SRC = os.path.join(BASE, 'clinica-frontend', 'src')

d = docx.Document(DOC)
tbl = d.tables[1]  # tabla de preguntas (3x3 con vMerge/gridSpan)

def texto_celda(celda):
    return "\n".join(p.text for p in celda.paragraphs)

def encontrar_fila_enunciado(marker):
    """Devuelve la fila (_tr) de la tabla 1 cuya celda 0 (gridSpan=3) contiene marker."""
    for row in tbl.rows:
        c0 = row.cells[0]
        if c0._tc.tcPr is not None and c0._tc.tcPr.gridSpan is not None:
            t = texto_celda(c0)
            if marker in t:
                return row
    return None

def insertar_fila_despues(row):
    """Inserta una nueva <w:tr> con una celda gridSpan=3 justo después de `row`."""
    tr = row._tr
    # Copiar trPr (propiedades de fila) de la original
    trPr = tr.find(qn('w:trPr'))
    nuevo_tr = OxmlElement('w:tr')
    if trPr is not None:
        nuevo_tr.append(trPr.__copy__())
    # Celda única que abarca 3 columnas
    tc = OxmlElement('w:tc')
    tcPr = OxmlElement('w:tcW')
    tcPr.set(qn('w:w'), '9826')   # ancho aprox total de la tabla
    tcPr.set(qn('w:type'), 'dxa')
    tc.append(tcPr)
    gridSpan = OxmlElement('w:gridSpan')
    gridSpan.set(qn('w:val'), '3')
    tcPr2 = tc.find(qn('w:tcPr'))
    if tcPr2 is None:
        tcPr2 = OxmlElement('w:tcPr')
        tc.insert(0, tcPr2)
    tcPr2.append(gridSpan)
    # párrafo vacío inicial
    p = OxmlElement('w:p')
    pPr = OxmlElement('w:pPr')
    p.append(pPr)
    r = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    sz = OxmlElement('w:sz'); sz.set(qn('w:val'), '20'); rPr.append(sz)
    r.append(rPr)
    t = OxmlElement('w:t'); t.text = ''
    r.append(t)
    p.append(r)
    tc.append(p)
    nuevo_tr.append(tc)
    tr.addnext(nuevo_tr)
    # devolver celda como objeto Cell de python-docx
    from docx.table import _Cell
    cell = _Cell(tc, row._parent if hasattr(row, '_parent') else tbl)
    return cell

def parrafo_con_texto(cell, texto, tam=11, negrita=False, color=None, espacio_despues=6, mono=False):
    p = cell.add_paragraph()
    p.paragraph_format.space_after = Pt(espacio_despues)
    run = p.add_run(texto)
    run.font.size = Pt(tam)
    run.font.bold = negrita
    run.font.name = 'Consolas' if mono else 'Calibri'
    if mono:
        rpr = run._element.get_or_add_rPr()
        rf = OxmlElement('w:rFonts'); rf.set(qn('w:ascii'), 'Consolas'); rf.set(qn('w:hAnsi'), 'Consolas'); rpr.append(rf)
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    return p

def bloque_codigo(cell, ruta, tam=8.5):
    with open(ruta, 'r', encoding='utf-8') as f:
        codigo = f.read()
    # título del archivo
    parrafo_con_texto(cell, os.path.basename(ruta), tam=tam, negrita=True, color='0B5E50', espacio_despues=2)
    p = cell.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    # fondo gris claro para el bloque de código
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement('w:shd'); shd.set(qn('w:val'), 'clear'); shd.set(qn('w:color'), 'auto'); shd.set(qn('w:fill'), 'F2F5F2')
    pPr.append(shd)
    run = p.add_run(codigo)
    run.font.size = Pt(tam)
    run.font.name = 'Consolas'
    rpr = run._element.get_or_add_rPr()
    rf = OxmlElement('w:rFonts'); rf.set(qn('w:ascii'), 'Consolas'); rf.set(qn('w:hAnsi'), 'Consolas'); rpr.append(rf)
    return p

def insertar_imagen(cell, ruta, ancho_cm=15.5):
    if not os.path.exists(ruta):
        parrafo_con_texto(cell, f'[IMAGEN NO ENCONTRADA: {ruta}]', tam=10, color='C00000')
        return
    p = cell.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run()
    run.add_picture(ruta, width=Cm(ancho_cm))

SECCIONES = [
    # (marker, [bloques])
    ('Pregunta 2:', [
        ('texto', 'Para la Pregunta 2 inicialicé el proyecto con Vite usando `npm create vite@latest clinica-frontend -- --template react` y lo ejecuté con `npm run dev` en http://localhost:5173.\n\n- `index.html`: es el punto de entrada del navegador; solo monta el div con id "root" y carga el script module de main.jsx.\n- `main.jsx`: crea la raíz de React con `createRoot(document.getElementById(\'root\')).render(...)` y envuelve la app en `ClinicaProvider` (Context API). `createRoot()` inicializa el contenedor DOM donde React renderiza su árbol de componentes y gestiona el DOM virtual.\n- `App.jsx`: componente padre que define la navegación entre las vistas (Inicio, Pacientes, Médicos, Citas) y centraliza el estado de especialidades, pacientes, médicos, citas y estados.\n- `package.json`: lista las dependencias del proyecto (React, React DOM, Vite) y los scripts `dev`, `build`, `preview`.\n\nEstructura de `src/`: `components/`, `pages/`, `services/` y `context/`.\n\nExplicación de la prop `key`: React necesita `key` para identificar de forma estable cada elemento de una lista renderizada con `.map()`. Así puede reutilizar, mover o eliminar nodos del DOM sin reconstruir toda la lista. Si uso el índice del arreglo como `key`, al insertar o borrar elementos en el medio React pierde la correspondencia y puede renderizar contenido en la fila equivocada o perder el estado de los inputs. Por eso usé el `id` estable de cada especialidad.\n'),
        ('codigo', os.path.join(BASE, 'clinica-frontend', 'index.html')),
        ('codigo', os.path.join(SRC, 'main.jsx')),
        ('codigo', os.path.join(SRC, 'App.jsx')),
        ('codigo', os.path.join(SRC, 'services', 'api.js')),
        ('codigo', os.path.join(SRC, 'components', 'Encabezado.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'PiePagina.jsx')),
        ('img', os.path.join(CAP, 'p2-cargando.png')),
        ('img', os.path.join(CAP, 'p2-especialidades.png')),
        ('img', os.path.join(CAP, 'p2-consola.png')),
    ]),
    ('Pregunta 3:', [
        ('texto', 'Desarrollé las pantallas de pacientes y médicos con componentes funcionales reutilizables.\n\n- `TarjetaMedico`: recibe props desestructuradas (nombres, cmp, especialidad, especialidad_nombre, foto) y muestra una imagen por defecto si no llega foto.\n- `Boton`: reutilizable, recibe texto, variante, tipo y onClick.\n- `FormularioPaciente`: formulario controlado con un único estado `form` y `handleChange` que usa `event.target.name` y `event.target.value`. `onSubmit` llama `event.preventDefault()` para no recargar la página. Valida DNI (8 dígitos), campos obligatorios y formato email, mostrando el error debajo de cada campo. Si todo es correcto, hace POST a /api/pacientes/, muestra éxito y limpia el formulario.\n- `TablaPacientes`: renderiza una fila por paciente con botón «Eliminar» que pide confirmación y envía DELETE.\n- `BuscadorPacientes`: input con `onChange` que filtra por nombre o DNI mientras se escribe; botón «Limpiar» (onClick) vacía el filtro.\n- `FiltroEspecialidad`: `<select>` con `onChange` que consulta /api/medicos/?especialidad=<id>, muestra las TarjetaMedico filtradas y un contador de resultados.\n\nDiferencia `onClick={eliminar}` vs `onClick={() => eliminar(id)}`: con `onClick={eliminar}` paso la referencia de la función (se ejecuta sin el id y no sé qué fila eliminar). Con la función flecha `() => eliminar(id)` creo un cierre que captura el id y se ejecuta solo al hacer clic; así paso parámetros al manejador.\n'),
        ('codigo', os.path.join(SRC, 'components', 'Boton.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'TarjetaMedico.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'FormularioPaciente.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'TablaPacientes.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'BuscadorPacientes.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'FiltroEspecialidad.jsx')),
        ('codigo', os.path.join(SRC, 'pages', 'PaginaPacientes.jsx')),
        ('img', os.path.join(CAP, 'p3-validacion.png')),
        ('img', os.path.join(CAP, 'p3-registrado.png')),
        ('img', os.path.join(CAP, 'p3-buscador.png')),
        ('img', os.path.join(CAP, 'p3-medicos.png')),
    ]),
    ('Pregunta 4:', [
        ('texto', 'Implementé la página de citas con `PaginaCitas` como padre.\n\n- Padre -> hijo (props): `PaginaCitas` guarda citas, médicos y pacientes en su estado y los envía por props a `FormularioCita`, `ListaCitas`, `DetalleCita` y `ResumenCita`. `ListaCitas` renderiza un `ItemCita` por cada cita.\n- Hijo -> padre (callbacks): `FormularioCita` recibe `onCitaCreada`; al registrar la cita (POST /api/citas/) invoca el callback con la cita devuelta y `PaginaCitas` la agrega a su estado sin recargar la página. Si la API responde 400, se muestra el mensaje en el formulario.\n- Entre hermanos (elevación del estado): al hacer clic en «Ver detalle» en un `ItemCita` se notifica al padre con `onSeleccionar(id)`, y el hermano `DetalleCita` muestra la información completa de esa cita.\n- Cambio de estado: `DetalleCita` tiene botones «Confirmar», «Marcar como atendida» y «Cancelar» que envían PATCH a la API y notifican al padre con `onCambiarEstado`. El cambio se refleja a la vez en `ListaCitas` y en `ResumenCita` (que calcula totales por estado a partir de sus props). Los botones se deshabilitan en estados finales («atendida», «cancelada»).\n- Context API: `ClinicaContext` comparte la recepcionista activa y la fecha de trabajo; `Encabezado` y `FormularioCita` los leen con `useContext` sin recibirlos por props.\n\nDiagrama del árbol de componentes:\n```\nPaginaCitas (padre, estado de citas/medicos/pacientes/estados)\n├── Encabezado ──(useContext: ClinicaContext)──> recepcionista, fechaTrabajo\n├── FormularioCita ──(props: pacientes, medicos; callback onCitaCreada)──┐\n│                                            └──(useContext)──> fechaTrabajo\n├── ListaCitas ──(props: citas; callback onSeleccionar)──┐\n│    └── ItemCita (por cita) ──(clic)──> onSeleccionar(id)\n├── DetalleCita ──(props: cita, estados; callback onCambiarEstado)\n└── ResumenCita ──(props: citas, estados)──> totales por estado\n```\nProps viajan de `PaginaCitas` a hijos; callbacks viajan de hijos a padre (`onCitaCreada`, `onSeleccionar`, `onCambiarEstado`); el contexto viaja de `ClinicaProvider` a `Encabezado` y `FormularioCita`.\n'),
        ('codigo', os.path.join(SRC, 'context', 'ClinicaContext.jsx')),
        ('codigo', os.path.join(SRC, 'pages', 'PaginaCitas.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'FormularioCita.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'ListaCitas.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'ItemCita.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'DetalleCita.jsx')),
        ('codigo', os.path.join(SRC, 'components', 'ResumenCitas.jsx')),
        ('img', os.path.join(CAP, 'p4-nueva-cita.png')),
        ('img', os.path.join(CAP, 'p4-error400.png')),
        ('img', os.path.join(CAP, 'p4-detalle.png')),
        ('img', os.path.join(CAP, 'p4-cambio-estado.png')),
    ]),
    ('Pregunta 5:', [
        ('texto', 'Para la Pregunta 5 desarrollo esta reflexión final.\n\n1. Ventajas de separar Backend (Django REST) y Frontend (React): separar ambos permite trabajar de forma independiente, elegir tecnologías óptimas para cada capa, escalar por separado, exponer la misma API a web y móvil, y que el frontend tenga una UI reactiva sin recargas de página, algo limitado con las plantillas de Django.\n\n2. Diferencias entre Props y State: los props son datos de entrada que recibe un componente desde su padre y son inmutables para quien los recibe; el state es datos internos propios del componente que puede cambiar con `setState`/`useState`. Uso props para configurar componentes y state para datos que cambian con el tiempo (formularios, listas, selección de cita).\n\n3. Ventajas de elevar el estado vs Context API: elevar el estado al padre es ideal cuando pocos componentes hermanos necesitan compartir datos (lista <-> detalle <-> resumen). Conviene Context API cuando la información es transversal y se usa en muchos niveles (recepcionista y fecha de trabajo en `Encabezado` y `FormularioCita`), evitando el «prop drilling».\n\n4. Importancia de la validación redundante en el backend: aunque React valide en el cliente, un usuario puede enviar peticiones directamente con curl/Postman o desactivar JavaScript. Por seguridad y consistencia, el backend debe revalidar (horario ocupado, fecha pasada, DNI único) y responder 400 con mensajes claros, porque la fuente de verdad es el servidor.\n'),
    ]),
]

# Encabezado de respuestas: insertar un párrafo de inicio antes del primer bloque
for marker, bloques in SECCIONES:
    fila = encontrar_fila_enunciado(marker)
    if fila is None:
        print('NO SE ENCONTRÓ:', marker)
        continue
    cell = insertar_fila_despues(fila)
    # título de la sección de respuesta
    parrafo_con_texto(cell, '--- RESPUESTA (insertada sobre el documento original) ---', tam=11, negrita=True, color='0B5E50', espacio_despues=6)
    for tipo, ruta in bloques:
        if tipo == 'texto':
            parrafo_con_texto(cell, ruta, tam=11, espacio_despues=8)
        elif tipo == 'codigo':
            bloque_codigo(cell, ruta)
        elif tipo == 'img':
            insertar_imagen(cell, ruta)

d.save(OUT)
print('GUARDADO:', OUT)
