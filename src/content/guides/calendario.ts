import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Calendario: RD 1007/2023, disposición final cuarta, en la redacción del RDL 15/2025 (sources.rd1007, sources.rdl15),
   fechas anteriores del RD 254/2025 (sources.rd254); productores: 9 meses desde la Orden HAC/1177/2024 (sources.orden1177);
   B2B: RD 238/2026, disp. final cuarta y transitorias 2.ª y 3.ª, contadas desde la Orden HAC/1028/2026 (sources.rd238,
   sources.orden1028). Las fechas B2B y la de productores son cálculo del sitio (K.sumarMeses). */
const VF = K.P.verifactu, B = K.P.b2b;
const ultSoc = K.vispera(VF.sociedadesAntes), ultResto = K.vispera(VF.restoAntes);
const solPublica = K.sumarMeses(B.fechaGrandes, -B.solucionPublicaAntesMeses);

export default defineGuide({
  id: 'calendario', group: 'verifactu', order: 2,
  tool: 'frise',
  related: ['que-es', 'obligatoria', 'autonomos', 'sanciones', 'b2b'],
  sources: ['rd1007', 'rdl15', 'rd254', 'orden1177', 'rd238', 'orden1028'],
  es: {
    slug: 'calendario-verifactu',
    nav: 'Calendario Verifactu', card: 'Todas las fechas de Verifactu y de la factura electrónica B2B en una línea de tiempo interactiva',
    title: 'Calendario Verifactu 2026: fechas de 2027 y factura B2B',
    description: 'Calendario Verifactu 2026: fechas de 2027 para sociedades y autónomos, aplazamientos previos y factura electrónica B2B de 2027 y 2028, en una línea de tiempo.',
    h1: 'Calendario Verifactu: todas las fechas, de 2025 a 2029',
    intro: 'La línea de tiempo coloca cada fecha en el tiempo y marca dónde estamos hoy. Debajo, cada fecha con su norma y el simulador que te dice cuáles te tocan.',
    resume: `Las fechas de Verifactu están en la disposición final cuarta del RD 1007/2023 y han cambiado dos veces. El texto original fijaba el ${VF.fechasPrevias.original[0].split('-').reverse().join('/')} para todos; el RD 254/2025 las llevó al ${VF.fechasPrevias.rd254[0].split('-').reverse().join('/')} para las sociedades y al ${VF.fechasPrevias.rd254[1].split('-').reverse().join('/')} para el resto; y el Real Decreto-ley 15/2025, publicado en el BOE el ${VF.rdl15Boe.split('-').reverse().join('/')}, las retrasó un año más. Hoy rigen estas: quien paga el Impuesto sobre Sociedades debe tener el programa adaptado antes del ${VF.sociedadesAntes.split('-').reverse().join('/')}, y autónomos, comunidades de bienes, no residentes con establecimiento permanente y demás obligados antes del ${VF.restoAntes.split('-').reverse().join('/')}. Los productores de programas debían ofrecer versiones adaptadas a los ${VF.productoresMeses} meses de la entrada en vigor de la Orden HAC/1177/2024, el ${VF.productoresDesde.split('-').reverse().join('/')} según nuestro cálculo. La factura electrónica B2B va aparte: el RD 238/2026 cuenta 12 y 24 meses desde la Orden HAC/1028/2026, en vigor el ${B.ordenVigor.split('-').reverse().join('/')}, lo que da, por nuestro cálculo, el ${B.fechaGrandes.split('-').reverse().join('/')} para quien supera ${B.umbral / 1e6} millones y el ${B.fechaResto.split('-').reverse().join('/')} para el resto.`,
    faqs: [
      { q: '¿Cuál es el último día con un programa sin adaptar?', a: `Si pagas el Impuesto sobre Sociedades, el ${ultSoc.split('-').reverse().join('/')}; en los demás casos, el ${ultResto.split('-').reverse().join('/')}. La norma dice que los sistemas deben estar adaptados antes del 1 de enero y antes del 1 de julio de 2027, así que la primera factura del nuevo año, o del segundo semestre, ya tiene que salir de un sistema que cumpla.` },
      { q: '¿Pueden volver a aplazar Verifactu?', a: 'Puede ocurrir, como ya pasó con el RD 254/2025 y con el Real Decreto-ley 15/2025, pero solo vale lo publicado en el BOE. A la fecha de nuestra última lectura no hay ningún nuevo aplazamiento. Planifica con las fechas vigentes y revisa esta página: la actualizamos cuando cambia la norma, con la fecha de lectura de cada fuente.' },
      { q: '¿Por qué las fechas de la factura B2B son un cálculo?', a: 'Porque el RD 238/2026 no da días concretos: dice que la obligación se exige doce o veinticuatro meses después de que entre en vigor la orden que desarrolla la solución pública. Esa orden, la HAC/1028/2026, entró en vigor el 6 de octubre de 2026, y de ahí salen nuestras fechas. Hacienda puede publicar fechas oficiales con otro criterio de cómputo.' },
      { q: '¿Qué pasa en una sociedad que cierra su ejercicio a mitad de año?', a: 'Nada distinto: la fecha de Verifactu no depende del ejercicio fiscal, sino de ser contribuyente del Impuesto sobre Sociedades. El programa debe estar adaptado antes del 1 de enero de 2027, cierre cuando cierre la sociedad sus cuentas. Las sanciones, en cambio, sí se cuentan por ejercicios, como explica la página de sanciones.' },
    ],
    body: (h) => `
<h2>Las fechas de Verifactu y sus cambios</h2>
${h.table(['Norma', 'Sociedades', 'Resto de obligados'], [
  ['RD 1007/2023, texto original', h.day(VF.fechasPrevias.original[0]), h.day(VF.fechasPrevias.original[1])],
  ['RD 254/2025', h.day(VF.fechasPrevias.rd254[0]), h.day(VF.fechasPrevias.rd254[1])],
  ['Real Decreto-ley 15/2025 (vigente)', `antes del ${h.day(VF.sociedadesAntes)}`, `antes del ${h.day(VF.restoAntes)}`],
], 'Disposición final cuarta del RD 1007/2023 en sus sucesivas redacciones.', ['l', 'l', 'l'])}
<p>La ${h.src('rd1007', 'disposición final cuarta del RD 1007/2023')} distingue dos grupos de usuarios. El primero son los contribuyentes del Impuesto sobre Sociedades. El segundo, todos los demás: autónomos en el IRPF, comunidades de bienes y otras entidades en atribución de rentas, y no residentes con establecimiento permanente. El ${h.src('rd254', 'RD 254/2025')} ya había separado los dos grupos; el ${h.src('rdl15', 'Real Decreto-ley 15/2025')} mantuvo el esquema y retrasó ambas fechas un año. Para los productores, el plazo de adaptación se contó desde la entrada en vigor de la ${h.src('orden1177', 'Orden HAC/1177/2024')}, el ${h.day(VF.ordenVigor)}.</p>
<p>Elige tu perfil y verás tus fechas, la de Verifactu y la de la factura B2B:</p>
${h.mini('calendario', { p: ['perfil'], c: 'Diagnóstico completo de Verifactu' })}
<h2>Las fechas de la factura electrónica B2B</h2>
<p>El ${h.src('rd238', 'RD 238/2026')} entró en vigor el ${h.day(B.rdVigor)}, pero sus obligaciones esperan a la orden de la solución pública, la ${h.src('orden1028', 'Orden HAC/1028/2026')}, en vigor el ${h.day(B.ordenVigor)}. Desde ahí, ${h.n(B.mesesGrandes)} meses para quien superó ${h.eur(B.umbral)} de volumen de operaciones el año anterior y ${h.n(B.mesesResto)} meses para el resto. Las grandes deben acompañar la factura electrónica de un PDF durante ${h.n(B.pdfMeses)} meses, salvo que el cliente acepte recibirla solo en su formato original. Los autónomos de hasta ${h.eur(B.umbral)} informan del estado de la factura de forma voluntaria hasta el ${h.day(B.estadosVoluntariosHasta)}. La solución pública debe estar disponible al menos ${h.n(B.solucionPublicaAntesMeses)} meses antes de la primera fecha, es decir, hacia el ${h.day(solPublica)} por nuestro cálculo.</p>
<p>Todas las fechas de la factura electrónica salen de nuestro cómputo de meses desde la entrada en vigor de la orden. Comprueba tu caso en el ${h.a('obligatoria', 'checker de la factura electrónica obligatoria')} y la multa por llegar tarde en ${h.a('sanciones', 'sanciones Verifactu')}. Si tu empresa supera el umbral un año y no el siguiente, mira el volumen del año natural anterior a la fecha que te toca.</p>
`,
  },
  en: {
    slug: 'verifactu-timeline',
    nav: 'Verifactu timeline', card: 'Every Verifactu and B2B e-invoicing date on an interactive timeline',
    title: 'Verifactu Timeline 2026: 2027 Deadlines and B2B E-Invoicing',
    description: 'Verifactu timeline 2026: the 2027 deadlines for companies and the self-employed, earlier delays and the B2B e-invoicing dates in 2027 and 2028, on one timeline.',
    h1: 'Verifactu timeline: every date from 2025 to 2029',
    intro: 'The timeline places each date in time and marks where we are today. Below it, each date with its legal basis and the simulator that tells you which ones apply to you.',
    resume: `Verifactu dates sit in the fourth final provision of RD 1007/2023 and have changed twice. The original text set ${VF.fechasPrevias.original[0].split('-').reverse().join('/')} for everyone; RD 254/2025 moved them to ${VF.fechasPrevias.rd254[0].split('-').reverse().join('/')} for companies and ${VF.fechasPrevias.rd254[1].split('-').reverse().join('/')} for everyone else; and Royal Decree-law 15/2025, published in the BOE on ${VF.rdl15Boe.split('-').reverse().join('/')}, pushed them back another year. These now apply: corporate income taxpayers must have adapted software before ${VF.sociedadesAntes.split('-').reverse().join('/')}, and the self-employed, joint ownerships, non-residents with a permanent establishment and everyone else caught before ${VF.restoAntes.split('-').reverse().join('/')}. Software producers had to offer adapted versions ${VF.productoresMeses} months after Order HAC/1177/2024 came into force, on ${VF.productoresDesde.split('-').reverse().join('/')} by our calculation. B2B e-invoicing runs separately: RD 238/2026 counts 12 and 24 months from Order HAC/1028/2026, in force on ${B.ordenVigor.split('-').reverse().join('/')}, which by our calculation gives ${B.fechaGrandes.split('-').reverse().join('/')} for businesses above ${B.umbral / 1e6} million and ${B.fechaResto.split('-').reverse().join('/')} for everyone else.`,
    faqs: [
      { q: 'What is the last day on non-adapted software?', a: `If you pay corporate income tax, ${ultSoc.split('-').reverse().join('/')}; in all other cases, ${ultResto.split('-').reverse().join('/')}. The rule says systems must be adapted before 1 January and before 1 July 2027, so the first invoice of the new year, or of the second half, must already come out of a compliant system.` },
      { q: 'Could Verifactu be postponed again?', a: 'It could happen, as it did with RD 254/2025 and Royal Decree-law 15/2025, but only what is published in the BOE counts. As of our latest reading there is no new delay. Plan around the current dates and check this page: we update it when the law changes, with the reading date of each source.' },
      { q: 'Why are the B2B e-invoicing dates a calculation?', a: 'Because RD 238/2026 gives no calendar days: it says the duty applies twelve or twenty-four months after the order developing the public solution comes into force. That order, HAC/1028/2026, came into force on 6 October 2026, and our dates follow from it. The tax office may publish official dates using a different way of counting.' },
      { q: 'What about a company whose financial year ends mid-year?', a: 'Nothing different: the Verifactu date does not depend on the financial year but on being a corporate income taxpayer. The software must be adapted before 1 January 2027, whenever the company closes its accounts. Fines, on the other hand, are counted per financial year, as the penalties page explains.' },
    ],
    body: (h) => `
<h2>Verifactu dates and how they changed</h2>
${h.table(['Rule', 'Companies', 'Everyone else'], [
  ['RD 1007/2023, original text', h.day(VF.fechasPrevias.original[0]), h.day(VF.fechasPrevias.original[1])],
  ['RD 254/2025', h.day(VF.fechasPrevias.rd254[0]), h.day(VF.fechasPrevias.rd254[1])],
  ['Royal Decree-law 15/2025 (current)', `before ${h.day(VF.sociedadesAntes)}`, `before ${h.day(VF.restoAntes)}`],
], 'Fourth final provision of RD 1007/2023 in its successive versions.', ['l', 'l', 'l'])}
<p>The ${h.src('rd1007', 'fourth final provision of RD 1007/2023')} separates two groups of users. The first is corporate income taxpayers. The second is everyone else: the self-employed under personal income tax, joint ownerships and other pass-through entities, and non-residents with a permanent establishment. ${h.src('rd254', 'RD 254/2025')} had already split the two groups; ${h.src('rdl15', 'Royal Decree-law 15/2025')} kept the split and moved both dates back a year. For producers, the adaptation period ran from the entry into force of ${h.src('orden1177', 'Order HAC/1177/2024')} on ${h.day(VF.ordenVigor)}.</p>
<p>Choose your profile to see your dates, for Verifactu and for B2B e-invoicing:</p>
${h.mini('calendario', { p: ['perfil'], c: 'Full Verifactu check' })}
<h2>B2B e-invoicing dates</h2>
<p>${h.src('rd238', 'RD 238/2026')} came into force on ${h.day(B.rdVigor)}, but its duties wait for the public solution order, ${h.src('orden1028', 'Order HAC/1028/2026')}, in force on ${h.day(B.ordenVigor)}. From then, ${h.n(B.mesesGrandes)} months for businesses whose turnover exceeded ${h.eur(B.umbral)} the previous year and ${h.n(B.mesesResto)} months for everyone else. Large businesses must add a PDF to each e-invoice for ${h.n(B.pdfMeses)} months, unless the customer agrees to receive only the original format. Self-employed people up to ${h.eur(B.umbral)} report invoice status voluntarily until ${h.day(B.estadosVoluntariosHasta)}. The public solution must be available at least ${h.n(B.solucionPublicaAntesMeses)} months before the first date, around ${h.day(solPublica)} by our calculation.</p>
<p>All e-invoicing dates come from our count of months from the order’s entry into force. Check your case with the ${h.a('obligatoria', 'mandatory e-invoicing checker')} and the fine for being late on ${h.a('sanciones', 'Verifactu penalties')}.</p>
<h2>How to use these dates</h2>
<p>Work backwards from your own date. Ask your software provider now when the adapted version will be ready and whether it comes with its declaration of conformity. Allow time to install it, train whoever issues invoices and test a few invoices, including the QR, before the deadline. If you also fall under B2B e-invoicing, ask the same provider whether the version that meets Verifactu will also send and receive e-invoices, so that you change systems once rather than twice. If your turnover crosses the threshold one year and not the next, look at the calendar year before the date that applies to you.</p>
`,
  },
});
