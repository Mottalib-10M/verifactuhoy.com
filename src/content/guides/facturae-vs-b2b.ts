import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Facturae (Ley 25/2013, arts. 4 a 6; Orden HAP/1074/2014) frente a la factura electrónica B2B (RD 238/2026, arts. 5 a 7 y 11).
   Formatos admitidos: params b2b.formatos (art. 7.1). La solución pública trabaja en UBL (art. 11.2). */
const B = K.P.b2b, F = K.P.factura, FE = K.P.facturae;

export default defineGuide({
  id: 'facturae-vs-b2b', group: 'electronica', order: 5,
  tool: 'formato',
  related: ['facturae', 'b2b', 'face', 'factura-electronica', 'firma'],
  sources: ['rd238', 'ley25', 'orden1074', 'facturae', 'orden1028'],
  es: {
    slug: 'facturae-o-factura-electronica-b2b',
    nav: 'Facturae o factura B2B', card: 'Qué formato y qué canal usar según vaya la factura a la Administración o a una empresa',
    title: 'Facturae o factura electrónica B2B 2026: formato y canal',
    description: 'Facturae o factura electrónica B2B en 2026: qué formato, firma y canal pide una factura a la Administración y cuál una factura a otra empresa, con su norma.',
    h1: 'Facturae o factura electrónica B2B: qué formato usar en cada caso',
    intro: 'Elige a quién va la factura: el simulador dice el formato, la firma y la vía de envío que pide la norma, y desde cuándo es obligatorio.',
    resume: `En España conviven dos factura electrónicas obligatorias que se confunden a menudo. La primera, desde el ${F.faceDesde.split('-').reverse().join('/')}, es la factura a las Administraciones públicas: la Ley 25/2013 exige un formato estructurado firmado con firma electrónica avanzada, en la práctica Facturae ${FE.version}, presentado por el punto general de entrada de cada Administración, FACe en el caso del Estado. La segunda es la factura entre empresas y profesionales del Real Decreto 238/2026, que llegará el ${B.fechaGrandes.split('-').reverse().join('/')} o el ${B.fechaResto.split('-').reverse().join('/')} según el volumen, por nuestro cálculo. Aquí la norma admite cuatro sintaxis basadas en el modelo europeo EN 16931: UBL, CII, EDIFACT y Facturae. Si usas una plataforma privada, la factura va firmada y la plataforma envía una copia fiel en UBL a la Agencia Tributaria; si usas la solución pública de la AEAT, trabajas directamente en UBL y la firma la sustituyen los procedimientos de la propia Agencia. Facturae vale para los dos mundos, pero no es la única opción entre empresas.`,
    faqs: [
      { q: '¿Puedo enviar a una empresa el mismo Facturae que envío a FACe?', a: 'Sí, Facturae es una de las cuatro sintaxis admitidas en el artículo 7.1 del Real Decreto 238/2026. Para la Administración, el fichero debe llevar los códigos DIR3 de oficina contable, órgano gestor y unidad tramitadora, que en una factura a una empresa sobran. Lo que cambia es el canal: entre empresas no se usa FACe, sino una plataforma privada o la solución pública.' },
      { q: '¿Qué es UBL y por qué lo usa la solución pública de la AEAT?', a: 'UBL es una sintaxis XML internacional para documentos comerciales, compatible con el modelo semántico europeo EN 16931. El artículo 11.2 del real decreto obliga a usarla a quien emita por la solución pública, y las plataformas privadas deben enviar en UBL la copia fiel de cada factura. Así la Agencia Tributaria recibe todas las facturas en un único formato.' },
      { q: '¿Una factura electrónica también tiene que cumplir Verifactu?', a: 'Sí, si la emite un sistema informático de facturación sujeto al Real Decreto 1007/2023. El formato electrónico regula cómo viaja la factura al cliente; Verifactu regula cómo el programa registra cada factura y la encadena. Son capas distintas: una misma factura B2B tendrá su fichero estructurado y, además, su registro con huella y su QR o contenido equivalente.' },
    ],
    body: (h) => `
<h2>Las dos obligaciones, lado a lado</h2>
${h.table(['', 'Factura a la Administración', 'Factura a otra empresa'], [
  ['Norma', 'Ley 25/2013 y Orden HAP/1074/2014', 'Ley 18/2022 y RD 238/2026'],
  ['Desde', h.day(F.faceDesde), `${h.day(B.fechaGrandes)} o ${h.day(B.fechaResto)}`],
  ['Formato', `Facturae ${FE.version}`, B.formatos.join(', ')],
  ['Firma', 'Avanzada con certificado, o sello electrónico', 'Avanzada en plataformas privadas'],
  ['Canal', 'FACe u otro punto general de entrada', 'Plataforma privada o solución pública de la AEAT'],
  ['Estados', 'Los publica el punto de entrada', 'Aceptación, rechazo y pago, informados por el cliente'],
], 'Comparación con la norma vigente el día de lectura.', ['l', 'l', 'l'])}
<p>La ${h.src('ley25', 'Ley 25/2013, artículo 5')}, pide para las facturas a la Administración un formato estructurado y una firma electrónica avanzada basada en certificado reconocido, o un sello electrónico avanzado. El formato concreto es Facturae, publicado en ${h.src('facturae', 'facturae.gob.es')}, y la ${h.src('orden1074', 'Orden HAP/1074/2014')} añade los campos de destino y un tamaño máximo de ${h.n(F.faceTamanoMb)} MB. Cada factura entra por el punto general de entrada de la Administración destinataria, que la registra y te dice en qué estado está.</p>
<h2>Entre empresas, cuatro sintaxis y dos vías</h2>
<p>El ${h.src('rd238', 'artículo 7 del Real Decreto 238/2026')} admite cualquier mensaje estructurado que siga el modelo europeo EN 16931 en sintaxis CII, UBL, EDIFACT o Facturae. Las plataformas privadas deben saber transformar la factura entre todas ellas sin romper su autenticidad, y cada factura que circula por ellas va firmada con firma avanzada, del propio emisor o delegada. Cada factura lleva un código único que incluye el NIF del emisor, la serie y el número, y la fecha.</p>
<p>La alternativa es la solución pública de la Agencia Tributaria, gratuita, regulada en el artículo 11 y desarrollada por la ${h.src('orden1028', 'Orden HAC/1028/2026')}. Allí la sintaxis es siempre UBL. Quien no comunique otra cosa recibe por esta vía. Prueba qué formato corresponde a cada destino:</p>
${h.mini('fe', { p: ['cli', 'vol', 'soc'], c: 'Ver qué factura electrónica te toca' })}
<h2>Cuál elegir si facturas a los dos</h2>
<p>Si trabajas a la vez para Administraciones y empresas, Facturae tiene la ventaja de servir en ambos sitios: puedes generar el mismo tipo de fichero y cambiar solo el canal y los datos de destino. Si casi todo va a empresas, lo más práctico será lo que use tu programa o tu plataforma, normalmente UBL. Para probar Facturae sin instalar nada, el ${h.a('facturae', 'creador de Facturae')} genera el XML y el ${h.a('firma', 'paso de firma')} explica cómo firmarlo. La vía de la Administración se detalla en ${h.a('face', 'FACe')}, y la de las empresas en ${h.a('b2b', 'la factura electrónica B2B')}.</p>
`,
  },
  en: {
    slug: 'facturae-vs-b2b-e-invoice',
    nav: 'Facturae or B2B e-invoice', card: 'Which format and channel to use for invoices to public bodies or to businesses',
    title: 'Facturae vs B2B E-Invoice in Spain 2026: Format and Channel',
    description: 'Facturae or B2B e-invoice in Spain for 2026: the format, signature and channel an invoice to a public body needs, and those for a business, with the rules.',
    h1: 'Facturae or B2B e-invoice: which format to use in each case',
    intro: 'Choose where the invoice goes: the calculator gives the format, signature and delivery route the rules require, and since when it is mandatory.',
    resume: `Spain has two mandatory e-invoicing regimes that are easily confused. The first, since ${F.faceDesde.split('-').reverse().join('/')}, covers invoices to public bodies: Law 25/2013 requires a structured format signed with an advanced electronic signature, in practice Facturae ${FE.version}, filed through each administration's general entry point, FACe for central government. The second is business-to-business invoicing under Royal Decree 238/2026, arriving on ${B.fechaGrandes.split('-').reverse().join('/')} or ${B.fechaResto.split('-').reverse().join('/')} depending on turnover, by our calculation. Here the rules accept four syntaxes based on the European EN 16931 model: UBL, CII, EDIFACT and Facturae. On a private platform the invoice is signed and the platform sends a faithful UBL copy to the Tax Agency; on the AEAT public solution you work directly in UBL and the Agency's own procedures take the place of the signature. Facturae works in both worlds, but it is not the only option between businesses.`,
    faqs: [
      { q: 'Can I send a business the same Facturae file I send to FACe?', a: 'Yes, Facturae is one of the four syntaxes allowed by article 7.1 of Royal Decree 238/2026. For public bodies the file must carry the DIR3 codes for accounting office, managing body and processing unit, which an invoice to a business does not need. What changes is the channel: between businesses you use a private platform or the public solution, not FACe.' },
      { q: 'What is UBL and why does the AEAT public solution use it?', a: 'UBL is an international XML syntax for business documents that fits the European EN 16931 semantic model. Article 11.2 of the royal decree requires it for anyone issuing through the public solution, and private platforms must send the faithful copy of each invoice in UBL. That way the Tax Agency receives every invoice in a single format.' },
      { q: 'Does an e-invoice also have to comply with Verifactu?', a: 'Yes, if it is issued by invoicing software subject to Royal Decree 1007/2023. The electronic format governs how the invoice travels to the customer; Verifactu governs how the software records and chains each invoice. They are separate layers: one B2B invoice will have its structured file and, on top, its record with a hash and its QR code or equivalent content.' },
    ],
    body: (h) => `
<h2>The two duties side by side</h2>
${h.table(['', 'Invoice to a public body', 'Invoice to a business'], [
  ['Rules', 'Law 25/2013 and Order HAP/1074/2014', 'Law 18/2022 and RD 238/2026'],
  ['Since', h.day(F.faceDesde), `${h.day(B.fechaGrandes)} or ${h.day(B.fechaResto)}`],
  ['Format', `Facturae ${FE.version}`, B.formatos.join(', ')],
  ['Signature', 'Advanced, certificate-based, or electronic seal', 'Advanced on private platforms'],
  ['Channel', 'FACe or another general entry point', 'Private platform or AEAT public solution'],
  ['Statuses', 'Published by the entry point', 'Acceptance, rejection and payment, reported by the customer'],
], 'Comparison under the rules in force on the reading date.', ['l', 'l', 'l'])}
<p>${h.src('ley25', 'Law 25/2013, article 5')}, requires invoices to public bodies to use a structured format and an advanced electronic signature based on a qualified certificate, or an advanced electronic seal. The format in practice is Facturae, published on ${h.src('facturae', 'facturae.gob.es')}, and ${h.src('orden1074', 'Order HAP/1074/2014')} adds routing fields and a maximum size of ${h.n(F.faceTamanoMb)} MB. Each invoice enters through the recipient administration's general entry point, which files it and tells you its status.</p>
<h2>Between businesses: four syntaxes, two routes</h2>
<p>${h.src('rd238', 'Article 7 of Royal Decree 238/2026')} accepts any structured file following the European EN 16931 model in CII, UBL, EDIFACT or Facturae syntax. Private platforms must be able to convert an invoice between all of them without breaking its authenticity, and every invoice they carry is signed with an advanced signature, by the issuer or by delegation. Each invoice has a unique code combining the issuer tax ID, the series and number, and the date.</p>
<p>The alternative is the Tax Agency public solution, free of charge, governed by article 11 and set up by ${h.src('orden1028', 'Order HAC/1028/2026')}. There the syntax is always UBL. Anyone who states nothing else receives through this route. Try which format applies to each destination:</p>
${h.mini('fe', { p: ['cli', 'vol', 'soc'], c: 'See which e-invoice applies to you' })}
<h2>Which to choose if you invoice both</h2>
<p>If you work for public bodies and businesses alike, Facturae has the advantage of fitting both: you can produce the same kind of file and change only the channel and routing details. If nearly everything goes to businesses, the practical choice is whatever your software or platform uses, usually UBL. To try Facturae without installing anything, the ${h.a('facturae', 'Facturae creator')} builds the XML and the ${h.a('firma', 'signing step')} explains how to sign it. The public sector route is covered in ${h.a('face', 'FACe')}, and the business route in ${h.a('b2b', 'B2B e-invoicing')}. Whichever you pick, keep the original XML file as your record, not a printout.</p>
`,
  },
});
