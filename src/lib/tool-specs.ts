/**
 * Simuladores declarativos del sitio (diagnóstico Verifactu, factura electrónica B2B, sanciones, SII…).
 * Cada cifra y cada fecha viene de params-2026.json a través de las funciones puras de engine/reglas.ts.
 * Una spec lista sus campos (visibles primero, `adv` plegados) y una función `run` que da la tarjeta de resultado.
 * Las herramientas de fichero (lector del QR, creador y visor Facturae, huella) son componentes propios en components/vf.
 */
import type { ToolSpec, V, ToolOut } from './tool-types';
import { resolve } from './tool-types';
import { formatMoney, formatNumber, displayDate, type Lang } from './format';
import * as R from './engine/reglas';
import { huellaAlta, cadenaAlta, EJEMPLO_1 } from './engine/huella';
import { construirUrl, validarDatos } from './engine/qr';
import P from '../data/params-2026.json';

export type Args = Record<string, number | string>;
const T = (l: Lang, es: string, en: string) => (l === 'es' ? es : en);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k] ?? '');
const eur = (x: number, l: Lang) => formatMoney(x, 0, l);
const day = (iso: string, l: Lang) => displayDate(iso, l === 'es' ? 'es-ES' : 'en-GB');
const mesLargo = (ym: string, l: Lang) => new Date(`${ym}-15T00:00:00Z`).toLocaleDateString(l === 'es' ? 'es-ES' : 'en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const yn = (l: Lang) => [{ value: 'si', label: T(l, 'Sí', 'Yes') }, { value: 'no', label: T(l, 'No', 'No') }];
const VF = P.verifactu, B = P.b2b, SA = P.sanciones;

/* ------------------------------------------------------------------ ¿Me afecta Verifactu? */
const tipoOpts = (l: Lang) => [
  { value: 'autonomo', label: T(l, 'Autónomo (IRPF con actividad económica)', 'Self-employed (personal income tax)') },
  { value: 'sociedad', label: T(l, 'Sociedad (Impuesto sobre Sociedades)', 'Company (corporate income tax)') },
  { value: 'atribucion', label: T(l, 'Comunidad de bienes o sociedad civil', 'Joint ownership or civil partnership') },
  { value: 'irnr', label: T(l, 'No residente con establecimiento permanente', 'Non-resident with a permanent establishment') },
  { value: 'exenta', label: T(l, 'Entidad totalmente exenta (art. 9.1 LIS)', 'Fully exempt entity (art. 9.1 LIS)') },
];
const terrOpts = (l: Lang) => [
  { value: 'comun', label: T(l, 'Territorio común (incluye Canarias, Ceuta y Melilla)', 'Common territory (incl. Canary Islands, Ceuta, Melilla)') },
  { value: 'paisvasco', label: T(l, 'País Vasco (Álava, Bizkaia, Gipuzkoa)', 'Basque Country (Álava, Bizkaia, Gipuzkoa)') },
  { value: 'navarra', label: T(l, 'Navarra', 'Navarre') },
];
function verifactuSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'tipo', label: T(l, '¿Cómo tributas?', 'How are you taxed?'), def: String(a?.tipo ?? 'autonomo'), options: tipoOpts(l) },
      { kind: 'select', id: 'terr', label: T(l, 'Domicilio fiscal', 'Tax domicile'), def: String(a?.terr ?? 'comun'), options: terrOpts(l) },
      { kind: 'choice', id: 'prog', label: T(l, '¿Facturas con un programa?', 'Do you invoice with software?'), def: String(a?.prog ?? 'si'), options: yn(l), help: T(l, 'Programa, aplicación, hoja de cálculo que numera o TPV, aunque sea para una parte', 'Software, app, numbering spreadsheet or till, even for part of your invoices') },
      { kind: 'choice', id: 'sii', label: T(l, '¿Llevas los libros en el SII?', 'Are you on the SII?'), def: String(a?.sii ?? 'no'), options: yn(l) },
      { kind: 'choice', id: 'mod', label: T(l, '¿Estimación objetiva (módulos)?', 'Flat-rate scheme (módulos)?'), def: 'no', options: yn(l), adv: true },
    ],
    run: (v) => {
      const r = R.verifactu({ tipo: s(v, 'tipo') as R.Tipo, territorio: s(v, 'terr') as R.Territorio, sii: s(v, 'sii') === 'si', programa: s(v, 'prog') === 'si' });
      const mod = s(v, 'mod') === 'si';
      const sub: Record<R.EstadoVf, string> = {
        obligado: T(l, `Tu programa debe cumplir el Reglamento antes del ${day(r.antesDe ?? VF.restoAntes, l)}: el último día con un sistema no adaptado es el ${day(r.ultimoDia ?? VF.restoAntes, l)} (RD 1007/2023, disposición final cuarta, redacción del RDL 15/2025).`, `Your software must meet the Regulation before ${day(r.antesDe ?? VF.restoAntes, l)}: the last day on a non-adapted system is ${day(r.ultimoDia ?? VF.restoAntes, l)} (RD 1007/2023, fourth final provision, as worded by RDL 15/2025).`),
        'excluido-sii': T(l, 'Quien lleva los libros registro en el SII (art. 62.6 del Reglamento del IVA) queda fuera del Reglamento (RD 1007/2023, art. 3.3). Si sales del SII, entras en Verifactu.', 'Businesses keeping their VAT books on the SII (art. 62.6 VAT Regulation) are outside the Regulation (RD 1007/2023, art. 3.3). If you leave the SII, Verifactu applies.'),
        foral: T(l, 'Con domicilio fiscal en un territorio foral, el RD 1007/2023 no se aplica (art. 1.3): rige la norma de tu Hacienda foral. En el País Vasco es TicketBAI; Navarra tiene su propio régimen.', 'With a tax domicile in a foral territory, RD 1007/2023 does not apply (art. 1.3): your provincial treasury rules apply. In the Basque Country that is TicketBAI; Navarre has its own regime.'),
        exenta: T(l, 'Las entidades exentas del artículo 9.1 de la Ley del Impuesto sobre Sociedades no están sometidas (RD 1007/2023, art. 3.1.a). Las parcialmente exentas sí, por sus rentas no exentas.', 'Entities exempt under article 9.1 of the Corporate Tax Act are not covered (RD 1007/2023, art. 3.1.a). Partially exempt entities are, for their non-exempt income.'),
        'sin-programa': T(l, 'El Reglamento regula los sistemas informáticos de facturación. Si expides todas tus facturas a mano, en papel o en un documento sin cálculo ni registro, no te afecta; el día que uses un programa, aunque sea para una parte, sí.', 'The Regulation governs invoicing software. If you issue every invoice by hand, on paper or in a plain document with no calculation or record, it does not apply; once you use software, even for part of them, it does.'),
      };
      const modalidad = r.estado === 'obligado' ? T(l, 'VERI*FACTU (envío de cada registro a la AEAT) o no VERI*FACTU (firma y registro de eventos)', 'VERI*FACTU (each record sent to the AEAT) or non-VERI*FACTU (signature and event log)') : '–';
      return {
        label: T(l, 'Verifactu en tu caso', 'Verifactu in your case'),
        value: r.estado === 'obligado' ? day(r.antesDe!, l) : r.estado === 'foral' ? T(l, 'Norma foral', 'Foral rules') : T(l, 'No te afecta', 'Not covered'),
        sub: sub[r.estado],
        rows: [
          [T(l, 'Grupo del calendario', 'Timeline group'), r.grupo === 'is' ? T(l, 'Impuesto sobre Sociedades', 'Corporate income tax') : r.grupo === 'resto' ? T(l, 'Resto de obligados', 'Everyone else') : '–'],
          [T(l, 'Modalidad que puedes elegir', 'Mode you can choose'), modalidad],
          [T(l, 'Programas a la venta adaptados desde', 'Software on sale adapted since'), day(VF.productoresDesde, l)],
          [T(l, 'Alternativa gratuita', 'Free alternative'), r.estado === 'obligado' ? T(l, 'Aplicación de facturación de la AEAT (art. 7.b)', 'AEAT invoicing app (art. 7.b)') : '–'],
          ...(mod && r.estado === 'obligado' ? [[T(l, 'Módulos', 'Flat-rate scheme'), T(l, 'No excluye: cuenta si usas un programa', 'No exemption: what counts is the software')] as [string, string]] : []),
        ],
        note: T(l, 'Base: RD 1007/2023, arts. 1.3, 3 y 4; disposición final cuarta modificada por el RDL 15/2025 (BOE 3/12/2025). No es asesoramiento fiscal.', 'Basis: RD 1007/2023, arts. 1.3, 3 and 4; fourth final provision as amended by RDL 15/2025 (BOE 3/12/2025). Not tax advice.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ VERI*FACTU o no VERI*FACTU */
function modalidadSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'choice', id: 'mod', label: T(l, 'Modalidad', 'Mode'), def: String(a?.mod ?? 'vf'), options: [{ value: 'vf', label: 'VERI*FACTU' }, { value: 'no', label: T(l, 'No VERI*FACTU', 'Non-VERI*FACTU') }] },
      { kind: 'choice', id: 'red', label: T(l, '¿Conexión a internet al facturar?', 'Internet when invoicing?'), def: String(a?.red ?? 'si'), options: [{ value: 'si', label: T(l, 'Siempre', 'Always') }, { value: 'no', label: T(l, 'No siempre', 'Not always') }] },
    ],
    run: (v) => {
      const vf = s(v, 'mod') === 'vf', red = s(v, 'red') === 'si';
      return {
        label: T(l, 'Qué exige esta modalidad', 'What this mode requires'), value: vf ? 'VERI*FACTU' : T(l, 'No VERI*FACTU', 'Non-VERI*FACTU'),
        sub: vf ? T(l, 'Cada registro de facturación se envía a la AEAT por medios electrónicos; a cambio no hace falta firmarlo ni llevar registro de eventos, y el sistema se presume conforme (RD 1007/2023, arts. 15 y 16).', 'Each invoice record is sent electronically to the AEAT; in return no signature or event log is needed and the system is presumed compliant (RD 1007/2023, arts. 15 and 16).')
          : T(l, 'Los registros se quedan en tu sistema, firmados con certificado y con un registro de eventos; la AEAT puede pedirlos en un requerimiento (RD 1007/2023, arts. 8, 12 y 14).', 'Records stay in your system, signed with a certificate and with an event log; the AEAT can request them (RD 1007/2023, arts. 8, 12 and 14).'),
        rows: [
          [T(l, 'Envío a la AEAT', 'Sending to the AEAT'), vf ? T(l, `Sí, en lotes de hasta ${formatNumber(VF.lotesMax, 0, l)} registros`, `Yes, in batches of up to ${formatNumber(VF.lotesMax, 0, l)} records`) : T(l, 'Solo si lo pide la AEAT', 'Only when the AEAT asks')],
          [T(l, 'Firma electrónica de cada registro', 'Electronic signature of each record'), vf ? T(l, 'No', 'No') : VF.firma],
          [T(l, 'Registro de eventos', 'Event log'), vf ? T(l, 'No', 'No') : T(l, 'Obligatorio (Orden HAC/1177/2024, art. 9)', 'Mandatory (Order HAC/1177/2024, art. 9)')],
          [T(l, 'Leyenda bajo el QR', 'Wording below the QR'), vf ? `« ${P.qr.textoAbajoVerifactu} » / « ${P.qr.textoAbajoCorto} »` : T(l, 'Ninguna', 'None')],
          [T(l, 'Sin conexión', 'Offline'), vf ? (red ? T(l, 'Sin problema', 'No issue') : T(l, 'El sistema guarda y envía en cuanto vuelve la conexión', 'The system stores and sends once back online')) : T(l, 'Sin efecto', 'No effect')],
          [T(l, 'Permanencia', 'Commitment'), vf ? T(l, 'Al menos hasta el final del año natural (art. 16.3)', 'At least until the end of the calendar year (art. 16.3)') : T(l, 'Puedes pasar a VERI*FACTU', 'You can switch to VERI*FACTU')],
        ],
        note: T(l, `Tras cada envío el sistema espera ${VF.esperaSegundos} segundos o a reunir ${formatNumber(VF.lotesMax, 0, l)} registros, y reintenta al menos cada hora si falla (Orden HAC/1177/2024, art. 16).`, `After each sending the system waits ${VF.esperaSegundos} seconds or until it has ${formatNumber(VF.lotesMax, 0, l)} records, and retries at least hourly on failure (Order HAC/1177/2024, art. 16).`),
      };
    },
  };
}

/* ------------------------------------------------------------------ calendario */
function calendarioSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'perfil', label: T(l, 'Tu perfil', 'Your profile'), def: String(a?.perfil ?? 'autonomo'), options: [
        { value: 'autonomo', label: T(l, 'Autónomo o comunidad de bienes', 'Self-employed or joint ownership') },
        { value: 'sociedad', label: T(l, 'Sociedad', 'Company') },
        { value: 'grande', label: T(l, 'Empresa con más de 8 millones de facturación', 'Business with turnover above 8 million') },
      ] },
    ],
    run: (v) => {
      const p = s(v, 'perfil');
      const vfDate = p === 'autonomo' ? VF.restoAntes : VF.sociedadesAntes;
      const b2bDate = p === 'grande' ? B.fechaGrandes : B.fechaResto;
      const hitos: Array<[string, string]> = [
        [day(VF.ordenVigor, l), T(l, 'Entra en vigor la Orden HAC/1177/2024 (especificaciones técnicas)', 'Order HAC/1177/2024 (technical specifications) enters into force')],
        [day(VF.productoresDesde, l), T(l, 'Los programas a la venta deben estar adaptados (9 meses después)', 'Software on sale must be adapted (9 months later)')],
        [day(B.ordenVigor, l), T(l, 'Orden HAC/1028/2026: empieza a contar el plazo de la factura electrónica B2B', 'Order HAC/1028/2026: the B2B e-invoicing countdown starts')],
        [day(vfDate, l), T(l, 'Verifactu obligatorio para ti (sistema adaptado antes de esta fecha)', 'Verifactu mandatory for you (system adapted before this date)')],
        [day(b2bDate, l), T(l, 'Factura electrónica B2B obligatoria para ti', 'B2B e-invoicing mandatory for you')],
      ];
      return {
        label: T(l, 'Tu próxima fecha', 'Your next date'), value: day(vfDate, l),
        sub: T(l, 'Fechas leídas en el BOE: RD 1007/2023 en la redacción del RDL 15/2025, y RD 238/2026 contado desde la Orden HAC/1028/2026.', 'Dates read in the BOE: RD 1007/2023 as worded by RDL 15/2025, and RD 238/2026 counted from Order HAC/1028/2026.'),
        rows: hitos.map(([d, t]) => [t, d]),
        note: T(l, 'Las fechas B2B son nuestro cálculo: 12 o 24 meses desde el 6 de octubre de 2026, día de entrada en vigor de la Orden.', 'B2B dates are our calculation: 12 or 24 months from 6 October 2026, when the Order entered into force.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ sanciones (LGT art. 201 bis) */
function sancionesSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'choice', id: 'rol', label: T(l, 'Eres', 'You are'), def: String(a?.rol ?? 'usuario'), options: [{ value: 'usuario', label: T(l, 'Usuario del programa', 'Software user') }, { value: 'fabricante', label: T(l, 'Productor o vendedor', 'Producer or seller') }] },
      { id: 'ej', label: T(l, 'Ejercicios afectados', 'Financial years affected'), def: Number(a?.ej ?? 1), max: 10, decimals: 0 },
      { kind: 'choice', id: 'pronto', label: T(l, '¿Pagas en plazo sin recurrir?', 'Pay on time without appeal?'), def: 'no', options: yn(l) },
      { kind: 'choice', id: 'motivo', label: T(l, 'Infracción del productor', 'Producer infringement'), def: 'alteracion', options: [{ value: 'alteracion', label: T(l, 'Programa que permite alterar', 'Software allowing tampering') }, { value: 'certificado', label: T(l, 'Sin certificado', 'No certificate') }], adv: true },
      { id: 'tipos', label: T(l, 'Tipos distintos de programa', 'Different software types'), def: 1, max: 50, decimals: 0, adv: true },
      { id: 'sist', label: T(l, 'Programas vendidos sin certificado', 'Copies sold without certificate'), def: 10, max: 100000, decimals: 0, adv: true },
    ],
    run: (v) => {
      const r = R.sancion({ rol: s(v, 'rol') as R.Rol, motivo: s(v, 'motivo') as R.Motivo, ejercicios: n(v, 'ej'), tipos: n(v, 'tipos'), sistemas: n(v, 'sist'), pronto: s(v, 'pronto') === 'si' });
      const usuario = s(v, 'rol') === 'usuario';
      return {
        label: T(l, 'Multa según el artículo 201 bis LGT', 'Fine under article 201 bis LGT'), value: eur(r.total, l),
        sub: usuario ? T(l, `Tenencia de un programa no certificado o alterado: ${eur(SA.tenencia, l)} fijos por ejercicio (art. 201 bis.2 y 4). Infracción grave.`, `Holding uncertified or altered software: a fixed ${eur(SA.tenencia, l)} per financial year (art. 201 bis.2 and 4). Serious infringement.`)
          : s(v, 'motivo') === 'certificado' ? T(l, `Falta de certificado: ${eur(SA.sinCertificado, l)} por cada programa vendido sin él (art. 201 bis.1.f y 4).`, `Missing certificate: ${eur(SA.sinCertificado, l)} per copy sold without it (art. 201 bis.1.f and 4).`)
          : T(l, `${eur(SA.fabricante, l)} por ejercicio con ventas y por cada tipo de programa (art. 201 bis.1 y 4).`, `${eur(SA.fabricante, l)} per financial year with sales and per software type (art. 201 bis.1 and 4).`),
        rows: [
          [T(l, 'Importe por unidad', 'Amount per unit'), eur(r.unidad, l), r.unidad],
          [T(l, 'Veces que se aplica', 'Times applied'), formatNumber(r.veces, 0, l)],
          [T(l, 'Sanción antes de reducir', 'Fine before reduction'), eur(r.base, l), r.base],
          [T(l, 'Reducción por pronto pago (40 %)', 'Prompt payment reduction (40%)'), r.reduccion ? `− ${eur(r.reduccion, l)}` : '–', r.reduccion],
        ],
        note: T(l, 'Reducción del 40 % si pagas en el plazo del artículo 62.2 y no recurres (LGT art. 188.3). Vigente desde el 11 de octubre de 2021 (Ley 11/2021).', '40% reduction if you pay within the article 62.2 deadline and do not appeal (LGT art. 188.3). In force since 11 October 2021 (Law 11/2021).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ requisitos del programa */
const REQ = ['decl', 'qr', 'huella', 'inalt', 'conserv'] as const;
function requisitosSpec(l: Lang): ToolSpec {
  const lab: Record<(typeof REQ)[number], [string, string]> = {
    decl: ['¿Tiene declaración responsable del productor?', 'Does it have the producer’s declaration of conformity?'],
    qr: ['¿Imprime el QR tributario en cada factura?', 'Does it print the tax QR code on each invoice?'],
    huella: ['¿Encadena cada registro con la huella del anterior?', 'Does it chain each record to the previous hash?'],
    inalt: ['¿Impide borrar o modificar facturas emitidas?', 'Does it prevent deleting or editing issued invoices?'],
    conserv: ['¿Conserva y exporta los registros?', 'Does it keep and export the records?'],
  };
  return {
    inputs: REQ.map((k) => ({ kind: 'choice' as const, id: k, label: T(l, lab[k][0], lab[k][1]), def: 'si', options: yn(l) })),
    run: (v) => {
      const faltan = REQ.filter((k) => s(v, k) !== 'si');
      return {
        label: T(l, 'Requisitos que cumple', 'Requirements met'), value: `${REQ.length - faltan.length} / ${REQ.length}`,
        sub: faltan.length === 0 ? T(l, 'Cumple lo básico que el usuario puede comprobar. La conformidad completa la asegura el productor en su declaración responsable (RD 1007/2023, art. 13).', 'It meets the basics a user can check. Full conformity is stated by the producer in its declaration (RD 1007/2023, art. 13).')
          : T(l, `Falta: ${faltan.map((k) => T(l, lab[k][0], lab[k][1]).replace(/^¿|\?$/g, '').toLowerCase()).join('; ')}. Pide al proveedor la versión adaptada o la declaración responsable.`, `Missing: ${faltan.map((k) => lab[k][1].replace(/\?$/, '').toLowerCase()).join('; ')}. Ask the provider for the adapted version or the declaration.`),
        rows: [
          [T(l, 'Declaración responsable', 'Declaration of conformity'), T(l, 'RD 1007/2023 art. 13; contenido en Orden HAC/1177/2024 art. 15', 'RD 1007/2023 art. 13; content in Order HAC/1177/2024 art. 15')],
          [T(l, 'QR y leyenda', 'QR and wording'), T(l, 'RD 1619/2012 art. 6.5; Orden arts. 20 y 21', 'RD 1619/2012 art. 6.5; Order arts. 20 and 21')],
          [T(l, 'Huella SHA-256', 'SHA-256 hash'), T(l, 'Orden HAC/1177/2024 art. 13', 'Order HAC/1177/2024 art. 13')],
          [T(l, 'Si falta algo', 'If anything is missing'), T(l, `Riesgo de ${eur(SA.tenencia, l)} por ejercicio`, `Risk of ${eur(SA.tenencia, l)} per financial year`)],
        ],
        note: T(l, 'Comprobación orientativa: no sustituye la declaración responsable ni certifica el programa.', 'Indicative check: it does not replace the declaration or certify the software.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ elegir programa (criterios neutros) */
function elegirSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'fact', label: T(l, 'Facturas al mes', 'Invoices per month'), def: Number(a?.fact ?? 15), max: 100000, decimals: 0 },
      { kind: 'choice', id: 'tickets', label: T(l, '¿Haces tiques sin datos del cliente?', 'Do you issue receipts without customer data?'), def: String(a?.tickets ?? 'no'), options: yn(l) },
      { kind: 'choice', id: 'b2b', label: T(l, '¿Facturas a empresas?', 'Do you invoice businesses?'), def: 'si', options: yn(l) },
      { kind: 'choice', id: 'face', label: T(l, '¿Facturas a la Administración?', 'Do you invoice public bodies?'), def: 'no', options: yn(l), adv: true },
    ],
    run: (v) => {
      const f = n(v, 'fact'), tick = s(v, 'tickets') === 'si', b2b = s(v, 'b2b') === 'si', face = s(v, 'face') === 'si';
      const app = !tick && f <= 30;
      const value = tick ? T(l, 'TPV o programa con tiques', 'Till or software with receipts') : app ? T(l, 'Aplicación de la AEAT o programa sencillo', 'AEAT app or simple software') : T(l, 'Programa de facturación adaptado', 'Adapted invoicing software');
      return {
        label: T(l, 'Tipo de solución que encaja', 'Type of solution that fits'), value,
        sub: tick ? T(l, 'La aplicación gratuita de la AEAT exige siempre un destinatario (Orden HAC/1177/2024, art. 19.2.c): para tiques sin datos del cliente necesitas un sistema propio.', 'The free AEAT app always requires a recipient (Order HAC/1177/2024, art. 19.2.c): for receipts without customer data you need your own system.')
          : app ? T(l, 'Con pocas facturas y siempre a un cliente identificado, la aplicación de la AEAT cumple sin coste; un programa sencillo te ahorra teclear datos repetidos.', 'With few invoices, always to an identified customer, the AEAT app complies at no cost; simple software saves retyping data.')
          : T(l, 'Con este volumen compensa un programa que genere los registros y el QR solo, importe tus clientes y exporte a tu gestoría.', 'At this volume, software that creates the records and QR itself, imports customers and exports to your accountant pays off.'),
        rows: [
          [T(l, 'Exige al proveedor', 'Ask the provider for'), T(l, 'Declaración responsable (art. 13)', 'Declaration of conformity (art. 13)')],
          [T(l, 'Factura electrónica B2B', 'B2B e-invoicing'), b2b ? T(l, 'Que genere UBL o Facturae y se conecte a una plataforma', 'UBL or Facturae output and a platform connection') : T(l, 'No necesaria', 'Not needed')],
          [T(l, 'Facturas a la Administración', 'Invoices to public bodies'), face ? T(l, 'Facturae 3.2.2 con firma y códigos DIR3', 'Signed Facturae 3.2.2 with DIR3 codes') : '–'],
          [T(l, 'Exportación de datos', 'Data export'), T(l, 'Registros y facturas en un formato abierto', 'Records and invoices in an open format')],
        ],
        note: T(l, 'Criterios neutros: no recomendamos marcas ni tenemos acuerdos con ningún proveedor.', 'Neutral criteria: we do not recommend brands and have no deals with any provider.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ aplicación de facturación de la AEAT */
function appSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'choice', id: 'dest', label: T(l, '¿Siempre conoces al cliente?', 'Do you always know the customer?'), def: String(a?.dest ?? 'si'), options: yn(l) },
      { kind: 'choice', id: 'ident', label: T(l, '¿Tienes Cl@ve o certificado?', 'Do you have Cl@ve or a certificate?'), def: 'si', options: yn(l) },
      { kind: 'choice', id: 'otro', label: T(l, '¿Quieres llevar las facturas a otro programa?', 'Move invoices to other software?'), def: 'no', options: yn(l) },
    ],
    run: (v) => {
      const ok = s(v, 'dest') === 'si' && s(v, 'ident') === 'si' && s(v, 'otro') === 'no';
      return {
        label: T(l, '¿Te sirve la aplicación de la AEAT?', 'Does the AEAT app suit you?'), value: ok ? T(l, 'Sí', 'Yes') : T(l, 'Con límites', 'With limits'),
        sub: ok ? T(l, 'Factura en tu nombre o como apoderado, con destinatario, y descarga cada factura en PDF. Los registros se generan solos.', 'Invoice in your own name or as a representative, with a recipient, and download each invoice as PDF. Records are created for you.')
          : T(l, 'La aplicación exige identificarse, un destinatario en cada factura, y solo ella puede gestionar sus facturas y registros (Orden HAC/1177/2024, art. 19.2).', 'The app requires identification, a recipient on every invoice, and only the app itself can manage its invoices and records (Order HAC/1177/2024, art. 19.2).'),
        rows: [
          [T(l, 'Funciones mínimas', 'Minimum features'), T(l, 'Captura, consulta, PDF y registro', 'Entry, search, PDF and record')],
          [T(l, 'Facturas sin destinatario', 'Invoices without recipient'), T(l, 'No admitidas', 'Not allowed')],
          [T(l, 'Pasar facturas a otro sistema', 'Moving invoices to another system'), T(l, 'No: solo la aplicación las gestiona', 'No: only the app manages them')],
          [T(l, 'Coste', 'Cost'), T(l, 'Gratuita', 'Free')],
        ],
        note: T(l, 'Base: RD 1007/2023, art. 7.b, y Orden HAC/1177/2024, art. 19.', 'Basis: RD 1007/2023, art. 7.b, and Order HAC/1177/2024, art. 19.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ territorio: TicketBAI, Navarra, común */
function territorioSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'dom', label: T(l, 'Domicilio fiscal', 'Tax domicile'), def: String(a?.dom ?? 'gipuzkoa'), options: [
        { value: 'araba', label: 'Álava / Araba' }, { value: 'bizkaia', label: 'Bizkaia' }, { value: 'gipuzkoa', label: 'Gipuzkoa' },
        { value: 'navarra', label: T(l, 'Navarra', 'Navarre') }, { value: 'comun', label: T(l, 'Resto de España', 'Rest of Spain') },
      ] },
    ],
    run: (v) => {
      const d = s(v, 'dom');
      const vasco = ['araba', 'bizkaia', 'gipuzkoa'].includes(d);
      const sistema = vasco ? (d === 'bizkaia' ? 'TicketBAI (Batuz)' : 'TicketBAI') : d === 'navarra' ? T(l, 'Régimen foral de Navarra', 'Navarre foral regime') : 'Verifactu';
      const web: Record<string, string> = { araba: 'web.araba.eus', bizkaia: 'batuz.eus', gipuzkoa: 'gipuzkoa.eus', navarra: 'navarra.es', comun: 'agenciatributaria.gob.es' };
      return {
        label: T(l, 'Sistema de control de la facturación', 'Invoicing control system'), value: sistema,
        sub: vasco ? T(l, 'El RD 1007/2023 no se aplica con domicilio fiscal en el País Vasco (art. 1.3). Rige TicketBAI, regulado por la norma de cada Diputación Foral, con su propio QR e identificador TBAI.', 'RD 1007/2023 does not apply with a tax domicile in the Basque Country (art. 1.3). TicketBAI applies, regulated by each Provincial Council, with its own QR and TBAI identifier.')
          : d === 'navarra' ? T(l, 'El RD 1007/2023 no se aplica con domicilio fiscal en Navarra (art. 1.3). Consulta en la Hacienda Foral de Navarra la norma vigente y sus fechas.', 'RD 1007/2023 does not apply with a tax domicile in Navarre (art. 1.3). Check the current rules and dates with the Navarre Provincial Treasury.')
          : T(l, `Con domicilio fiscal en territorio común se aplica Verifactu: antes del ${day(VF.sociedadesAntes, l)} para sociedades y del ${day(VF.restoAntes, l)} para el resto.`, `With a tax domicile in the common territory Verifactu applies: before ${day(VF.sociedadesAntes, l)} for companies and ${day(VF.restoAntes, l)} for everyone else.`),
        rows: [
          [T(l, 'Norma estatal Verifactu', 'National Verifactu rules'), vasco || d === 'navarra' ? T(l, 'No aplicable', 'Not applicable') : T(l, 'Aplicable', 'Applicable')],
          [T(l, 'Dónde consultar', 'Where to check'), web[d]],
          [T(l, 'Factura electrónica B2B', 'B2B e-invoicing'), T(l, 'Ley estatal: también en territorios forales', 'National law: also in foral territories')],
        ],
        note: T(l, 'El domicilio fiscal decide, no el lugar donde vendes. Resumen orientativo de la norma estatal; las fechas forales, en cada Hacienda.', 'Your tax domicile decides, not where you sell. Indicative summary of the national rule; foral dates are set by each treasury.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ SII: plazo de 4 días */
function siiSpec(l: Lang, a?: Args): ToolSpec {
  const dates = (y: number) => Array.from({ length: 12 }, (_, m) => `${y}-${String(m + 1).padStart(2, '0')}`);
  const meses = [...dates(2026), ...dates(2027)];
  const dias = Array.from({ length: 31 }, (_, i) => String(i + 1));
  return {
    inputs: [
      { kind: 'select', id: 'clase', label: T(l, 'Registro', 'Record'), def: String(a?.clase ?? 'expedida'), options: [
        { value: 'expedida', label: T(l, 'Factura expedida', 'Invoice issued') }, { value: 'tercero', label: T(l, 'Expedida por el cliente o un tercero', 'Issued by customer or third party') },
        { value: 'recibida', label: T(l, 'Factura recibida', 'Invoice received') }, { value: 'rectificativa', label: T(l, 'Factura rectificativa', 'Corrective invoice') },
      ] },
      { kind: 'select', id: 'mes', label: T(l, 'Mes de expedición o registro', 'Month issued or booked'), def: String(a?.mes ?? '2026-12'), options: meses.map((m) => ({ value: m, label: mesLargo(m, l) })) },
      { kind: 'select', id: 'dia', label: T(l, 'Día', 'Day'), def: String(a?.dia ?? '23'), options: (v) => { const [y, m] = s(v, 'mes').split('-').map(Number); const last = new Date(Date.UTC(y, m, 0)).getUTCDate(); return dias.slice(0, last).map((d) => ({ value: d, label: d })); } },
    ],
    run: (v) => {
      const fecha = `${s(v, 'mes')}-${s(v, 'dia').padStart(2, '0')}`;
      const r = R.plazoSii(s(v, 'clase') as R.ClaseSii, fecha, fecha);
      return {
        label: T(l, 'Último día para enviar al SII', 'Last day to send to the SII'), value: day(r.limite, l),
        sub: T(l, `${r.dias} días naturales sin contar sábados, domingos ni festivos nacionales (Reglamento del IVA, art. 69 bis).`, `${r.dias} calendar days excluding Saturdays, Sundays and national holidays (VAT Regulation, art. 69 bis).`),
        rows: [
          [T(l, 'Fecha de partida', 'Start date'), day(fecha, l)],
          [T(l, `Plazo de ${r.dias} días`, `${r.dias}-day limit`), day(r.porDias, l)],
          [T(l, 'Tope del día 15 del mes siguiente', 'Cap: 15th of next month'), r.tope ? day(r.tope, l) : '–'],
          ...(r.fuera ? [[T(l, 'Aviso', 'Note'), T(l, 'Festivos de ese año aún no cargados', 'That year’s holidays not loaded yet')] as [string, string]] : []),
        ],
        note: T(l, 'Festivos nacionales de 2026 y 2027 según las resoluciones de la Dirección General de Trabajo (BOE). Para las expedidas el tope se cuenta desde el devengo; aquí se toma la misma fecha.', 'National holidays for 2026 and 2027 per the Directorate-General for Labour resolutions (BOE). For issued invoices the cap counts from the tax point; here we use the same date.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ factura electrónica B2B: ¿cuándo me obliga? */
function b2bSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'vol', label: T(l, 'Volumen de operaciones del año anterior', 'Prior-year turnover (volumen de operaciones)'), def: Number(a?.vol ?? 250000), unit: '€', max: 5e9, help: T(l, 'Calculado como en el art. 121 de la Ley del IVA', 'As defined in art. 121 of the VAT Act') },
      { kind: 'choice', id: 'pers', label: T(l, 'Forma', 'Legal form'), def: String(a?.pers ?? 'fisica'), options: [{ value: 'fisica', label: T(l, 'Autónomo', 'Self-employed') }, { value: 'juridica', label: T(l, 'Sociedad', 'Company') }] },
      { kind: 'select', id: 'dest', label: T(l, 'Tus clientes', 'Your customers'), def: String(a?.dest ?? 'empresa'), options: [
        { value: 'empresa', label: T(l, 'Empresas y autónomos en España', 'Businesses in Spain') }, { value: 'particular', label: T(l, 'Solo particulares', 'Consumers only') },
        { value: 'extranjero', label: T(l, 'Solo empresas en el extranjero', 'Only foreign businesses') }, { value: 'administracion', label: T(l, 'Solo Administraciones públicas', 'Only public bodies') },
      ] },
    ],
    run: (v) => {
      const r = R.b2b({ volumen: n(v, 'vol'), persona: s(v, 'pers') as R.Persona, destino: s(v, 'dest') as R.Destino });
      const d = s(v, 'dest');
      return {
        label: T(l, 'Factura electrónica B2B obligatoria desde', 'B2B e-invoicing mandatory from'), value: r.desde ? day(r.desde, l) : T(l, 'No por esta norma', 'Not under this rule'),
        sub: r.aplica ? (r.grande ? T(l, `Más de ${eur(B.umbral, l)}: 12 meses desde la Orden HAC/1028/2026 (RD 238/2026, disposición final cuarta.1.a). Durante el primer año acompañas un PDF salvo que el cliente acepte el original.`, `Above ${eur(B.umbral, l)}: 12 months after Order HAC/1028/2026 (RD 238/2026, fourth final provision 1.a). In the first year you add a PDF unless the customer accepts the original.`) : T(l, `Hasta ${eur(B.umbral, l)}: 24 meses desde la Orden HAC/1028/2026 (RD 238/2026, disposición final cuarta.1.b).`, `Up to ${eur(B.umbral, l)}: 24 months after Order HAC/1028/2026 (RD 238/2026, fourth final provision 1.b).`))
          : d === 'administracion' ? T(l, 'A la Administración ya facturas en electrónico por FACe u otro punto de entrada (Ley 25/2013), con sus propias reglas.', 'Invoices to public bodies already go electronic through FACe or another entry point (Law 25/2013), under their own rules.')
            : d === 'particular' ? T(l, 'La obligación del RD 238/2026 se limita a las facturas entre empresarios y profesionales (art. 3). Con particulares no cambia nada por esta norma.', 'The RD 238/2026 mandate covers invoices between businesses only (art. 3). Nothing changes for consumers under this rule.')
              : T(l, 'Solo se aplica cuando el destinatario está establecido en España (RD 238/2026, art. 3).', 'It only applies when the recipient is established in Spain (RD 238/2026, art. 3).'),
        rows: [
          [T(l, 'Informar del estado y del pago', 'Report status and payment'), r.estadosDesde ? T(l, `Obligatorio desde ${day(r.estadosDesde, l)}`, `Mandatory from ${day(r.estadosDesde, l)}`) : '–'],
          [T(l, 'PDF junto a la factura hasta', 'PDF alongside the invoice until'), r.pdfHasta ? day(r.pdfHasta, l) : '–'],
          [T(l, 'Formatos admitidos', 'Accepted formats'), B.formatos.join(', ')],
          [T(l, 'Opción gratuita', 'Free option'), T(l, 'Solución pública de la AEAT', 'AEAT public solution')],
        ],
        note: T(l, 'Fechas calculadas por nosotros a partir del 6 de octubre de 2026 (entrada en vigor de la Orden HAC/1028/2026, BOE del 5). Las facturas simplificadas no cualificadas quedan fuera (art. 4).', 'Dates calculated by us from 6 October 2026 (entry into force of Order HAC/1028/2026, BOE of the 5th). Non-qualified simplified invoices are excluded (art. 4).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ estados de la factura B2B: 4 días */
function estadosSpec(l: Lang, a?: Args): ToolSpec {
  const meses = ['2027-10', '2027-11', '2027-12'];
  return {
    inputs: [
      { kind: 'select', id: 'mes', label: T(l, 'Mes de recepción o de pago', 'Month received or paid'), def: String(a?.mes ?? '2027-12'), options: meses.map((m) => ({ value: m, label: mesLargo(m, l) })) },
      { kind: 'select', id: 'dia', label: T(l, 'Día', 'Day'), def: String(a?.dia ?? '4'), options: (v) => { const [y, m] = s(v, 'mes').split('-').map(Number); const last = new Date(Date.UTC(y, m, 0)).getUTCDate(); return Array.from({ length: last }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })); } },
      { kind: 'choice', id: 'que', label: T(l, 'Qué comunicas', 'What you report'), def: 'acepta', options: [{ value: 'acepta', label: T(l, 'Aceptación o rechazo', 'Acceptance or rejection') }, { value: 'pago', label: T(l, 'Pago completo', 'Full payment') }] },
    ],
    run: (v) => {
      const fecha = `${s(v, 'mes')}-${s(v, 'dia').padStart(2, '0')}`;
      const p = R.plazoHabil(fecha, B.diasEstados);
      return {
        label: T(l, 'Comunicar como tarde el', 'Report by'), value: day(p.fecha, l),
        sub: T(l, `${B.diasEstados} días naturales sin sábados, domingos ni festivos nacionales (RD 238/2026, arts. 10 y 12).`, `${B.diasEstados} calendar days excluding Saturdays, Sundays and national holidays (RD 238/2026, arts. 10 and 12).`),
        rows: [
          [T(l, 'Fecha de partida', 'Start date'), day(fecha, l)],
          [T(l, 'Quién comunica', 'Who reports'), s(v, 'que') === 'pago' ? T(l, 'El destinatario que paga', 'The recipient who pays') : T(l, 'El destinatario', 'The recipient')],
          [T(l, 'Dato obligatorio', 'Required data'), s(v, 'que') === 'pago' ? T(l, 'Fecha de pago y vencimiento', 'Payment and due date') : T(l, 'Aceptación o rechazo y su fecha', 'Acceptance or rejection and date')],
          ...(p.fueraDeCalendario ? [[T(l, 'Aviso', 'Note'), T(l, 'Festivos de ese año aún no cargados', 'That year’s holidays not loaded yet')] as [string, string]] : []),
        ],
        note: T(l, 'Ejemplo en las fechas de la primera obligación (octubre de 2027). Los autónomos de hasta 8 millones pueden informar de forma voluntaria durante su primer año (DT 3ª).', 'Example on the first mandate dates (October 2027). Self-employed people up to 8 million may report voluntarily in their first year (third transitional provision).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ ¿qué factura electrónica me toca? */
function feSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'cli', label: T(l, 'Facturas a', 'You invoice'), def: String(a?.cli ?? 'empresa'), options: [
        { value: 'empresa', label: T(l, 'Empresas y autónomos', 'Businesses') }, { value: 'admin', label: T(l, 'Administraciones públicas', 'Public bodies') }, { value: 'particular', label: T(l, 'Particulares', 'Consumers') },
      ] },
      { id: 'vol', label: T(l, 'Volumen de operaciones del año anterior', 'Prior-year turnover'), def: Number(a?.vol ?? 250000), unit: '€', max: 5e9 },
      { kind: 'choice', id: 'soc', label: T(l, 'Forma', 'Form'), def: 'auto', options: [{ value: 'auto', label: T(l, 'Autónomo', 'Self-employed') }, { value: 'soc', label: T(l, 'Sociedad', 'Company') }] },
    ],
    run: (v) => {
      const cli = s(v, 'cli'), soc = s(v, 'soc') === 'soc';
      const r = R.b2b({ volumen: n(v, 'vol'), persona: soc ? 'juridica' : 'fisica', destino: 'empresa' });
      const value = cli === 'admin' ? (soc ? T(l, 'Ya obligatoria', 'Already mandatory') : T(l, 'Voluntaria por ley', 'Voluntary by law')) : cli === 'empresa' ? day(r.desde!, l) : T(l, 'Solo si la pide', 'Only on request');
      return {
        label: T(l, 'Factura electrónica estructurada', 'Structured e-invoice'), value,
        sub: cli === 'admin' ? T(l, 'Sociedades anónimas y limitadas, entidades extranjeras, UTE y similares deben usar FACe u otro punto de entrada desde 2015 (Ley 25/2013, art. 4); un autónomo puede, aunque la Administración puede exigirla en el contrato.', 'Public and private limited companies, foreign entities, joint ventures and similar must use FACe or another entry point since 2015 (Law 25/2013, art. 4); a self-employed person may, though the contract can require it.')
          : cli === 'empresa' ? T(l, 'Entre empresas la obligación llega con el RD 238/2026. Mientras tanto, Verifactu ya cambia cómo emites tus facturas, sean en papel, PDF o electrónicas.', 'Between businesses the mandate comes with RD 238/2026. Meanwhile, Verifactu already changes how you issue invoices, whether paper, PDF or electronic.')
            : T(l, 'Con particulares no hay obligación general: solo ciertas grandes empresas de servicios deben ofrecerla a quien la acepte (Ley 56/2007, art. 2 bis.4).', 'There is no general mandate for consumers: only certain large service companies must offer it to those who accept (Law 56/2007, art. 2 bis.4).'),
        rows: [
          [T(l, 'Formato', 'Format'), cli === 'admin' ? 'Facturae 3.2.x' : cli === 'empresa' ? B.formatos.join(', ') : T(l, 'Libre (PDF admitido)', 'Free (PDF allowed)')],
          [T(l, 'Canal', 'Channel'), cli === 'admin' ? T(l, 'FACe o punto de entrada autonómico o local', 'FACe or regional or local entry point') : cli === 'empresa' ? T(l, 'Plataforma privada o solución pública', 'Private platform or public solution') : T(l, 'El que acordéis', 'Whatever you agree')],
          [T(l, 'Verifactu también', 'Verifactu as well'), T(l, `Sí, desde ${day(soc ? P.verifactu.sociedadesAntes : P.verifactu.restoAntes, l)}`, `Yes, from ${day(soc ? P.verifactu.sociedadesAntes : P.verifactu.restoAntes, l)}`)],
        ],
        note: T(l, 'Base: Ley 25/2013, Ley 56/2007 art. 2 bis, RD 238/2026 y RD 1007/2023.', 'Basis: Law 25/2013, Law 56/2007 art. 2 bis, RD 238/2026 and RD 1007/2023.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ FACe */
function faceSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'forma', label: T(l, 'Tu forma jurídica', 'Your legal form'), def: String(a?.forma ?? 'sa-sl'), options: [
        { value: 'sa-sl', label: T(l, 'Sociedad anónima o limitada', 'Public or private limited company') }, { value: 'extranjera', label: T(l, 'Entidad extranjera o establecimiento permanente', 'Foreign entity or permanent establishment') },
        { value: 'ute', label: T(l, 'UTE, AIE o fondo', 'Joint venture, EIG or fund') }, { value: 'autonomo', label: T(l, 'Autónomo', 'Self-employed') }, { value: 'otra', label: T(l, 'Otra (asociación, comunidad de bienes)', 'Other (association, joint ownership)') },
      ] },
      { id: 'imp', label: T(l, 'Importe de la factura', 'Invoice amount'), def: Number(a?.imp ?? 3000), unit: '€', max: 1e9 },
      { kind: 'choice', id: 'excl', label: T(l, '¿La Administración excluye las de hasta 5000 €?', 'Does the body exempt invoices up to €5,000?'), def: 'si', options: yn(l) },
    ],
    run: (v) => {
      const r = R.face(s(v, 'forma') as R.Forma, n(v, 'imp'), s(v, 'excl') === 'si');
      return {
        label: T(l, 'Factura electrónica a la Administración', 'E-invoice to public bodies'), value: r === 'obligado' ? T(l, 'Obligatoria', 'Mandatory') : r === 'exento-importe' ? T(l, 'Puedes en papel', 'Paper allowed') : T(l, 'Voluntaria', 'Voluntary'),
        sub: r === 'obligado' ? T(l, 'Debes presentar Facturae firmada por el punto general de entrada que corresponda (Ley 25/2013, arts. 4 a 6).', 'You must file a signed Facturae through the relevant entry point (Law 25/2013, arts. 4 to 6).')
          : r === 'exento-importe' ? T(l, `Las Administraciones pueden excluir las facturas de hasta ${eur(P.factura.faceExclusion, l)} (Ley 25/2013, art. 4). Si tu cliente lo ha hecho, el papel vale.`, `Public bodies may exempt invoices up to ${eur(P.factura.faceExclusion, l)} (Law 25/2013, art. 4). If yours has, paper is fine.`)
            : T(l, 'La ley no te obliga, pero puedes usar FACe y muchas Administraciones lo piden en el contrato.', 'The law does not require it, but you can use FACe and many bodies ask for it in the contract.'),
        rows: [
          [T(l, 'Formato', 'Format'), `Facturae ${P.facturae.version}`],
          [T(l, 'Códigos DIR3', 'DIR3 codes'), T(l, 'Oficina contable, órgano gestor, unidad tramitadora', 'Accounting office, managing body, processing unit')],
          [T(l, 'Tamaño máximo', 'Maximum size'), `${P.factura.faceTamanoMb} MB`],
          [T(l, 'Registro en la Administración', 'Filing with the public body'), T(l, `${P.factura.faceRegistroDias} días desde la entrega (art. 3)`, `${P.factura.faceRegistroDias} days from delivery (art. 3)`)],
        ],
        note: T(l, 'Base: Ley 25/2013, arts. 3 a 6; Orden HAP/1074/2014, art. 5.3.', 'Basis: Law 25/2013, arts. 3 to 6; Order HAP/1074/2014, art. 5.3.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ formato: Facturae o factura B2B */
function formatoSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'dest', label: T(l, 'La factura va a', 'The invoice goes to'), def: String(a?.dest ?? 'face'), options: [
        { value: 'face', label: T(l, 'Una Administración (FACe)', 'A public body (FACe)') }, { value: 'plataforma', label: T(l, 'Una empresa, por plataforma privada', 'A business, via a private platform') }, { value: 'publica', label: T(l, 'Una empresa, por la solución pública', 'A business, via the public solution') },
      ] },
    ],
    run: (v) => {
      const d = s(v, 'dest');
      return {
        label: T(l, 'Formato y firma', 'Format and signature'), value: d === 'face' ? `Facturae ${P.facturae.version}` : d === 'plataforma' ? 'UBL, CII, EDIFACT, Facturae' : 'UBL (EN 16931)',
        sub: d === 'face' ? T(l, 'Facturae con firma electrónica avanzada XAdES basada en certificado (Ley 25/2013, art. 5, y política de firma de Facturae).', 'Facturae with an XAdES advanced electronic signature based on a certificate (Law 25/2013, art. 5, and the Facturae signature policy).')
          : d === 'plataforma' ? T(l, 'Cualquier sintaxis de la norma EN 16931 o Facturae, con firma electrónica avanzada; la plataforma envía copia fiel en UBL a la solución pública (RD 238/2026, arts. 6 y 7).', 'Any EN 16931 syntax or Facturae, with an advanced electronic signature; the platform sends a faithful UBL copy to the public solution (RD 238/2026, arts. 6 and 7).')
            : T(l, 'La solución pública de la AEAT trabaja en UBL conforme a EN 16931 y ofrece formularios gratuitos con identificación electrónica (Orden HAC/1028/2026).', 'The AEAT public solution works in UBL under EN 16931 and offers free forms with electronic identification (Order HAC/1028/2026).'),
        rows: [
          [T(l, 'Obligatoria desde', 'Mandatory since'), d === 'face' ? day(P.factura.faceDesde, l) : day(B.fechaGrandes, l) + ' / ' + day(B.fechaResto, l)],
          [T(l, 'Identificador único', 'Unique identifier'), d === 'face' ? T(l, 'Número de registro de FACe', 'FACe registry number') : T(l, 'NIF + serie y número + fecha', 'Tax ID + series and number + date')],
          [T(l, 'Estados', 'Statuses'), d === 'face' ? T(l, 'Los publica FACe', 'Published by FACe') : T(l, 'Aceptación, rechazo y pago en 4 días', 'Acceptance, rejection and payment in 4 days')],
        ],
        note: T(l, 'Una misma factura puede tener que cumplir dos cosas: el formato electrónico (Facturae o B2B) y el registro de Verifactu del programa que la emite.', 'One invoice may need two things: the electronic format (Facturae or B2B) and the Verifactu record from the software issuing it.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ cómo obtener un Facturae */
function descargaSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'fact', label: T(l, 'Facturas a la Administración al año', 'Invoices to public bodies per year'), def: Number(a?.fact ?? 6), max: 100000, decimals: 0 },
      { kind: 'choice', id: 'cert', label: T(l, '¿Tienes certificado electrónico?', 'Do you have an e-certificate?'), def: 'si', options: yn(l) },
      { kind: 'choice', id: 'inst', label: T(l, '¿Puedes instalar programas?', 'Can you install software?'), def: 'si', options: yn(l) },
    ],
    run: (v) => {
      const f = n(v, 'fact'), cert = s(v, 'cert') === 'si', inst = s(v, 'inst') === 'si';
      const value = f > 50 ? T(l, 'Programa con Facturae', 'Software with Facturae') : inst ? T(l, `Aplicación de escritorio ${P.facturae.appVersion}`, `Desktop app ${P.facturae.appVersion}`) : T(l, 'Creador en el navegador', 'In-browser creator');
      return {
        label: T(l, 'Camino recomendado', 'Suggested route'), value,
        sub: f > 50 ? T(l, 'Con muchas facturas, que tu programa genere el Facturae y lo firme te ahorra el trabajo manual.', 'With many invoices, software that creates and signs the Facturae saves manual work.')
          : inst ? T(l, `La aplicación gratuita de facturae.gob.es (versión ${P.facturae.appVersion}, para Linux, MacOS y Windows) crea y gestiona facturas en formato Facturae.`, `The free facturae.gob.es application (version ${P.facturae.appVersion}, for Linux, MacOS and Windows) creates and manages Facturae invoices.`)
            : T(l, 'Sin instalar nada, el creador de esta web genera el XML Facturae 3.2.2 en tu navegador; después lo firmas con tu certificado.', 'Without installing anything, this site’s creator builds the Facturae 3.2.2 XML in your browser; you then sign it with your certificate.'),
        rows: [
          [T(l, 'Firma', 'Signature'), cert ? T(l, 'Con tu certificado, en una aplicación de firma', 'With your certificate, in a signing app') : T(l, 'Necesitas un certificado electrónico', 'You need an electronic certificate')],
          [T(l, 'Versión del formato', 'Format version'), P.facturae.version],
          [T(l, 'Envío', 'Sending'), 'FACe'],
        ],
        note: T(l, 'Sin firma, FACe no acepta la factura. El creador de esta web no firma: no hay forma segura de usar tu certificado desde una página.', 'Without a signature FACe rejects the invoice. This site’s creator does not sign: there is no safe way to use your certificate from a web page.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ firma */
function firmaSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'caso', label: T(l, 'Qué vas a firmar', 'What you sign'), def: String(a?.caso ?? 'face'), options: [
        { value: 'face', label: T(l, 'Facturae para FACe', 'Facturae for FACe') }, { value: 'b2b', label: T(l, 'Factura B2B por plataforma', 'B2B invoice via platform') },
        { value: 'vf', label: T(l, 'Registro VERI*FACTU', 'VERI*FACTU record') }, { value: 'novf', label: T(l, 'Registro no VERI*FACTU', 'Non-VERI*FACTU record') },
      ] },
    ],
    run: (v) => {
      const c = s(v, 'caso');
      const m: Record<string, [string, string, string, string]> = {
        face: ['XAdES', 'Firma electrónica avanzada basada en certificado reconocido, o sello electrónico (Ley 25/2013, art. 5).', 'Advanced electronic signature based on a qualified certificate, or an electronic seal (Law 25/2013, art. 5).', 'Ley 25/2013'],
        b2b: [T(l, 'Firma avanzada', 'Advanced signature'), 'Las facturas que circulan por plataformas privadas llevan firma electrónica avanzada (RD 238/2026, art. 7).', 'Invoices exchanged through private platforms carry an advanced electronic signature (RD 238/2026, art. 7).', 'RD 238/2026'],
        vf: [T(l, 'No hace falta', 'Not needed'), 'Los sistemas VERI*FACTU no firman los registros: el envío a la AEAT los protege (RD 1007/2023, art. 16).', 'VERI*FACTU systems do not sign records: sending them to the AEAT protects them (RD 1007/2023, art. 16).', 'RD 1007/2023'],
        novf: [VF.firma, 'Cada registro se firma con certificado cualificado en formato XAdES Enveloped (Orden HAC/1177/2024, art. 14).', 'Each record is signed with a qualified certificate in XAdES Enveloped format (Order HAC/1177/2024, art. 14).', 'Orden HAC/1177/2024'],
      };
      const x = m[c];
      return {
        label: T(l, 'Firma exigida', 'Signature required'), value: x[0], sub: T(l, x[1], x[2]),
        rows: [[T(l, 'Norma', 'Rule'), x[3]], [T(l, 'Quién firma', 'Who signs'), c === 'vf' ? '–' : T(l, 'El emisor o quien factura en su nombre', 'The issuer or whoever invoices on its behalf')]],
        note: T(l, 'Ninguna herramienta de esta web firma: la firma se hace con tu certificado en tu equipo.', 'No tool on this site signs: you sign with your certificate on your own device.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ factura simplificada */
function simplificadaSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'imp', label: T(l, 'Importe con IVA', 'Amount incl. VAT'), def: Number(a?.imp ?? 250), unit: '€', max: 1e7, decimals: 2 },
      { kind: 'choice', id: 'sector', label: T(l, 'Actividad', 'Activity'), def: String(a?.sector ?? 'general'), options: [{ value: 'general', label: T(l, 'General', 'General') }, { value: 'listado', label: T(l, 'Comercio, hostelería…', 'Retail, hospitality…') }], help: T(l, 'Las del art. 4.2: venta al por menor, hostelería, transporte de personas, peluquería, aparcamiento y otras', 'Those in art. 4.2: retail, hospitality, passenger transport, hairdressing, parking and others') },
      { kind: 'choice', id: 'rect', label: T(l, '¿Es una rectificativa?', 'Is it a corrective invoice?'), def: 'no', options: yn(l), adv: true },
    ],
    run: (v) => {
      const r = R.simplificada(n(v, 'imp'), s(v, 'sector') as R.Sector, s(v, 'rect') === 'si');
      return {
        label: T(l, '¿Vale una factura simplificada?', 'Is a simplified invoice allowed?'), value: r.permitida ? T(l, 'Sí', 'Yes') : T(l, 'No: factura completa', 'No: full invoice'),
        sub: r.permitida ? T(l, `Hasta ${eur(r.limite, l)} con IVA puedes emitir una simplificada (RD 1619/2012, art. 4). Si el cliente es empresa y lo pide, añade su NIF y domicilio y la cuota (simplificada cualificada, art. 7.2).`, `Up to ${eur(r.limite, l)} incl. VAT you may issue a simplified invoice (RD 1619/2012, art. 4). If a business customer asks, add its tax ID, address and the VAT amount (qualified simplified invoice, art. 7.2).`)
          : T(l, `Por encima de ${eur(r.limite, l)} con IVA necesitas una factura completa con todos los datos del artículo 6.`, `Above ${eur(r.limite, l)} incl. VAT you need a full invoice with all article 6 data.`),
        rows: [
          [T(l, 'Límite general', 'General limit'), eur(P.simplificada.general, l)],
          [T(l, 'Límite de las actividades del art. 4.2', 'Limit for art. 4.2 activities'), eur(P.simplificada.sectores, l)],
          [T(l, 'Tipo en Verifactu', 'Verifactu type'), r.permitida ? 'F2' : 'F1'],
          [T(l, 'Factura electrónica B2B', 'B2B e-invoicing'), T(l, 'Excluida salvo cualificada (RD 238/2026, art. 4)', 'Excluded unless qualified (RD 238/2026, art. 4)')],
        ],
        note: T(l, 'No caben simplificadas en entregas intracomunitarias, ventas a distancia ni algunas operaciones con inversión del sujeto pasivo (art. 4.4).', 'Simplified invoices are not allowed for intra-EU supplies, distance sales or some reverse-charge transactions (art. 4.4).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ factura rectificativa */
function rectificativaSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { kind: 'select', id: 'causa', label: T(l, 'Motivo', 'Reason'), def: String(a?.causa ?? 'art80-1-2-6'), options: [
        { value: 'art80-1-2-6', label: T(l, 'IVA mal aplicado, devolución, descuento o anulación', 'Wrong VAT, return, discount or cancellation') }, { value: 'error', label: T(l, 'Otro error en los datos de la factura', 'Other error in the invoice data') },
        { value: 'concurso', label: T(l, 'Cliente en concurso', 'Customer in insolvency') }, { value: 'impago', label: T(l, 'Crédito incobrable', 'Bad debt') }, { value: 'otra', label: T(l, 'Otro motivo', 'Other reason') },
      ] },
      { kind: 'choice', id: 'simp', label: T(l, '¿Corriges una simplificada?', 'Correcting a simplified invoice?'), def: 'no', options: yn(l) },
      { id: 'ano', label: T(l, 'Año del devengo', 'Year of the tax point'), def: Number(a?.ano ?? 2024), max: 2100, decimals: 0, adv: true },
    ],
    run: (v) => {
      const t = R.tipoRectificativa(s(v, 'causa') as R.Causa, s(v, 'simp') === 'si');
      const lim = R.limiteRectificar(`${Math.round(n(v, 'ano'))}-12-31`);
      const desc: Record<string, [string, string]> = {
        R1: ['Error fundado en derecho o artículo 80, apartados uno, dos y seis, de la Ley del IVA', 'Error in law or article 80(1), (2) and (6) of the VAT Act'],
        R2: ['Artículo 80.tres: concurso del destinatario', 'Article 80(3): recipient insolvency'],
        R3: ['Artículo 80.cuatro: créditos incobrables', 'Article 80(4): bad debts'],
        R4: ['Resto de causas', 'Other causes'],
        R5: ['Rectificativa de facturas simplificadas', 'Correction of simplified invoices'],
      };
      return {
        label: T(l, 'Tipo de rectificativa en Verifactu', 'Verifactu corrective type'), value: t, sub: T(l, desc[t][0], desc[t][1]),
        rows: [
          [T(l, 'Serie', 'Series'), T(l, 'Específica para rectificativas (art. 15.5)', 'Separate series for corrections (art. 15.5)')],
          [T(l, 'Método', 'Method'), T(l, 'Sustitución (S) o diferencias (I)', 'Substitution (S) or differences (I)')],
          [T(l, 'Plazo para rectificar', 'Deadline to correct'), T(l, `4 años desde el devengo (hasta ${day(lim, l)} si fue el 31/12)`, `4 years from the tax point (until ${day(lim, l)} if it was 31/12)`)],
        ],
        note: T(l, 'Base: RD 1619/2012, art. 15; claves R1 a R5 de la Orden HAC/1177/2024. Una factura emitida no se borra: se rectifica o se anula con un registro de anulación.', 'Basis: RD 1619/2012, art. 15; codes R1 to R5 of Order HAC/1177/2024. An issued invoice is never deleted: it is corrected, or cancelled with a cancellation record.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ datos obligatorios de la factura (art. 6) */
const CAMPOS = ['num', 'fecha', 'emisor', 'nifs', 'domicilios', 'desc', 'tipo', 'cuota', 'fechaop'] as const;
function requisitosFacturaSpec(l: Lang): ToolSpec {
  const lab: Record<(typeof CAMPOS)[number], [string, string]> = {
    num: ['Número y serie', 'Number and series'], fecha: ['Fecha de expedición', 'Issue date'], emisor: ['Nombre o razón social de ambos', 'Names of both parties'],
    nifs: ['NIF del emisor y del destinatario', 'Tax IDs of issuer and recipient'], domicilios: ['Domicilio de ambos', 'Addresses of both'], desc: ['Descripción de la operación', 'Description of the supply'],
    tipo: ['Tipo de IVA aplicado', 'VAT rate applied'], cuota: ['Cuota de IVA', 'VAT amount'], fechaop: ['Fecha de la operación, si es distinta', 'Date of supply, if different'],
  };
  return {
    inputs: CAMPOS.map((k, i) => ({ kind: 'choice' as const, id: k, label: T(l, lab[k][0], lab[k][1]), def: i === 8 ? 'no' : 'si', options: yn(l), adv: i >= 6 })),
    run: (v) => {
      const faltan = CAMPOS.filter((k) => s(v, k) !== 'si' && k !== 'fechaop');
      return {
        label: T(l, 'Datos obligatorios presentes', 'Mandatory data present'), value: `${CAMPOS.length - 1 - faltan.length} / ${CAMPOS.length - 1}`,
        sub: faltan.length ? T(l, `Falta: ${faltan.map((k) => lab[k][0].toLowerCase()).join(', ')}. Sin estos datos la factura no es completa (RD 1619/2012, art. 6) y tu cliente puede perder la deducción del IVA.`, `Missing: ${faltan.map((k) => lab[k][1].toLowerCase()).join(', ')}. Without these the invoice is not complete (RD 1619/2012, art. 6) and your customer may lose the VAT deduction.`)
          : T(l, 'Tiene los datos básicos del artículo 6. Con Verifactu, añade además el QR tributario y, si procede, la leyenda VERI*FACTU.', 'It has the basic article 6 data. With Verifactu, also add the tax QR code and, where relevant, the VERI*FACTU wording.'),
        rows: [
          [T(l, 'Menciones especiales', 'Special wording'), T(l, 'Exención, inversión del sujeto pasivo, criterio de caja…', 'Exemption, reverse charge, cash accounting…')],
          [T(l, 'Desde Verifactu', 'With Verifactu'), T(l, 'QR tributario (art. 6.5)', 'Tax QR code (art. 6.5)')],
          [T(l, 'Conservación', 'Retention'), T(l, 'Durante el plazo de prescripción (art. 19)', 'For the limitation period (art. 19)')],
        ],
        note: T(l, 'Lista resumida del artículo 6.1 del RD 1619/2012; el texto completo tiene 16 apartados (a a p).', 'Summary of article 6.1 of RD 1619/2012; the full text has 16 items (a to p).'),
      };
    },
  };
}

/* ------------------------------------------------------------------ huella (mini) */
function huellaMiniSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'imp', label: T(l, 'Importe total', 'Total amount'), def: Number(a?.imp ?? 123.45), unit: '€', max: 1e9, decimals: 2 },
      { id: 'cuota', label: T(l, 'Cuota total', 'Total VAT'), def: Number(a?.cuota ?? 12.35), unit: '€', max: 1e9, decimals: 2 },
    ],
    run: (v) => {
      const alta = { ...EJEMPLO_1, importe: n(v, 'imp').toFixed(2), cuota: n(v, 'cuota').toFixed(2) };
      const h = huellaAlta(alta);
      return {
        label: T(l, 'Huella SHA-256', 'SHA-256 hash'), value: `${h.slice(0, 12)}…`,
        sub: T(l, 'Cambia un céntimo y cambia toda la huella: así se detecta cualquier alteración.', 'Change one cent and the whole hash changes: that is how tampering shows.'),
        rows: [[T(l, 'Huella completa', 'Full hash'), h], [T(l, 'Cadena', 'String'), cadenaAlta(alta).slice(0, 48) + '…']],
        note: T(l, 'Algoritmo del documento de la AEAT, versión 0.1.2.', 'Algorithm from the AEAT document, version 0.1.2.'),
      };
    },
  };
}

/* ------------------------------------------------------------------ URL del QR (mini) */
function qrMiniSpec(l: Lang, a?: Args): ToolSpec {
  return {
    inputs: [
      { id: 'imp', label: T(l, 'Importe total', 'Total amount'), def: Number(a?.imp ?? 241.4), unit: '€', max: 1e9, decimals: 2 },
      { kind: 'choice', id: 'mod', label: T(l, 'Sistema', 'System'), def: 'vf', options: [{ value: 'vf', label: 'VERI*FACTU' }, { value: 'no', label: T(l, 'No VERI*FACTU', 'Non-VERI*FACTU') }] },
    ],
    run: (v) => {
      const d = { nif: '89890001K', numserie: '12345678&G33', fecha: '01-01-2024', importe: String(Math.round(n(v, 'imp') * 100) / 100) };
      const url = construirUrl(d, s(v, 'mod') === 'vf' ? 'verifactu' : 'noverifactu', 'pruebas');
      const ok = validarDatos(d).errores.length === 0;
      return {
        label: T(l, 'URL que codifica el QR', 'URL encoded in the QR'), value: ok ? T(l, 'Válida', 'Valid') : T(l, 'Revisar', 'Check'),
        rows: [[T(l, 'URL (entorno de pruebas)', 'URL (test environment)'), url], [T(l, 'El & del número', 'The & in the number'), '%26']],
        note: T(l, 'Datos del ejemplo oficial de la AEAT, en su entorno de pruebas.', 'Data from the official AEAT example, in its test environment.'),
      };
    },
  };
}

export const SPECS: Record<string, (l: Lang, arg?: Args) => ToolSpec> = {
  verifactu: verifactuSpec, modalidad: modalidadSpec, calendario: calendarioSpec, sanciones: sancionesSpec, requisitos: requisitosSpec, elegir: elegirSpec,
  app: appSpec, territorio: territorioSpec, sii: siiSpec, b2b: b2bSpec, estados: estadosSpec, fe: feSpec, face: faceSpec, formato: formatoSpec,
  descarga: descargaSpec, firma: firmaSpec, simplificada: simplificadaSpec, rectificativa: rectificativaSpec, datos: requisitosFacturaSpec, hash: huellaMiniSpec, qrurl: qrMiniSpec,
};
export const TOOL_KINDS = [...Object.keys(SPECS), 'lector', 'qrgen', 'huella', 'creador', 'visor', 'frise'];
export function getTool(kind: string, l: Lang, arg?: Args): ToolSpec {
  const f = SPECS[kind]; if (!f) throw new Error(`simulador desconocido: ${kind}`);
  return f(l, arg);
}
/** Ejecuta un simulador con sus valores por defecto (o los dados): sirve a las páginas y a los tests. */
export function runTool(kind: string, l: Lang, arg?: Args, values?: V): ToolOut {
  const spec = getTool(kind, l, arg);
  const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])) as V;
  return spec.run(resolve(spec.inputs, { ...v, ...(values ?? {}) }));
}
export { formatNumber };
