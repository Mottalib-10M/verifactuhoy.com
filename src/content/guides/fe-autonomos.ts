import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Factura electrónica para autónomos: RD 238/2026 (sources.rd238), arts. 3, 4, 6, 10, 11 y 12, DF 4ª y DT 3ª;
   Orden HAC/1028/2026 (sources.orden1028), en vigor el 6/10/2026; Ley 25/2013, art. 4 (sources.ley25).
   Fechas calculadas por engine/reglas.ts (b2b) y guardadas en params-2026.json > b2b. */
const B = K.P.b2b;
const R = K.b2b({ volumen: 60000, persona: 'fisica', destino: 'empresa' });

export default defineGuide({
  id: 'fe-autonomos', group: 'electronica', order: 4,
  tool: 'b2b', toolArg: { pers: 'fisica' },
  related: ['obligatoria', 'b2b', 'autonomos', 'facturae-vs-b2b', 'simplificada'],
  sources: ['rd238', 'orden1028', 'ley18', 'ley25'],
  es: {
    slug: 'factura-electronica-autonomos',
    nav: 'Factura electrónica para autónomos', card: 'Desde cuándo factura en electrónico un autónomo y qué puede hacer gratis',
    title: 'Factura electrónica autónomos 2026: fechas y opción gratuita',
    description: 'Factura electrónica para autónomos 2026: desde cuándo es obligatoria según tu volumen, qué pasa con los tiques, los estados y la solución gratuita de la AEAT.',
    h1: 'Factura electrónica para autónomos: cuándo te toca y cómo cumplir',
    intro: 'Indica tu volumen de operaciones y a quién facturas: el simulador da la fecha en que la factura electrónica pasa a ser obligatoria para ti y lo que cambia ese día.',
    resume: `La factura electrónica entre empresas también alcanza a los autónomos. El Real Decreto 238/2026 obliga a todo empresario o profesional a emitir en formato electrónico las facturas dirigidas a otro empresario o profesional establecido en España, sin distinguir entre sociedades y personas físicas. Lo que decide la fecha es el volumen de operaciones del año anterior: con más de ${K.P.b2b.umbral / 1e6} millones de euros, ${B.mesesGrandes} meses desde la entrada en vigor de la Orden HAC/1028/2026; por debajo, ${B.mesesResto} meses. Como la orden entró en vigor el ${K.P.b2b.ordenVigor.split('-').reverse().join('/')}, para casi todos los autónomos la obligación empieza el ${B.fechaResto.split('-').reverse().join('/')}, según nuestro cálculo. Hay dos alivios propios de las personas físicas: los tiques o facturas simplificadas no cualificadas quedan fuera, y si tu volumen no supera el umbral, informar del estado de las facturas que recibes es voluntario hasta el ${B.estadosVoluntariosHasta.split('-').reverse().join('/')}. Si no eliges ninguna plataforma privada, recibes y envías por la solución pública de la Agencia Tributaria, que es gratuita. Facturar a particulares no cambia con esta norma.`,
    faqs: [
      { q: '¿Un autónomo con pocos clientes también tendrá que emitir factura electrónica?', a: 'Sí, si factura a otras empresas o autónomos establecidos en España. El real decreto no fija un mínimo de facturas ni de ingresos para quedar fuera: el umbral de ocho millones solo adelanta o retrasa la fecha. Si todos tus clientes son particulares o empresas extranjeras, esta obligación no te afecta, aunque Verifactu sí puede afectarte por otra vía.' },
      { q: '¿Tengo que pagar una plataforma para recibir facturas electrónicas?', a: 'No. Si no has acordado con tus proveedores recibir por una plataforma privada, el artículo 6.1 entiende que eliges la solución pública de la Agencia Tributaria, sin hacer ningún trámite. El artículo 11.10 establece que su uso es gratuito. Una plataforma privada puede ser cómoda si tu programa ya la integra, pero no es obligatoria.' },
      { q: '¿Qué estados de la factura debe comunicar un autónomo?', a: 'Como destinatario, la aceptación o el rechazo comercial y el pago completo con su fecha, en un plazo de cuatro días naturales sin contar sábados, domingos ni festivos nacionales. Los autónomos con un volumen de hasta ocho millones pueden hacerlo de forma voluntaria durante los doce meses siguientes a su fecha de obligación, según la disposición transitoria tercera.' },
      { q: '¿Puedo seguir haciendo tiques en mi tienda o bar?', a: 'Sí. Las facturas simplificadas del artículo 4 del Reglamento de facturación quedan fuera de la factura electrónica obligatoria, salvo las cualificadas, es decir, aquellas en las que el cliente empresario te pide que añadas su NIF, su domicilio y la cuota de IVA. Esos tiques sí tendrán que ir en formato electrónico cuando llegue tu fecha.' },
    ],
    body: (h) => `
<h2>Qué cambia para un autónomo y cuándo</h2>
${h.table(['Situación', 'Desde', 'Base'], [
  [`Volumen de operaciones de hasta ${h.eur(B.umbral)}`, h.day(B.fechaResto), 'RD 238/2026, disposición final cuarta.1.b'],
  [`Volumen superior a ${h.eur(B.umbral)}`, h.day(B.fechaGrandes), 'RD 238/2026, disposición final cuarta.1.a'],
  ['Estados de las facturas recibidas, autónomo pequeño', `voluntarios hasta el ${h.day(B.estadosVoluntariosHasta)}`, 'RD 238/2026, disposición transitoria tercera'],
], 'Fechas calculadas por nosotros desde la entrada en vigor de la Orden HAC/1028/2026.', ['l', 'l', 'l'])}
<p>El ${h.src('rd238', 'artículo 3 del Real Decreto 238/2026')} no habla de sociedades ni de autónomos: obliga a cualquier empresario o profesional que deba expedir factura según el Reglamento de facturación, siempre que el destinatario sea otro empresario o profesional con sede, establecimiento permanente o domicilio en España. Un autónomo que diseña webs para una sociedad de Valencia queda dentro; si su cliente está en Francia, no. La norma desarrolla la ${h.src('ley18', 'Ley 18/2022, Crea y Crece')}, y sus plazos cuentan desde la ${h.src('orden1028', 'Orden HAC/1028/2026')}, en vigor el ${h.day(B.ordenVigor)}.</p>
<p>Para un autónomo con un volumen de operaciones normal, el resultado es la fecha del ${h.day(R.desde ?? B.fechaResto)}. Hasta entonces puedes seguir enviando facturas en PDF o en papel a tus clientes empresarios, aunque ya puedes enviarlas en electrónico si los dos estáis de acuerdo.</p>
<h2>Los estados de las facturas que recibes</h2>
<p>La parte nueva no es emitir, sino informar. Cuando recibas una factura electrónica de un proveedor, deberás comunicarle si la aceptas o la rechazas y, cuando la pagues, la fecha del pago completo, según los ${h.src('rd238', 'artículos 10 y 12')}. El pago se comunica además a la solución pública de la Agencia Tributaria. El plazo es de ${h.n(B.diasEstados)} días naturales sin sábados, domingos ni festivos nacionales. Calcula el último día con una fecha de ejemplo:</p>
${h.mini('estados', { p: ['mes', 'dia', 'que'], c: 'Calcular otros plazos de estados' })}
<p>Si eres persona física y tu volumen no supera el umbral, la disposición transitoria tercera hace voluntaria esta comunicación durante doce meses más. Es un año de margen para acostumbrarte, no una exención: el ${h.day(B.estadosVoluntariosHasta)} pasa a ser obligatoria.</p>
<h2>Cómo cumplir sin gastar</h2>
<p>La solución pública de facturación electrónica de la Agencia Tributaria es gratuita y será el buzón por defecto de quien no elija otra cosa. Funciona en sintaxis UBL y se accede con identificación electrónica. Si ya usas un programa de facturación, lo normal es que el propio programa envíe a una plataforma privada o a la solución pública. Verifactu sigue su propio calendario: como autónomo, tu programa debe estar adaptado antes del ${h.day(h.P.verifactu.restoAntes)}, como explica ${h.a('autonomos', 'Verifactu para autónomos')}.</p>
<p>Con la Administración las reglas son otras. La ${h.src('ley25', 'Ley 25/2013')} no obliga a los autónomos a usar FACe, aunque muchos contratos públicos lo piden; en ese caso necesitas un ${h.a('facturae', 'Facturae')} firmado. Las diferencias de formato se resumen en ${h.a('facturae-vs-b2b', 'Facturae o factura electrónica B2B')}, y los tiques en ${h.a('simplificada', 'la factura simplificada')}.</p>
`,
  },
  en: {
    slug: 'e-invoicing-self-employed',
    nav: 'E-invoicing for the self-employed', card: 'When a self-employed person must e-invoice in Spain and the free option',
    title: 'Self-Employed E-Invoicing in Spain 2026: Dates, Free Option',
    description: 'Spanish e-invoicing for the self-employed in 2026: when it becomes mandatory by turnover, what happens to receipts, payment status and the free AEAT option.',
    h1: 'E-invoicing for the self-employed in Spain: when and how',
    intro: 'Enter your turnover and who you invoice: the calculator gives the date from which e-invoicing becomes mandatory for you and what changes on that day.',
    resume: `Spanish B2B e-invoicing also reaches the self-employed. Royal Decree 238/2026 requires every business or professional to issue invoices in electronic format when the customer is another business or professional established in Spain, with no distinction between companies and individuals. What sets the date is prior-year turnover: above ${K.P.b2b.umbral / 1e6} million euros, ${B.mesesGrandes} months after Order HAC/1028/2026 came into force; below it, ${B.mesesResto} months. As the order came into force on ${K.P.b2b.ordenVigor.split('-').reverse().join('/')}, for almost every self-employed person the duty starts on ${B.fechaResto.split('-').reverse().join('/')}, by our calculation. Individuals get two reliefs: till receipts, or non-qualified simplified invoices, are outside the scope, and if your turnover is below the threshold, reporting the status of invoices you receive is voluntary until ${B.estadosVoluntariosHasta.split('-').reverse().join('/')}. If you choose no private platform, you send and receive through the Tax Agency public solution, which is free. Invoicing consumers does not change under this rule.`,
    faqs: [
      { q: 'Will a self-employed person with few clients have to e-invoice too?', a: 'Yes, if you invoice other businesses or self-employed people established in Spain. The royal decree sets no minimum number of invoices or income below which you are exempt: the eight million threshold only brings the date forward or pushes it back. If all your customers are consumers or foreign businesses, this duty does not reach you, though Verifactu may apply by another route.' },
      { q: 'Do I need to pay for a platform to receive e-invoices?', a: 'No. If you have not agreed with your suppliers to receive through a private platform, article 6.1 treats you as choosing the Tax Agency public solution, with no paperwork. Article 11.10 states that using it is free of charge. A private platform can be convenient if your software already connects to one, but it is not required.' },
      { q: 'Which invoice statuses must a self-employed person report?', a: 'As a recipient, commercial acceptance or rejection and full payment with its date, within four calendar days excluding Saturdays, Sundays and national holidays. Self-employed people with turnover up to eight million may report voluntarily during the twelve months after their mandate date, under the third transitional provision of the royal decree.' },
      { q: 'Can I keep issuing till receipts in my shop or bar?', a: 'Yes. Simplified invoices under article 4 of the Invoicing Regulation are outside mandatory e-invoicing, except qualified ones, meaning those where a business customer asks you to add its tax ID, address and the VAT amount. Those receipts will have to be electronic once your date arrives.' },
    ],
    body: (h) => `
<h2>What changes for a self-employed person, and when</h2>
${h.table(['Situation', 'From', 'Basis'], [
  [`Turnover up to ${h.eur(B.umbral)}`, h.day(B.fechaResto), 'RD 238/2026, fourth final provision 1.b'],
  [`Turnover above ${h.eur(B.umbral)}`, h.day(B.fechaGrandes), 'RD 238/2026, fourth final provision 1.a'],
  ['Status of invoices received, small self-employed', `voluntary until ${h.day(B.estadosVoluntariosHasta)}`, 'RD 238/2026, third transitional provision'],
], 'Dates calculated by us from the entry into force of Order HAC/1028/2026.', ['l', 'l', 'l'])}
<p>${h.src('rd238', 'Article 3 of Royal Decree 238/2026')} does not mention companies or the self-employed: it covers any business or professional that must issue invoices under the Invoicing Regulation, as long as the customer is another business or professional with its seat, permanent establishment or address in Spain. A self-employed web designer working for a company in Valencia is caught; if the client is in France, not. The decree implements ${h.src('ley18', 'Law 18/2022, known as Crea y Crece')}, and its deadlines run from ${h.src('orden1028', 'Order HAC/1028/2026')}, in force since ${h.day(B.ordenVigor)}.</p>
<p>For a self-employed person with ordinary turnover the answer is ${h.day(R.desde ?? B.fechaResto)}. Until then you may keep sending PDF or paper invoices to business customers, although you can already send electronic ones if both sides agree.</p>
<h2>Status of the invoices you receive</h2>
<p>The new part is not issuing but reporting. When a supplier sends you an e-invoice, you will have to tell them whether you accept or reject it and, once you pay, the date of full payment, under ${h.src('rd238', 'articles 10 and 12')}. Payment is also reported to the Tax Agency public solution. The deadline is ${h.n(B.diasEstados)} calendar days excluding Saturdays, Sundays and national holidays. Work out the last day with a sample date:</p>
${h.mini('estados', { p: ['mes', 'dia', 'que'], c: 'Work out other status deadlines' })}
<p>If you are an individual below the threshold, the third transitional provision makes this reporting voluntary for twelve more months. It is a year of slack to get used to it, not an exemption: from ${h.day(B.estadosVoluntariosHasta)} it becomes mandatory.</p>
<h2>How to comply without spending</h2>
<p>The Tax Agency public e-invoicing solution is free and will be the default inbox for anyone who chooses nothing else. It works in UBL syntax and you log in with electronic identification. If you already use invoicing software, the software itself will usually send to a private platform or to the public solution. Verifactu follows its own timetable: as a self-employed person your software must be adapted before ${h.day(h.P.verifactu.restoAntes)}, as explained in ${h.a('autonomos', 'Verifactu for the self-employed')}.</p>
<p>Public bodies have other rules. ${h.src('ley25', 'Law 25/2013')} does not require the self-employed to use FACe, though many public contracts ask for it; then you need a signed ${h.a('facturae', 'Facturae file')}. The format differences are summed up in ${h.a('facturae-vs-b2b', 'Facturae or B2B e-invoice')}, and receipts in ${h.a('simplificada', 'the simplified invoice')}.</p>
`,
  },
});
