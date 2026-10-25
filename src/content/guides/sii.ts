import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { formatMoney, displayDate } from '../../lib/format';

/* SII: Reglamento del IVA arts. 62.6, 68 bis, 69 bis y 71.3 (sources.riva); RD 1007/2023 art. 3.3 (sources.rd1007);
   festivos nacionales 2026 y 2027 (sources.festivos2026, festivos2027). Ejemplo calculado con K.plazoSii. */
const S = K.P.sii;
const EJ = '2026-12-23';
const R = K.plazoSii('expedida', EJ, EJ);
const D = (iso: string, l: 'es' | 'en') => displayDate(iso, l === 'es' ? 'es-ES' : 'en-GB');

export default defineGuide({
  id: 'sii', group: 'verifactu', order: 9,
  tool: 'sii',
  related: ['que-es', 'ticketbai', 'rectificativa', 'b2b', 'calendario'],
  sources: ['riva', 'rd1007', 'festivos2026', 'festivos2027'],
  es: {
    slug: 'sii-suministro-inmediato',
    nav: 'SII: suministro inmediato', card: 'Plazo de 4 días del SII y por qué quien lo lleva queda fuera de Verifactu',
    title: 'SII 2026: plazo de 4 días, quién está obligado y Verifactu',
    description: 'SII 2026: calcula el último día para enviar cada factura al Suministro Inmediato de Información, con festivos, quién está obligado y por qué no hay Verifactu.',
    h1: 'SII: plazo de 4 días, obligados y relación con Verifactu',
    intro: 'Elige el tipo de registro y la fecha: la calculadora da el último día para enviarlo al SII, sin contar sábados, domingos ni festivos nacionales.',
    resume: `El Suministro Inmediato de Información, o SII, es la forma de llevar los libros registro del IVA a través de la sede electrónica de la Agencia Tributaria, enviando el detalle de cada factura en pocos días. Según el artículo 62.6 del Reglamento del IVA, están obligados quienes liquidan el IVA cada mes: las empresas cuyo volumen de operaciones superó ${formatMoney(S.volumen, 2, 'es')} el año anterior, las inscritas en el registro de devolución mensual, los grupos de entidades a efectos del IVA y otros casos del artículo 71.3; el resto puede optar voluntariamente. El artículo 69 bis fija los plazos: ${S.diasExpedidas} días naturales desde la expedición para las facturas emitidas, ${S.diasTercero} si las expide el cliente o un tercero, y ${S.diasRecibidas} desde el registro contable para las recibidas, sin contar sábados, domingos ni festivos nacionales, y siempre antes del día ${S.limiteDia} del mes siguiente. Quien lleva el SII queda fuera de Verifactu por el artículo 3.3 del Real Decreto 1007/2023, porque Hacienda ya recibe sus facturas casi en tiempo real. Si sales del SII, entras en Verifactu.`,
    faqs: [
      { q: '¿Por qué quien lleva el SII no tiene que cumplir Verifactu?', a: 'Porque el artículo 3.3 del Real Decreto 1007/2023 excluye expresamente a los contribuyentes que llevan los libros registro conforme al artículo 62.6 del Reglamento del IVA. La Agencia Tributaria ya recibe el detalle de sus facturas en pocos días, así que no les exige un segundo sistema de registro. La exclusión dura mientras estés en el SII: si te das de baja, pasas a estar obligado.' },
      { q: '¿Puedo darme de alta en el SII de forma voluntaria?', a: 'Sí. El artículo 68 bis del Reglamento del IVA permite optar por la llevanza electrónica de los libros registro mediante la declaración censal, en cualquier momento del año, con efecto desde el primer periodo de liquidación que empiece después. Quien opta debe mantenerse al menos todo ese año natural y cumplir los plazos de cuatro días, algo que exige un sistema preparado.' },
      { q: '¿Cuentan los festivos de mi comunidad autónoma en el plazo?', a: 'No. El artículo 69 bis excluye del cómputo los sábados, los domingos y los festivos nacionales, es decir, los que se celebran en todo el país según la resolución anual de la Dirección General de Trabajo. Los festivos solo autonómicos o locales sí cuentan como días del plazo. Nuestra calculadora usa los festivos nacionales de 2026 y 2027 publicados en el BOE.' },
      { q: '¿Qué plazo tienen las facturas que emite mi cliente por mí?', a: `Cuando la factura la expide el destinatario o un tercero, en lugar del propio empresario, el plazo es de ${S.diasTercero} días naturales en lugar de ${S.diasExpedidas}, también sin sábados, domingos ni festivos nacionales. El tope del día ${S.limiteDia} del mes siguiente al devengo se mantiene. Es el caso de la autofacturación pactada con un cliente, prevista en el artículo 164.dos de la Ley del IVA.` },
    ],
    body: (h) => `
<h2>Plazos del artículo 69 bis</h2>
${h.table(['Registro', 'Plazo', 'Desde', 'Tope'], [
  ['Factura expedida', `${S.diasExpedidas} días`, 'La expedición', `Antes del día ${S.limiteDia} del mes siguiente al devengo`],
  ['Expedida por el cliente o un tercero', `${S.diasTercero} días`, 'La expedición', `Antes del día ${S.limiteDia} del mes siguiente al devengo`],
  ['Factura recibida', `${S.diasRecibidas} días`, 'El registro contable', `Antes del día ${S.limiteDia} del mes siguiente al periodo de liquidación`],
  ['Factura rectificativa', `${S.diasExpedidas} días`, 'La expedición o el registro contable', 'Según el caso'],
], 'Días naturales sin sábados, domingos ni festivos nacionales. Reglamento del IVA, artículo 69 bis.', ['l', 'r', 'l', 'l'])}
<p>El ${h.src('riva', 'artículo 69 bis del Reglamento del IVA')} cuenta los días de una forma particular: son días naturales, pero se saltan los sábados, los domingos y los festivos nacionales. Un ejemplo con una factura expedida el ${h.day(EJ)}: el día 25 de diciembre es festivo nacional según la ${h.src('festivos2026', 'resolución de fiestas laborales para 2026')} y después viene un fin de semana, así que el plazo de ${S.diasExpedidas} días termina el ${h.day(R.porDias)}, antes del tope del ${h.day(R.tope ?? R.limite)}. El último día para enviarla es, por tanto, el ${h.day(R.limite)}.</p>
<h2>Quién está obligado</h2>
<p>El SII no depende del tamaño en abstracto, sino del periodo de liquidación del IVA. El artículo 62.6 remite a quienes liquidan cada mes, y el artículo 71.3 los enumera: volumen de operaciones superior a ${h.eur(S.volumen, 2)} el año anterior, inscritos en el registro de devolución mensual, grupos de entidades, ciertos adquirentes de patrimonios empresariales y titulares de depósitos fiscales de hidrocarburos. Cualquier otro empresario puede optar por el SII con el artículo 68 bis. Quien opta debe permanecer al menos el año natural y adaptar su sistema contable para enviar los registros en plazo.</p>
<p>Comprueba qué pasa con Verifactu si llevas o dejas el SII:</p>
${h.mini('verifactu', { p: ['sii', 'tipo'], d: { sii: 'si', tipo: 'sociedad' }, c: 'Diagnóstico completo de Verifactu' })}
<h2>SII, Verifactu y factura electrónica</h2>
<p>El ${h.src('rd1007', 'artículo 3.3 del RD 1007/2023')} saca del reglamento a quien lleva el SII. Eso no le libra de la factura electrónica entre empresas, que es otra obligación: si tu volumen supera ${h.eur(K.P.b2b.umbral)}, la tendrás, según nuestro cálculo, desde el ${h.day(K.P.b2b.fechaGrandes)}. Lo explicamos en ${h.a('b2b', 'la factura electrónica B2B')}. Las correcciones de facturas tienen sus propias reglas, en ${h.a('rectificativa', 'la factura rectificativa')}; y para ver todas las fechas juntas, consulta el ${h.a('calendario', 'calendario')}. En el País Vasco, Bizkaia integra los libros en Batuz: mira ${h.a('ticketbai', 'TicketBAI')}.</p>
`,
  },
  en: {
    slug: 'sii-immediate-supply',
    nav: 'SII: immediate supply', card: 'The SII 4-day deadline and why SII filers are outside Verifactu',
    title: 'SII Spain 2026: 4-Day Deadline, Who Must File, Verifactu',
    description: 'SII Spain 2026: find the last day to send each invoice to the Immediate Supply of Information, with holidays, who must file and why Verifactu is excluded.',
    h1: 'SII: the 4-day deadline, who files and how it relates to Verifactu',
    intro: 'Choose the record type and date: the calculator gives the last day to send it to the SII, excluding Saturdays, Sundays and national holidays.',
    resume: `The Immediate Supply of Information, or SII, is the way of keeping the VAT books through the Spanish Tax Agency website, sending the details of each invoice within a few days. Under article 62.6 of the VAT Regulation, it is mandatory for businesses that file VAT monthly: those whose turnover exceeded ${formatMoney(S.volumen, 2, 'en')} in the previous year, those registered for monthly refunds, VAT groups and the other cases in article 71.3; anyone else may opt in. Article 69 bis sets the deadlines: ${S.diasExpedidas} calendar days from issue for invoices issued, ${S.diasTercero} if issued by the customer or a third party, and ${S.diasRecibidas} from booking for invoices received, excluding Saturdays, Sundays and national holidays, and always before day ${S.limiteDia} of the following month. SII filers are outside Verifactu under article 3.3 of Royal Decree 1007/2023, because the tax office already receives their invoices almost in real time. If you leave the SII, Verifactu applies to you. The calculator above uses the national holidays for 2026 and 2027.`,
    faqs: [
      { q: 'Why do SII filers not have to comply with Verifactu?', a: 'Because article 3.3 of Royal Decree 1007/2023 expressly excludes taxpayers who keep their books under article 62.6 of the VAT Regulation. The Tax Agency already receives their invoice details within days, so it does not require a second recording system. The exclusion lasts while you are on the SII: if you leave, you become caught.' },
      { q: 'Can I join the SII voluntarily?', a: 'Yes. Article 68 bis of the VAT Regulation lets you opt for keeping the books electronically through a census declaration, at any time of year, taking effect from the first filing period that starts afterwards. Anyone who opts in must stay for at least that calendar year and meet the four-day deadlines, which needs a system built for it.' },
      { q: 'Do my regional holidays count in the deadline?', a: 'No. Article 69 bis excludes Saturdays, Sundays and national holidays, meaning those observed across the whole country under the annual resolution of the Directorate-General for Labour. Purely regional or local holidays do count as days of the deadline. Our calculator uses the national holidays for 2026 and 2027 published in the BOE.' },
      { q: 'What deadline applies to invoices my customer issues for me?', a: `When the invoice is issued by the recipient or a third party instead of the business itself, the deadline is ${S.diasTercero} calendar days instead of ${S.diasExpedidas}, again excluding Saturdays, Sundays and national holidays. The cap of day ${S.limiteDia} of the month after the tax point still applies. This covers self-billing agreed with a customer under article 164.dos of the VAT Act.` },
    ],
    body: (h) => `
<h2>Deadlines under article 69 bis</h2>
${h.table(['Record', 'Deadline', 'From', 'Cap'], [
  ['Invoice issued', `${S.diasExpedidas} days`, 'Issue', `Before day ${S.limiteDia} of the month after the tax point`],
  ['Issued by customer or third party', `${S.diasTercero} days`, 'Issue', `Before day ${S.limiteDia} of the month after the tax point`],
  ['Invoice received', `${S.diasRecibidas} days`, 'Booking', `Before day ${S.limiteDia} of the month after the filing period`],
  ['Corrective invoice', `${S.diasExpedidas} days`, 'Issue or booking', 'Depends on the case'],
], 'Calendar days excluding Saturdays, Sundays and national holidays. VAT Regulation, article 69 bis.', ['l', 'r', 'l', 'l'])}
<p>${h.src('riva', 'Article 69 bis of the VAT Regulation')} counts days in a particular way: they are calendar days, but Saturdays, Sundays and national holidays are skipped. Take an invoice issued on ${h.day(EJ)}: 25 December is a national holiday under the ${h.src('festivos2026', 'resolution on public holidays for 2026')} and a weekend follows, so the ${S.diasExpedidas}-day period ends on ${h.day(R.porDias)}, before the cap of ${h.day(R.tope ?? R.limite)}. The last day to send it is therefore ${h.day(R.limite)}. Regional and local holidays do not stop the clock: only national ones do, which is why the calculator above loads the national holiday lists for 2026 and 2027 from the BOE and warns you when a date falls outside them.</p>
<h2>Who must file</h2>
<p>The SII does not depend on size in the abstract but on the VAT filing period. Article 62.6 refers to monthly filers, and article 71.3 lists them: turnover above ${h.eur(S.volumen, 2)} in the previous year, businesses registered for monthly refunds, VAT groups, certain buyers of business assets and holders of fuel tax warehouses. Any other business may opt in under article 68 bis, through a census declaration, with effect from the next filing period. Opting in means staying for at least that calendar year and sending records within the four-day windows, so the accounting system must be able to send them automatically and keep track of rejected submissions.</p>
<p>See what happens with Verifactu if you keep or leave the SII:</p>
${h.mini('verifactu', { p: ['sii', 'tipo'], d: { sii: 'si', tipo: 'sociedad' }, c: 'Full Verifactu check' })}
<h2>SII, Verifactu and e-invoicing</h2>
<p>${h.src('rd1007', 'Article 3.3 of RD 1007/2023')} takes SII filers out of the regulation. That does not free them from B2B e-invoicing, which is a separate duty: if your turnover exceeds ${h.eur(K.P.b2b.umbral)}, it applies, by our calculation, from ${h.day(K.P.b2b.fechaGrandes)}. We explain it in ${h.a('b2b', 'B2B e-invoicing')}. Corrections have their own rules, in ${h.a('rectificativa', 'the corrective invoice')}; to see all dates together, check the ${h.a('calendario', 'timeline')}. In the Basque Country, Bizkaia folds the books into Batuz: see ${h.a('ticketbai', 'TicketBAI')}.</p>
`,
  },
});
