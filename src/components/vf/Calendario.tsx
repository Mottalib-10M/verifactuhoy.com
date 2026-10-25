/**
 * Frise del calendario (RECETTE §17.6): de la adaptación de los programas (productores) al fin del periodo voluntario de
 * los estados de la factura B2B. Cada tramo dura exactamente los días entre dos fechas de params-2026.json, así que cada
 * etapa termina en su fecha oficial. El lector puede mover la fecha de partida para ver el efecto de un aplazamiento.
 */
import Frise, { type FriseStep } from '../ui/Frise';
import P from '../../data/params-2026.json';
import type { Lang } from '../../lib/format';

const VF = P.verifactu, B = P.b2b, S = P.sources as Record<string, { url: string; label: { es: string; en: string } }>;
const days = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);

export default function Calendario({ lang, idPrefix = 'cal' }: { lang: Lang; idPrefix?: string }) {
  const es = lang === 'es';
  const src = (k: string) => ({ label: S[k].label[lang], href: S[k].url });
  const tramos: Array<[string, string, string, string, string, string]> = [
    // [desde, hasta, título es, título en, detalle es, detalle en] ; fuente por índice abajo
    [VF.productoresDesde, VF.sociedadesAntes, 'Sociedades: adaptar el programa', 'Companies: adapt the software', 'Los productores ya debían ofrecer programas adaptados. Quien paga el Impuesto sobre Sociedades tiene hasta el 31 de diciembre de 2026.', 'Producers already had to offer adapted software. Corporate income taxpayers have until 31 December 2026.'],
    [VF.sociedadesAntes, VF.restoAntes, 'Autónomos y resto: adaptar el programa', 'Self-employed and others: adapt the software', 'Las sociedades ya facturan con Verifactu. Autónomos, comunidades de bienes y no residentes tienen hasta el 30 de junio de 2027.', 'Companies already invoice under Verifactu. The self-employed, joint ownerships and non-residents have until 30 June 2027.'],
    [VF.restoAntes, B.fechaGrandes, 'Factura B2B: preparación de las grandes', 'B2B e-invoicing: large businesses prepare', `Todos facturan con Verifactu. Las empresas con más de ${B.umbral / 1e6} millones de volumen de operaciones preparan la factura electrónica.`, `Everyone invoices under Verifactu. Businesses with turnover above ${B.umbral / 1e6} million prepare for e-invoicing.`],
    [B.fechaGrandes, B.fechaResto, 'Factura B2B: preparación del resto', 'B2B e-invoicing: everyone else prepares', 'Las grandes ya emiten factura electrónica, acompañada de un PDF durante 12 meses salvo que el cliente acepte recibirla solo en su formato original. El resto prepara su paso.', 'Large businesses already issue e-invoices, accompanied by a PDF for 12 months unless the customer agrees to receive only the original format. Everyone else prepares.'],
    [B.fechaResto, B.estadosVoluntariosHasta, 'Estados de la factura: voluntarios para autónomos pequeños', 'Invoice status: voluntary for small self-employed', `Todos emiten factura electrónica. Los autónomos de hasta ${B.umbral / 1e6} millones informan del estado de forma voluntaria hasta esta fecha.`, `Everyone issues e-invoices. Self-employed people up to ${B.umbral / 1e6} million report invoice status voluntarily until this date.`],
  ];
  const fuentes = ['rd1007', 'rd1007', 'rd238', 'rd238', 'rd238'];
  const steps: FriseStep[] = [
    { id: 'productores', title: es ? 'Programas adaptados a la venta' : 'Adapted software on sale', detail: es ? 'Nueve meses después de la Orden HAC/1177/2024 (cálculo del sitio).' : 'Nine months after Order HAC/1177/2024 (site calculation).', minDays: 0, maxDays: 0, source: src('orden1177') },
    ...tramos.map(([a, b, te, tn, de, dn], i) => ({ id: `t${i}`, title: es ? te : tn, detail: es ? de : dn, minDays: days(a, b), maxDays: days(a, b), source: src(fuentes[i]) })),
  ];
  const labels = es
    ? { start: 'Inicio del calendario', startHelp: 'Fecha a partir de la cual los productores debían ofrecer programas adaptados.', end: 'Fin del calendario', between: 'entre', and: 'y', today: 'Hoy', done: 'Terminado', current: 'En curso', upcoming: 'Por llegar', day: 'día', days: 'días', week: 'semana', weeks: 'semanas', month: 'mes', months: 'meses', milestone: 'hito', caption: 'Calendario de Verifactu y de la factura electrónica B2B: cada tramo termina en su fecha oficial.' }
    : { start: 'Timeline start', startHelp: 'Date from which producers had to offer adapted software.', end: 'Timeline end', between: 'between', and: 'and', today: 'Today', done: 'Done', current: 'In progress', upcoming: 'Upcoming', day: 'day', days: 'days', week: 'week', weeks: 'weeks', month: 'month', months: 'months', milestone: 'milestone', caption: 'Verifactu and B2B e-invoicing timeline: each stretch ends on its official date.' };
  return <Frise steps={steps} labels={labels} locale={es ? 'es-ES' : 'en-GB'} defaultStart={VF.productoresDesde} id={`${idPrefix}-frise`} />;
}
