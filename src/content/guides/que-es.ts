import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Qué es Verifactu: LGT art. 29.2.j (sources.lgt); RD 1007/2023, arts. 1, 3, 7 a 17 y disposición final cuarta
   (sources.rd1007, redacción del RDL 15/2025: sources.rdl15); Orden HAC/1177/2024 (sources.orden1177). */
const VF = K.P.verifactu;

export default defineGuide({
  id: 'que-es', group: 'verifactu', order: 1,
  tool: 'verifactu',
  related: ['modalidades', 'calendario', 'requisitos', 'autonomos', 'lector'],
  sources: ['rd1007', 'rdl15', 'orden1177', 'lgt', 'aeatSif'],
  es: {
    slug: 'que-es-verifactu',
    nav: 'Qué es Verifactu', card: 'El reglamento de los programas de facturación explicado pieza a pieza, con diagnóstico',
    title: 'Verifactu 2026, qué es: el reglamento explicado por partes',
    description: 'Qué es Verifactu en 2026: registro de cada factura, huella encadenada, QR, declaración responsable y envío a la AEAT, explicado con el RD 1007/2023 y un test.',
    h1: 'Qué es Verifactu: el reglamento de los programas de facturación',
    intro: 'Verifactu no es un programa ni una aplicación de Hacienda: es un conjunto de reglas para los programas con los que facturas. El diagnóstico te dice si te alcanzan.',
    resume: `Verifactu es el nombre popular del Reglamento aprobado por el ${VF.rd}, que fija los requisitos de los sistemas informáticos de facturación. Nace de la Ley 11/2021 de prevención del fraude fiscal, que añadió al artículo 29.2.j de la Ley General Tributaria la obligación de que los programas de facturación y contabilidad garanticen la integridad, conservación, accesibilidad, legibilidad, trazabilidad e inalterabilidad de los registros. El reglamento concreta esa idea en cinco piezas. Cada factura genera en el programa un registro de alta, y cada anulación un registro de anulación. Cada registro lleva una huella que lo encadena con el anterior. La factura lleva un código QR que el cliente puede comprobar. El productor del programa firma una declaración responsable de que cumple. Y el usuario elige entre enviar cada registro a la Agencia Tributaria, la modalidad VERI*FACTU que da nombre al conjunto, o guardarlos firmados en su sistema. La Orden HAC/1177/2024 añade las especificaciones técnicas. Tras el Real Decreto-ley 15/2025, los programas deben estar adaptados antes del ${VF.sociedadesAntes.split('-').reverse().join('/')} en las sociedades y antes del ${VF.restoAntes.split('-').reverse().join('/')} en los demás obligados.`,
    faqs: [
      { q: '¿Verifactu es una aplicación que tengo que descargar?', a: 'No. Es un reglamento que se cumple con el programa de facturación que ya usas, una vez que el fabricante lo adapta. La Agencia Tributaria ofrece además una aplicación gratuita de facturación, prevista en el artículo 7.b del reglamento, que cumple por sí misma; es una opción para quien emite pocas facturas, no una obligación.' },
      { q: '¿De dónde viene el nombre Verifactu?', a: 'De la expresión sistemas de emisión de facturas verificables, que el artículo 16 del RD 1007/2023 abrevia como VERI*FACTU. En rigor designa solo a los sistemas que envían todos sus registros a la Agencia Tributaria. En el lenguaje común se usa para todo el reglamento, incluida la modalidad que no envía los registros.' },
      { q: '¿Qué es un registro de facturación de alta?', a: 'Es la ficha que el programa genera automáticamente, a la vez o justo antes de expedir cada factura, según el artículo 9 del reglamento. Contiene los datos de la factura, como emisor, número, fecha, importes e IVA, más datos técnicos: la referencia y parte de la huella del registro anterior, el sistema que la genera y el momento exacto de su creación.' },
    ],
    body: (h) => `
<h2>Las piezas del reglamento</h2>
${h.table(['Pieza', 'Qué es', 'Dónde se regula'], [
  ['Registro de alta', 'Ficha que el programa crea al expedir cada factura', 'RD 1007/2023, arts. 9 y 10'],
  ['Registro de anulación', 'Ficha que anula el alta de una factura emitida por error', 'RD 1007/2023, art. 11'],
  ['Huella', `Resumen ${h.P.huella.algoritmo} que encadena cada registro con el anterior`, 'RD 1007/2023, art. 12; Orden, art. 13'],
  ['Código QR', 'URL de cotejo con NIF, número, fecha e importe', 'Orden HAC/1177/2024, arts. 20 y 21'],
  ['Declaración responsable', 'Documento en el que el productor certifica que el programa cumple', 'RD 1007/2023, art. 13'],
  ['Modalidad VERI*FACTU', 'Envío de todos los registros a la AEAT', 'RD 1007/2023, arts. 15 y 16'],
], 'Elementos del Reglamento de los sistemas informáticos de facturación.', ['l', 'l', 'l'])}
<p>El ${h.src('rd1007', 'RD 1007/2023')} no dice qué programa usar ni cómo debe ser su pantalla. Dice qué debe garantizar: que un registro, una vez generado, no se pueda alterar sin que el sistema lo detecte y avise; que los registros estén encadenados y fechados; y que se conserven y puedan exportarse durante el plazo de prescripción. Cualquier corrección se hace con un registro nuevo, nunca reescribiendo el anterior. La ${h.src('orden1177', 'Orden HAC/1177/2024')} traduce esos principios a formatos, campos y servicios técnicos.</p>
<h2>A quién se aplica</h2>
<p>El artículo 3 incluye a los contribuyentes del Impuesto sobre Sociedades, a los del IRPF que desarrollan actividades económicas, a los no residentes con establecimiento permanente y a las entidades en atribución de rentas, siempre que usen un sistema informático para facturar, aunque solo sea en parte. Quedan fuera quienes llevan el SII, las entidades totalmente exentas y, por el artículo 1.3, quienes tienen el domicilio fiscal en el País Vasco o Navarra. Contesta y lo verás en tu caso:</p>
${h.mini('verifactu', { p: ['tipo', 'terr', 'prog', 'sii'], c: 'Diagnóstico completo' })}
<h2>Lo que Verifactu no cambia</h2>
<p>Verifactu no cambia los datos que debe llevar una factura, ni los tipos de IVA, ni los plazos de declaración. Tampoco obliga a que la factura sea electrónica: puedes seguir entregando papel o PDF, con el QR impreso. La factura electrónica entre empresas es otra obligación, de otra ley y con otras fechas. Lo que cambia es el programa: debe registrar cada factura de forma que no se pueda borrar ni retocar sin dejar rastro, y su productor debe responder de ello con una declaración responsable.</p>
<p>Para entender las dos maneras de cumplir, lee ${h.a('modalidades', 'VERI*FACTU o no VERI*FACTU')}. Las fechas están en el ${h.a('calendario', 'calendario de Verifactu')}, y lo que debes pedir a tu proveedor en ${h.a('requisitos', 'requisitos del programa')}. La ${h.src('aeatSif', 'página de la Agencia Tributaria')} reúne la normativa y los documentos técnicos.</p>
`,
  },
  en: {
    slug: 'what-is-verifactu',
    nav: 'What is Verifactu', card: 'The invoicing software regulation explained piece by piece, with a check',
    title: 'Verifactu Explained 2026: Spain’s Invoicing Software Rules',
    description: 'Verifactu explained for 2026: invoice records, chained hash, QR code, declaration of conformity and sending to the AEAT, set out from RD 1007/2023 with a check.',
    h1: 'What is Verifactu: Spain’s rules for invoicing software',
    intro: 'Verifactu is not a program or a tax office app: it is a set of rules for the software you invoice with. The check tells you whether they reach you.',
    resume: `Verifactu is the popular name for the Regulation approved by Royal Decree 1007/2023, which sets the requirements for invoicing software in Spain. It stems from Law 11/2021 on preventing tax fraud, which added to article 29.2.j of the General Tax Act the duty for invoicing and accounting software to guarantee the integrity, retention, accessibility, legibility, traceability and unalterability of records. The regulation turns that idea into five pieces. Each invoice creates a registration record in the software, and each cancellation a cancellation record. Each record carries a hash that chains it to the previous one. The invoice carries a QR code the customer can check. The software producer signs a declaration of conformity. And the user chooses between sending every record to the Tax Agency, the VERI*FACTU mode that gives the whole scheme its name, or keeping them signed in their own system. Order HAC/1177/2024 adds the technical specifications. After Royal Decree-law 15/2025, software must be adapted before ${VF.sociedadesAntes.split('-').reverse().join('/')} for companies and before ${VF.restoAntes.split('-').reverse().join('/')} for everyone else caught.`,
    faqs: [
      { q: 'Is Verifactu an app I have to download?', a: 'No. It is a regulation you meet through the invoicing software you already use, once the vendor adapts it. The Tax Agency also offers a free invoicing app, provided for in article 7.b of the regulation, which complies by itself; it is an option for people who issue few invoices, not a requirement.' },
      { q: 'Where does the name Verifactu come from?', a: 'From the phrase verifiable invoice issuing systems, which article 16 of RD 1007/2023 shortens to VERI*FACTU. Strictly it refers only to systems that send all their records to the Tax Agency. In everyday use it covers the whole regulation, including the mode that does not send records.' },
      { q: 'What is an invoice registration record?', a: 'It is the entry the software creates automatically, at the same time as or just before issuing each invoice, under article 9 of the regulation. It holds the invoice data, such as issuer, number, date, amounts and VAT, plus technical data: the reference and part of the hash of the previous record, the system that created it and the exact moment it was generated.' },
    ],
    body: (h) => `
<h2>The pieces of the regulation</h2>
${h.table(['Piece', 'What it is', 'Where it is set'], [
  ['Registration record', 'Entry the software creates when issuing each invoice', 'RD 1007/2023, arts. 9 and 10'],
  ['Cancellation record', 'Entry that cancels the registration of an invoice issued in error', 'RD 1007/2023, art. 11'],
  ['Hash', `${h.P.huella.algoritmo} digest chaining each record to the previous one`, 'RD 1007/2023, art. 12; Order, art. 13'],
  ['QR code', 'Matching URL with tax ID, number, date and amount', 'Order HAC/1177/2024, arts. 20 and 21'],
  ['Declaration of conformity', 'Document in which the producer certifies the software complies', 'RD 1007/2023, art. 13'],
  ['VERI*FACTU mode', 'Sending every record to the AEAT', 'RD 1007/2023, arts. 15 and 16'],
], 'Elements of the invoicing software Regulation.', ['l', 'l', 'l'])}
<p>${h.src('rd1007', 'RD 1007/2023')} does not say which software to use or what its screens should look like. It says what the software must guarantee: that a record, once created, cannot be altered without the system detecting it and warning; that records are chained and dated; and that they are kept and can be exported for the limitation period. Any correction is made with a new record, never by rewriting the old one, and the tax office may turn up where the system is used and demand immediate access to the records. ${h.src('orden1177', 'Order HAC/1177/2024')} turns those principles into formats, fields and technical services.</p>
<h2>Who it applies to</h2>
<p>Article 3 covers corporate income taxpayers, personal income taxpayers with business activities, non-residents with a permanent establishment and pass-through entities, as long as they use software to invoice, even only in part. Left out are businesses on the SII, fully exempt entities and, under article 1.3, anyone with a tax domicile in the Basque Country or Navarre. Answer and see your own case:</p>
${h.mini('verifactu', { p: ['tipo', 'terr', 'prog', 'sii'], c: 'Full check' })}
<h2>What Verifactu does not change</h2>
<p>Verifactu does not change the details an invoice must show, the VAT rates or the filing deadlines. Nor does it require invoices to be electronic: you can keep handing out paper or PDF, with the QR printed on it. B2B e-invoicing is a separate duty, under another law and with other dates. What changes is the software: it must record every invoice so that nothing can be deleted or touched up without a trace, and its producer must stand behind that with a declaration of conformity.</p>
<p>To understand the two ways of complying, read ${h.a('modalidades', 'VERI*FACTU or non-VERI*FACTU')}. The dates are on the ${h.a('calendario', 'Verifactu timeline')}, and what to ask your provider is on ${h.a('requisitos', 'software requirements')}. The ${h.src('aeatSif', 'Tax Agency page')} gathers the rules and technical documents.</p>
`,
  },
});
