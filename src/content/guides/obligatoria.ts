import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { displayDate } from '../../lib/format';

/* Factura electrónica obligatoria B2B: RD 238/2026 arts. 3 y 4, disposiciones adicionales segunda y quinta, transitorias
   segunda y tercera, final cuarta (sources.rd238); Orden HAC/1028/2026, disposición final única (sources.orden1028);
   Ley 18/2022 art. 12 y disposición final octava (sources.ley18); Ley 56/2007 art. 2 bis (sources.ley56).
   Fechas = cálculo del sitio (sumarMeses desde la entrada en vigor de la orden). */
const B = K.P.b2b;
const D = (iso: string, l: 'es' | 'en') => displayDate(iso, l === 'es' ? 'es-ES' : 'en-GB');
const PDF_HASTA = K.sumarMeses(B.fechaGrandes, B.pdfMeses);
const PUBLICA = K.sumarMeses(B.fechaGrandes, -B.solucionPublicaAntesMeses);

export default defineGuide({
  id: 'obligatoria', group: 'electronica', order: 2,
  tool: 'b2b',
  related: ['b2b', 'fe-autonomos', 'factura-electronica', 'calendario', 'simplificada'],
  sources: ['rd238', 'orden1028', 'ley18', 'ley56'],
  es: {
    slug: 'factura-electronica-obligatoria',
    nav: 'Factura electrónica obligatoria', card: 'Desde cuándo te obliga la factura electrónica B2B según tu volumen',
    title: 'Factura electrónica obligatoria 2026: fechas por volumen',
    description: 'Factura electrónica obligatoria en 2026: la fecha que te toca según tu volumen de operaciones, quién queda fuera, el PDF del primer año y la condición europea.',
    h1: 'Factura electrónica obligatoria: desde cuándo te toca',
    intro: 'Indica tu volumen de operaciones del año anterior, tu forma y tus clientes: el checker da la fecha en que la factura electrónica B2B será obligatoria para ti.',
    resume: `La factura electrónica entre empresas será obligatoria en dos fases que cuentan desde la entrada en vigor de la Orden HAC/1028/2026, el ${D(B.ordenVigor, 'es')}, según la disposición final cuarta del Real Decreto 238/2026. A los doce meses para quien tuvo un volumen de operaciones superior a ${B.umbral / 1e6} millones de euros el año natural anterior, calculado como en el artículo 121 de la Ley del IVA; por nuestro cálculo, el ${D(B.fechaGrandes, 'es')}. A los veinticuatro meses para el resto, el ${D(B.fechaResto, 'es')}. La obligación alcanza las facturas a empresarios y profesionales con sede, establecimiento permanente o domicilio en España, también cuando las expide el cliente o un tercero. Quedan fuera las facturas simplificadas no cualificadas, las facturas a particulares y a clientes extranjeros, y algunas operaciones de los mercados eléctrico y de gas y de las cámaras de compensación aéreas. Durante su primer año, las grandes empresas acompañarán cada factura de un PDF legible salvo que el cliente acepte el original. Los autónomos de hasta ${B.umbral / 1e6} millones podrán informar del estado de sus facturas de forma voluntaria doce meses más.`,
    faqs: [
      { q: '¿Qué volumen de operaciones cuenta para el umbral de 8 millones?', a: 'El del año natural inmediato anterior, calculado como dice el artículo 121 de la Ley del IVA: el importe total, sin el propio IVA, de las entregas de bienes y prestaciones de servicios realizadas en tu actividad. Es la misma cifra que usa Hacienda para otras obligaciones del IVA. Si superas el umbral, te toca la primera fase aunque factures poco a otras empresas.' },
      { q: '¿Por qué decís que las fechas son un cálculo vuestro?', a: `Porque el BOE no publica un día concreto: el RD 238/2026 fija plazos de doce y veinticuatro meses desde la entrada en vigor de la orden de la solución pública. La Orden HAC/1028/2026 entró en vigor el día siguiente a su publicación del ${D(B.ordenBoe, 'es')}. Sumando los meses salen nuestras fechas; si la Agencia Tributaria publica otra interpretación, la adoptaremos.` },
      { q: '¿Están obligadas las facturas simplificadas o tiques?', a: 'No, salvo que sean simplificadas cualificadas. El artículo 4 del RD 238/2026 exceptúa las operaciones documentadas con factura simplificada del artículo 4 del Reglamento de facturación. Las cualificadas son aquellas en las que el cliente empresario pide que consten su NIF y domicilio para deducir el IVA; esas sí deberán ser electrónicas cuando la obligación te alcance.' },
      { q: '¿Cuándo estará disponible la solución pública de la Agencia Tributaria?', a: `El RD 238/2026 exige que esté disponible al menos ${B.solucionPublicaAntesMeses} meses antes de la primera aplicación efectiva. Con nuestras fechas, eso supone no más tarde del ${D(PUBLICA, 'es')}. Será gratuita para los usuarios y servirá para emitir, recibir y guardar copia de todas las facturas, además de para comunicar los pagos. Su uso técnico lo regula la Orden HAC/1028/2026.` },
    ],
    body: (h) => `
<h2>Las dos fases, con sus fechas</h2>
${h.table(['Quién', 'Obligatoria desde', 'Particularidad', 'Base'], [
  [`Volumen superior a ${h.eur(B.umbral)}`, h.day(B.fechaGrandes), `PDF junto a la factura hasta el ${h.day(PDF_HASTA)}, salvo que el cliente acepte el original`, 'DF 4ª.1.a y DT 2ª'],
  [`Sociedades hasta ${h.eur(B.umbral)}`, h.day(B.fechaResto), 'Estados de la factura obligatorios desde el inicio', 'DF 4ª.1.b'],
  [`Autónomos y comunidades de bienes hasta ${h.eur(B.umbral)}`, h.day(B.fechaResto), `Estados de la factura voluntarios hasta el ${h.day(B.estadosVoluntariosHasta)}`, 'DF 4ª.1.b y DT 3ª'],
], 'Fechas calculadas por nosotros sumando los meses del RD 238/2026 a la entrada en vigor de la Orden HAC/1028/2026.', ['l', 'l', 'l', 'l'])}
<p>La ${h.src('rd238', 'disposición final cuarta del RD 238/2026')} difiere la aplicación efectiva y la cuenta desde la entrada en vigor de la orden ministerial de la solución pública. Esa orden es la ${h.src('orden1028', 'Orden HAC/1028/2026')}, que entró en vigor el ${h.day(B.ordenVigor)}, día siguiente a su publicación. El umbral se mide con el volumen de operaciones del año natural inmediato anterior.</p>
<h2>Quién queda fuera</h2>
<p>El artículo 3 limita la obligación a las facturas a empresarios y profesionales con sede, establecimiento permanente o domicilio en España, y el artículo 4 exceptúa las facturas simplificadas no cualificadas. La disposición adicional segunda deja fuera las actividades del operador del mercado eléctrico y del mercado organizado de gas, y las facturas liquidadas en las cámaras de compensación de la asociación internacional de transporte aéreo. Las facturas a particulares siguen otra regla, la del ${h.src('ley56', 'artículo 2 bis.4 de la Ley 56/2007')}.</p>
<p>Una vez obligado, el cliente tiene ${h.n(B.diasEstados)} días para comunicar el pago. Prueba el plazo:</p>
${h.mini('estados', { p: ['mes', 'dia'], c: 'Calculadora de estados y pagos' })}
<h2>Cómo prepararte desde ahora</h2>
<p>Tres pasos sirven para cualquier fase. Primero, calcula tu volumen de operaciones de este año, porque decide la fase del año siguiente. Segundo, pregunta a tu proveedor de facturación si emitirá en alguna de las sintaxis admitidas y si se conectará a una plataforma privada o a la solución pública. Tercero, revisa cómo registras los pagos: como cliente tendrás que comunicar cada pago completo con su fecha, y como proveedor podrás ver en la solución pública cuándo te pagan.</p>
<h2>Una condición europea que conviene vigilar</h2>
<p>La ${h.src('ley18', 'Ley 18/2022')} supeditó la entrada en vigor de su artículo 12, que impone el deber general, a obtener una excepción europea a los artículos 218 y 232 de la Directiva del IVA, como recuerda la nota del texto consolidado. El preámbulo del RD 238/2026 declara su coherencia con la ${B.directivaVida}, que modifica esa directiva. Damos las fechas tal como resultan de las normas publicadas; si una resolución posterior las cambiara, lo reflejaremos. Más detalle en ${h.a('b2b', 'la factura electrónica B2B')}, en ${h.a('fe-autonomos', 'la guía para autónomos')} y en el ${h.a('calendario', 'calendario')}.</p>
`,
  },
  en: {
    slug: 'mandatory-e-invoicing-spain',
    nav: 'Mandatory e-invoicing', card: 'When B2B e-invoicing becomes mandatory for you, by turnover',
    title: 'Mandatory E-Invoicing Spain 2026: Dates by Turnover Band',
    description: 'Mandatory e-invoicing in Spain 2026: the date that applies to your turnover, who is excluded, the first-year PDF rule and the EU condition behind the mandate.',
    h1: 'Mandatory e-invoicing in Spain: when it applies to you',
    intro: 'Enter your prior-year turnover, legal form and customers: the checker gives the date on which B2B e-invoicing becomes mandatory for you.',
    resume: `B2B e-invoicing in Spain becomes mandatory in two phases counted from the entry into force of Order HAC/1028/2026 on ${D(B.ordenVigor, 'en')}, under the fourth final provision of Royal Decree 238/2026. After twelve months for businesses whose turnover exceeded ${B.umbral / 1e6} million euros in the previous calendar year, measured as in article 121 of the VAT Act; by our calculation, ${D(B.fechaGrandes, 'en')}. After twenty-four months for everyone else, ${D(B.fechaResto, 'en')}. The mandate covers invoices to businesses with their seat, a permanent establishment or residence in Spain, including when the customer or a third party issues them. Excluded are non-qualified simplified invoices, invoices to consumers and foreign customers, and some transactions in the electricity and gas markets and air transport clearing houses. During their first year, large businesses will send a legible PDF with each invoice unless the customer accepts the original. Self-employed people up to ${B.umbral / 1e6} million may report invoice status voluntarily for twelve more months.`,
    faqs: [
      { q: 'Which turnover counts for the 8 million threshold?', a: 'That of the immediately preceding calendar year, measured under article 121 of the VAT Act: the total amount, excluding the VAT itself, of goods and services supplied in your business. It is the same figure the tax office uses for other VAT duties. If you exceed it, you fall in the first phase even if you invoice other businesses only a little.' },
      { q: 'Why do you say the dates are your own calculation?', a: `Because the BOE gives no specific day: RD 238/2026 sets periods of twelve and twenty-four months from the entry into force of the order on the public solution. Order HAC/1028/2026 came into force the day after its publication on ${D(B.ordenBoe, 'en')}. Adding the months gives our dates; if the Tax Agency publishes another reading, we will adopt it.` },
      { q: 'Are simplified invoices or receipts covered?', a: 'No, unless they are qualified simplified invoices. Article 4 of RD 238/2026 exempts transactions documented with a simplified invoice under article 4 of the Invoicing Regulation. Qualified ones are those where a business customer asks for its tax ID and address to be shown in order to deduct VAT; those will have to be electronic once the mandate reaches you.' },
      { q: 'When will the Tax Agency’s public solution be available?', a: `RD 238/2026 requires it to be available at least ${B.solucionPublicaAntesMeses} months before the first effective application. With our dates, that means no later than ${D(PUBLICA, 'en')}. It will be free to use and will serve to issue, receive and keep a copy of every invoice, as well as to report payments. Its technical use is governed by Order HAC/1028/2026.` },
    ],
    body: (h) => `
<h2>The two phases and their dates</h2>
${h.table(['Who', 'Mandatory from', 'Special feature', 'Basis'], [
  [`Turnover above ${h.eur(B.umbral)}`, h.day(B.fechaGrandes), `PDF alongside the invoice until ${h.day(PDF_HASTA)}, unless the customer accepts the original`, 'FP 4.1.a and TP 2'],
  [`Companies up to ${h.eur(B.umbral)}`, h.day(B.fechaResto), 'Invoice status reporting mandatory from the start', 'FP 4.1.b'],
  [`Self-employed and joint ownerships up to ${h.eur(B.umbral)}`, h.day(B.fechaResto), `Status reporting voluntary until ${h.day(B.estadosVoluntariosHasta)}`, 'FP 4.1.b and TP 3'],
], 'Dates calculated by us by adding the RD 238/2026 periods to the entry into force of Order HAC/1028/2026. FP: final provision; TP: transitional provision.', ['l', 'l', 'l', 'l'])}
<p>The ${h.src('rd238', 'fourth final provision of RD 238/2026')} defers effective application and counts it from the entry into force of the ministerial order on the public solution. That order is ${h.src('orden1028', 'Order HAC/1028/2026')}, which came into force on ${h.day(B.ordenVigor)}, the day after publication. The threshold uses the turnover of the immediately preceding calendar year.</p>
<h2>Who is excluded</h2>
<p>Article 3 limits the mandate to invoices to businesses with their seat, a permanent establishment or residence in Spain, and article 4 exempts non-qualified simplified invoices. The second additional provision leaves out the activities of the electricity market operator and the organised gas market, and invoices settled through the clearing houses of the international air transport association. Invoices to consumers follow another rule, ${h.src('ley56', 'article 2 bis.4 of Law 56/2007')}.</p>
<p>Once caught, the customer has ${h.n(B.diasEstados)} days to report payment. Try the deadline:</p>
${h.mini('estados', { p: ['mes', 'dia'], c: 'Status and payment calculator' })}
<h2>How to prepare now</h2>
<p>Three steps work for either phase. First, work out this year’s turnover, because it decides your phase the following year. Second, ask your invoicing provider whether it will issue in one of the accepted syntaxes and whether it will connect to a private platform or the public solution. Third, review how you record payments: as a customer you will have to report each full payment with its date, and as a supplier you will be able to see in the public solution when you are paid. If you are close to the threshold, plan for the earlier date.</p>
<h2>An EU condition worth watching</h2>
<p>${h.src('ley18', 'Law 18/2022')} made the entry into force of its article 12, which imposes the general duty, conditional on obtaining an EU derogation from articles 218 and 232 of the VAT Directive, as the note in the consolidated text recalls. The preamble of RD 238/2026 states that it is consistent with ${B.directivaVida}, which amends that directive. We give the dates as they follow from the published rules; if a later decision changed them, we will reflect it. More detail in ${h.a('b2b', 'B2B e-invoicing')}, in ${h.a('fe-autonomos', 'the guide for the self-employed')} and in the ${h.a('calendario', 'timeline')}.</p>
`,
  },
});
