import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { displayDate } from '../../lib/format';

/* Factura electrónica en España: RD 1619/2012 arts. 9 y 10 (sources.rd1619); Ley 25/2013 arts. 4 y 5 (sources.ley25);
   Ley 56/2007 art. 2 bis (sources.ley56); RD 238/2026 arts. 2, 3 y 7 (sources.rd238); Ley 18/2022 (sources.ley18). */
const B = K.P.b2b, F = K.P.factura;
const D = (iso: string, l: 'es' | 'en') => displayDate(iso, l === 'es' ? 'es-ES' : 'en-GB');

export default defineGuide({
  id: 'factura-electronica', group: 'electronica', order: 1,
  tool: 'fe',
  related: ['obligatoria', 'b2b', 'facturae-vs-b2b', 'face', 'que-es'],
  sources: ['rd1619', 'ley25', 'ley56', 'rd238', 'ley18'],
  es: {
    slug: 'factura-electronica',
    nav: 'Factura electrónica', card: 'Qué es una factura electrónica y cuál te toca según a quién facturas',
    title: 'Factura electrónica 2026: qué es y cuál te toca a ti',
    description: 'Factura electrónica 2026: qué es, por qué un PDF no basta para la obligación B2B y qué formato y canal usar con empresas, Administración o particulares.',
    h1: 'Factura electrónica: qué es y cuál te toca en 2026',
    intro: 'Elige a quién facturas: la herramienta dice si ya debes usar factura electrónica estructurada, desde cuándo, en qué formato y por qué canal.',
    resume: `Para el Reglamento de facturación, artículo 9, una factura electrónica es la que se expide, se transmite y se recibe en formato electrónico. Hasta ahora eso incluía un PDF enviado por correo, siempre que el cliente lo aceptara. Con la factura electrónica obligatoria entre empresas, el concepto se estrecha: el Real Decreto 238/2026 exige un mensaje estructurado según la norma europea EN 16931, en una de cuatro sintaxis, UBL, CII, EDIFACT o Facturae, que un programa pueda leer sin intervención humana. En España conviven tres situaciones. A la Administración, las sociedades y otras entidades deben facturar en Facturae a través de FACe u otro punto de entrada desde el ${D(F.faceDesde, 'es')}, por la Ley 25/2013. Entre empresas, la obligación llega, según nuestro cálculo, el ${D(B.fechaGrandes, 'es')} para quien supera ${B.umbral / 1e6} millones de volumen de operaciones y el ${D(B.fechaResto, 'es')} para el resto. A particulares no hay obligación general: solo ciertas grandes empresas de servicios deben ofrecerla a quien la acepte. Verifactu es aparte y se aplica a toda factura, sea en papel o electrónica.`,
    faqs: [
      { q: '¿Un PDF enviado por correo es una factura electrónica?', a: 'Hoy sí, en el sentido del artículo 9 del Reglamento de facturación, si el cliente ha dado su consentimiento y se garantizan la autenticidad y la integridad. Pero no sirve para la factura electrónica obligatoria entre empresas, que exige un fichero estructurado según la norma EN 16931. Durante el primer año, las grandes empresas acompañarán ese fichero de un PDF, que no lo sustituye.' },
      { q: '¿Necesito el consentimiento del cliente para enviarle factura electrónica?', a: 'Fuera de la obligación, sí: el artículo 9.2 del Reglamento de facturación condiciona la factura electrónica a que el destinatario la acepte. En los casos obligatorios del nuevo artículo 8 bis, introducido por el RD 238/2026, ese consentimiento ya no hace falta. A la Administración tampoco se pide, porque la Ley 25/2013 obliga a determinadas entidades a facturarle en electrónico.' },
      { q: '¿Qué es la norma EN 16931 de la que habla el reglamento?', a: 'Es la norma europea que define el modelo semántico de una factura electrónica: qué datos lleva y qué significan, como el número, la fecha, las partes, las líneas y los impuestos. No es un formato de fichero en sí; las sintaxis UBL y CII la expresan en XML. El RD 238/2026 exige que toda factura obligatoria se ajuste a ese modelo.' },
      { q: '¿Las facturas a clientes del extranjero tienen que ser electrónicas?', a: 'No por el RD 238/2026. Su artículo 3 aplica la obligación cuando el destinatario es un empresario o profesional con la sede de su actividad, un establecimiento permanente o su domicilio en España. A clientes de otros países puedes seguir enviando la factura en el formato que acordéis, respetando su contenido obligatorio y, si estás obligado, el registro de Verifactu.' },
    ],
    body: (h) => `
<h2>Tres destinatarios, tres reglas</h2>
${h.table(['Facturas a', 'Obligación', 'Formato', 'Norma'], [
  ['Administraciones públicas', `Sociedades y otras entidades, desde ${h.day(F.faceDesde)}`, `Facturae ${K.P.facturae.version}, firmado`, 'Ley 25/2013, art. 4'],
  ['Empresas y autónomos en España', `${h.day(B.fechaGrandes)} o ${h.day(B.fechaResto)}, según volumen`, B.formatos.join(', '), 'RD 238/2026'],
  ['Particulares', 'Solo ciertas grandes empresas de servicios, si el cliente la acepta', 'Libre', 'Ley 56/2007, art. 2 bis.4'],
], 'Fechas B2B calculadas por nosotros a partir de la Orden HAC/1028/2026.', ['l', 'l', 'l', 'l'])}
<p>La ${h.src('ley25', 'Ley 25/2013')} lleva más de diez años en vigor: las sociedades anónimas y limitadas, las entidades extranjeras con establecimiento en España, las uniones temporales de empresas y otras entidades de su artículo 4 deben facturar a las Administraciones en formato electrónico, y cada Administración puede excluir las facturas de hasta ${h.eur(F.faceExclusion)}. Los autónomos pueden hacerlo, pero la ley no les obliga. El formato es Facturae con firma electrónica avanzada.</p>
<h2>Lo que cambia con la obligación entre empresas</h2>
<p>El ${h.src('rd238', 'RD 238/2026')} desarrolla la ${h.src('ley18', 'Ley 18/2022')} y define la factura electrónica obligatoria como la que se expide, transmite y recibe en formato electrónico estructurado, según el modelo EN 16931 y en una de las sintaxis de su artículo 7. Además del formato, introduce dos novedades: cada factura debe llegar a la solución pública de la Agencia Tributaria, como original o como copia fiel en UBL, y el cliente debe informar de si la acepta o la rechaza y de cuándo la paga. El objetivo declarado es reducir la morosidad entre empresas, que el preámbulo de la norma señala como un problema grave para las pymes.</p>
<p>Qué formato y canal te tocan depende del destinatario:</p>
${h.mini('formato', { p: ['dest'], c: 'Formatos y firma en detalle' })}
<h2>Y Verifactu, ¿dónde encaja?</h2>
<p>Verifactu no es un formato de factura, sino una regla sobre el programa que la emite. Se aplica a todas tus facturas, también a las de papel y a las de particulares, si las haces con un programa. Una factura B2B electrónica emitida con un programa adaptado llevará, por tanto, su registro y su QR de Verifactu y, además, viajará como fichero estructurado. Las diferencias se explican en ${h.a('que-es', 'qué es Verifactu')}. Para saber si te toca la obligación, usa el ${h.a('obligatoria', 'checker de la factura electrónica obligatoria')}; para elegir formato, ${h.a('facturae-vs-b2b', 'Facturae o factura B2B')}; y para la Administración, ${h.a('face', 'FACe')}. La ${h.src('ley56', 'Ley 56/2007')} recoge el deber general en su artículo 2 bis.</p>
`,
  },
  en: {
    slug: 'e-invoicing-spain',
    nav: 'E-invoicing in Spain', card: 'What an e-invoice is and which one applies depending on your customer',
    title: 'E-Invoicing Spain 2026: What It Is and Which One Applies',
    description: 'E-invoicing in Spain 2026: the legal definition, why a PDF will not meet the B2B mandate, and the format and channel for businesses, public bodies or consumers.',
    h1: 'E-invoicing in Spain: what it is and which one applies in 2026',
    intro: 'Choose who you invoice: the tool tells you whether you already need structured e-invoices, from when, in which format and through which channel.',
    resume: `Under article 9 of the Spanish Invoicing Regulation, an electronic invoice is one issued, transmitted and received in electronic form. Until now that included a PDF sent by email, as long as the customer accepted it. With mandatory B2B e-invoicing the concept narrows: Royal Decree 238/2026 requires a structured file under the European standard EN 16931, in one of four syntaxes, UBL, CII, EDIFACT or Facturae, which software can read without human intervention. Three situations coexist in Spain. For public bodies, companies and other entities must invoice in Facturae through FACe or another entry point since ${D(F.faceDesde, 'en')}, under Law 25/2013. Between businesses, the mandate arrives, by our calculation, on ${D(B.fechaGrandes, 'en')} for those with turnover above ${B.umbral / 1e6} million euros and on ${D(B.fechaResto, 'en')} for everyone else. For consumers there is no general mandate: only certain large service companies must offer it to those who accept. Verifactu is separate and applies to every invoice, paper or electronic.`,
    faqs: [
      { q: 'Is a PDF sent by email an electronic invoice?', a: 'Today yes, in the sense of article 9 of the Invoicing Regulation, if the customer has consented and authenticity and integrity are guaranteed. But it does not meet the B2B e-invoicing mandate, which requires a structured file under EN 16931. During the first year, large businesses will send a PDF alongside that file, which does not replace it.' },
      { q: 'Do I need my customer’s consent to send an e-invoice?', a: 'Outside the mandate, yes: article 9.2 of the Invoicing Regulation makes e-invoicing conditional on the recipient accepting it. In the mandatory cases of the new article 8 bis, added by RD 238/2026, that consent is no longer needed. Public bodies do not need to consent either, because Law 25/2013 requires certain entities to invoice them electronically.' },
      { q: 'What is the EN 16931 standard the regulation mentions?', a: 'It is the European standard defining the semantic model of an e-invoice: which data it carries and what they mean, such as number, date, parties, lines and taxes. It is not a file format itself; the UBL and CII syntaxes express it in XML. RD 238/2026 requires every mandatory invoice to follow that model.' },
      { q: 'Must invoices to foreign customers be electronic?', a: 'Not under RD 238/2026. Its article 3 applies the mandate when the recipient is a business with its seat, a permanent establishment or its residence in Spain. For customers in other countries you can keep sending invoices in whatever format you agree, respecting the mandatory content and, if you are caught, the Verifactu record.' },
    ],
    body: (h) => `
<h2>Three recipients, three sets of rules</h2>
${h.table(['Invoices to', 'Mandate', 'Format', 'Rule'], [
  ['Public bodies', `Companies and other entities, since ${h.day(F.faceDesde)}`, `Facturae ${K.P.facturae.version}, signed`, 'Law 25/2013, art. 4'],
  ['Businesses in Spain', `${h.day(B.fechaGrandes)} or ${h.day(B.fechaResto)}, by turnover`, B.formatos.join(', '), 'RD 238/2026'],
  ['Consumers', 'Only certain large service companies, if the customer accepts', 'Any', 'Law 56/2007, art. 2 bis.4'],
], 'B2B dates calculated by us from Order HAC/1028/2026.', ['l', 'l', 'l', 'l'])}
<p>${h.src('ley25', 'Law 25/2013')} has been in force for more than ten years: public and private limited companies, foreign entities with an establishment in Spain, temporary joint ventures and the other entities in its article 4 must invoice public bodies electronically, and each body may exempt invoices up to ${h.eur(F.faceExclusion)}. The self-employed may do so but the law does not require it. The format is Facturae with an advanced electronic signature, filed through FACe or the entry point of each regional or local administration.</p>
<h2>What changes with the B2B mandate</h2>
<p>${h.src('rd238', 'RD 238/2026')} implements ${h.src('ley18', 'Law 18/2022')} and defines the mandatory e-invoice as one issued, transmitted and received in structured electronic form, following the EN 16931 model and in one of the syntaxes of its article 7. Beyond the format it brings two new features: every invoice must reach the Tax Agency’s public solution, as the original or as a faithful copy in UBL, and the customer must report whether they accept or reject it and when they pay it. The stated aim is to cut late payment between businesses, which the law treats as a major problem for small firms.</p>
<p>Which format and channel apply depends on the recipient:</p>
${h.mini('formato', { p: ['dest'], c: 'Formats and signature in detail' })}
<h2>And where does Verifactu fit?</h2>
<p>Verifactu is not an invoice format but a rule about the software that issues it. It applies to all your invoices, paper and consumer invoices included, if you produce them with software. A B2B e-invoice issued with adapted software will therefore carry its Verifactu record and QR and also travel as a structured file. The differences are explained in ${h.a('que-es', 'what Verifactu is')}. To see whether the mandate applies to you, use the ${h.a('obligatoria', 'mandatory e-invoicing checker')}; to choose a format, ${h.a('facturae-vs-b2b', 'Facturae or B2B e-invoice')}; and for public bodies, ${h.a('face', 'FACe')}. ${h.src('ley56', 'Law 56/2007')} sets out the general duty for businesses in its article 2 bis.</p>
`,
  },
});
