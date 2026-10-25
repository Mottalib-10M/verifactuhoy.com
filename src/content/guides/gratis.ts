import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Factura electrónica gratis entre empresas: RD 1619/2012, arts. 8 y 9 (consentimiento, sources.rd1619);
   RD 238/2026, arts. 6 y 7 y disposición final cuarta (sources.rd238); Orden HAC/1028/2026 (sources.orden1028);
   RD 1007/2023, art. 3 (sources.rd1007). Fechas B2B = cálculo del sitio (params.b2b). */
const B = K.P.b2b, F = K.P.facturae;

export default defineGuide({
  id: 'gratis', group: 'herramientas', order: 5,
  tool: 'creador', toolArg: { preset: 'empresa' },
  related: ['facturae', 'obligatoria', 'app-aeat', 'facturae-vs-b2b', 'visor'],
  sources: ['rd1619', 'rd238', 'orden1028', 'rd1007', 'facturae'],
  es: {
    slug: 'factura-electronica-gratis',
    nav: 'Factura electrónica gratis', card: 'Crea una factura electrónica Facturae para otra empresa, sin cuenta y sin instalar nada',
    title: 'Factura electrónica gratis 2026: crea tu Facturae sin cuenta',
    description: 'Factura electrónica gratis 2026: crea un Facturae para otra empresa en el navegador, sin cuenta ni instalar, y mira qué cambia con la factura B2B obligatoria.',
    h1: 'Factura electrónica gratis: crea tu Facturae en el navegador',
    intro: 'Rellena emisor, cliente y conceptos: el creador calcula la factura, te deja imprimirla o guardarla en PDF y descargar el XML Facturae, sin registrarte.',
    resume: `Entre empresas y autónomos, la factura electrónica es hoy voluntaria en España. El artículo 9 del Reglamento de facturación la define como la factura expedida, transmitida y recibida en formato electrónico, y la condiciona al consentimiento del cliente salvo en los casos de factura electrónica obligatoria. Esa obligación llega con el RD 238/2026: por nuestro cálculo a partir de la Orden HAC/1028/2026, desde el ${B.fechaGrandes.split('-').reverse().join('/')} para quien supere ${B.umbral / 1e6} millones de euros de volumen de operaciones y desde el ${B.fechaResto.split('-').reverse().join('/')} para el resto. Facturae ${F.version} es uno de los formatos que admitirá ese sistema, junto con UBL, CII y EDIFACT. Este creador gratuito genera la factura en tu navegador: calcula líneas, IVA por tipo y retención, la muestra lista para imprimir o guardar en PDF y descarga el XML Facturae. No hay cuenta, ni límite de facturas, ni datos guardados en ningún servidor. Tiene dos límites que conviene saber: no firma el fichero y no lleva un registro de facturas, así que no sustituye al programa de facturación que exige Verifactu a quien factura con medios informáticos.`,
    faqs: [
      { q: '¿Una factura en PDF por correo ya es factura electrónica?', a: 'Sí, en el sentido del artículo 9 del Reglamento de facturación: se expide, se envía y se recibe en formato electrónico, y el cliente la acepta. Lo que no es, es una factura estructurada. Cuando la factura B2B sea obligatoria, el PDF dejará de bastar y habrá que enviar un fichero en UBL, CII, EDIFACT o Facturae por una plataforma o por la solución pública.' },
      { q: '¿Puedo facturar siempre con este creador gratuito?', a: 'Si estás obligado a Verifactu, no como herramienta principal. El reglamento obliga a quien usa un sistema informático para facturar a que ese sistema genere registros encadenados, y este creador no los genera. Para pocas facturas existe una alternativa gratuita que sí cumple: la aplicación de facturación de la Agencia Tributaria, que te identifica con certificado o Cl@ve.' },
      { q: '¿Necesito el consentimiento del cliente para enviarle un Facturae?', a: 'Hoy sí. El artículo 9.2 del Reglamento de facturación condiciona la expedición, la transmisión y la recepción de la factura electrónica al consentimiento del destinatario, así que pregúntale antes de cambiar de formato. Cuando llegue la obligación del RD 238/2026 el consentimiento dejará de ser necesario para las operaciones obligadas, porque el cliente también tendrá que recibir en formato electrónico.' },
    ],
    body: (h) => `
<h2>Qué puedes hacer gratis hoy</h2>
<p>Mientras la factura electrónica entre empresas no sea obligatoria, cualquier formato vale si cumple el ${h.src('rd1619', 'Reglamento de facturación')}: papel, PDF o un fichero estructurado. El artículo 8 solo pide que el medio garantice la autenticidad del origen, la integridad del contenido y la legibilidad durante todo el periodo de conservación. Enviar un Facturae a un cliente que lo acepta es, por tanto, una factura electrónica plena. A muchos clientes grandes les conviene recibirla así, porque su programa la lee sin teclear nada.</p>
<p>El creador te da las dos piezas: una vista imprimible, que puedes guardar en PDF desde el navegador, y el XML Facturae ${h.P.facturae.version}. El fichero sigue el mismo esquema que la versión para la Administración, pero sin los códigos de centro DIR3, que solo pide el sector público.</p>
<h2>Cuándo dejará de bastar</h2>
<p>El ${h.src('rd238', 'RD 238/2026')} convierte la factura electrónica en obligatoria entre empresarios y profesionales establecidos en España. El fichero tendrá que viajar por una plataforma privada de intercambio o por la solución pública de la Agencia Tributaria, y habrá que informar de los estados de la factura, entre ellos el pago. Un XML enviado por correo electrónico no cumplirá esas condiciones. Comprueba cuándo te toca según tu volumen y tu forma jurídica:</p>
${h.mini('b2b', { p: ['vol', 'pers', 'dest'], c: 'Checker completo de la factura obligatoria' })}
<h2>Gratis no significa sin obligaciones</h2>
<p>El ${h.src('rd1007', 'artículo 3 del RD 1007/2023')} se aplica a quien utilice sistemas informáticos de facturación, aunque solo sea para una parte de sus facturas. Un creador en el navegador que no guarda registros no es un sistema que cumpla esas reglas, así que úsalo para casos sueltos, para probar el formato o para entender qué lleva una factura estructurada, y registra tus facturas en un sistema adaptado. La ${h.a('app-aeat', 'aplicación gratuita de la AEAT')} cumple Verifactu sin coste.</p>
<p>Si vas a facturar a una Administración, usa la versión con códigos DIR3 del ${h.a('facturae', 'creador Facturae')}. Para elegir entre Facturae y los formatos europeos en el futuro sistema B2B, lee ${h.a('facturae-vs-b2b', 'Facturae o factura B2B')}. Y si un cliente te envía un Facturae, ábrelo con el ${h.a('visor', 'visor')}.</p>
`,
  },
  en: {
    slug: 'free-e-invoice-spain',
    nav: 'Free e-invoice', card: 'Create a Facturae e-invoice for another business, with no account and nothing to install',
    title: 'Free E-Invoice Spain 2026: Create a Facturae With No Account',
    description: 'Free e-invoice for Spain 2026: create a Facturae for another business in your browser, no account or install, and see what mandatory B2B e-invoicing changes.',
    h1: 'Free e-invoice for Spain: create a Facturae file in your browser',
    intro: 'Fill in issuer, customer and line items: the creator works out the invoice, lets you print it or save it as a PDF and download the Facturae XML, without signing up.',
    resume: `Between businesses and self-employed people, e-invoicing is voluntary in Spain today. Article 9 of the Invoicing Regulation defines an e-invoice as one issued, transmitted and received in electronic form, and makes it conditional on the customer’s consent except where e-invoicing is mandatory. That mandate arrives with RD 238/2026: by our calculation from Order HAC/1028/2026, from ${B.fechaGrandes.split('-').reverse().join('/')} for businesses with turnover above ${B.umbral / 1e6} million euros and from ${B.fechaResto.split('-').reverse().join('/')} for everyone else. Facturae ${F.version} is one of the formats the system will accept, along with UBL, CII and EDIFACT. This free creator builds the invoice in your browser: it computes the lines, VAT per rate and withholding, shows it ready to print or save as a PDF and downloads the Facturae XML. There is no account, no invoice limit and no data stored on any server. It has two limits worth knowing: it does not sign the file and it keeps no invoice register, so it does not replace the invoicing software that Verifactu requires of anyone who invoices with computer systems.`,
    faqs: [
      { q: 'Is a PDF invoice sent by email already an e-invoice?', a: 'Yes, in the sense of article 9 of the Invoicing Regulation: it is issued, sent and received electronically, and the customer accepts it. What it is not is a structured invoice. Once B2B e-invoicing becomes mandatory, a PDF will no longer be enough and you will need to send a UBL, CII, EDIFACT or Facturae file through a platform or the public solution.' },
      { q: 'Can I always invoice with this free creator?', a: 'If Verifactu applies to you, not as your main tool. The regulation requires anyone using a computer system to invoice to make that system produce chained records, and this creator produces none. For a small number of invoices there is a free option that does comply: the Tax Agency invoicing app, where you identify yourself with a certificate or Cl@ve.' },
      { q: 'Do I need the customer’s consent to send a Facturae?', a: 'Today, yes. Article 9.2 of the Invoicing Regulation makes issuing, transmitting and receiving an e-invoice conditional on the recipient’s consent, so ask them before switching format. When the RD 238/2026 mandate arrives, consent will no longer be needed for the transactions it covers, because the customer will also have to receive electronically.' },
    ],
    body: (h) => `
<h2>What you can do for free today</h2>
<p>As long as B2B e-invoicing is not mandatory, any format works if it meets the ${h.src('rd1619', 'Invoicing Regulation')}: paper, PDF or a structured file. Article 8 only asks that the medium guarantees authenticity of origin, integrity of content and legibility throughout the retention period. Sending a Facturae to a customer who accepts it is therefore a full e-invoice. Many large customers prefer to receive it that way, because their software reads it with no typing.</p>
<p>The creator gives you both pieces: a printable view, which you can save as a PDF from the browser, and the Facturae ${h.P.facturae.version} XML. The file follows the same schema as the public-sector version, but without the DIR3 centre codes, which only public bodies ask for.</p>
<h2>When it will no longer be enough</h2>
<p>${h.src('rd238', 'RD 238/2026')} makes e-invoicing mandatory between businesses and professionals established in Spain. The file will have to travel through a private exchange platform or the Tax Agency’s public solution, and invoice statuses, payment among them, will have to be reported. An XML sent by email will not meet those conditions. Check when your turn comes by turnover and legal form:</p>
${h.mini('b2b', { p: ['vol', 'pers', 'dest'], c: 'Full mandatory e-invoicing checker' })}
<h2>Free does not mean free of duties</h2>
<p>${h.src('rd1007', 'Article 3 of RD 1007/2023')} applies to anyone who uses invoicing software, even for only part of their invoices. A browser creator that keeps no records is not a system that meets those rules, so use it for one-off cases, to try the format or to understand what a structured invoice holds, and record your invoices in an adapted system. The ${h.a('app-aeat', 'free AEAT app')} complies with Verifactu at no cost.</p>
<p>If you are invoicing a public body, use the DIR3 version of the ${h.a('facturae', 'Facturae creator')}. To choose between Facturae and the European formats in the future B2B system, read ${h.a('facturae-vs-b2b', 'Facturae or B2B e-invoice')}. And if a customer sends you a Facturae file, open it with the ${h.a('visor', 'viewer')}.</p>
`,
  },
});
