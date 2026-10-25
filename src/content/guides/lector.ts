import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Lector del QR tributario: AEAT, « Características del QR y especificaciones del servicio de cotejo », v. 0.5.0
   (sources.aeatQr); Orden HAC/1177/2024, arts. 20 y 21 (sources.orden1177). Ejemplo oficial: nif 89890001K. */
const Q = K.P.qr;

export default defineGuide({
  id: 'lector', group: 'herramientas', order: 1,
  tool: 'lector',
  related: ['generador-qr', 'huella', 'que-es', 'modalidades', 'ticketbai'],
  sources: ['aeatQr', 'orden1177', 'rd1007'],
  es: {
    slug: 'lector-qr-verifactu',
    nav: 'Lector del QR Verifactu', card: 'Lee el QR de una factura y ábrelo en la página de cotejo de la AEAT',
    title: 'Lector QR Verifactu 2026: comprueba el QR de una factura',
    description: 'Lector del QR Verifactu 2026: suelta o escanea el QR de una factura, mira NIF, número, fecha e importe y ábrelo en la página oficial de cotejo de la AEAT.',
    h1: 'Lector del QR Verifactu: comprueba el QR de una factura',
    intro: 'Suelta una foto o captura del QR, escanéalo con la cámara o pega la URL: el lector muestra los datos de la factura y te lleva a la página oficial de cotejo.',
    resume: `El código QR que llevan las facturas de los programas adaptados a Verifactu contiene una dirección web de la Agencia Tributaria con cuatro datos: el NIF del emisor, la serie y el número de la factura, la fecha de expedición en formato día, mes y año, y el importe total con punto decimal. La especificación oficial de la AEAT, versión ${Q.docVersion}, fija dos direcciones según la modalidad: una para las facturas VERI*FACTU, cuyo registro ya se ha enviado, y otra para las no VERI*FACTU. Al abrir esa dirección, la sede electrónica responde si la factura consta en sus registros. Este lector decodifica el QR en tu navegador, separa los cuatro datos, comprueba su formato y la letra del DNI o NIE, avisa si la URL apunta al entorno de pruebas y te da el enlace a la página oficial. Un QR con formato correcto no prueba nada por sí solo: la única respuesta que vale es la de la sede de la AEAT. Las facturas del País Vasco llevan otro QR, el de TicketBAI, que se comprueba en la Hacienda foral correspondiente.`,
    faqs: [
      { q: '¿Se envía la foto del QR a algún servidor?', a: 'No. La imagen se lee dentro de tu navegador, con el lector de códigos del propio navegador cuando existe y, si no, con una librería de código abierto que se descarga con la página. Solo cuando pulsas el enlace de cotejo se abre la página de la Agencia Tributaria con los cuatro datos del QR, igual que si lo escanearas con el móvil.' },
      { q: 'La AEAT dice que la factura no consta: ¿es falsa?', a: 'No necesariamente. En la modalidad no VERI*FACTU el programa no envía los registros, así que la sede no puede encontrarlos y solo muestra los datos. En VERI*FACTU el envío puede retrasarse por el control de flujo del sistema. Si la factura es VERI*FACTU y días después sigue sin constar, pide explicaciones al emisor antes de deducir el IVA.' },
      { q: '¿Por qué el número de la factura aparece con %26 en la URL?', a: 'Porque la especificación obliga a codificar cada dato para que la dirección web sea válida. Algunos caracteres tienen un significado propio en una URL; el símbolo &, por ejemplo, separa los parámetros. Por eso un número como 12345678&G33 se escribe 12345678%26G33 dentro del QR. El lector deshace esa codificación y te muestra el número tal como está en la factura.' },
      { q: '¿Qué hago si el lector no encuentra el QR en la imagen?', a: 'Recorta la imagen para que el código ocupe casi todo el encuadre, con un poco de margen blanco alrededor, y evita reflejos y fotos movidas. Una captura de pantalla del PDF suele funcionar mejor que una foto del papel. Si aun así falla, abre el QR con la cámara del móvil, copia la dirección y pégala en el campo de la URL.' },
    ],
    body: (h) => `
<h2>Qué datos lleva el QR tributario</h2>
${h.table(['Parámetro', 'Contenido', 'Formato'], [
  ['nif', 'NIF del emisor de la factura', '9 caracteres'],
  ['numserie', 'Serie y número de la factura', `hasta ${Q.numserieMax} caracteres imprimibles`],
  ['fecha', 'Fecha de expedición', 'DD-MM-AAAA'],
  ['importe', 'Importe total de la factura', `hasta ${Q.importeEnterosMax} enteros y 2 decimales, con punto`],
], `Parámetros de la URL según la especificación de la AEAT, versión ${Q.docVersion}.`, ['l', 'l', 'l'])}
<p>La ${h.src('aeatQr', 'especificación del QR de la Agencia Tributaria')} define el código con detalle: norma ${Q.norma}, nivel de corrección de errores ${Q.correccion}, tamaño impreso entre ${Q.mmMin} y ${Q.mmMax} milímetros de lado y un margen blanco de al menos ${Q.margenMin} milímetros. Encima del código va el texto «${Q.textoArriba}». En las facturas VERI*FACTU aparece además la frase «${Q.textoAbajoVerifactu}» o, en formato corto, «${Q.textoAbajoCorto}». La ${h.src('orden1177', 'Orden HAC/1177/2024')} obliga a incluir el QR en todas las facturas expedidas con un sistema informático, también en los tiques.</p>
<h2>Dos direcciones, dos modalidades</h2>
<p>La parte inicial de la URL dice qué tipo de sistema expidió la factura. Si termina en <code>ValidarQR</code>, la factura es VERI*FACTU y su registro debería estar ya en la Agencia Tributaria. Si termina en <code>ValidarQRNoVerifactu</code>, el programa guarda los registros firmados y la sede solo puede comprobar que los datos tienen sentido. Cuando la dirección empieza por <code>prewww2.aeat.es</code>, el QR apunta al entorno de pruebas de la AEAT: sirve a los programadores y nunca debe aparecer en una factura real.</p>
<p>Prueba cómo cambia la URL al modificar el importe del ejemplo oficial o la modalidad:</p>
${h.mini('qrurl', { p: ['imp', 'mod'], c: 'Generar un QR completo' })}
<h2>Lo que comprueba el lector y lo que no</h2>
<p>El lector comprueba el formato de los cuatro datos, que la fecha exista, que el importe tenga como mucho dos decimales y, en los DNI y NIE, que la letra cuadre con el número. También avisa si la URL no empieza por https o lleva parámetros que no deben ir en un QR impreso. No puede saber si la factura está registrada ni si el emisor existe: eso solo lo dice la sede de la AEAT al abrir el enlace.</p>
<p>Si quieres ver cómo se construye el QR desde dentro, el ${h.a('generador-qr', 'generador del QR')} hace el camino inverso y el ${h.a('huella', 'calculador de la huella')} muestra el resumen que encadena cada registro. Las diferencias entre los dos sistemas se explican en ${h.a('modalidades', 'VERI*FACTU o no VERI*FACTU')}, y los QR del País Vasco en ${h.a('ticketbai', 'TicketBAI')}.</p>
`,
  },
  en: {
    slug: 'verifactu-qr-reader',
    nav: 'Verifactu QR reader', card: 'Read the QR on an invoice and open it on the AEAT matching page',
    title: 'Verifactu QR Reader 2026: Check the QR Code on an Invoice',
    description: 'Verifactu QR reader 2026: drop a photo or scan the QR on a Spanish invoice, see tax ID, number, date and amount, then open the official AEAT matching page.',
    h1: 'Verifactu QR reader: check the QR code on a Spanish invoice',
    intro: 'Drop a photo or screenshot of the QR, scan it with the camera or paste the URL: the reader shows the invoice details and takes you to the official matching page.',
    resume: `The QR code on invoices from Verifactu-compliant software contains a Spanish Tax Agency web address with four details: the issuer tax ID, the invoice series and number, the issue date as day, month and year, and the total amount with a decimal point. The official AEAT specification, version ${Q.docVersion}, sets two addresses depending on the mode: one for VERI*FACTU invoices, whose record has already been sent, and one for non-VERI*FACTU invoices. When you open that address, the Tax Agency website answers whether the invoice is on its records. This reader decodes the QR in your browser, splits out the four details, checks their format and the DNI or NIE check letter, warns if the URL points to the test environment and gives you the link to the official page. A correctly formatted QR proves nothing by itself: the only answer that counts is the one from the AEAT website. Invoices from the Basque Country carry a different QR, the TicketBAI one, which is checked with the relevant provincial treasury.`,
    faqs: [
      { q: 'Is the QR photo sent to a server?', a: 'No. The image is read inside your browser, with the browser’s own barcode reader where available and otherwise with an open source library downloaded with the page. Only when you click the matching link does the Tax Agency page open with the four QR details, just as if you had scanned it with your phone.' },
      { q: 'The AEAT says the invoice is not on record: is it fake?', a: 'Not necessarily. In non-VERI*FACTU mode the software does not send records, so the website cannot find them and only displays the details. In VERI*FACTU mode sending can be delayed by the system’s flow control. If the invoice is VERI*FACTU and still not on record days later, ask the issuer before deducting the VAT.' },
      { q: 'Why does the invoice number show %26 in the URL?', a: 'Because the specification requires each value to be encoded so that the web address is valid. Some characters have their own meaning in a URL; the & sign, for example, separates parameters. That is why a number like 12345678&G33 is written 12345678%26G33 inside the QR. The reader undoes the encoding and shows the number as it appears on the invoice.' },
      { q: 'What if the reader cannot find the QR in my image?', a: 'Crop the image so the code fills almost the whole frame, with a little white margin around it, and avoid glare and blurry shots. A screenshot of the PDF usually works better than a photo of paper. If it still fails, open the QR with your phone camera, copy the address and paste it into the URL field.' },
    ],
    body: (h) => `
<h2>What the tax QR contains</h2>
${h.table(['Parameter', 'Content', 'Format'], [
  ['nif', 'Issuer tax ID', '9 characters'],
  ['numserie', 'Invoice series and number', `up to ${Q.numserieMax} printable characters`],
  ['fecha', 'Issue date', 'DD-MM-YYYY'],
  ['importe', 'Invoice total', `up to ${Q.importeEnterosMax} digits and 2 decimals, with a dot`],
], `URL parameters under the AEAT specification, version ${Q.docVersion}.`, ['l', 'l', 'l'])}
<p>The ${h.src('aeatQr', 'Tax Agency QR specification')} defines the code in detail: standard ${Q.norma}, error correction level ${Q.correccion}, printed size between ${Q.mmMin} and ${Q.mmMax} millimetres a side and a white margin of at least ${Q.margenMin} millimetres. The words “${Q.textoArriba}” sit above the code. VERI*FACTU invoices also carry the sentence “${Q.textoAbajoVerifactu}” or, in short form, “${Q.textoAbajoCorto}”. ${h.src('orden1177', 'Order HAC/1177/2024')} requires the QR on every invoice issued with software, receipts included.</p>
<h2>Two addresses, two modes</h2>
<p>The first part of the URL says what kind of system issued the invoice. If it ends in <code>ValidarQR</code>, the invoice is VERI*FACTU and its record should already be with the Tax Agency. If it ends in <code>ValidarQRNoVerifactu</code>, the software keeps signed records and the website can only check that the details make sense. When the address starts with <code>prewww2.aeat.es</code>, the QR points to the AEAT test environment: it is for developers and must never appear on a real invoice.</p>
<p>See how the URL changes when you alter the amount of the official example or the mode:</p>
${h.mini('qrurl', { p: ['imp', 'mod'], c: 'Generate a full QR code' })}
<h2>What the reader checks and what it does not</h2>
<p>The reader checks the format of the four details, that the date exists, that the amount has at most two decimals and, for DNI and NIE numbers, that the letter matches the digits. It also warns if the URL does not start with https or carries parameters that do not belong in a printed QR. It cannot know whether the invoice is registered or whether the issuer exists: only the AEAT website says so when you open the link.</p>
<p>To see how the QR is built from the inside, the ${h.a('generador-qr', 'QR generator')} works the other way round and the ${h.a('huella', 'hash calculator')} shows the digest that chains each record. The differences between the two systems are explained in ${h.a('modalidades', 'VERI*FACTU or non-VERI*FACTU')}, and Basque QR codes in ${h.a('ticketbai', 'TicketBAI')}.</p>
`,
  },
});
