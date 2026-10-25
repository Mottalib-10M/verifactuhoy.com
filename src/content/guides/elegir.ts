import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Elegir programa: criterios neutros, sin marcas. RD 1007/2023 arts. 7, 13 y 16 (sources.rd1007); Orden HAC/1177/2024
   arts. 8, 15 y 19 (sources.orden1177); RD 238/2026 art. 7 (sources.rd238); Ley 25/2013 (sources.ley25). */
const VF = K.P.verifactu, B = K.P.b2b;

export default defineGuide({
  id: 'elegir', group: 'verifactu', order: 5,
  tool: 'elegir',
  related: ['requisitos', 'app-aeat', 'modalidades', 'facturae-vs-b2b', 'autonomos'],
  sources: ['rd1007', 'orden1177', 'rd238', 'ley25'],
  es: {
    slug: 'elegir-programa-facturacion',
    nav: 'Elegir programa de facturación', card: 'Criterios neutros para escoger un programa adaptado, sin marcas',
    title: 'Programa de facturación Verifactu 2026: cómo elegir bien',
    description: 'Programa de facturación Verifactu 2026: criterios neutros para elegir según tus facturas y clientes, qué exigir al proveedor y cuándo basta la app de la AEAT.',
    h1: 'Cómo elegir un programa de facturación adaptado a Verifactu',
    intro: 'Dinos cuántas facturas haces y a quién: el asistente indica qué tipo de solución encaja y qué debes pedir a cualquier proveedor, sin recomendar marcas.',
    resume: `Para elegir un programa de facturación en 2026 importa menos la marca que cinco comprobaciones. La primera es la declaración responsable del productor, que el artículo 13 del Real Decreto 1007/2023 exige para cada versión y que debe verse dentro del programa. La segunda, las modalidades que admite: solo VERI*FACTU, con envío de cada registro a la Agencia Tributaria, o también la otra, que permite facturar sin conexión a cambio de firmar los registros. La tercera, si emite tiques sin datos del cliente, algo que la aplicación gratuita de la AEAT no permite porque exige siempre un destinatario. La cuarta, si prepara la factura electrónica entre empresas del Real Decreto 238/2026, en UBL, CII, EDIFACT o Facturae, y si se conecta a una plataforma o a la solución pública. La quinta, si exporta tus registros y facturas en un formato abierto, para que puedas cambiar de proveedor sin perder nada. Con pocas facturas al mes y clientes siempre identificados, la aplicación de la AEAT puede bastar; con tiques o mucho volumen conviene un programa propio.`,
    faqs: [
      { q: '¿Hay una lista oficial de programas que cumplen Verifactu?', a: 'No existe un registro de programas aprobados: cada productor certifica el suyo con la declaración responsable del artículo 13 del reglamento. Algunas Haciendas forales publican listados de programas inscritos para TicketBAI, pero eso no vale para el territorio común. Por eso conviene pedir la declaración antes de pagar y comprobar que corresponde a la versión que vas a instalar.' },
      { q: '¿Puedo seguir con mi programa actual si se actualiza?', a: 'Sí, si el proveedor publica una versión adaptada antes de tu fecha y la acompaña de su declaración responsable. Pregunta por escrito cuándo estará disponible, si tendrá coste y si conservará tus facturas anteriores. Una actualización no tiene que cambiar tus series ni tus clientes, pero desde que la instales cada factura generará su registro, su huella y su código QR.' },
      { q: '¿Qué conviene a una gestoría que factura por varios clientes?', a: 'Un sistema que admita varios obligados tributarios en la misma instalación, algo que la declaración responsable debe indicar. El artículo 7 del reglamento lo permite siempre que los registros de cada cliente estén separados y se cumplan los requisitos para cada uno por separado. Comprueba también que cada cliente pueda elegir su modalidad y que la exportación se haga cliente a cliente.' },
      { q: '¿Me obliga Verifactu a tener el programa en la nube?', a: 'No. El reglamento no impone dónde se instala el programa: puede estar en tu ordenador, en un servidor propio o en la nube. Lo que exige es que garantice la conservación y la inalterabilidad de los registros y que pueda enviarlos a la Agencia Tributaria. Si eliges la modalidad VERI*FACTU necesitas conexión al facturar, sea cual sea la instalación.' },
    ],
    body: (h) => `
<h2>Cinco preguntas para cualquier proveedor</h2>
${h.table(['Pregunta', 'Respuesta que buscas', 'Base'], [
  ['¿Tiene declaración responsable para esta versión?', 'Sí, visible en el programa y entregada al comprar', 'RD 1007/2023, art. 13'],
  ['¿Qué modalidades admite?', 'La que tú vas a usar: VERI*FACTU o ambas', 'RD 1007/2023, art. 16'],
  ['¿Emite tiques sin datos del cliente?', 'Sí, si vendes al público', 'RD 1619/2012, art. 4'],
  ['¿Genera factura electrónica B2B?', `En ${B.formatos.join(', ')}`, 'RD 238/2026, art. 7'],
  ['¿Exporta registros y facturas?', 'Sí, en un formato abierto y legible', 'Orden HAC/1177/2024, art. 8'],
], 'Criterios neutros: valen para cualquier programa, sin importar la marca.', ['l', 'l', 'l'])}
<p>La declaración responsable es lo único que el proveedor está obligado a darte por escrito. La ${h.src('orden1177', 'Orden HAC/1177/2024')} fija su contenido y exige que diga si el programa funciona solo como VERI*FACTU y si admite varios obligados tributarios. Con esos dos datos ya sabes si encaja con tu forma de trabajar. La exportación importa más de lo que parece: el artículo 8 de la orden permite conservar los registros fuera del programa si se exportan de forma segura y legible, y eso es lo que te permite cambiar de proveedor sin perder el historial.</p>
<h2>Cuándo basta la aplicación de la AEAT</h2>
<p>El ${h.src('rd1007', 'artículo 7 del RD 1007/2023')} ofrece una alternativa gratuita: la aplicación de facturación de la Agencia Tributaria, que se considera sistema VERI*FACTU a todos los efectos. Tiene condiciones: solo factura en nombre propio o como apoderado, exige identificarte y un destinatario en cada factura, y sus facturas solo se gestionan desde ella. Comprueba si te sirve:</p>
${h.mini('app', { p: ['dest', 'ident', 'otro'], c: 'Todas las condiciones de la aplicación' })}
<h2>Pensar ya en la factura electrónica</h2>
<p>Si facturas a empresas, el programa que elijas ahora tendrá que emitir factura electrónica estructurada desde el ${h.day(B.fechaGrandes)} o el ${h.day(B.fechaResto)}, según tu volumen y nuestro cálculo con la ${h.src('rd238', 'disposición final cuarta del RD 238/2026')}. Pregunta si el proveedor lo tiene previsto, con qué formato y a través de qué vía. Si además facturas a la Administración, necesitas Facturae firmado, que exige la ${h.src('ley25', 'Ley 25/2013')}. La diferencia entre ambos formatos está en ${h.a('facturae-vs-b2b', 'Facturae o factura electrónica B2B')}.</p>
<p>Recuerda las fechas: el programa debe estar adaptado antes del ${h.day(VF.sociedadesAntes)} si pagas el Impuesto sobre Sociedades y antes del ${h.day(VF.restoAntes)} en los demás casos. Antes de firmar, repasa los ${h.a('requisitos', 'requisitos del programa')} y, si eres autónomo, la guía de ${h.a('autonomos', 'Verifactu para autónomos')}.</p>
`,
  },
  en: {
    slug: 'choosing-invoicing-software',
    nav: 'Choosing invoicing software', card: 'Neutral criteria for picking adapted software, without brands',
    title: 'Verifactu Invoicing Software 2026: How to Choose Well',
    description: 'Verifactu invoicing software 2026: neutral criteria to choose by invoices, receipts and customers, what to ask the provider and when the AEAT app is enough.',
    h1: 'How to choose invoicing software adapted to Verifactu',
    intro: 'Tell us how many invoices you issue and to whom: the assistant shows what type of solution fits and what to ask any provider, without recommending brands.',
    resume: `When choosing invoicing software in 2026, the brand matters less than five checks. The first is the producer’s statement of compliance, which article 13 of Royal Decree 1007/2023 requires for each version and which must be visible inside the software. The second is which modes it supports: VERI*FACTU only, sending each record to the Tax Agency, or also the other mode, which allows offline invoicing in exchange for signing records. The third is whether it issues receipts without customer details, which the free AEAT app does not allow because it always requires a recipient. The fourth is whether it is ready for B2B e-invoicing under Royal Decree 238/2026, in UBL, CII, EDIFACT or Facturae, and whether it connects to a platform or the public solution. The fifth is whether it exports your records and invoices in an open format, so you can switch provider without losing anything. With few invoices a month and customers always identified, the AEAT app may be enough; with receipts or high volumes, your own software is the better fit.`,
    faqs: [
      { q: 'Is there an official list of Verifactu-compliant software?', a: 'There is no register of approved software: each producer certifies its own with the statement of compliance under article 13 of the regulation. Some Basque treasuries publish lists of software registered for TicketBAI, but that does not apply to the common territory. So ask for the statement before paying and check it matches the version you will install.' },
      { q: 'Can I keep my current software if it gets updated?', a: 'Yes, if the provider releases an adapted version before your date and supplies its statement of compliance. Ask in writing when it will be available, whether it will cost extra and whether it keeps your earlier invoices. An update need not change your series or customers, but once installed every invoice will create its record, hash and QR code.' },
      { q: 'What suits an accounting firm invoicing for several clients?', a: 'A system that supports several taxpayers in the same installation, which the statement of compliance must state. Article 7 of the regulation allows this as long as each client’s records are kept separate and the requirements are met for each one separately. Also check that each client can choose their mode and that exports run client by client.' },
      { q: 'Does Verifactu force me to use cloud software?', a: 'No. The regulation does not dictate where the software is installed: on your computer, your own server or in the cloud. It requires the software to guarantee the storage and unalterability of records and to be able to send them to the Tax Agency. If you choose VERI*FACTU mode you need a connection when invoicing, whatever the installation.' },
    ],
    body: (h) => `
<h2>Five questions for any provider</h2>
${h.table(['Question', 'Answer you want', 'Basis'], [
  ['Is there a statement of compliance for this version?', 'Yes, visible in the software and supplied on purchase', 'RD 1007/2023, art. 13'],
  ['Which modes does it support?', 'The one you will use: VERI*FACTU or both', 'RD 1007/2023, art. 16'],
  ['Does it issue receipts without customer details?', 'Yes, if you sell to the public', 'RD 1619/2012, art. 4'],
  ['Does it produce B2B e-invoices?', `In ${B.formatos.join(', ')}`, 'RD 238/2026, art. 7'],
  ['Does it export records and invoices?', 'Yes, in an open, readable format', 'Order HAC/1177/2024, art. 8'],
], 'Neutral criteria: they apply to any software, whatever the brand.', ['l', 'l', 'l'])}
<p>The statement of compliance is the only thing the provider must give you in writing. ${h.src('orden1177', 'Order HAC/1177/2024')} sets its content and requires it to say whether the software works only as VERI*FACTU and whether it supports several taxpayers. Those two facts already tell you whether it fits the way you work. Export matters more than it seems: article 8 of the order allows records to be kept outside the software if they are exported securely and legibly, which is what lets you change provider without losing your history.</p>
<h2>When the AEAT app is enough</h2>
<p>${h.src('rd1007', 'Article 7 of RD 1007/2023')} offers a free alternative: the Tax Agency invoicing app, which counts as a VERI*FACTU system for all purposes. It has conditions: it invoices only in your own name or as a representative, requires you to log in and a recipient on every invoice, and its invoices can only be managed inside it. Check whether it suits you:</p>
${h.mini('app', { p: ['dest', 'ident', 'otro'], c: 'All conditions of the app' })}
<h2>Think about e-invoicing now</h2>
<p>If you invoice businesses, the software you choose now will have to issue structured e-invoices from ${h.day(B.fechaGrandes)} or ${h.day(B.fechaResto)}, depending on your turnover and our reading of the ${h.src('rd238', 'fourth final provision of RD 238/2026')}. Ask whether the provider has planned for it, in which format and through which channel. If you also invoice public bodies, you need signed Facturae files, as required by ${h.src('ley25', 'Law 25/2013')}. The difference between the formats is explained in ${h.a('facturae-vs-b2b', 'Facturae or B2B e-invoice')}.</p>
<p>Keep the dates in mind: software must be adapted before ${h.day(VF.sociedadesAntes)} if you pay corporate income tax and before ${h.day(VF.restoAntes)} otherwise. Before you sign any contract or pay for a licence, go over the ${h.a('requisitos', 'software requirements')} and, if you are self-employed, the guide on ${h.a('autonomos', 'Verifactu for the self-employed')}.</p>
`,
  },
});
