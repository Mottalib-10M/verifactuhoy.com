import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Visor de Facturae: formato Facturae 3.2, 3.2.1 y 3.2.2 (sources.facturae); firma según Ley 25/2013, art. 5
   (sources.ley25) y política de firma (sources.facturaeFirma); conservación: RD 1619/2012, art. 8 (sources.rd1619). */
const F = K.P.facturae;

export default defineGuide({
  id: 'visor', group: 'herramientas', order: 6,
  tool: 'visor',
  related: ['facturae', 'firma', 'ejemplo', 'descargar', 'gratis'],
  sources: ['facturae', 'facturaeFirma', 'ley25', 'rd1619', 'facturaeApp'],
  es: {
    slug: 'abrir-facturae-online',
    nav: 'Visor de Facturae', card: 'Abre un fichero Facturae, firmado o no, y léelo como una factura normal',
    title: 'Abrir Facturae online 2026: visor gratis de XML y XSIG',
    description: 'Abrir Facturae online 2026: arrastra un .xml o .xsig y léelo como factura, con emisor, conceptos, IVA y total, sumas comprobadas y aviso si le falta la firma.',
    h1: 'Abrir un Facturae online: visor de facturas XML y XSIG',
    intro: 'Arrastra el fichero que te han enviado: el visor lo muestra como una factura legible, comprueba que las sumas cuadran y te deja imprimirlo o guardarlo en PDF.',
    resume: `Un Facturae es un fichero XML pensado para que lo lea un programa, no una persona. Si lo abres con un editor de texto ves etiquetas y números sin formato; si lo abres con el navegador, como mucho un árbol de datos. Este visor lo convierte en una factura normal: emisor y cliente con sus NIF, serie y número, fecha, conceptos con cantidad y precio, impuestos agrupados por tipo, retenciones, total y forma de pago. Acepta las versiones 3.2, 3.2.1 y ${F.version} del formato, con extensión .xml o .xsig y con firma electrónica o sin ella. Además rehace las cuentas: comprueba que la suma de las líneas da el importe bruto, que cada cuota corresponde a su base y su tipo, y que base más impuestos menos retenciones da el total. Si el fichero no lleva firma, te avisa, porque la Ley 25/2013 la exige en las facturas a la Administración. El visor no valida el certificado de la firma ni sustituye al original: la factura que tienes que conservar es el fichero XML, no la impresión. Todo ocurre en tu navegador y el fichero no sale de tu equipo.`,
    faqs: [
      { q: '¿Qué diferencia hay entre un fichero .xml y uno .xsig?', a: 'Ninguna en el contenido de la factura: los dos son XML con el esquema Facturae. La extensión .xsig se usa por costumbre para los ficheros que ya llevan la firma electrónica dentro, y .xml para los que aún no la tienen. El visor abre los dos y te dice si ha encontrado una firma, aunque no comprueba el certificado.' },
      { q: '¿El visor dice si la firma de la factura es válida?', a: 'No. Detecta si el fichero contiene una firma, pero no comprueba el certificado, su vigencia ni que el contenido no se haya tocado después de firmar. Para eso hace falta una aplicación de validación de firmas que consulte el estado del certificado. Si la factura va a la Administración, el punto de entrada hace esa comprobación al recibirla.' },
      { q: '¿Basta con guardar el PDF que genera el visor?', a: 'No. El PDF es una copia legible, útil para archivarla junto al expediente o enviarla a quien no tiene programa. El documento que vale como factura electrónica es el fichero original, y el Reglamento de facturación exige conservarlo de forma que se garantice su autenticidad, integridad y legibilidad durante todo el plazo. Guarda el XML tal como llegó.' },
    ],
    body: (h) => `
<h2>Qué muestra el visor</h2>
${h.table(['Parte del fichero', 'Qué ves en el visor'], [
  ['FileHeader', 'Versión del esquema, número de facturas del fichero e importe total del lote'],
  ['Parties', 'Vendedor y comprador, con NIF, nombre o razón social y dirección'],
  ['Invoices', 'Serie, número, fecha, conceptos, impuestos, retenciones y total de cada factura'],
  ['AdministrativeCentres', 'Códigos DIR3, si la factura va a una Administración'],
  ['ds:Signature', 'Si existe firma electrónica (sin validar el certificado)'],
], 'Bloques principales del esquema Facturae y su lectura en el visor.', ['l', 'l'])}
<p>El ${h.src('facturae', 'formato Facturae')} agrupa en un fichero una cabecera, las partes y una o varias facturas. Si el fichero trae varias, el visor muestra la primera y te avisa. Los importes se presentan con el formato español, aunque en el XML vayan con punto decimal, y las cuotas de IVA se agrupan por tipo como en una factura en papel.</p>
<h2>Las comprobaciones que hace</h2>
<p>Una factura estructurada puede estar bien formada y aun así tener las cuentas mal. El visor rehace cuatro cálculos y avisa si alguno no cuadra: suma de las líneas frente al importe bruto, suma de los impuestos frente al total de impuestos, cuota de cada tipo frente a su base, y base más impuestos menos retenciones frente al total a pagar. Un descuadre de céntimos suele venir de redondear por línea o por total; uno mayor es motivo para pedir al emisor que la revise antes de pagar.</p>
<p>También mira si hay firma. El ${h.src('ley25', 'artículo 5 de la Ley 25/2013')} exige firma electrónica avanzada, o sello electrónico, en las facturas que se presentan a la Administración. Si vas a presentar el fichero en un punto de entrada, comprueba qué firma necesitas:</p>
${h.mini('firma', { p: ['caso'], c: 'Cómo firmar un Facturae' })}
<h2>Abrir un Facturae sin instalar nada</h2>
<p>La alternativa oficial para leer y crear Facturae es la ${h.src('facturaeApp', 'aplicación de escritorio')} ${F.appVersion} de facturae.gob.es, que hay que instalar. El visor sirve para el caso rápido: un fichero que llega por correo y quieres leer, imprimir o comprobar. No guarda nada y funciona sin conexión una vez cargada la página. Tampoco necesita que la factura venga de un programa concreto: cualquier fichero que siga el esquema Facturae se lee igual, lo haya creado una empresa, una gestoría o la aplicación oficial. Si quieres ver cómo es un fichero por dentro, abre la ${h.a('ejemplo', 'factura electrónica de ejemplo')}; para crear uno, usa el ${h.a('facturae', 'creador de Facturae')}.</p>
`,
  },
  en: {
    slug: 'facturae-viewer',
    nav: 'Facturae viewer', card: 'Open a Facturae file, signed or not, and read it as an ordinary invoice',
    title: 'Facturae Viewer 2026: Open XML and XSIG Invoices Online Free',
    description: 'Facturae viewer 2026: drop a .xml or .xsig file and read it as an invoice with issuer, lines, VAT and total, sums rechecked and a warning if it is unsigned.',
    h1: 'Facturae viewer: open XML and XSIG e-invoices online',
    intro: 'Drop the file you received: the viewer shows it as a readable invoice, checks that the totals add up and lets you print it or save it as a PDF.',
    resume: `A Facturae file is XML meant to be read by software, not by people. Open it in a text editor and you see tags and unformatted numbers; open it in a browser and at best you get a data tree. This viewer turns it into an ordinary invoice: issuer and customer with their tax IDs, series and number, date, line items with quantity and price, taxes grouped by rate, withholdings, total and payment terms. It accepts versions 3.2, 3.2.1 and ${F.version} of the format, with a .xml or .xsig extension and with or without an electronic signature. It also redoes the arithmetic: it checks that the lines add up to the gross amount, that each tax amount matches its base and rate, and that base plus taxes minus withholdings equals the total. If the file carries no signature, it warns you, because Law 25/2013 requires one on invoices to public bodies. The viewer does not validate the signing certificate and does not replace the original: the invoice you must keep is the XML file, not the printout. Everything happens in your browser and the file never leaves your device.`,
    faqs: [
      { q: 'What is the difference between a .xml and a .xsig file?', a: 'None in the invoice content: both are XML using the Facturae schema. The .xsig extension is customarily used for files that already contain the electronic signature, and .xml for those that do not yet. The viewer opens both and tells you whether it found a signature, although it does not check the certificate.' },
      { q: 'Does the viewer tell me whether the signature is valid?', a: 'No. It detects whether the file contains a signature, but it does not check the certificate, its validity or that the content was not touched after signing. That needs a signature validation application that queries the certificate status. If the invoice goes to a public body, the entry point runs that check on receipt.' },
      { q: 'Is it enough to keep the PDF the viewer produces?', a: 'No. The PDF is a readable copy, handy for filing with a case or sending to someone without software. The document that counts as the e-invoice is the original file, and the Invoicing Regulation requires it to be kept in a way that guarantees authenticity, integrity and legibility for the whole retention period. Keep the XML exactly as it arrived.' },
    ],
    body: (h) => `
<h2>What the viewer shows</h2>
${h.table(['Part of the file', 'What you see in the viewer'], [
  ['FileHeader', 'Schema version, number of invoices in the file and batch total'],
  ['Parties', 'Seller and buyer, with tax ID, name and address'],
  ['Invoices', 'Series, number, date, line items, taxes, withholdings and total of each invoice'],
  ['AdministrativeCentres', 'DIR3 codes, if the invoice goes to a public body'],
  ['ds:Signature', 'Whether there is an electronic signature (certificate not validated)'],
], 'Main blocks of the Facturae schema and how the viewer reads them.', ['l', 'l'])}
<p>The ${h.src('facturae', 'Facturae format')} groups a header, the parties and one or more invoices in a single file. If the file holds several, the viewer shows the first and tells you so. Amounts are displayed in Spanish format even though the XML uses a decimal point, and VAT amounts are grouped by rate as on a paper invoice.</p>
<h2>The checks it runs</h2>
<p>A structured invoice can be well formed and still have wrong figures. The viewer redoes four calculations and warns if any of them is off: the sum of the lines against the gross amount, the sum of taxes against the tax total, each rate’s tax against its base, and base plus taxes minus withholdings against the amount due. A difference of a few cents usually comes from rounding per line rather than on the total; anything larger is a reason to ask the issuer to review the invoice before you pay.</p>
<p>It also looks for a signature. ${h.src('ley25', 'Article 5 of Law 25/2013')} requires an advanced electronic signature, or an electronic seal, on invoices filed with public bodies. If you are going to file the file at an entry point, check which signature you need:</p>
${h.mini('firma', { p: ['caso'], c: 'How to sign a Facturae' })}
<h2>Opening a Facturae without installing anything</h2>
<p>The official way to read and create Facturae files is the ${h.src('facturaeApp', 'desktop application')} ${F.appVersion} from facturae.gob.es, which you have to install. The viewer covers the quick case: a file that arrives by email that you want to read, print or check. It stores nothing and works offline once the page has loaded. Nor does it matter which software produced the invoice: any file that follows the Facturae schema reads the same, whether a business, an accounting firm or the official application created it. To see what a file looks like inside, open the ${h.a('ejemplo', 'sample e-invoice')}; to create one, use the ${h.a('facturae', 'Facturae creator')}.</p>
`,
  },
});
