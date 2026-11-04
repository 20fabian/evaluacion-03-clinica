// Capturas reales con Chromium headless (Playwright) sobre http://localhost:5173
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const OUT = '../capturas';
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  await sleep(500);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('CAPTURA', name);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });
const consoleMsgs = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') consoleMsgs.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => consoleMsgs.push('[pageerror] ' + e.message));

// --- Pregunta 2 ---
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
await page.getByText('Cargando...').first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
await shot(page, 'p2-cargando');                     // 1) «Cargando...»
await page.getByText('Medicina General').first().waitFor({ timeout: 15000 });
await shot(page, 'p2-especialidades');               // 2) especialidades cargadas

// --- Pregunta 3 (Pacientes) ---
await page.getByRole('button', { name: 'Pacientes', exact: true }).click();
await page.getByRole('heading', { name: 'Registrar paciente' }).waitFor({ timeout: 10000 });
await page.getByPlaceholder('Ej: 45678912').fill('123');
await page.getByPlaceholder('Ej: ana@mail.pe').fill('correo-invalido');
await page.getByRole('button', { name: 'Registrar paciente' }).click();
await page.getByText('El DNI debe tener exactamente 8 digitos.').waitFor({ timeout: 5000 });
await shot(page, 'p3-validacion');                   // 1) errores de validación

await page.getByPlaceholder('Ej: 45678912').fill('73456789');
await page.getByPlaceholder('Ej: Ana Torres Vega').fill(' Sofia Herrera '); // hueco previo para evitar el placeholder
await page.getByPlaceholder('Ej: Ana Torres Vega').fill('Sofia Herrera');
await page.getByPlaceholder('Ej: 987654321').fill('998877665');
await page.getByPlaceholder('Ej: ana@mail.pe').fill('sofia.herrera@mail.pe');
await page.locator('input[type="date"]').fill('1993-06-18');
await page.getByRole('button', { name: 'Registrar paciente' }).click();
await page.getByText('Paciente registrado correctamente').waitFor({ timeout: 10000 });
await shot(page, 'p3-registrado');                   // 2) paciente nuevo en la tabla

await page.getByLabel('Buscar paciente por nombre o DNI').fill('Sofia');
await page.getByText('Sofia Herrera').first().waitFor({ timeout: 5000 });
await shot(page, 'p3-buscador');                     // 3) buscador filtrando
await page.getByRole('button', { name: 'Limpiar', exact: true }).click();

// --- Pregunta 3 (Médicos) ---
await page.getByRole('button', { name: 'Medicos', exact: true }).click();
await page.getByRole('heading', { name: 'Medicos por especialidad' }).waitFor({ timeout: 10000 });
await page.locator('select').selectOption({ label: 'Cardiologia' });
await page.getByText('Medicos mostrados: 2').waitFor({ timeout: 10000 });
await page.waitForTimeout(600);
await shot(page, 'p3-medicos');                      // 4) filtro por especialidad

// --- Pregunta 4 (Citas) ---
await page.getByRole('button', { name: 'Citas', exact: true }).click();
await page.getByRole('heading', { name: 'Recepcion — Reserva de citas' }).waitFor({ timeout: 10000 });
await shot(page, 'p4-inicio-citas');
await page.getByRole('button', { name: 'Ver detalle' }).first().click();
await page.getByRole('heading', { name: 'Detalle de la cita' }).waitFor({ timeout: 5000 });
await shot(page, 'p4-detalle');                      // 3) detalle de la cita

await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
await page.getByText('Estado actualizado a').waitFor({ timeout: 10000 });
await shot(page, 'p4-cambio-estado');                // 4) lista + resumen actualizados

// Error 400: mismo médico, misma fecha y hora ya ocupada (demo: 2026-11-10 09:00, médico 1)
const selects = page.locator('.form-cita select');
await selects.nth(0).selectOption('1');
await selects.nth(1).selectOption('1');
await page.locator('.form-cita input[type="date"]').fill('2026-11-10');
await page.locator('.form-cita input[type="time"]').fill('09:00');
await page.locator('.form-cita input[name="motivo"]').fill('Control');
await page.locator('.form-cita').getByRole('button', { name: /Registrar cita/ }).click();
await page.getByText('El medico ya tiene una cita en esa fecha y hora').waitFor({ timeout: 10000 });
await shot(page, 'p4-error400');                     // 2) alerta HTTP 400

// Cita nueva registrada y visible en la lista
await page.locator('.form-cita input[type="date"]').fill('2026-12-01');
await page.locator('.form-cita input[type="time"]').fill('08:30');
await selects.nth(1).selectOption('4');
await page.locator('.form-cita input[name="motivo"]').fill('Electrocardiograma');
await page.locator('.form-cita').getByRole('button', { name: /Registrar cita/ }).click();
await page.getByText('Cita registrada:').waitFor({ timeout: 10000 });
await shot(page, 'p4-nueva-cita');                   // 1) cita nueva en la lista

fs.writeFileSync(`${OUT}/consola.txt`, consoleMsgs.length ? consoleMsgs.join('\n') : 'Sin advertencias ni errores en la consola del navegador (0 warnings, 0 errors).');
console.log('CONSOLA:', consoleMsgs.length ? consoleMsgs.join(' | ') : 'limpia (0 errores/0 warnings)');
await browser.close();
