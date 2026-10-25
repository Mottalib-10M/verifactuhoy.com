import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Aplicación de facturación de la AEAT: RD 1007/2023 arts. 7.b y 16.4 (sources.rd1007); Orden HAC/1177/2024 art. 19
   (sources.orden1177); formulario B2B previsto en la disposición adicional primera del RD 238/2026 (sources.rd238). */
const VF = K.P.verifactu, B = K.P.b2b;

export default defineGuide({
  id: 'app-aeat', group: 'verifactu', order: 6,
  tool: 'app',
  related: ['elegir', 'autonomos', 'modalidades', 'requisitos', 'b2b'],
  sources: ['rd1007', 'orden1177', 'rd238', 'aeatSif'],
  es: {
    slug: 'aplicacion-facturacion-aeat',
    nav: 'Aplicación gratuita de la AEAT', card: 'Para quién sirve la aplicación de facturación de la AEAT y sus límites',
    title: 'Aplicación facturación AEAT 2026: gratis, límites y usos',
    description: 'Aplicación de facturación de la AEAT 2026: gratis y VERI*FACTU, pero con destinatario obligatorio y sin pasar facturas a otro programa. Comprueba si te sirve.',
    h1: 'Aplicación de facturación de la AEAT: para quién sirve',
    intro: 'Tres respuestas sobre cómo facturas: la comprobación dice si la aplicación gratuita de la Agencia Tributaria te basta o si chocarás con alguno de sus límites.',
    resume: `El artículo 7 del Real Decreto 1007/2023 permite cumplir Verifactu de dos maneras: con un programa que reúna los requisitos o con la aplicación informática de facturación que desarrolle la Agencia Tributaria. Esa aplicación es gratuita y se considera un sistema VERI*FACTU a todos los efectos, según el artículo 16.4, así que cada factura que emites con ella genera su registro y queda en la Agencia Tributaria. La Orden HAC/1177/2024, en su artículo 19, fija lo que debe ofrecer como mínimo: captura, almacenamiento, consulta y descarga de los datos de las facturas, expedición y descarga de la factura en PDF y generación del registro de facturación. También fija cuatro condiciones de uso: solo para facturar en nombre propio o como apoderado, con identificación mediante los sistemas que admite la Agencia Tributaria, con un destinatario obligatorio en cada factura y sin que otro sistema pueda gestionar esas facturas ni sus registros. Encaja con quien emite pocas facturas a clientes identificados; no sirve para tiques al público. Consulta en la sede de la AEAT cómo acceder a ella.`,
    faqs: [
      { q: '¿Puedo hacer tiques con la aplicación de la Agencia Tributaria?', a: 'No en la forma habitual de un comercio. La Orden HAC/1177/2024 exige que toda factura expedida con la aplicación tenga un destinatario, y un tique de mostrador se emite precisamente sin datos del cliente. Si vendes al público y das tiques, necesitas un programa o un terminal de punto de venta propio que cumpla los requisitos del reglamento.' },
      { q: '¿Puedo pasar a otro programa las facturas hechas con la aplicación?', a: 'Puedes descargarlas en PDF, pero no gestionarlas desde otro sistema. El artículo 19.2.d de la orden dispone que las facturas expedidas con la aplicación y sus registros solo los gestiona la propia aplicación. Si más adelante cambias a un programa comercial, empezarás en él tus nuevas facturas, y las anteriores seguirán consultándose donde se emitieron.' },
      { q: '¿Puede usar la aplicación mi gestoría en mi nombre?', a: 'Sí, si actúa como apoderado. La orden permite usar la aplicación para facturar en nombre propio o por medio de un apoderado, siempre que quien entra se identifique con alguno de los sistemas que admite la Agencia Tributaria. Lo que no prevé es que una persona use la aplicación para facturar por cuenta de terceros sin ese apoderamiento.' },
      { q: '¿La aplicación servirá también para la factura electrónica B2B?', a: 'Para la factura electrónica entre empresas, el RD 238/2026 prevé un formulario gratuito de la Agencia Tributaria, en su disposición adicional primera, que permitirá emitir facturas electrónicas e informar de su estado y pago a través de la solución pública. Es una herramienta prevista por otra norma; cuando esté disponible, comprueba sus condiciones en la sede de la AEAT.' },
    ],
    body: (h) => `
<h2>Qué ofrece y qué condiciones tiene</h2>
${h.table(['Aspecto', 'Aplicación de la AEAT', 'Base'], [
  ['Coste', 'Gratuita', 'RD 1007/2023, art. 7.b'],
  ['Modalidad', 'VERI*FACTU a todos los efectos', 'RD 1007/2023, art. 16.4'],
  ['Funciones mínimas', 'Captura, consulta, descarga, PDF y registro', 'Orden HAC/1177/2024, art. 19.1'],
  ['Quién puede facturar', 'El titular o un apoderado, identificados', 'Orden HAC/1177/2024, art. 19.2.a y b'],
  ['Destinatario', 'Obligatorio en todas las facturas', 'Orden HAC/1177/2024, art. 19.2.c'],
  ['Gestión desde otro sistema', 'No permitida', 'Orden HAC/1177/2024, art. 19.2.d'],
], 'Condiciones de la aplicación de facturación según la normativa leída en el BOE.', ['l', 'l', 'l'])}
<p>La ventaja principal es que no tienes que comprobar nada del programa: al ser de la propia Agencia Tributaria, el ${h.src('rd1007', 'reglamento')} la trata como sistema VERI*FACTU y no necesitas declaración responsable de ningún productor. Cada factura queda registrada en el momento, lleva su código QR y tu cliente puede cotejarla en la sede. A cambio aceptas sus límites, que la ${h.src('orden1177', 'orden')} enumera sin excepciones. Conviene conocerlos antes de emitir la primera factura, porque después no podrás llevarte esas facturas a otro sistema.</p>
<h2>Para quién encaja y para quién no</h2>
<p>Encaja con el profesional que emite pocas facturas al mes, siempre a clientes con nombre y NIF, por ejemplo un traductor, un arquitecto o un consultor que factura a empresas. No encaja con un comercio o un bar que da tiques sin datos del cliente, ni con quien necesita volcar sus facturas en un programa de contabilidad o de gestión, ni con quien emite muchas facturas parecidas y quiere plantillas o series automáticas. Compara con otras opciones:</p>
${h.mini('elegir', { p: ['fact', 'tickets'], c: 'Asistente completo para elegir' })}
<h2>Fechas y siguientes pasos</h2>
<p>Las fechas son las mismas que con cualquier programa: tu sistema de facturación debe cumplir antes del ${h.day(VF.sociedadesAntes)} si pagas el Impuesto sobre Sociedades y antes del ${h.day(VF.restoAntes)} si eres autónomo o comunidad de bienes. Puedes empezar antes con la aplicación y, si tu actividad crece, pasar a un programa propio. En ese caso revisa los ${h.a('requisitos', 'requisitos del programa')} y los ${h.a('elegir', 'criterios para elegirlo')}.</p>
<p>La factura electrónica entre empresas sigue otro camino. El ${h.src('rd238', 'RD 238/2026')} prevé un formulario gratuito propio, y la obligación llega, según nuestro cálculo, el ${h.day(B.fechaGrandes)} para quien supera ${h.eur(B.umbral)} y el ${h.day(B.fechaResto)} para el resto. Lo explicamos en ${h.a('b2b', 'la factura electrónica B2B')}. Si eres autónomo, la guía de ${h.a('autonomos', 'Verifactu para autónomos')} resume tu caso.</p>
`,
  },
  en: {
    slug: 'aeat-free-invoicing-app',
    nav: 'Free AEAT invoicing app', card: 'Who the Tax Agency invoicing app suits, and its limits',
    title: 'AEAT Invoicing App 2026: Free, Limits and Who It Suits',
    description: 'The AEAT invoicing app in 2026: free and VERI*FACTU, but a recipient is mandatory and invoices cannot move to other software. Check whether it suits you.',
    h1: 'The AEAT invoicing app: who it suits and its limits',
    intro: 'Three answers about how you invoice: the check tells you whether the free Tax Agency app is enough or whether you will run into one of its limits.',
    resume: `Article 7 of Royal Decree 1007/2023 lets you comply with Verifactu in two ways: with software that meets the requirements or with the invoicing app developed by the Spanish Tax Agency. The app is free and counts as a VERI*FACTU system for all purposes under article 16.4, so every invoice you issue with it creates its record and lands with the Tax Agency. Article 19 of Order HAC/1177/2024 sets the minimum it must offer: entry, storage, search and download of invoice data, issue and download of the invoice as a PDF, and creation of the invoicing record. It also sets four conditions of use: invoicing only in your own name or through a representative, logging in with a method the Tax Agency accepts, a mandatory recipient on every invoice, and no other system may manage those invoices or their records. It suits people issuing few invoices to identified customers; it does not work for receipts to the public. Check the AEAT website for how to access it.`,
    faqs: [
      { q: 'Can I issue till receipts with the Tax Agency app?', a: 'Not in the way a shop does. Order HAC/1177/2024 requires every invoice issued with the app to have a recipient, and a counter receipt is issued precisely without customer details. If you sell to the public and give receipts, you need your own software or point-of-sale terminal that meets the regulation’s requirements.' },
      { q: 'Can I move invoices made in the app to other software?', a: 'You can download them as PDFs, but not manage them from another system. Article 19.2.d of the order states that invoices issued with the app and their records are managed only by the app itself. If you later switch to commercial software, you start your new invoices there, and earlier ones stay viewable where they were issued.' },
      { q: 'Can my accountant use the app on my behalf?', a: 'Yes, if acting as your authorised representative. The order allows the app to be used to invoice in your own name or through a representative, as long as whoever logs in uses a method the Tax Agency accepts. What it does not allow is one person using the app to invoice for others without that authorisation.' },
      { q: 'Will the app also handle B2B e-invoicing?', a: 'For e-invoicing between businesses, RD 238/2026 provides for a free Tax Agency form in its first additional provision, which will let businesses issue e-invoices and report status and payment through the public solution. It is a tool under a different rule; when it becomes available, check its conditions on the AEAT website.' },
    ],
    body: (h) => `
<h2>What it offers and its conditions</h2>
${h.table(['Aspect', 'AEAT app', 'Basis'], [
  ['Cost', 'Free', 'RD 1007/2023, art. 7.b'],
  ['Mode', 'VERI*FACTU for all purposes', 'RD 1007/2023, art. 16.4'],
  ['Minimum features', 'Entry, search, download, PDF and record', 'Order HAC/1177/2024, art. 19.1'],
  ['Who may invoice', 'The holder or a representative, logged in', 'Order HAC/1177/2024, art. 19.2.a and b'],
  ['Recipient', 'Mandatory on every invoice', 'Order HAC/1177/2024, art. 19.2.c'],
  ['Management from another system', 'Not allowed', 'Order HAC/1177/2024, art. 19.2.d'],
], 'Conditions of the invoicing app under the rules read in the BOE.', ['l', 'l', 'l'])}
<p>The main advantage is that you have nothing to check about the software: because it belongs to the Tax Agency, the ${h.src('rd1007', 'regulation')} treats it as a VERI*FACTU system and you need no statement of compliance from any producer. Each invoice is recorded at once, carries its QR code and your customer can check it on the AEAT website. In exchange you accept its limits, which the ${h.src('orden1177', 'order')} lists without exceptions. It pays to know them before issuing your first invoice, because afterwards you cannot take those invoices to another system.</p>
<h2>Who it suits and who it does not</h2>
<p>It suits a professional issuing a few invoices a month, always to customers with a name and tax ID, for example a translator, an architect or a consultant billing companies. It does not suit a shop or bar giving receipts without customer details, anyone who needs to load invoices into accounting or management software, or anyone issuing many similar invoices who wants templates or automatic series. Compare with other options:</p>
${h.mini('elegir', { p: ['fact', 'tickets'], c: 'Full assistant for choosing' })}
<h2>Dates and next steps</h2>
<p>The dates are the same as with any software: your invoicing system must comply before ${h.day(VF.sociedadesAntes)} if you pay corporate income tax and before ${h.day(VF.restoAntes)} if you are self-employed or a joint ownership. You can start early with the app and, if your business grows, move to your own software. In that case review the ${h.a('requisitos', 'software requirements')} and the ${h.a('elegir', 'criteria for choosing it')}, and keep the PDFs of every invoice issued in the app.</p>
<p>B2B e-invoicing follows a different path. ${h.src('rd238', 'RD 238/2026')} provides for its own free form, and the mandate arrives, by our calculation, on ${h.day(B.fechaGrandes)} for businesses above ${h.eur(B.umbral)} and on ${h.day(B.fechaResto)} for everyone else. We explain it in ${h.a('b2b', 'B2B e-invoicing')}. If you are self-employed, the guide on ${h.a('autonomos', 'Verifactu for the self-employed')} sums up your case.</p>
`,
  },
});
