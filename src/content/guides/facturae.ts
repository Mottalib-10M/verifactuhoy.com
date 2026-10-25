import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Creador Facturae para la Administración: Ley 25/2013, arts. 3 a 6 (sources.ley25); Orden HAP/1074/2014, art. 5 y
   anexo (códigos DIR3, 8 MB; sources.orden1074); formato Facturae 3.2.2 (sources.facturae). XML generado validado
   con el XSD oficial (tests y scripts/valida-facturae.sh). */
const F = K.P.facturae, FA = K.P.factura;

export default defineGuide({
  id: 'facturae', group: 'herramientas', order: 4,
  tool: 'creador', toolArg: { preset: 'admin' },
  related: ['face', 'firma', 'descargar', 'visor', 'gratis'],
  sources: ['ley25', 'orden1074', 'facturae', 'facturaeFirma', 'face'],
  es: {
    slug: 'facturae',
    nav: 'Crear un Facturae gratis', card: 'Genera el XML Facturae 3.2.2 con los códigos DIR3 para facturar a la Administración',
    title: 'Facturae 2026: crear y descargar el XML 3.2.2 gratis online',
    description: 'Facturae 2026 gratis: rellena el formulario y descarga el XML 3.2.2 con los códigos DIR3 que pide FACe, comprobado contra el esquema oficial y sin cuenta.',
    h1: 'Facturae: crea y descarga tu factura XML 3.2.2 gratis',
    intro: 'Rellena tus datos, los del organismo y los conceptos: el creador calcula base, IVA y retención, y te deja descargar el Facturae listo para firmar y presentar en FACe.',
    resume: `Facturae es el formato XML de factura electrónica que exige la Administración española. Desde el ${K.P.factura.faceDesde.split('-').reverse().join('/')}, la Ley 25/2013 obliga a las sociedades anónimas y limitadas, a las entidades extranjeras, a los establecimientos permanentes, a las uniones temporales de empresas y a varias agrupaciones y fondos a facturar a las Administraciones en formato electrónico, firmado y presentado por el punto general de entrada que corresponda, que en la Administración General del Estado es FACe. Cada Administración puede excluir las facturas de hasta ${FA.faceExclusion} euros. La versión vigente del formato es la ${F.version}. Este creador genera un Facturae ${F.version} en tu navegador: añade los tres códigos DIR3 que exige la Orden HAP/1074/2014 (oficina contable, órgano gestor y unidad tramitadora), calcula importes por línea, IVA por tipo y retención de IRPF, y bloquea la descarga mientras falte un dato. El XML que produce se ha comprobado contra el esquema oficial. No lo firma: la firma electrónica avanzada la añades después con tu certificado en una aplicación de firma, porque ninguna página web debería tocar tu certificado.`,
    faqs: [
      { q: '¿Dónde encuentro los códigos DIR3 del organismo?', a: 'Te los da el organismo, normalmente en el pedido, en el contrato o en las instrucciones de facturación que entrega al adjudicatario; si no aparecen, pídeselos antes de facturar. Son códigos del directorio común DIR3 y son tres distintos: la oficina contable que registra la factura, el órgano gestor que la aprueba y la unidad tramitadora que la gestiona. A veces los tres coinciden, pero no lo des por hecho.' },
      { q: '¿Puedo presentar en FACe el XML sin firmar que descargo?', a: 'No. El artículo 5 de la Ley 25/2013 exige una firma electrónica avanzada basada en un certificado reconocido, o un sello electrónico avanzado. Sin firma, el punto de entrada rechaza la factura. Descarga el XML, fírmalo con tu certificado en una aplicación de firma que siga la política de Facturae y presenta el fichero firmado.' },
      { q: '¿Un autónomo tiene que usar Facturae con la Administración?', a: 'La Ley 25/2013 no obliga a los autónomos: la lista del artículo 4 empieza por las sociedades anónimas y limitadas. Puedes enviar factura en papel salvo que el contrato o la Administración pidan otra cosa. Si quieres o te lo piden, puedes usar FACe igual que una empresa, con Facturae firmado con tu certificado de persona física.' },
      { q: '¿Qué plazo tengo para presentar la factura a la Administración?', a: `${FA.faceRegistroDias} días desde la entrega efectiva de las mercancías o la prestación del servicio, según el artículo 3 de la Ley 25/2013. La factura se presenta en un registro administrativo, y la factura electrónica en el punto general de entrada. Mientras no se presenta en tiempo y forma, la ley entiende que esa obligación no se ha cumplido, así que conviene no apurar el plazo.` },
    ],
    body: (h) => `
<h2>Quién debe facturar en Facturae a la Administración</h2>
<p>El ${h.src('ley25', 'artículo 4 de la Ley 25/2013')} permite a cualquier proveedor enviar factura electrónica a la Administración y obliga a una lista cerrada de entidades: sociedades anónimas, sociedades de responsabilidad limitada, personas jurídicas y entidades sin nacionalidad española, establecimientos permanentes y sucursales de no residentes, uniones temporales de empresas y agrupaciones de interés económico y fondos. Las Administraciones pueden excluir por reglamento las facturas de hasta ${h.eur(FA.faceExclusion)}. Comprueba tu caso:</p>
${h.mini('face', { p: ['forma', 'imp', 'excl'], c: 'Todo sobre FACe' })}
<h2>Qué lleva un Facturae para la Administración</h2>
${h.table(['Bloque', 'Contenido', 'Base'], [
  ['Cabecera', 'Versión del esquema, emisor de la remesa, número de facturas e importes totales', 'Esquema Facturae'],
  ['Partes', 'Datos fiscales del vendedor y del comprador, con NIF y dirección', 'Esquema Facturae'],
  ['Centros administrativos', 'Códigos DIR3 de oficina contable, órgano gestor y unidad tramitadora', 'Orden HAP/1074/2014, anexo'],
  ['Factura', 'Serie y número, fecha, líneas, impuestos, retenciones y totales', 'Esquema Facturae'],
  ['Firma', 'Firma XAdES con certificado reconocido, o sello electrónico', 'Ley 25/2013, art. 5'],
], `Estructura de un fichero Facturae ${F.version} dirigido a un punto general de entrada.`, ['l', 'l', 'l'])}
<p>Los tres códigos de centro son el dato que más rechazos provoca. La ${h.src('orden1074', 'Orden HAP/1074/2014')} los hace obligatorios para que el punto de entrada sepa a quién remitir la factura, y deben ser los del directorio común DIR3. El fichero completo, con anexos, no puede superar ${h.n(FA.faceTamanoMb)} MB. El creador incluye los tres códigos en cuanto eliges una Administración como destinatario y no te deja descargar mientras falte alguno.</p>
<h2>Del formulario a FACe en tres pasos</h2>
<p>Primero, rellena el formulario y descarga el XML. El creador escribe el fichero según el ${h.src('facturae', 'esquema oficial Facturae')} ${F.version}, con importes redondeados a dos decimales y los impuestos agrupados por tipo. Segundo, firma el XML con tu certificado en una aplicación que aplique la ${h.src('facturaeFirma', 'política de firma de Facturae')}; los caminos posibles se explican en ${h.a('firma', 'cómo firmar un Facturae')}. Tercero, preséntalo en ${h.src('face', 'FACe')} o en el punto de entrada de tu comunidad autónoma o ayuntamiento, y guarda el número de registro que te devuelve.</p>
<p>Este creador no lleva registro de facturas ni encadena huellas, así que no cumple Verifactu por sí solo. Si tu empresa está obligada y usa el creador para una factura, esa factura debe constar también en tu sistema de facturación. Para abrir un Facturae que recibes usa el ${h.a('visor', 'visor')}; si prefieres instalar un programa, mira ${h.a('descargar', 'descargar Facturae')}.</p>
`,
  },
  en: {
    slug: 'facturae-format',
    nav: 'Create a free Facturae', card: 'Build the Facturae 3.2.2 XML with the DIR3 codes needed to invoice Spanish public bodies',
    title: 'Facturae 2026: Create and Download a Free 3.2.2 XML Invoice',
    description: 'Facturae 2026 for free: fill in the form and download the 3.2.2 XML with the DIR3 codes FACe needs, checked against the official schema, with no account.',
    h1: 'Facturae: create and download your 3.2.2 XML invoice for free',
    intro: 'Fill in your details, the public body’s and the line items: the creator works out base, VAT and withholding, and lets you download the Facturae ready to sign and file on FACe.',
    resume: `Facturae is the XML e-invoice format required by Spanish public bodies. Since ${K.P.factura.faceDesde.split('-').reverse().join('/')}, Law 25/2013 has required public and private limited companies, foreign entities, permanent establishments, joint ventures and several groupings and funds to invoice public bodies electronically, signed and filed through the relevant general entry point, which for central government is FACe. Each public body may exempt invoices up to ${FA.faceExclusion} euros. The current format version is ${F.version}. This creator builds a Facturae ${F.version} file in your browser: it adds the three DIR3 codes required by Order HAP/1074/2014 (accounting office, managing body and processing unit), computes line amounts, VAT per rate and personal income tax withholding, and blocks the download while any detail is missing. The XML it produces has been checked against the official schema. It does not sign it: you add the advanced electronic signature afterwards with your certificate in a signing application, because no web page should handle your certificate.`,
    faqs: [
      { q: 'Where do I find the public body’s DIR3 codes?', a: 'The public body gives them to you, usually in the purchase order, the contract or the invoicing instructions it hands to the supplier; if they are missing, ask before invoicing. They are codes from the common DIR3 directory and there are three separate ones: the accounting office that records the invoice, the managing body that approves it and the processing unit that handles it. Sometimes all three match, but do not assume so.' },
      { q: 'Can I file the unsigned XML I download on FACe?', a: 'No. Article 5 of Law 25/2013 requires an advanced electronic signature based on a qualified certificate, or an advanced electronic seal. Without a signature the entry point rejects the invoice. Download the XML, sign it with your certificate in a signing application that follows the Facturae policy, and file the signed file.' },
      { q: 'Must a self-employed person use Facturae with public bodies?', a: 'Law 25/2013 does not oblige the self-employed: the list in article 4 begins with public and private limited companies. You may send a paper invoice unless the contract or the public body asks otherwise. If you want to, or are asked to, you can use FACe just like a company, with a Facturae file signed with your personal certificate.' },
      { q: 'How long do I have to file the invoice with the public body?', a: `${FA.faceRegistroDias} days from the actual delivery of goods or performance of the service, under article 3 of Law 25/2013. The invoice is filed with an administrative registry, and an e-invoice through the general entry point. Until it is filed on time and in the right form, the law treats that duty as unmet, so it is wise not to leave it to the last day.` },
    ],
    body: (h) => `
<h2>Who must invoice public bodies in Facturae</h2>
<p>${h.src('ley25', 'Article 4 of Law 25/2013')} lets any supplier send public bodies an e-invoice and obliges a closed list of entities: public limited companies, private limited companies, legal persons and entities without Spanish nationality, permanent establishments and branches of non-residents, joint ventures, and economic interest groupings and funds. Public bodies may exempt invoices up to ${h.eur(FA.faceExclusion)} by regulation. Check your case:</p>
${h.mini('face', { p: ['forma', 'imp', 'excl'], c: 'All about FACe' })}
<h2>What a Facturae for a public body contains</h2>
${h.table(['Block', 'Content', 'Basis'], [
  ['Header', 'Schema version, batch issuer, number of invoices and totals', 'Facturae schema'],
  ['Parties', 'Tax details of seller and buyer, with tax ID and address', 'Facturae schema'],
  ['Administrative centres', 'DIR3 codes of accounting office, managing body and processing unit', 'Order HAP/1074/2014, annex'],
  ['Invoice', 'Series and number, date, lines, taxes, withholdings and totals', 'Facturae schema'],
  ['Signature', 'XAdES signature with a qualified certificate, or an electronic seal', 'Law 25/2013, art. 5'],
], `Structure of a Facturae ${F.version} file addressed to a general entry point.`, ['l', 'l', 'l'])}
<p>The three centre codes cause more rejections than anything else. ${h.src('orden1074', 'Order HAP/1074/2014')} makes them mandatory so the entry point knows where to forward the invoice, and they must come from the common DIR3 directory. The whole file, attachments included, may not exceed ${h.n(FA.faceTamanoMb)} MB. The creator adds the three codes as soon as you pick a public body as recipient and will not let you download while any of them is missing. It also checks that every line has a description and a quantity above zero, that Spanish tax IDs have a valid format and that Spanish postcodes have five digits.</p>
<h2>From form to FACe in three steps</h2>
<p>First, fill in the form and download the XML. The creator writes the file under the ${h.src('facturae', 'official Facturae schema')} ${F.version}, with amounts rounded to two decimals and taxes grouped by rate. Second, sign the XML with your certificate in an application that applies the ${h.src('facturaeFirma', 'Facturae signature policy')}; the options are explained in ${h.a('firma', 'how to sign a Facturae')}. Third, file it on ${h.src('face', 'FACe')} or the entry point of your region or city council, and keep the registry number it returns.</p>
<p>This creator keeps no invoice register and chains no hashes, so it does not meet Verifactu on its own. If your business is caught and uses the creator for an invoice, that invoice must also be recorded in your invoicing system. To open a Facturae you receive, use the ${h.a('visor', 'viewer')}; if you would rather install software, see ${h.a('descargar', 'Facturae download')}.</p>
`,
  },
});
