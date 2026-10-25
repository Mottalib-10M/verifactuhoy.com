import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Generador del QR tributario: AEAT, « Características del QR y especificaciones del servicio de cotejo », v. 0.5.0
   (sources.aeatQr); Orden HAC/1177/2024, arts. 20 y 21 (sources.orden1177); RD 1619/2012, art. 6.5 (sources.rd1619). */
const Q = K.P.qr;

export default defineGuide({
  id: 'generador-qr', group: 'herramientas', order: 2,
  tool: 'qrgen',
  related: ['lector', 'huella', 'requisitos', 'modalidades', 'que-es'],
  sources: ['aeatQr', 'orden1177', 'rd1619', 'aeatTecnica'],
  es: {
    slug: 'codigo-qr-verifactu',
    nav: 'Generador del QR Verifactu', card: 'Forma la URL del QR tributario y descárgalo en SVG o PNG para probar un diseño',
    title: 'Código QR Verifactu 2026: generador de la URL y del QR',
    description: 'Código QR Verifactu 2026: escribe NIF, número, fecha e importe y obtén la URL de cotejo y el QR en SVG o PNG con el tamaño y la corrección que pide la AEAT.',
    h1: 'Código QR Verifactu: genera la URL y el QR de una factura',
    intro: 'Escribe los cuatro datos de la factura y elige la modalidad: el generador forma la URL de cotejo, la valida y dibuja el QR listo para probar tu plantilla.',
    resume: `Cada factura expedida con un sistema informático de facturación debe llevar un código QR tributario, según la Orden HAC/1177/2024 y el artículo 6.5 del Reglamento de facturación. Ese código no contiene la factura, sino una URL de la sede de la Agencia Tributaria con cuatro parámetros: NIF del emisor, serie y número, fecha de expedición e importe total. La especificación de la AEAT, versión ${Q.docVersion}, fija el resto: norma ${Q.norma}, nivel de corrección ${Q.correccion}, un tamaño impreso entre ${Q.mmMin} y ${Q.mmMax} milímetros de lado, al menos ${Q.margenMin} milímetros de zona en blanco y el texto «${Q.textoArriba}» encima. Este generador construye la URL con la codificación correcta, avisa si un dato no cumple el formato y dibuja el QR en SVG o PNG para que diseñadores y programadores comprueben una plantilla de factura. Por defecto usa el ejemplo oficial de la AEAT y su entorno de pruebas. Generar el QR no registra nada: en una factura real lo crea el programa de facturación al mismo tiempo que el registro de alta, y solo entonces la sede puede encontrar la factura.`,
    faqs: [
      { q: '¿Puedo pegar este QR en una factura que hago a mano?', a: 'Puedes, pero no sirve de nada. Si facturas a mano no estás obligado a llevar QR, y si facturas con un programa, es el programa quien debe generar el registro y el QR a la vez. Un QR añadido por fuera apunta a una factura que la Agencia Tributaria no tiene, así que tu cliente verá que no consta.' },
      { q: '¿Qué tamaño debe tener el QR en la factura impresa?', a: `Entre ${Q.mmMin} y ${Q.mmMax} milímetros de lado, con una zona en blanco alrededor de al menos ${Q.margenMin} milímetros. Por debajo de ese tamaño muchos móviles no lo leen bien y por encima ocupa espacio sin ganar nada. En el PDF vale lo mismo: el SVG del generador se escala sin perder nitidez, así que ajústalo al tamaño que diga tu plantilla.` },
      { q: '¿Por qué el importe va con punto y no con coma?', a: 'Porque la especificación de la AEAT lo pide así: hasta doce cifras enteras y dos decimales, separados por un punto y sin separador de miles. Es el formato de los datos, no el de la factura impresa, donde puedes seguir escribiendo el importe con coma. El generador cambia la coma por un punto si la escribes por costumbre.' },
      { q: '¿Qué cambia en el QR si mi sistema no es VERI*FACTU?', a: 'Cambia la dirección a la que apunta: termina en ValidarQRNoVerifactu en lugar de ValidarQR. Los cuatro parámetros son los mismos. Además, la factura no lleva la frase de factura verificable ni la palabra VERI*FACTU bajo el código, porque los registros no se envían a la Agencia Tributaria en el momento de expedir.' },
    ],
    body: (h) => `
<h2>Cómo se forma la URL del QR</h2>
<p>La URL tiene dos partes. La primera es fija y depende del sistema y del entorno: en producción, <code>${Q.verifactu}</code> para VERI*FACTU y <code>${Q.noVerifactu}</code> para el resto. La segunda lleva los cuatro parámetros en este orden: <code>nif</code>, <code>numserie</code>, <code>fecha</code> e <code>importe</code>. Cada valor se escribe en UTF-8 y se codifica para URL, de modo que un espacio, una barra o el signo & del número de factura no rompen la dirección. La ${h.src('aeatQr', 'especificación del QR')} da como ejemplo el número 12345678&G33, que dentro del QR queda 12345678%26G33.</p>
${h.table(['Requisito', 'Valor', 'Dónde se fija'], [
  ['Norma del código', Q.norma, 'Orden HAC/1177/2024, art. 21.1'],
  ['Corrección de errores', Q.correccion, 'Orden HAC/1177/2024, art. 21.1'],
  ['Tamaño impreso', `${Q.mmMin} a ${Q.mmMax} mm de lado`, 'Orden HAC/1177/2024, art. 21.1'],
  ['Zona en blanco', `al menos ${Q.margenMin} mm`, 'Especificación AEAT'],
  ['Texto encima', `«${Q.textoArriba}»`, 'Especificación AEAT'],
  ['Leyenda VERI*FACTU', `«${Q.textoAbajoVerifactu}» o «${Q.textoAbajoCorto}»`, 'Orden HAC/1177/2024, art. 20.1.b'],
], `Características del QR tributario, versión ${Q.docVersion} de la especificación.`, ['l', 'l', 'l'])}
<h2>Para qué sirve este generador</h2>
<p>Sirve para tres cosas. Quien diseña una plantilla de factura puede colocar un QR de tamaño real y comprobar que se lee con el móvil antes de mandar la plantilla al programa. Quien programa un sistema de facturación puede comparar la URL que produce su código con la que sale aquí y encontrar errores de codificación, el fallo más frecuente. Y quien recibe facturas puede entender qué datos lleva el código antes de fiarse de él.</p>
<p>Cambia el importe y observa cómo cambia la URL; el resto de datos son los del ejemplo oficial:</p>
${h.mini('qrurl', { p: ['imp', 'mod'], c: 'Abrir el generador completo' })}
<h2>Lo que el generador no hace</h2>
<p>No crea el registro de facturación, no calcula la huella y no envía nada a la Agencia Tributaria. El ${h.src('orden1177', 'artículo 21 de la Orden HAC/1177/2024')} fija el contenido del QR: la URL del servicio de cotejo y cuatro datos de la factura expedida. La sede solo encuentra la factura si el sistema ha generado su registro de alta y, en VERI*FACTU, lo ha enviado. Un QR creado aparte, aunque tenga el formato perfecto, apunta a una factura que la sede no puede encontrar. Por eso el generador usa por defecto el entorno de pruebas: su dirección empieza por <code>prewww2.aeat.es</code> y no se confunde con una factura real. En una factura electrónica estructurada, el artículo 20.2 de la Orden permite sustituir el dibujo del QR por la URL en un campo propio.</p>
<p>Si tienes una factura y quieres comprobar su código, usa el ${h.a('lector', 'lector del QR')}. Si quieres ver el otro elemento técnico de Verifactu, el resumen que encadena los registros, abre el ${h.a('huella', 'calculador de la huella')}. Lo que debe hacer un programa para cumplir está en ${h.a('requisitos', 'requisitos del programa de facturación')}.</p>
`,
  },
  en: {
    slug: 'verifactu-qr-code',
    nav: 'Verifactu QR generator', card: 'Build the tax QR URL and download the code as SVG or PNG to test a layout',
    title: 'Verifactu QR Code 2026: URL and QR Code Generator for Spain',
    description: 'Verifactu QR code 2026: enter tax ID, number, date and amount to get the matching URL and the QR as SVG or PNG, at the size and error level the AEAT requires.',
    h1: 'Verifactu QR code: generate the URL and QR for an invoice',
    intro: 'Enter the four invoice details and choose the mode: the generator builds the matching URL, validates it and draws the QR, ready to test your invoice template.',
    resume: `Every invoice issued with invoicing software in Spain must carry a tax QR code under Order HAC/1177/2024 and article 6.5 of the Invoicing Regulation. The code does not hold the invoice; it holds a Spanish Tax Agency URL with four parameters: issuer tax ID, series and number, issue date and total amount. The AEAT specification, version ${Q.docVersion}, sets the rest: standard ${Q.norma}, error correction level ${Q.correccion}, a printed size between ${Q.mmMin} and ${Q.mmMax} millimetres a side, a quiet zone of at least ${Q.margenMin} millimetres and the words “${Q.textoArriba}” above it. This generator builds the URL with the correct encoding, warns when a value breaks the format and draws the QR as SVG or PNG so that designers and developers can check an invoice template. By default it uses the official AEAT example and its test environment. Generating the QR registers nothing: on a real invoice the invoicing software creates it together with the registration record, and only then can the Tax Agency website find the invoice.`,
    faqs: [
      { q: 'Can I paste this QR onto an invoice I write by hand?', a: 'You can, but it achieves nothing. If you invoice by hand you do not need a QR, and if you invoice with software, the software must create the record and the QR together. A QR added from outside points to an invoice the Tax Agency does not have, so your customer will see that it is not on record.' },
      { q: 'How big should the QR be on a printed invoice?', a: `Between ${Q.mmMin} and ${Q.mmMax} millimetres a side, with a white margin of at least ${Q.margenMin} millimetres around it. Smaller codes are hard for many phones to read, and larger ones take space for no gain. The same applies in a PDF: the generator’s SVG scales without losing sharpness, so set it to the size your template needs.` },
      { q: 'Why does the amount use a dot rather than a comma?', a: 'Because the AEAT specification says so: up to twelve whole digits and two decimals, separated by a dot and with no thousands separator. That is the data format, not the printed invoice, where you can keep writing the amount with a comma. The generator swaps a comma for a dot if you type one out of habit.' },
      { q: 'What changes in the QR if my system is not VERI*FACTU?', a: 'The address it points to: it ends in ValidarQRNoVerifactu instead of ValidarQR. The four parameters stay the same. The invoice also drops the verifiable invoice sentence and the word VERI*FACTU under the code, because the records are not sent to the Tax Agency at the moment of issue.' },
    ],
    body: (h) => `
<h2>How the QR URL is built</h2>
<p>The URL has two parts. The first is fixed and depends on the system and environment: in production, <code>${Q.verifactu}</code> for VERI*FACTU and <code>${Q.noVerifactu}</code> for everything else. The second carries the four parameters in this order: <code>nif</code>, <code>numserie</code>, <code>fecha</code> and <code>importe</code>. Each value is written in UTF-8 and URL-encoded, so a space, a slash or an & sign in the invoice number does not break the address. The ${h.src('aeatQr', 'QR specification')} uses the number 12345678&G33 as its example, which becomes 12345678%26G33 inside the QR.</p>
${h.table(['Requirement', 'Value', 'Where it is set'], [
  ['Code standard', Q.norma, 'Order HAC/1177/2024, art. 21.1'],
  ['Error correction', Q.correccion, 'Order HAC/1177/2024, art. 21.1'],
  ['Printed size', `${Q.mmMin} to ${Q.mmMax} mm a side`, 'Order HAC/1177/2024, art. 21.1'],
  ['Quiet zone', `at least ${Q.margenMin} mm`, 'AEAT specification'],
  ['Words above', `“${Q.textoArriba}”`, 'AEAT specification'],
  ['VERI*FACTU caption', `“${Q.textoAbajoVerifactu}” or “${Q.textoAbajoCorto}”`, 'Order HAC/1177/2024, art. 20.1.b'],
], `Tax QR characteristics, specification version ${Q.docVersion}.`, ['l', 'l', 'l'])}
<h2>What this generator is for</h2>
<p>It serves three purposes. Someone designing an invoice template can place a full-size QR and check that a phone reads it before handing the template to the software. Someone programming an invoicing system can compare the URL their code produces with the one shown here and catch encoding errors, the most common fault. And someone receiving invoices can see what data the code holds before trusting it.</p>
<p>Change the amount and watch the URL change; the other values come from the official example:</p>
${h.mini('qrurl', { p: ['imp', 'mod'], c: 'Open the full generator' })}
<h2>What the generator does not do</h2>
<p>It creates no invoice record, computes no hash and sends nothing to the Tax Agency. ${h.src('orden1177', 'Article 21 of Order HAC/1177/2024')} sets the QR content: the matching service URL and four details of the issued invoice. The website only finds the invoice if the system generated its registration record and, in VERI*FACTU mode, sent it. A QR made separately, however perfect its format, points to an invoice the website cannot find. That is why the generator defaults to the test environment: its address starts with <code>prewww2.aeat.es</code> and cannot be mistaken for a real invoice. In a structured e-invoice, article 20.2 of the Order allows the URL in a field of its own instead of the QR image.</p>
<p>If you have an invoice and want to check its code, use the ${h.a('lector', 'QR reader')}. To see the other technical element of Verifactu, the digest that chains the records, open the ${h.a('huella', 'hash calculator')}. What software must do to comply is on ${h.a('requisitos', 'invoicing software requirements')}.</p>
`,
  },
});
