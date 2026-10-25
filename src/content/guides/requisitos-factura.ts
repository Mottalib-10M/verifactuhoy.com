import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Requisitos de la factura: RD 1619/2012 (sources.rd1619), art. 6.1 letras a) a p), 6.2, 6.4 y 6.5 (QR y frase
   VERI*FACTU, añadido por el RD 1007/2023), art. 19 (conservación). Textos del QR: params qr. */
const Q = K.P.qr;

export default defineGuide({
  id: 'requisitos-factura', group: 'facturas', order: 3,
  tool: 'datos',
  related: ['simplificada', 'rectificativa', 'ejemplo', 'generador-qr', 'que-es'],
  sources: ['rd1619', 'rd1007', 'aeatQr'],
  es: {
    slug: 'requisitos-factura',
    nav: 'Requisitos de una factura', card: 'Los datos obligatorios de una factura completa, las menciones especiales y el QR',
    title: 'Requisitos de una factura 2026: datos obligatorios y QR',
    description: 'Requisitos de una factura en 2026: los datos obligatorios del artículo 6, las menciones especiales, qué añade Verifactu con el QR y cuánto tiempo se conserva.',
    h1: 'Requisitos de una factura: los datos que no pueden faltar',
    intro: 'Marca los datos que lleva tu factura: el simulador te dice si está completa según el Reglamento de facturación y qué te falta añadir con Verifactu.',
    resume: `Una factura completa en España debe llevar los datos del artículo 6.1 del Reglamento de facturación: número y, en su caso, serie, con numeración correlativa; fecha de expedición; nombre y apellidos o razón social del emisor y del destinatario; NIF del emisor y, en la mayoría de las operaciones entre empresas, también del destinatario; domicilio de ambos; descripción de la operación con los datos necesarios para calcular la base imponible, incluido el precio unitario sin impuesto y los descuentos; tipo o tipos de IVA aplicados; cuota de IVA consignada por separado; y fecha de la operación si es distinta de la de expedición. Según el caso, se añaden menciones especiales: la referencia a la exención, «inversión del sujeto pasivo», «facturación por el destinatario», «régimen especial del criterio de caja» y las de los regímenes de agencias de viajes y bienes usados. Solo un documento con todos estos datos es factura a efectos de deducir el IVA. Si la emite un programa sujeto a Verifactu, lleva además un código QR y, cuando el sistema envía los registros a la Agencia Tributaria, la frase «${Q.textoAbajoVerifactu}» o «${Q.textoAbajoCorto}».`,
    faqs: [
      { q: '¿Qué pasa si a mi factura le falta un dato obligatorio?', a: 'El documento no es una factura completa a efectos del artículo 97 de la Ley del IVA, y tu cliente puede tener problemas para deducir la cuota. Lo que corresponde es expedir una factura rectificativa, porque el artículo 15.1 del Reglamento obliga a rectificar cuando la original no cumple los requisitos del artículo 6. No se corrige a mano ni se sustituye el original.' },
      { q: '¿Siempre hay que poner el NIF del cliente?', a: 'No en todos los casos, pero sí en la mayoría de las facturas entre empresas. El artículo 6.1.d obliga a consignarlo en las entregas intracomunitarias exentas, cuando el cliente es el sujeto pasivo y en las operaciones realizadas en España por un emisor establecido aquí. Si el cliente es un particular, puedes no ponerlo, aunque conviene si te lo pide.' },
      { q: '¿Cuánto tiempo hay que guardar las facturas?', a: 'El artículo 19 del Reglamento remite al plazo de la Ley General Tributaria: se conservan las facturas recibidas y las copias de las emitidas, con su contenido original y de forma ordenada, durante el plazo de prescripción de los impuestos. Una factura electrónica se guarda como fichero electrónico original, no como un papel impreso a partir de ella.' },
    ],
    body: (h) => `
<h2>Los datos del artículo 6.1</h2>
${h.table(['Letra', 'Dato', 'Cuándo'], [
  ['a', 'Número y serie, correlativos', 'Siempre; series separadas para rectificativas'],
  ['b', 'Fecha de expedición', 'Siempre'],
  ['c', 'Nombre o razón social de emisor y destinatario', 'Siempre'],
  ['d', 'NIF del emisor y del destinatario', 'El del emisor siempre; el del cliente en los casos tasados'],
  ['e', 'Domicilio de ambos', 'Siempre'],
  ['f', 'Descripción, precio unitario sin IVA y descuentos', 'Siempre'],
  ['g y h', 'Tipo de IVA y cuota separada', 'Siempre que haya IVA'],
  ['i', 'Fecha de la operación', 'Si es distinta de la de expedición'],
  ['j a p', 'Menciones especiales', 'Exención, inversión del sujeto pasivo, criterio de caja y otros'],
], 'Contenido de la factura completa según el Reglamento de facturación.', ['l', 'l', 'l'])}
<p>El ${h.src('rd1619', 'artículo 6 del Reglamento de facturación')} añade dos reglas que se olvidan a menudo. La primera: si una factura documenta operaciones exentas y no exentas, operaciones con inversión del sujeto pasivo y sin ella, o tipos de IVA distintos, hay que separar la base imponible de cada una. La segunda: solo tiene la consideración de factura, a efectos del derecho a deducir, el documento que reúne todos estos datos. Un presupuesto, un albarán o una proforma no lo son, aunque lleven importes y NIF.</p>
<h2>Lo que añade Verifactu</h2>
<p>El ${h.src('rd1007', 'Real Decreto 1007/2023')} incorporó al artículo 6 un apartado 5 para las facturas expedidas con sistemas informáticos de facturación: deben llevar la representación gráfica de parte de su contenido en un código QR, que en una factura electrónica puede sustituirse por el contenido que representa. Si el sistema remite todos los registros a la Agencia Tributaria, la factura incluye además la frase «${Q.textoAbajoVerifactu}» o «${Q.textoAbajoCorto}». El QR codifica una URL con el NIF del emisor, el número, la fecha y el importe, según la ${h.src('aeatQr', 'especificación de la AEAT')}. Cambia el importe y mira cómo cambia la dirección:</p>
${h.mini('qrurl', { p: ['imp', 'mod'], c: 'Generar el QR completo' })}
<h2>Datos que no son obligatorios pero ayudan</h2>
<p>El reglamento permite incluir cualquier otra mención. En la práctica conviene añadir la forma y la fecha de pago, la cuenta bancaria, la referencia del pedido del cliente y, en facturas a la Administración, los códigos de destino que pida su punto de entrada. En la factura electrónica B2B, el cliente puede exigir datos adicionales si lo habéis pactado y te los ha facilitado antes de la operación.</p>
<p>Una factura de ejemplo con todos los datos, en formato Facturae, está en ${h.a('ejemplo', 'el ejemplo de factura electrónica')}. Los tiques siguen reglas más ligeras, explicadas en ${h.a('simplificada', 'la factura simplificada')}, y los errores se corrigen como indica ${h.a('rectificativa', 'la factura rectificativa')}. El QR se puede probar con el ${h.a('generador-qr', 'generador del QR')}.</p>
`,
  },
  en: {
    slug: 'invoice-requirements-spain',
    nav: 'Invoice requirements', card: 'The mandatory details on a full Spanish invoice, special wording and the QR code',
    title: 'Invoice Requirements in Spain 2026: Mandatory Data and QR',
    description: 'Invoice requirements in Spain 2026: the mandatory details of article 6, special wording, what Verifactu adds with the QR code and how long to keep invoices.',
    h1: 'Spanish invoice requirements: the details you cannot leave out',
    intro: 'Tick the details your invoice carries: the calculator tells you whether it is complete under the Invoicing Regulation and what Verifactu adds.',
    resume: `A full invoice in Spain must carry the details listed in article 6.1 of the Invoicing Regulation: a number and, where used, a series, numbered consecutively; the issue date; the full name or company name of both issuer and recipient; the issuer's tax ID and, in most business transactions, the recipient's too; both addresses; a description of the transaction with what is needed to work out the taxable amount, including the unit price before tax and any discounts; the VAT rate or rates applied; the VAT amount shown separately; and the date of the transaction if it differs from the issue date. Depending on the case, special wording is added: a reference to the exemption, “inversión del sujeto pasivo” for reverse charge, “facturación por el destinatario” for self-billing, “régimen especial del criterio de caja” for cash accounting, and the wording for the travel agency and second-hand goods schemes. Only a document with all these details counts as an invoice for VAT deduction. If it is issued by software subject to Verifactu, it also carries a QR code and, when the system sends its records to the Tax Agency, the sentence “${Q.textoAbajoVerifactu}” or “${Q.textoAbajoCorto}”.`,
    faqs: [
      { q: 'What happens if my invoice is missing a mandatory detail?', a: 'The document is not a complete invoice for the purposes of article 97 of the VAT Act, and your customer may struggle to deduct the VAT. The proper step is to issue a corrective invoice, because article 15.1 of the Regulation requires a correction when the original does not meet the article 6 requirements. You do not fix it by hand or replace the original.' },
      { q: 'Must the customer’s tax ID always appear?', a: 'Not in every case, but in most invoices between businesses. Article 6.1.d requires it for exempt intra-EU supplies, when the customer is liable for the VAT, and for transactions carried out in Spain by an issuer established here. If the customer is a private individual you may leave it out, although it is worth adding if they ask.' },
      { q: 'How long must invoices be kept in Spain?', a: 'Article 19 of the Regulation refers to the General Tax Act period: invoices received and copies of those issued are kept, with their original content and in order, for the tax limitation period. An electronic invoice is kept as the original electronic file, not as a printout made from it.' },
    ],
    body: (h) => `
<h2>The details in article 6.1</h2>
${h.table(['Letter', 'Detail', 'When'], [
  ['a', 'Number and series, consecutive', 'Always; separate series for corrective invoices'],
  ['b', 'Issue date', 'Always'],
  ['c', 'Name of issuer and recipient', 'Always'],
  ['d', 'Tax IDs of issuer and recipient', 'Issuer always; customer in the listed cases'],
  ['e', 'Addresses of both', 'Always'],
  ['f', 'Description, unit price before VAT and discounts', 'Always'],
  ['g and h', 'VAT rate and separate VAT amount', 'Whenever VAT applies'],
  ['i', 'Date of the transaction', 'If different from the issue date'],
  ['j to p', 'Special wording', 'Exemption, reverse charge, cash accounting and others'],
], 'Content of a full invoice under the Invoicing Regulation.', ['l', 'l', 'l'])}
<p>${h.src('rd1619', 'Article 6 of the Invoicing Regulation')} adds two rules that are often forgotten. First, if an invoice covers exempt and non-exempt transactions, reverse-charge and ordinary transactions, or different VAT rates, the taxable amount of each must be shown separately. Second, only a document that brings together all these details counts as an invoice for the right to deduct. A quote, a delivery note or a pro forma is not one, even if it shows amounts and tax IDs.</p>
<h2>What Verifactu adds</h2>
<p>${h.src('rd1007', 'Royal Decree 1007/2023')} added a paragraph 5 to article 6 for invoices issued with invoicing software: they must carry a graphic representation of part of their content as a QR code, which on an electronic invoice may be replaced by the content it represents. If the system sends all records to the Tax Agency, the invoice also includes the sentence “${Q.textoAbajoVerifactu}” or “${Q.textoAbajoCorto}”. The QR encodes a URL with the issuer tax ID, number, date and amount, under the ${h.src('aeatQr', 'AEAT specification')}. Change the amount and watch the address change:</p>
${h.mini('qrurl', { p: ['imp', 'mod'], c: 'Generate the full QR code' })}
<h2>Details that are optional but useful</h2>
<p>The regulation allows any other wording. In practice it pays to add the payment method and due date, the bank account, the customer's order reference and, on invoices to public bodies, the routing codes their entry point asks for. For B2B e-invoices, the customer may require extra data if you have agreed on it and they gave it to you before the transaction.</p>
<p>A sample invoice with every detail, in Facturae format, is on ${h.a('ejemplo', 'the e-invoice example')}. Receipts follow lighter rules, explained in ${h.a('simplificada', 'the simplified invoice')}, and errors are fixed as described in ${h.a('rectificativa', 'the corrective invoice')}. You can try the QR code with the ${h.a('generador-qr', 'QR generator')} before your software prints it.</p>
`,
  },
});
