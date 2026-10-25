import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Descargar Facturae: página de descarga de facturae.gob.es leída el 25/10/2026 (sources.facturaeApp): aplicación
   « Gestión de facturación electrónica » versión params facturae.appVersion para Linux, MacOS y Windows; esquema XSD
   3.2.2 y anteriores 3.2 y 3.2.1 en sources.facturae. Firma: Ley 25/2013, art. 5. */
const FE = K.P.facturae, F = K.P.factura;

export default defineGuide({
  id: 'descargar', group: 'electronica', order: 6,
  tool: 'descarga',
  related: ['facturae', 'gratis', 'firma', 'visor', 'face'],
  sources: ['facturaeApp', 'facturae', 'facturaeFirma', 'ley25'],
  es: {
    slug: 'descargar-facturae',
    nav: 'Descargar Facturae', card: 'La aplicación oficial de escritorio, el esquema y la alternativa sin instalar nada',
    title: 'Descargar Facturae 2026: aplicación oficial y opción online',
    description: 'Descargar Facturae en 2026: dónde está la aplicación gratuita de escritorio para Windows, MacOS y Linux, el esquema 3.2.2 y cómo crear el XML sin instalar nada.',
    h1: 'Descargar Facturae: aplicación de escritorio o creador en línea',
    intro: 'Dinos cuántas facturas haces a la Administración, si tienes certificado y si puedes instalar programas: te decimos qué camino te conviene para obtener tu Facturae.',
    resume: `Quien busca descargar Facturae suele querer una de tres cosas. La primera es la aplicación gratuita «Gestión de facturación electrónica» que publica el Gobierno en facturae.gob.es, en su versión ${FE.appVersion}, con instaladores para Linux, MacOS y Windows: sirve para crear y gestionar facturas en formato Facturae desde el ordenador. La segunda es el esquema del formato, el fichero XSD de la versión ${FE.version}, que necesitan los programadores para generar o validar facturas; en la misma web siguen disponibles las versiones 3.2 y 3.2.1. La tercera es simplemente una factura lista para enviar a FACe. Para esto último no hace falta instalar nada: el creador de esta web genera en tu navegador un XML Facturae ${FE.version} que hemos validado contra el esquema oficial. En todos los casos falta un paso que ninguna web puede hacer por ti con seguridad: firmar la factura con tu certificado electrónico, como exige la Ley 25/2013 para las facturas a las Administraciones. Sin esa firma, FACe no la admite.`,
    faqs: [
      { q: '¿La aplicación de escritorio de Facturae es gratuita?', a: 'Sí. La aplicación de gestión de facturación electrónica se descarga sin coste desde facturae.gob.es, sin registro previo, y existe para los tres sistemas operativos más comunes. Ocupa unas decenas de megas y se instala como cualquier programa. Antes de instalarla, comprueba en la propia página que estás bajando la última versión publicada y no una copia antigua de otro sitio.' },
      { q: '¿Qué versión de Facturae debo usar en 2026?', a: 'La última publicada en facturae.gob.es es la 3.2.2, que añadió campos como la descripción general de la factura, referencias del receptor y el pago en especie respecto a la 3.2.1. El creador de esta web genera esa versión. Si una Administración o un cliente te pide expresamente otra versión, pregúntale antes de enviar, porque el esquema de cada versión es distinto.' },
      { q: '¿Puedo abrir un Facturae descargado sin instalar la aplicación?', a: 'Sí. Un Facturae es un fichero XML, y el visor de esta web lo muestra como una factura legible en tu navegador, firmado o sin firmar, sin subirlo a ningún servidor. Ves emisor, receptor, líneas, impuestos y totales, y compruebas si las sumas cuadran. Para modificarlo y volver a firmarlo sí necesitas una aplicación de escritorio o tu programa de facturación.' },
    ],
    body: (h) => `
<h2>Qué se puede descargar en facturae.gob.es</h2>
${h.table(['Descarga', 'Para qué sirve', 'Quién la necesita'], [
  [`Aplicación de gestión de facturación electrónica ${FE.appVersion}`, 'Crear y gestionar facturas Facturae en el ordenador', 'Proveedores con pocas facturas a la Administración'],
  [`Esquema XSD Facturae ${FE.version}`, 'Generar o validar ficheros por programa', 'Programadores y fabricantes de programas'],
  [`Política de firma ${FE.politicaFirma}`, 'Reglas de la firma XAdES de la factura', 'Quien firma con herramientas propias'],
], 'Contenido de facturae.gob.es leído el día de la última revisión.', ['l', 'l', 'l'])}
<p>La ${h.src('facturaeApp', 'página de descarga de la aplicación de escritorio')} ofrece tres instaladores de la versión ${FE.appVersion}, uno por sistema operativo. La ${h.src('facturae', 'página de la última versión del formato')} reúne el esquema XSD de la ${FE.version}, la descripción de sus campos y el historial de cambios, junto con los esquemas de las versiones anteriores. La ${h.src('facturaeFirma', 'política de firma')} está publicada en su versión ${FE.politicaFirma}.</p>
<h2>Qué camino te conviene</h2>
<p>Si emites muchas facturas a la Administración, lo razonable es que tu programa de facturación genere y firme el Facturae y lo envíe sin intervención manual. Si emites pocas y puedes instalar programas, la aplicación oficial es una opción completa. Si no puedes o no quieres instalar nada, por ejemplo en un ordenador de empresa sin permisos, el ${h.a('gratis', 'creador de factura electrónica gratis')} produce el XML en el navegador. Ajusta tu caso en el simulador de arriba.</p>
<p>Elijas lo que elijas, la factura a la Administración tiene que ir firmada. La ${h.src('ley25', 'Ley 25/2013, artículo 5')}, exige firma electrónica avanzada basada en certificado reconocido o sello electrónico avanzado. Este es el tipo de firma que pide cada destino:</p>
${h.mini('firma', { p: ['caso'], c: 'Ver cómo firmar' })}
<h2>Después de descargar</h2>
<p>Con el fichero ya firmado, la entrega se hace en el punto general de entrada de la Administración destinataria, FACe para el Estado y para las comunidades y ayuntamientos adheridos. El fichero no puede superar ${h.n(F.faceTamanoMb)} MB con sus anexos. Si quieres revisar un Facturae que te han enviado o el que acabas de crear, el ${h.a('visor', 'visor de Facturae')} lo muestra como factura y recalcula las sumas. Los pasos de la firma se explican en ${h.a('firma', 'firmar un Facturae')} y la entrega en ${h.a('face', 'FACe')}.</p>
<h2>Antes de instalar o de enviar</h2>
<p>Descarga la aplicación solo desde la web oficial y desconfía de copias en otros sitios, que pueden estar desfasadas o modificadas. Si trabajas con un programador, pásale el enlace al esquema oficial en vez de un fichero reenviado por correo: así valida contra la versión correcta. Y antes de presentar una factura, ábrela en un visor para comprobar que el NIF, los códigos de destino y los importes son los que esperas, porque una factura rechazada retrasa el cobro.</p>
`,
  },
  en: {
    slug: 'facturae-download',
    nav: 'Facturae download', card: 'The official desktop app, the schema and the no-install alternative',
    title: 'Facturae Download 2026: Official Desktop App or Online Tool',
    description: 'Facturae download in 2026: where to get the free desktop app for Windows, MacOS and Linux, the 3.2.2 schema, and how to build the XML with no install.',
    h1: 'Facturae download: desktop application or online creator',
    intro: 'Tell us how many invoices you send to public bodies, whether you have a certificate and whether you can install software: we suggest the best way to get your Facturae file.',
    resume: `People looking to download Facturae usually want one of three things. The first is the free “Gestión de facturación electrónica” application published by the Spanish government on facturae.gob.es, version ${FE.appVersion}, with installers for Linux, MacOS and Windows: it creates and manages Facturae invoices on your computer. The second is the format schema, the XSD file for version ${FE.version}, which developers need to generate or validate invoices; the same site still offers versions 3.2 and 3.2.1. The third is simply an invoice ready to send to FACe. For that you need to install nothing: the creator on this site builds a Facturae ${FE.version} XML file in your browser, which we have validated against the official schema. In every case one step remains that no website can safely do for you: signing the invoice with your electronic certificate, as Law 25/2013 requires for invoices to public bodies. Without that signature, FACe will not accept it.`,
    faqs: [
      { q: 'Is the Facturae desktop application free?', a: 'Yes. The e-invoicing management application downloads at no cost from facturae.gob.es, without registration, and exists for the three most common operating systems. It takes a few tens of megabytes and installs like any program. Before installing, check on the page itself that you are getting the latest published version rather than an old copy from another site.' },
      { q: 'Which Facturae version should I use in 2026?', a: 'The latest published on facturae.gob.es is 3.2.2, which added fields such as a general invoice description, receiver references and payment in kind compared with 3.2.1. The creator on this site produces that version. If a public body or customer explicitly asks for another version, check with them before sending, because each version has a different schema.' },
      { q: 'Can I open a downloaded Facturae file without the app?', a: 'Yes. A Facturae file is XML, and the viewer on this site displays it as a readable invoice in your browser, signed or unsigned, without uploading it anywhere. You see issuer, recipient, lines, taxes and totals, and check that the sums add up. To edit and re-sign it you do need a desktop application or your invoicing software.' },
    ],
    body: (h) => `
<h2>What you can download from facturae.gob.es</h2>
${h.table(['Download', 'What it is for', 'Who needs it'], [
  [`E-invoicing management application ${FE.appVersion}`, 'Create and manage Facturae invoices on a computer', 'Suppliers with few invoices to public bodies'],
  [`Facturae ${FE.version} XSD schema`, 'Generate or validate files in software', 'Developers and software producers'],
  [`Signature policy ${FE.politicaFirma}`, 'Rules for the invoice XAdES signature', 'Anyone signing with their own tools'],
], 'Content of facturae.gob.es as read on the latest review date.', ['l', 'l', 'l'])}
<p>The ${h.src('facturaeApp', 'desktop application download page')} offers three installers for version ${FE.appVersion}, one per operating system. The ${h.src('facturae', 'latest format version page')} gathers the ${FE.version} XSD schema, the field descriptions and the change history, along with the schemas of earlier versions. The ${h.src('facturaeFirma', 'signature policy')} is published in version ${FE.politicaFirma}.</p>
<h2>Which route suits you</h2>
<p>If you send many invoices to public bodies, it makes sense for your invoicing software to create and sign the Facturae file and send it without manual steps. If you send few and can install software, the official application is a complete option. If you cannot or would rather not install anything, for instance on a locked-down work computer, the ${h.a('gratis', 'free e-invoice creator')} produces the XML in your browser. Set your case in the calculator above.</p>
<p>Whatever you choose, an invoice to a public body must be signed. ${h.src('ley25', 'Law 25/2013, article 5')}, requires an advanced electronic signature based on a qualified certificate, or an advanced electronic seal. This is the signature each destination asks for:</p>
${h.mini('firma', { p: ['caso'], c: 'See how to sign' })}
<h2>After the download</h2>
<p>Once the file is signed, you deliver it through the recipient administration's general entry point: FACe for central government and for the regions and town halls that have joined it. The file may not exceed ${h.n(F.faceTamanoMb)} MB including attachments. To review a Facturae file someone sent you, or the one you have just made, the ${h.a('visor', 'Facturae viewer')} shows it as an invoice and recalculates the sums. The signing steps are explained in ${h.a('firma', 'signing a Facturae file')} and delivery in ${h.a('face', 'FACe')}.</p>
<h2>Before installing or sending</h2>
<p>Download the application only from the official website and be wary of copies hosted elsewhere, which may be outdated or altered. If you work with a developer, give them the link to the official schema rather than a file forwarded by email, so that they validate against the right version. And before filing an invoice, open it in a viewer to check that the tax ID, the routing codes and the amounts are the ones you expect, because a rejected invoice delays payment. Keep the signed file you sent, unchanged, together with the receipt the entry point returns.</p>
`,
  },
});
