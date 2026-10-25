import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* FACe: Ley 25/2013 (sources.ley25), arts. 3, 4, 5, 6 y 9; Orden HAP/1074/2014 (sources.orden1074), art. 5.3 (8 MB,
   añadido por la Orden HAP/1650/2015), art. 6 (estado y retirada), art. 7 (servicios web) y anexo (códigos DIR3, roles 01 a 04). */
const F = K.P.factura, FE = K.P.facturae;

export default defineGuide({
  id: 'face', group: 'electronica', order: 7,
  tool: 'face',
  related: ['facturae', 'firma', 'facturae-vs-b2b', 'descargar', 'factura-electronica'],
  sources: ['ley25', 'orden1074', 'face', 'facturae'],
  es: {
    slug: 'face-facturas-administracion',
    nav: 'FACe: facturas a la Administración', card: 'Quién debe facturar por FACe, con qué formato y códigos, y qué pasa después',
    title: 'FACe 2026: facturas electrónicas a la Administración pública',
    description: 'FACe en 2026: quién debe facturar en electrónico a la Administración, el Facturae firmado, los códigos DIR3, el límite de 8 MB y el plazo de registro.',
    h1: 'FACe: cómo facturar a la Administración en formato electrónico',
    intro: 'Elige tu forma jurídica y el importe de la factura: el simulador dice si debes presentarla por FACe o por otro punto de entrada, o si todavía puedes usar papel.',
    resume: `FACe es el punto general de entrada de facturas electrónicas de la Administración General del Estado, y muchas comunidades autónomas y ayuntamientos se han adherido a él. Desde el ${F.faceDesde.split('-').reverse().join('/')}, el artículo 4 de la Ley 25/2013 obliga a facturar en electrónico y a presentar por el punto de entrada que corresponda a las sociedades anónimas y limitadas, a las entidades sin nacionalidad española, a los establecimientos permanentes de no residentes, a las uniones temporales de empresas y a varias agrupaciones y fondos. Los autónomos pueden hacerlo, pero la ley no los obliga. Cada Administración puede excluir por norma las facturas de hasta ${F.faceExclusion} euros. La factura se presenta en formato Facturae, firmada con firma electrónica avanzada basada en certificado reconocido o con sello electrónico, y debe identificar con códigos DIR3 la oficina contable, el órgano gestor y la unidad tramitadora. El fichero no puede superar ${F.faceTamanoMb} MB. El proveedor tiene ${F.faceRegistroDias} días desde la entrega de los bienes o la prestación del servicio para presentar la factura en un registro administrativo.`,
    faqs: [
      { q: '¿Dónde encuentro los códigos DIR3 que pide la factura?', a: 'Los facilita la propia Administración que te contrata, normalmente en el contrato, en el pedido o en su perfil del contratante. Son tres códigos obligatorios: oficina contable, órgano gestor y unidad tramitadora, y uno opcional, el órgano proponente. Si faltan o no coinciden con los dados de alta en FACe, la factura no llega a su destino, así que confírmalos antes de presentarla.' },
      { q: '¿Qué pasa si presento la factura fuera del plazo de treinta días?', a: 'El artículo 3 de la Ley 25/2013 dice que, mientras no se cumplan los requisitos de tiempo y forma, no se entiende cumplida la obligación de presentar la factura en el registro. En la práctica, la fecha de presentación es la que cuenta para tramitar el pago, de modo que presentar tarde retrasa también el cobro. Presenta la factura en cuanto entregues el bien o termines el servicio.' },
      { q: '¿Puedo consultar en qué estado está mi factura en FACe?', a: 'Sí. El punto general de entrada te da un acuse de recibo con la fecha y la hora de presentación y te permite consultar el estado que le comunica la oficina contable, por ejemplo registrada, reconocida la obligación o pagada. También puedes pedir la retirada de una factura presentada, siempre que lo permitan las normas de facturación. Quien envía muchas facturas puede automatizarlo con servicios web.' },
      { q: '¿Un ayuntamiento pequeño también recibe facturas por FACe?', a: 'Depende. Cada comunidad autónoma y cada entidad local debe tener un punto general de entrada propio o adherirse al del Estado, a su diputación o a su comunidad. Muchos ayuntamientos usan FACe, pero no todos. Si una Administración no tiene punto de entrada ni se ha adherido a otro, puedes presentar la factura en el del Estado, que la deja a su disposición.' },
    ],
    body: (h) => `
<h2>Quién está obligado</h2>
${h.table(['Proveedor', 'Factura electrónica a la Administración'], [
  ['Sociedad anónima o limitada', 'Obligatoria'],
  ['Entidad sin nacionalidad española o establecimiento permanente', 'Obligatoria'],
  ['UTE, agrupación de interés económico, fondos', 'Obligatoria'],
  ['Autónomo, asociación, comunidad de bienes', 'Voluntaria, salvo que lo exija el contrato'],
  [`Cualquiera, factura de hasta ${h.eur(F.faceExclusion)}`, 'Papel posible si esa Administración las ha excluido'],
], 'Ley 25/2013, artículo 4.1.', ['l', 'l'])}
<p>La lista sale del ${h.src('ley25', 'artículo 4 de la Ley 25/2013')}, en vigor en este punto desde el ${h.day(F.faceDesde)}. Todos los proveedores pueden expedir factura electrónica a la Administración; las entidades de la lista deben hacerlo y presentarla por el punto general de entrada. La exclusión de las facturas pequeñas no es automática: cada Administración decide por norma si la aplica, así que pregunta antes de enviar papel. Comprueba tu caso con el simulador de arriba.</p>
<h2>El fichero: formato, firma y destino</h2>
<p>El ${h.src('ley25', 'artículo 5')} exige un formato estructurado con firma electrónica avanzada basada en certificado reconocido, o un sello electrónico avanzado de la entidad. El formato es Facturae, cuya versión vigente es la ${FE.version}. La ${h.src('orden1074', 'Orden HAP/1074/2014')} obliga a incluir en la factura los centros administrativos destinatarios con sus códigos del directorio DIR3: oficina contable, órgano gestor y unidad tramitadora. El tamaño máximo con anexos es de ${h.n(F.faceTamanoMb)} MB. Si dudas entre formatos, prueba el comparador:</p>
${h.mini('formato', { p: ['dest'], c: 'Comparar Facturae y factura B2B' })}
<h2>Qué pasa después de presentar</h2>
<p>Según el ${h.src('ley25', 'artículo 6')}, el punto de entrada registra la factura automáticamente, te da un acuse de recibo con fecha y hora, y la remite a la oficina contable que figura en ella. Esa oficina la anota en su registro contable, le asigna un código y la pasa al órgano que debe dar la conformidad. Desde ${h.src('face', 'FACe')} puedes seguir cada paso. El plazo de pago de la Administración empieza a contar con la factura bien presentada, por eso importa el plazo de ${h.n(F.faceRegistroDias)} días del artículo 3.</p>
<p>Para preparar el fichero sin instalar nada, el ${h.a('facturae', 'creador de Facturae')} pide los tres códigos DIR3 cuando eliges una Administración como cliente. Después lo firmas siguiendo ${h.a('firma', 'firmar un Facturae')}. Si prefieres la aplicación oficial, la tienes en ${h.a('descargar', 'descargar Facturae')}. Guarda siempre el fichero firmado que presentas y el acuse de recibo: son tu prueba de la fecha de presentación si hay un retraso en el pago.</p>
`,
  },
  en: {
    slug: 'face-public-sector-invoices',
    nav: 'FACe: invoices to public bodies', card: 'Who must invoice through FACe, with which format and codes, and what happens next',
    title: 'FACe 2026: E-Invoicing Spanish Public Bodies Step by Step',
    description: 'FACe in 2026: who must e-invoice Spanish public bodies, the signed Facturae format, DIR3 routing codes, the 8 MB size limit and the 30-day filing deadline.',
    h1: 'FACe: how to e-invoice the Spanish public sector',
    intro: 'Choose your legal form and the invoice amount: the calculator says whether you must file it through FACe or another entry point, or whether paper is still allowed.',
    resume: `FACe is the general e-invoice entry point of the Spanish central government, and many regions and town halls have joined it. Since ${F.faceDesde.split('-').reverse().join('/')}, article 4 of Law 25/2013 requires the following to e-invoice and to file through the relevant entry point: public and private limited companies, entities without Spanish nationality, permanent establishments of non-residents, joint ventures and several groupings and funds. The self-employed may do so, but the law does not require it. Each public body may exclude by regulation invoices up to ${F.faceExclusion} euros. The invoice is filed in Facturae format, signed with an advanced electronic signature based on a qualified certificate or with an electronic seal, and must identify the accounting office, managing body and processing unit with DIR3 codes. The file may not exceed ${F.faceTamanoMb} MB. The supplier has ${F.faceRegistroDias} days from delivery of the goods or the service to file the invoice with an official register.`,
    faqs: [
      { q: 'Where do I find the DIR3 codes the invoice asks for?', a: 'The public body that hires you provides them, usually in the contract, the purchase order or its procurement profile. There are three mandatory codes, accounting office, managing body and processing unit, and an optional one, the proposing body. If they are missing or do not match those registered in FACe, the invoice does not reach its destination, so confirm them before filing.' },
      { q: 'What if I file the invoice after the thirty-day deadline?', a: 'Article 3 of Law 25/2013 says that as long as the time and form requirements are not met, the duty to file the invoice with the register is not fulfilled. In practice the filing date is what counts for processing payment, so filing late also delays getting paid. File the invoice as soon as you deliver the goods or finish the service.' },
      { q: 'Can I check the status of my invoice in FACe?', a: 'Yes. The general entry point gives you a receipt with the date and time of filing and lets you see the status reported by the accounting office, such as registered, obligation recognised or paid. You may also ask to withdraw a filed invoice, where the invoicing rules allow it. Suppliers sending many invoices can automate all of this through web services.' },
      { q: 'Does a small town hall also receive invoices through FACe?', a: 'It depends. Every region and local authority must have its own general entry point or join the central government one, its provincial council’s or its region’s. Many town halls use FACe, but not all. If a public body has no entry point and has joined none, you may file the invoice at the central government point, which holds it for that body.' },
    ],
    body: (h) => `
<h2>Who must use it</h2>
${h.table(['Supplier', 'E-invoice to public bodies'], [
  ['Public or private limited company', 'Mandatory'],
  ['Entity without Spanish nationality or permanent establishment', 'Mandatory'],
  ['Joint venture, economic interest grouping, funds', 'Mandatory'],
  ['Self-employed, association, joint ownership', 'Voluntary, unless the contract requires it'],
  [`Anyone, invoice up to ${h.eur(F.faceExclusion)}`, 'Paper possible if that body has excluded them'],
], 'Law 25/2013, article 4.1.', ['l', 'l'])}
<p>The list comes from ${h.src('ley25', 'article 4 of Law 25/2013')}, in force on this point since ${h.day(F.faceDesde)}. Every supplier may send e-invoices to public bodies; the entities on the list must do so and file through the general entry point. The small invoice exclusion is not automatic: each public body decides by regulation whether to apply it, so ask before sending paper. Check your case with the calculator above.</p>
<h2>The file: format, signature and routing</h2>
<p>${h.src('ley25', 'Article 5')} requires a structured format with an advanced electronic signature based on a qualified certificate, or an advanced electronic seal of the entity. The format is Facturae, currently version ${FE.version}. ${h.src('orden1074', 'Order HAP/1074/2014')} requires the invoice to name the receiving administrative centres with their DIR3 directory codes: accounting office, managing body and processing unit. The maximum size including attachments is ${h.n(F.faceTamanoMb)} MB. If you are unsure which format applies, try the comparison:</p>
${h.mini('formato', { p: ['dest'], c: 'Compare Facturae and B2B e-invoices' })}
<h2>What happens after filing</h2>
<p>Under ${h.src('ley25', 'article 6')}, the entry point registers the invoice automatically, gives you a receipt with date and time, and forwards it to the accounting office named in it. That office records it in its invoice register, assigns it a code and passes it to the body that must confirm the delivery. You can follow each step in ${h.src('face', 'FACe')}. The public body's payment period starts with a correctly filed invoice, which is why the ${h.n(F.faceRegistroDias)} day deadline in article 3 matters.</p>
<p>To prepare the file without installing anything, the ${h.a('facturae', 'Facturae creator')} asks for the three DIR3 codes when you pick a public body as the customer. You then sign it by following ${h.a('firma', 'signing a Facturae file')}. If you prefer the official application, it is on ${h.a('descargar', 'Facturae download')}. Always keep the signed file you filed and the receipt from the entry point: together they prove your filing date if payment is late, and they let you answer any query from the accounting office quickly.</p>
`,
  },
});
