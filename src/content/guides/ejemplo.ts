import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { EJEMPLO, calcular } from '../../lib/engine/facturae';

/* Ejemplo de factura electrónica: la factura de ejemplo del motor (engine/facturae.ts, datos ficticios), generada en
   Facturae 3.2.2 y validada contra el XSD oficial (tests). Contenido: RD 1619/2012, art. 6 (sources.rd1619);
   Facturae (sources.facturae); destino a la Administración: Orden HAP/1074/2014, anexo (sources.orden1074). */
const E = EJEMPLO, T = calcular(EJEMPLO), FE = K.P.facturae;
const L1 = E.lineas[0], L2 = E.lineas[1];

export default defineGuide({
  id: 'ejemplo', group: 'facturas', order: 4,
  tool: 'visor',
  related: ['visor', 'facturae', 'requisitos-factura', 'face', 'gratis'],
  sources: ['facturae', 'rd1619', 'orden1074'],
  es: {
    slug: 'factura-electronica-ejemplo',
    nav: 'Ejemplo de factura electrónica', card: 'Una factura Facturae completa, campo a campo, con retención de IRPF',
    title: 'Ejemplo de factura electrónica 2026: Facturae campo a campo',
    description: 'Ejemplo de factura electrónica en 2026: una factura Facturae 3.2.2 de una autónoma con IVA y retención de IRPF, explicada campo a campo y descargable en XML.',
    h1: 'Ejemplo de factura electrónica: un Facturae explicado',
    intro: 'Arriba tienes una factura de ejemplo abierta en el visor: puedes descargar su XML, imprimirla o soltar tu propio Facturae para compararlo.',
    resume: `Esta página muestra una factura electrónica completa en formato Facturae ${FE.version}, con datos ficticios, generada por el mismo motor que el creador del sitio y validada contra el esquema oficial. La emite una diseñadora autónoma de Madrid a una sociedad limitada de Sevilla: dos líneas, un diseño de catálogo y horas de maquetación, con IVA del ${L1.iva} % y una retención de IRPF del ${E.retencion} %. La base suma ${T.bruto.toFixed(2)} euros, el IVA ${T.iva.toFixed(2)}, la retención ${T.retencion.toFixed(2)} y el total a pagar ${T.total.toFixed(2)}. En el XML cada dato tiene su sitio: la cabecera del fichero con la versión y el lote, las partes con el NIF, el nombre y la dirección del emisor y del receptor, y la factura con su número y serie, la fecha, los impuestos repercutidos y retenidos, los totales, las líneas y la forma de pago con el IBAN. Es el mismo contenido que exige el artículo 6 del Reglamento de facturación, pero en campos que un programa puede leer sin errores. Para enviarla a FACe faltarían los códigos DIR3 del destino y la firma electrónica.`,
    faqs: [
      { q: '¿Puedo usar esta factura de ejemplo como plantilla?', a: 'Sí. Descarga el XML desde el visor o, mejor, abre el creador de Facturae, que parte de estos mismos datos y te deja cambiarlos por los tuyos en un formulario. Así el fichero sigue siendo válido contra el esquema. Editar el XML a mano es posible, pero un error en una etiqueta o en una suma hace que el fichero deje de ser aceptado.' },
      { q: '¿Por qué la factura de ejemplo lleva una retención?', a: 'Porque es habitual en las facturas de profesionales autónomos a empresas: el cliente retiene un porcentaje a cuenta del IRPF del profesional y lo ingresa en Hacienda. En Facturae la retención va en su propio bloque de impuestos retenidos y se resta del total. Si tu actividad no lleva retención, ese bloque simplemente no aparece y el total es base más IVA.' },
      { q: '¿Este ejemplo es una factura real o un fichero oficial?', a: 'Ninguna de las dos cosas. Los nombres, el NIF y la cuenta son ficticios y la factura la ha generado este sitio, no una Administración. No hemos encontrado ejemplos oficiales de Facturae publicados con una licencia que permita reutilizarlos, así que usamos uno propio. Lo que sí es oficial es el esquema contra el que lo validamos en nuestras pruebas.' },
    ],
    body: (h) => `
<h2>La factura, en cifras</h2>
${h.table(['Concepto', 'Cantidad', 'Precio', 'Importe'], [
  [L1.descripcion, h.n(L1.cantidad), h.eur(L1.precio, 2), h.eur(T.lineas[0].importe, 2)],
  [L2.descripcion, h.n(L2.cantidad), h.eur(L2.precio, 2), h.eur(T.lineas[1].importe, 2)],
  ['Base imponible', '', '', h.eur(T.bruto, 2)],
  [`IVA ${h.n(L1.iva)} %`, '', '', h.eur(T.iva, 2)],
  [`Retención IRPF ${h.n(E.retencion)} %`, '', '', `-${h.eur(T.retencion, 2)}`],
  ['Total a pagar', '', '', h.eur(T.total, 2)],
], `Factura ${E.serie}-${E.numero}, datos ficticios.`, ['l', 'r', 'r', 'r'])}
<p>Los importes los calcula el mismo motor que usa el creador: cada línea es cantidad por precio, la cuota de IVA se calcula por línea y se agrupa por tipo, y la retención se aplica sobre la base. El total a pagar es base más IVA menos retención. El visor de arriba hace la operación inversa: lee el XML y comprueba que la suma de las líneas, los impuestos y el total cuadran, igual que haría el programa de tu cliente.</p>
<h2>Dónde va cada dato en el XML</h2>
${h.table(['Bloque', 'Contenido', 'Dato del art. 6'], [
  ['FileHeader', `Versión ${FE.version}, modalidad individual, emisor de la factura, lote con su total`, '-'],
  ['Parties / SellerParty', 'NIF, nombre y apellidos y dirección de la emisora', 'c, d, e'],
  ['Parties / BuyerParty', 'NIF, razón social y dirección del cliente', 'c, d, e'],
  ['InvoiceHeader', 'Número y serie, tipo de documento y clase', 'a'],
  ['InvoiceIssueData', 'Fecha de expedición, moneda y lengua', 'b'],
  ['TaxesOutputs y TaxesWithheld', 'IVA repercutido y retención, con base y cuota', 'g, h'],
  ['Items', 'Líneas con descripción, cantidad y precio sin impuesto', 'f'],
  ['PaymentDetails', 'Vencimiento, importe y cuenta de abono', '-'],
], 'Estructura del ejemplo en Facturae.', ['l', 'l', 'l'])}
<p>El esquema publicado en ${h.src('facturae', 'facturae.gob.es')} fija el orden y el tipo de cada elemento. Los códigos de impuesto distinguen el IVA de la retención, y la persona física se identifica con nombre y dos apellidos separados, mientras la sociedad usa su razón social. Todo lo que pide el ${h.src('rd1619', 'artículo 6 del Reglamento de facturación')} tiene su campo; comprueba los datos básicos con esta lista:</p>
${h.mini('datos', { p: ['num', 'fecha', 'nifs', 'domicilios'], c: 'Repasar todos los datos obligatorios' })}
<h2>Comparar tu propio Facturae con el ejemplo</h2>
<p>Si un cliente o una Administración te devuelve una factura, suelta tu fichero en el visor de arriba y compáralo con este ejemplo bloque a bloque. Los fallos más frecuentes son un NIF con letra incorrecta, una persona física registrada como sociedad o al revés, una retención que no se ha restado del total y una suma de líneas que no coincide con la base por un redondeo. El visor señala las sumas que no cuadran y avisa si el fichero no lleva firma, que es lo primero que comprobaría FACe.</p>
<h2>Qué le faltaría para ir a la Administración</h2>
<p>Este ejemplo va dirigido a una empresa. Si el cliente fuera una Administración, la ${h.src('orden1074', 'Orden HAP/1074/2014')} exigiría añadir en el bloque del comprador los centros administrativos con sus códigos DIR3: oficina contable, órgano gestor y unidad tramitadora. Después habría que firmarla. El ${h.a('facturae', 'creador de Facturae')} añade esos códigos cuando eliges una Administración, y ${h.a('face', 'FACe')} explica la presentación. Para revisar facturas que recibes, usa el ${h.a('visor', 'visor de Facturae')}, y si necesitas el detalle de cada dato, ${h.a('requisitos-factura', 'los requisitos de una factura')}.</p>
`,
  },
  en: {
    slug: 'e-invoice-example-spain',
    nav: 'E-invoice example', card: 'A complete Facturae invoice, field by field, with income tax withholding',
    title: 'E-Invoice Example for Spain 2026: Facturae Field by Field',
    description: 'A Spanish e-invoice example for 2026: a Facturae 3.2.2 invoice from a self-employed designer with VAT and income tax withholding, explained field by field.',
    h1: 'Spanish e-invoice example: a Facturae file explained',
    intro: 'Above is a sample invoice open in the viewer: you can download its XML, print it or drop in your own Facturae file to compare.',
    resume: `This page shows a complete electronic invoice in Facturae ${FE.version} format, with made-up data, produced by the same engine as the site's creator and validated against the official schema. It is issued by a self-employed designer in Madrid to a limited company in Seville: two lines, a catalogue design and layout hours, with VAT at ${L1.iva}% and personal income tax withholding at ${E.retencion}%. The taxable amount is ${T.bruto.toFixed(2)} euros, VAT ${T.iva.toFixed(2)}, withholding ${T.retencion.toFixed(2)} and the total to pay ${T.total.toFixed(2)}. In the XML every detail has its place: the file header with the version and batch, the parties with tax ID, name and address of issuer and recipient, and the invoice with its number and series, date, output and withheld taxes, totals, lines and payment details with the IBAN. It is the same content article 6 of the Invoicing Regulation requires, but in fields software can read without mistakes. To send it to FACe, it would still need the recipient's DIR3 routing codes and an electronic signature.`,
    faqs: [
      { q: 'Can I use this sample invoice as a template?', a: 'Yes. Download the XML from the viewer or, better, open the Facturae creator, which starts from these same details and lets you replace them with yours in a form. That way the file stays valid against the schema. Editing the XML by hand is possible, but a mistake in a tag or a sum makes the file unacceptable.' },
      { q: 'Why does the sample invoice include withholding?', a: 'Because it is common on invoices from self-employed professionals to companies: the customer withholds a percentage on account of the professional’s income tax and pays it to the tax office. In Facturae the withholding sits in its own withheld taxes block and is subtracted from the total. If your activity has no withholding, that block is simply absent and the total is base plus VAT.' },
      { q: 'Is this example a real invoice or an official file?', a: 'Neither. The names, tax ID and account are made up and the invoice was produced by this site, not by a public body. We found no official Facturae examples published under a licence that allows reuse, so we use our own. What is official is the schema we validate it against in our tests.' },
    ],
    body: (h) => `
<h2>The invoice in figures</h2>
${h.table(['Item', 'Quantity', 'Price', 'Amount'], [
  [L1.descripcion, h.n(L1.cantidad), h.eur(L1.precio, 2), h.eur(T.lineas[0].importe, 2)],
  [L2.descripcion, h.n(L2.cantidad), h.eur(L2.precio, 2), h.eur(T.lineas[1].importe, 2)],
  ['Taxable amount', '', '', h.eur(T.bruto, 2)],
  [`VAT ${h.n(L1.iva)}%`, '', '', h.eur(T.iva, 2)],
  [`Income tax withholding ${h.n(E.retencion)}%`, '', '', `-${h.eur(T.retencion, 2)}`],
  ['Total to pay', '', '', h.eur(T.total, 2)],
], `Invoice ${E.serie}-${E.numero}, made-up data. Line descriptions are in Spanish, as on the invoice.`, ['l', 'r', 'r', 'r'])}
<p>The amounts come from the same engine the creator uses: each line is quantity times price, VAT is worked out per line and grouped by rate, and withholding applies to the taxable amount. The total to pay is base plus VAT minus withholding. The viewer above does the reverse: it reads the XML and checks that the line sum, the taxes and the total add up, just as your customer's software would.</p>
<h2>Where each detail sits in the XML</h2>
${h.table(['Block', 'Content', 'Art. 6 detail'], [
  ['FileHeader', `Version ${FE.version}, single invoice mode, issuer role, batch with its total`, '-'],
  ['Parties / SellerParty', 'Tax ID, name and surnames and address of the issuer', 'c, d, e'],
  ['Parties / BuyerParty', 'Tax ID, company name and address of the customer', 'c, d, e'],
  ['InvoiceHeader', 'Number and series, document type and class', 'a'],
  ['InvoiceIssueData', 'Issue date, currency and language', 'b'],
  ['TaxesOutputs and TaxesWithheld', 'Output VAT and withholding, with base and amount', 'g, h'],
  ['Items', 'Lines with description, quantity and price before tax', 'f'],
  ['PaymentDetails', 'Due date, amount and account to credit', '-'],
], 'Structure of the example in Facturae.', ['l', 'l', 'l'])}
<p>The schema published on ${h.src('facturae', 'facturae.gob.es')} fixes the order and type of each element. Tax codes distinguish VAT from withholding, and an individual is identified by first name and two separate surnames, while a company uses its registered name. Everything ${h.src('rd1619', 'article 6 of the Invoicing Regulation')} asks for has its field; check the basic details with this list:</p>
${h.mini('datos', { p: ['num', 'fecha', 'nifs', 'domicilios'], c: 'Review every mandatory detail' })}
<h2>Comparing your own Facturae file with the example</h2>
<p>If a customer or a public body sends an invoice back, drop your file into the viewer above and compare it with this example block by block. The most frequent faults are a tax ID with the wrong check letter, an individual recorded as a company or the other way round, withholding that was not subtracted from the total, and a line sum that does not match the taxable amount because of rounding. The viewer flags sums that do not add up and warns if the file carries no signature, which is the first thing FACe would check. Fix the data in your software or in the creator and generate the file again rather than patching the XML by hand.</p>
<h2>What it would need to go to a public body</h2>
<p>This example is addressed to a business. If the customer were a public body, ${h.src('orden1074', 'Order HAP/1074/2014')} would require the buyer block to list the administrative centres with their DIR3 codes: accounting office, managing body and processing unit. Then it would need signing. The ${h.a('facturae', 'Facturae creator')} adds those codes when you choose a public body, and ${h.a('face', 'FACe')} explains filing. To review invoices you receive, use the ${h.a('visor', 'Facturae viewer')}, and for the detail of each item, ${h.a('requisitos-factura', 'Spanish invoice requirements')}.</p>
`,
  },
});
