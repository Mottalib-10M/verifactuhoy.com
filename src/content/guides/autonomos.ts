import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { formatNumber, displayDate } from '../../lib/format';

/* Verifactu para autónomos: RD 1007/2023 arts. 1.3, 3.1.b y 3.3, disposición final cuarta (redacción del RDL 15/2025)
   (sources.rd1007, sources.rdl15); LGT art. 201 bis (sources.lgt); Orden HAC/1177/2024 art. 19 (sources.orden1177). */
const VF = K.P.verifactu, SA = K.P.sanciones, B = K.P.b2b;
const ULTIMO = K.vispera(VF.restoAntes);
const D = (iso: string, l: 'es' | 'en') => displayDate(iso, l === 'es' ? 'es-ES' : 'en-GB');

export default defineGuide({
  id: 'autonomos', group: 'verifactu', order: 7,
  tool: 'verifactu', toolArg: { tipo: 'autonomo' },
  related: ['app-aeat', 'calendario', 'modalidades', 'fe-autonomos', 'sanciones'],
  sources: ['rd1007', 'rdl15', 'lgt', 'orden1177'],
  es: {
    slug: 'verifactu-autonomos',
    nav: 'Verifactu para autónomos', card: 'Si eres autónomo: cuándo te toca, módulos, Excel y opciones gratuitas',
    title: 'Verifactu autónomos 2026: fecha, módulos y opciones gratis',
    description: `Verifactu para autónomos 2026: tu programa debe cumplir antes del ${D(VF.restoAntes, 'es')}, también en módulos. Qué te excluye, la multa y la opción gratis.`,
    h1: 'Verifactu para autónomos: cuándo te toca y qué hacer',
    intro: 'Responde cómo tributas y cómo facturas: el diagnóstico, preparado para autónomos, dice si Verifactu te afecta y el último día con tu programa actual.',
    resume: `Si eres autónomo y tributas en el IRPF por una actividad económica, Verifactu te afecta en cuanto emites facturas con un programa, aunque sea solo una parte de ellas, según el artículo 3.1.b del Real Decreto 1007/2023. Lo mismo vale para las comunidades de bienes y las sociedades civiles que tributan en atribución de rentas. Tras el Real Decreto-ley 15/2025, tu sistema de facturación debe estar adaptado antes del ${D(VF.restoAntes, 'es')}, seis meses después que las sociedades; el último día con un programa sin adaptar es el ${D(ULTIMO, 'es')}. Estar en estimación objetiva, los llamados módulos, no te exime: la norma no excluye a nadie por su método de estimación. Quedas fuera si facturas a mano, si llevas los libros en el SII o si tu domicilio fiscal está en el País Vasco o Navarra. Si emites pocas facturas a clientes identificados, la aplicación gratuita de la Agencia Tributaria cumple. Usar un programa que no cumple cuando ya estás obligado se sanciona con ${formatNumber(SA.tenencia, 0, 'es')} euros por ejercicio, según el artículo 201 bis de la Ley General Tributaria.`,
    faqs: [
      { q: 'Soy autónomo en módulos: ¿tengo que cumplir Verifactu?', a: 'Sí, si facturas con un programa. El artículo 3 del reglamento incluye a todos los contribuyentes del IRPF que desarrollan actividades económicas, sin distinguir entre estimación directa y objetiva. Lo que decide es si usas un sistema informático para facturar. Si en módulos emites tus pocas facturas a mano, en un talonario, no te afecta mientras sigas haciéndolo así.' },
      { q: 'Facturo con una plantilla de Word: ¿me afecta?', a: 'Un documento de texto que solo usas para escribir la factura, sin numerar ni calcular ni guardar registros de forma automática, se parece más a facturar a mano. Si la plantilla está en una hoja de cálculo que numera, suma y archiva las facturas, la Agencia Tributaria puede considerarla un sistema informático de facturación. En la duda, pasa a la aplicación gratuita.' },
      { q: 'Si empiezo mi actividad en 2027, ¿desde cuándo debo cumplir?', a: `Desde tu primera factura con programa, si empiezas a partir del ${D(VF.restoAntes, 'es')}. Las fechas de la disposición final cuarta son plazos para adaptar los sistemas que ya usas; quien empieza después debe facturar desde el principio con un sistema que cumpla. Elige el programa o la aplicación de la Agencia Tributaria antes de emitir la primera factura.` },
      { q: '¿Mi gestoría puede encargarse de Verifactu por mí?', a: 'Puede emitir tus facturas como apoderada en la aplicación de la Agencia Tributaria o con un programa que admita varios obligados tributarios, con tus registros separados de los de otros clientes. Pero la obligación sigue siendo tuya: si tu sistema no cumple, la sanción del artículo 201 bis recae sobre ti como titular de la actividad, no sobre la gestoría.' },
    ],
    body: (h) => `
<h2>Tu caso en tres preguntas</h2>
${h.table(['Situación', 'Verifactu', 'Base'], [
  ['Autónomo que factura con programa, en directa o en módulos', `Obligado antes del ${h.day(VF.restoAntes)}`, 'RD 1007/2023, art. 3.1.b'],
  ['Comunidad de bienes o sociedad civil con actividad', `Obligada antes del ${h.day(VF.restoAntes)}`, 'RD 1007/2023, art. 3.1.d'],
  ['Autónomo que solo factura a mano', 'No le afecta', 'RD 1007/2023, art. 3.1'],
  ['Autónomo en el SII', 'Excluido', 'RD 1007/2023, art. 3.3'],
  ['Domicilio fiscal en el País Vasco o Navarra', 'Norma foral', 'RD 1007/2023, art. 1.3'],
], 'Situaciones habituales de un autónomo ante el reglamento.', ['l', 'l', 'l'])}
<p>El ${h.src('rd1007', 'reglamento')} se aplica a quien usa sistemas informáticos de facturación, «aunque solo los usen para una parte de su actividad». Si haces la mayoría de tus facturas a mano pero alguna con un programa, estás dentro. El calendario lo fija la disposición final cuarta, en la redacción del ${h.src('rdl15', 'Real Decreto-ley 15/2025')}: las sociedades antes del ${h.day(VF.sociedadesAntes)} y el resto, autónomos incluidos, antes del ${h.day(VF.restoAntes)}.</p>
<h2>Tres caminos para cumplir</h2>
<p>El primero es actualizar el programa que ya usas, si tu proveedor saca una versión adaptada con su declaración responsable. El segundo es cambiar a otro programa que la tenga. El tercero, la aplicación de facturación de la Agencia Tributaria, gratuita y VERI*FACTU, pensada para quien factura en nombre propio a clientes identificados. La ${h.src('orden1177', 'Orden HAC/1177/2024, artículo 19')}, le pone límites: destinatario obligatorio y sin pasar las facturas a otro sistema. Las condiciones están en la ${h.a('app-aeat', 'guía de la aplicación de la AEAT')}.</p>
<p>Si das tiques en un comercio o en hostelería, la aplicación no te sirve y necesitas un terminal o programa propio. Si factura tu gestoría, pregunta si su sistema separa tus registros y quién guardará la declaración responsable. Elijas lo que elijas, pruébalo unas semanas antes de tu fecha para que la primera factura adaptada no sea también tu primer intento.</p>
<h2>Y después llega la factura electrónica</h2>
<p>Verifactu no es la última obligación. Si facturas a empresas, la factura electrónica estructurada del RD 238/2026 te llegará, según nuestro cálculo, el ${h.day(B.fechaResto)} si tu volumen de operaciones no supera ${h.eur(B.umbral)}. Como persona física con ese volumen, informar del estado de tus facturas será voluntario hasta el ${h.day(B.estadosVoluntariosHasta)}. Comprueba tu fecha:</p>
${h.mini('b2b', { p: ['vol', 'dest'], d: { pers: 'fisica' }, c: 'Checker completo de la factura B2B' })}
<p>Más detalle en ${h.a('fe-autonomos', 'la factura electrónica para autónomos')} y en el ${h.a('calendario', 'calendario completo')}. Si quieres saber qué arriesgas si llegas tarde, usa el ${h.a('sanciones', 'simulador de sanciones')} de la ${h.src('lgt', 'Ley General Tributaria')}.</p>
`,
  },
  en: {
    slug: 'verifactu-for-self-employed',
    nav: 'Verifactu for the self-employed', card: 'If you are self-employed: your date, flat-rate scheme, Excel and free options',
    title: 'Verifactu Self-Employed 2026: Deadline, Módulos, Free Tools',
    description: `Verifactu for the self-employed in 2026: your software must comply before ${D(VF.restoAntes, 'en')}, flat-rate scheme included. Exemptions, the fine and the free option.`,
    h1: 'Verifactu for the self-employed: your date and what to do',
    intro: 'Say how you are taxed and how you invoice: the check, preset for the self-employed, tells you whether Verifactu applies and the last day on your current software.',
    resume: `If you are self-employed in Spain and pay personal income tax on a business activity, Verifactu applies as soon as you issue invoices with software, even for only part of them, under article 3.1.b of Royal Decree 1007/2023. The same goes for joint ownerships and civil partnerships taxed as pass-through entities. After Royal Decree-law 15/2025, your invoicing system must be adapted before ${D(VF.restoAntes, 'en')}, six months after companies; the last day on non-adapted software is ${D(ULTIMO, 'en')}. Being on the flat-rate scheme, known as módulos, does not exempt you: the rule excludes nobody because of how their income is assessed. You are outside it if you invoice by hand, keep your books on the SII or have your tax domicile in the Basque Country or Navarre. If you issue few invoices to identified customers, the free Tax Agency app complies. Using non-compliant software once you are caught is fined ${formatNumber(SA.tenencia, 0, 'en')} euros per financial year under article 201 bis of the General Tax Act.`,
    faqs: [
      { q: 'I am on the flat-rate scheme: must I comply with Verifactu?', a: 'Yes, if you invoice with software. Article 3 of the regulation covers every personal income taxpayer carrying on a business, without distinguishing between direct and flat-rate assessment. What decides is whether you use software to invoice. If on módulos you write your few invoices by hand in a book, it does not apply as long as you keep doing so.' },
      { q: 'I invoice with a Word template: am I caught?', a: 'A text document used only to type the invoice, with no automatic numbering, calculation or record keeping, is closer to invoicing by hand. If the template is a spreadsheet that numbers, totals and files invoices, the Tax Agency may treat it as invoicing software. When in doubt, move to the free app.' },
      { q: 'If I start trading in 2027, from when must I comply?', a: `From your first software-issued invoice, if you start on or after ${D(VF.restoAntes, 'en')}. The dates in the fourth final provision are deadlines for adapting systems already in use; anyone starting later must invoice from day one with a compliant system. Choose the software or the Tax Agency app before issuing your first invoice.` },
      { q: 'Can my accountant handle Verifactu for me?', a: 'They can issue your invoices as your representative in the Tax Agency app or with software that supports several taxpayers, keeping your records separate from other clients. But the duty stays yours: if your system does not comply, the article 201 bis fine falls on you as the business owner, not on the accounting firm.' },
    ],
    body: (h) => `
<h2>Your case in three questions</h2>
${h.table(['Situation', 'Verifactu', 'Basis'], [
  ['Self-employed invoicing with software, direct or flat-rate', `Caught before ${h.day(VF.restoAntes)}`, 'RD 1007/2023, art. 3.1.b'],
  ['Joint ownership or civil partnership in business', `Caught before ${h.day(VF.restoAntes)}`, 'RD 1007/2023, art. 3.1.d'],
  ['Self-employed invoicing only by hand', 'Not covered', 'RD 1007/2023, art. 3.1'],
  ['Self-employed on the SII', 'Excluded', 'RD 1007/2023, art. 3.3'],
  ['Tax domicile in the Basque Country or Navarre', 'Foral rules', 'RD 1007/2023, art. 1.3'],
], 'Common situations of a self-employed person under the regulation.', ['l', 'l', 'l'])}
<p>The ${h.src('rd1007', 'regulation')} applies to anyone using invoicing software, “even if they use it only for part of their activity”. If you write most invoices by hand but some with software, you are in. The timetable is in the fourth final provision, as worded by ${h.src('rdl15', 'Royal Decree-law 15/2025')}: companies before ${h.day(VF.sociedadesAntes)} and everyone else, the self-employed included, before ${h.day(VF.restoAntes)}.</p>
<h2>Three ways to comply</h2>
<p>The first is to update the software you already use, if your provider releases an adapted version with its statement of compliance. The second is to switch to other software that has one. The third is the Tax Agency invoicing app, free and VERI*FACTU, designed for people invoicing in their own name to identified customers. ${h.src('orden1177', 'Order HAC/1177/2024, article 19')}, sets its limits: a mandatory recipient and no moving invoices to another system. The conditions are in the ${h.a('app-aeat', 'AEAT app guide')}.</p>
<p>If you give receipts in a shop or in hospitality, the app does not work for you and you need your own terminal or software. If your accountant invoices for you, ask whether their system keeps your records separate and who will hold the statement of compliance. Whatever you choose, test it a few weeks before your date so the first compliant invoice is not also your first try.</p>
<h2>Then e-invoicing arrives</h2>
<p>Verifactu is not the last duty. If you invoice businesses, structured e-invoicing under RD 238/2026 will reach you, by our calculation, on ${h.day(B.fechaResto)} if your turnover does not exceed ${h.eur(B.umbral)}. As an individual at that turnover, reporting invoice status stays voluntary until ${h.day(B.estadosVoluntariosHasta)}. Check your date:</p>
${h.mini('b2b', { p: ['vol', 'dest'], d: { pers: 'fisica' }, c: 'Full B2B e-invoicing checker' })}
<p>More detail in ${h.a('fe-autonomos', 'e-invoicing for the self-employed')} and in the ${h.a('calendario', 'full timeline')}. To see what you risk if you are late, use the ${h.a('sanciones', 'penalty calculator')} based on the ${h.src('lgt', 'General Tax Act')}.</p>
`,
  },
});
