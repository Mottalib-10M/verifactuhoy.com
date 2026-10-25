import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { displayDate } from '../../lib/format';

/* Factura electrónica B2B, funcionamiento: RD 238/2026 arts. 5 a 12 (sources.rd238); Ley 56/2007 art. 2 bis.3 y 3 bis
   (sources.ley56); Orden HAC/1028/2026 (sources.orden1028); festivos nacionales 2027 (sources.festivos2027).
   Ejemplo de plazo calculado con K.plazoHabil. */
const B = K.P.b2b;
const EJ = '2027-12-04';
const PL = K.plazoHabil(EJ, B.diasEstados);
const FEST = K.P.festivos['2027'].filter((d) => d > EJ && d <= PL.fecha);
const D = (iso: string, l: 'es' | 'en') => displayDate(iso, l === 'es' ? 'es-ES' : 'en-GB');

export default defineGuide({
  id: 'b2b', group: 'electronica', order: 3,
  tool: 'estados',
  related: ['obligatoria', 'facturae-vs-b2b', 'factura-electronica', 'firma', 'fe-autonomos'],
  sources: ['rd238', 'ley56', 'orden1028', 'festivos2027'],
  es: {
    slug: 'factura-electronica-b2b',
    nav: 'Factura electrónica B2B', card: `Cómo funciona: plataformas, solución pública, estados y pago en ${B.diasEstados} días`,
    title: `Factura electrónica B2B 2026: cómo va y plazo de ${B.diasEstados} días`,
    description: `Factura electrónica B2B 2026: plataformas privadas o solución pública de la AEAT, copia fiel en UBL, estados y plazo de ${B.diasEstados} días para comunicar el pago.`,
    h1: 'Factura electrónica B2B: cómo funciona el sistema español',
    intro: 'Elige la fecha en que recibes, aceptas o pagas una factura: la calculadora da el último día para comunicarlo, sin sábados, domingos ni festivos nacionales.',
    resume: `El sistema español de factura electrónica que crea el Real Decreto 238/2026 tiene dos vías que pueden combinarse: las plataformas privadas de intercambio, que cumplen requisitos técnicos y de seguridad, y la solución pública de la Agencia Tributaria, gratuita, que usa la sintaxis UBL y sirve además de repositorio de todas las facturas. Si no has acordado con tus proveedores recibir por una plataforma, se entiende que eliges la solución pública sin hacer nada. Quien emite por una plataforma privada debe firmar la factura con firma electrónica avanzada y enviar a la vez una copia fiel en UBL a la solución pública. Las plataformas están obligadas a interconectarse entre sí gratis, en un plazo máximo de un mes desde la solicitud. El cliente informa al emisor de la aceptación o el rechazo de cada factura y de su pago completo, en un plazo de ${B.diasEstados} días naturales sin sábados, domingos ni festivos nacionales, y comunica además el pago, con su fecha y el vencimiento, a la solución pública. Si no rechaza la factura, se presume aceptada. Nadie puede obligar a su proveedor a usar una plataforma concreta.`,
    faqs: [
      { q: '¿Tengo que contratar una plataforma de factura electrónica?', a: 'No. La solución pública de la Agencia Tributaria es gratuita y basta para emitir y recibir. Si no has acordado expresamente con tus proveedores recibir por una plataforma privada, el artículo 6 del RD 238/2026 entiende que eliges la solución pública. Una plataforma puede compensarte si emites muchas facturas o quieres integrarla con tu contabilidad, pero es una elección.' },
      { q: '¿Qué pasa si no comunico el rechazo de una factura?', a: 'El artículo 12 del RD 238/2026 presume que la factura está aceptada si no hay rechazo ni una factura rectificativa posterior. Por eso conviene revisar las facturas recibidas a tiempo. Las desavenencias comerciales, incluido el repudio de una factura, afectan solo a la relación entre las partes y no eximen de emitir la rectificativa que corresponda.' },
      { q: '¿Puede mi cliente exigirme que use su plataforma?', a: 'No. El artículo 2 bis.3 bis de la Ley 56/2007 prohíbe al receptor obligar al emisor a usar una solución, plataforma o proveedor predeterminado. Las plataformas, además, deben interconectarse gratis con cualquier otra que forme parte del sistema español cuando un cliente lo pida, y mientras la conexión no funcione las facturas viajan a través de la solución pública.' },
      { q: '¿Durante cuánto tiempo puedo pedir copia de una factura electrónica?', a: 'Durante cuatro años desde su emisión, sin costes adicionales, según el artículo 2 bis.3 de la Ley 56/2007. La solución pública, por su parte, permitirá a emisores, destinatarios y sus autorizados descargar las facturas, tanto originales como copias fieles, distinguiendo unas de otras. Conserva también tus propias copias, porque las obligaciones de conservación del IVA siguen vigentes.' },
    ],
    body: (h) => `
<h2>Las piezas del sistema</h2>
${h.table(['Pieza', 'Qué hace', 'Base'], [
  ['Plataforma privada', 'Envía y recibe facturas firmadas; debe interconectarse gratis con las demás', 'RD 238/2026, arts. 7.3, 8, 9 y 13'],
  ['Solución pública de la AEAT', 'Emite y recibe en UBL, guarda todas las facturas, gratis', 'RD 238/2026, art. 11'],
  ['Copia fiel', 'Copia en UBL que la plataforma envía a la solución pública al emitir', 'RD 238/2026, art. 6.2'],
  ['Punto de entrada', 'Dónde recibes; si no lo publicas, la solución pública', 'RD 238/2026, art. 6.3'],
  ['Código único', 'NIF del emisor, serie y número, y fecha de expedición', 'RD 238/2026, art. 7.5'],
], 'Elementos del sistema español de factura electrónica.', ['l', 'l', 'l'])}
<p>El ${h.src('rd238', 'RD 238/2026')} admite cuatro sintaxis, ${B.formatos.join(', ')}, todas sobre el modelo europeo EN 16931. Las plataformas deben saber transformar una factura de un formato a otro, así que emisor y receptor no tienen que usar el mismo. La solución pública trabaja solo en UBL, en los términos de la ${h.src('orden1028', 'Orden HAC/1028/2026')}. Quien recibe por una plataforma debe hacer público su punto de entrada en sus comunicaciones y en su web.</p>
<h2>Estados de la factura y pago</h2>
<p>El artículo 10 obliga al destinatario a informar al emisor de dos estados: la aceptación o el rechazo comercial, con su fecha, y el pago efectivo completo, con su fecha. Puede informar además de aceptaciones o pagos parciales y de la cesión de la factura a un tercero. El artículo 12 añade la comunicación del pago completo, o del rechazo, a la solución pública, con la fecha de vencimiento. El plazo es de ${h.n(B.diasEstados)} días naturales, sin sábados, domingos ni festivos nacionales. Un pago hecho el ${h.day(EJ)} debe comunicarse como tarde el ${h.day(PL.fecha)}${FEST.length ? `, porque ${FEST.map((f) => h.day(f)).join(' y ')} ${FEST.length > 1 ? 'son festivos nacionales' : 'es festivo nacional'} según la ${h.src('festivos2027', 'resolución de fiestas laborales para 2027')}` : ''}.</p>
<p>¿Desde cuándo te tocan a ti estos plazos?</p>
${h.mini('b2b', { p: ['vol', 'pers'], c: 'Checker completo de la obligación' })}
<h2>Lo que gana el proveedor</h2>
<p>El sistema nace para combatir la morosidad: con la fecha de cada pago en la solución pública, la Agencia Tributaria dará a los ministerios competentes la información para seguir los plazos de pago entre empresas, como prevé el artículo 14. El emisor podrá comunicar de forma voluntaria el cobro, el impago o las diferencias con las fechas que comunicó su cliente. Las fechas de obligación están en la ${h.a('obligatoria', 'factura electrónica obligatoria')}; los formatos, en ${h.a('facturae-vs-b2b', 'Facturae o factura B2B')}; la firma, en ${h.a('firma', 'firmar un Facturae')}. El ${h.src('ley56', 'artículo 2 bis de la Ley 56/2007')} recoge los derechos básicos de emisor y receptor.</p>
`,
  },
  en: {
    slug: 'spain-b2b-e-invoicing',
    nav: 'B2B e-invoicing', card: `How it works: platforms, the public solution, status and ${B.diasEstados}-day payment reporting`,
    title: `B2B E-Invoicing in Spain 2026: How It Works, ${B.diasEstados}-Day Rule`,
    description: `B2B e-invoicing in Spain 2026: private platforms or the AEAT public solution, faithful UBL copies, invoice status and the ${B.diasEstados}-day deadline to report payment.`,
    h1: 'B2B e-invoicing in Spain: how the system works',
    intro: 'Choose the date you receive, accept or pay an invoice: the calculator gives the last day to report it, excluding Saturdays, Sundays and national holidays.',
    resume: `The Spanish e-invoicing system created by Royal Decree 238/2026 has two channels that can be combined: private exchange platforms, which meet technical and security requirements, and the Tax Agency’s public solution, free of charge, which uses the UBL syntax and also acts as a repository for all invoices. If you have not agreed with your suppliers to receive through a platform, you are deemed to choose the public solution without doing anything. Anyone issuing through a private platform must sign the invoice with an advanced electronic signature and simultaneously send a faithful UBL copy to the public solution. Platforms must connect with each other free of charge within one month of a request. The customer tells the issuer whether each invoice is accepted or rejected and when it is paid in full, within ${B.diasEstados} calendar days excluding Saturdays, Sundays and national holidays, and also reports the payment, with its date and the due date, to the public solution. If the customer does not reject an invoice, it is presumed accepted. Nobody can force a supplier to use a particular platform.`,
    faqs: [
      { q: 'Do I need to sign up with an e-invoicing platform?', a: 'No. The Tax Agency’s public solution is free and enough to issue and receive. If you have not expressly agreed with your suppliers to receive through a private platform, article 6 of RD 238/2026 deems you to choose the public solution. A platform may pay off if you issue many invoices or want to link it to your accounting, but it is a choice.' },
      { q: 'What happens if I do not report rejecting an invoice?', a: 'Article 12 of RD 238/2026 presumes the invoice is accepted if there is no rejection and no later corrective invoice. So it pays to review incoming invoices in time. Commercial disputes, including repudiating an invoice, affect only the relationship between the parties and do not remove the duty to issue any corrective invoice that is due.' },
      { q: 'Can my customer require me to use their platform?', a: 'No. Article 2 bis.3 bis of Law 56/2007 bars the recipient from forcing the issuer to use a particular solution, platform or provider. Platforms must also connect free of charge with any other platform in the Spanish system when a customer asks, and until the connection works, invoices travel through the public solution.' },
      { q: 'For how long can I ask for a copy of an e-invoice?', a: 'For four years from issue, at no extra cost, under article 2 bis.3 of Law 56/2007. The public solution will also let issuers, recipients and their authorised agents download invoices, both originals and faithful copies, telling them apart. Keep your own copies too, because the VAT record-keeping duties still apply.' },
    ],
    body: (h) => `
<h2>The parts of the system</h2>
${h.table(['Part', 'What it does', 'Basis'], [
  ['Private platform', 'Sends and receives signed invoices; must connect free with the others', 'RD 238/2026, arts. 7.3, 8, 9 and 13'],
  ['AEAT public solution', 'Issues and receives in UBL, stores every invoice, free', 'RD 238/2026, art. 11'],
  ['Faithful copy', 'UBL copy the platform sends to the public solution on issue', 'RD 238/2026, art. 6.2'],
  ['Entry point', 'Where you receive; if you publish none, the public solution', 'RD 238/2026, art. 6.3'],
  ['Unique code', 'Issuer tax ID, series and number, and issue date', 'RD 238/2026, art. 7.5'],
], 'Components of the Spanish e-invoicing system.', ['l', 'l', 'l'])}
<p>${h.src('rd238', 'RD 238/2026')} accepts four syntaxes, ${B.formatos.join(', ')}, all built on the European EN 16931 model. Platforms must be able to convert an invoice from one format to another, so issuer and recipient need not use the same one. The public solution works only in UBL, on the terms of ${h.src('orden1028', 'Order HAC/1028/2026')}. Anyone receiving through a platform must publish their entry point in their communications and on their website, so suppliers know where to send.</p>
<h2>Invoice status and payment</h2>
<p>Article 10 requires the recipient to tell the issuer two things: commercial acceptance or rejection, with its date, and full payment, with its date. It may also report partial acceptance or payment and assignment of the invoice to a third party. Article 12 adds reporting of full payment, or rejection, to the public solution, together with the due date. The deadline is ${h.n(B.diasEstados)} calendar days, excluding Saturdays, Sundays and national holidays. A payment made on ${h.day(EJ)} must be reported by ${h.day(PL.fecha)}${FEST.length ? `, because ${FEST.map((f) => h.day(f)).join(' and ')} ${FEST.length > 1 ? 'are national holidays' : 'is a national holiday'} under the ${h.src('festivos2027', 'resolution on public holidays for 2027')}` : ''}.</p>
<p>From when do these deadlines apply to you?</p>
${h.mini('b2b', { p: ['vol', 'pers'], c: 'Full mandate checker' })}
<h2>What the supplier gains</h2>
<p>The system is designed to fight late payment: with the date of each payment in the public solution, the Tax Agency will give the relevant ministries the information to monitor payment periods between businesses, as article 14 provides. The issuer may voluntarily report collection, non-payment or differences from the dates its customer reported, which gives suppliers a record they can rely on when chasing late payers. The mandate dates are in ${h.a('obligatoria', 'mandatory e-invoicing')}; the formats in ${h.a('facturae-vs-b2b', 'Facturae or B2B e-invoice')}; signing in ${h.a('firma', 'signing a Facturae file')}. ${h.src('ley56', 'Article 2 bis of Law 56/2007')} sets out the basic rights of issuer and recipient.</p>
`,
  },
});
