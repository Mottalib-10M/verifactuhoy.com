import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* Firma: Ley 25/2013, art. 5 (sources.ley25); política de firma Facturae, versión params facturae.politicaFirma
   (sources.facturaeFirma); RD 238/2026, art. 7.3 (sources.rd238); RD 1007/2023, art. 16 y Orden HAC/1177/2024, art. 14
   (registros no VERI*FACTU, params verifactu.firma). Ninguna herramienta del sitio firma. */
const FE = K.P.facturae, VF = K.P.verifactu;

export default defineGuide({
  id: 'firma', group: 'electronica', order: 8,
  tool: 'firma',
  related: ['facturae', 'face', 'descargar', 'modalidades', 'facturae-vs-b2b'],
  sources: ['ley25', 'facturaeFirma', 'rd238', 'orden1177', 'rd1007'],
  es: {
    slug: 'firmar-facturae',
    nav: 'Firmar un Facturae', card: 'Qué firma pide cada factura o registro y cómo firmar un Facturae con tu certificado',
    title: 'Firmar Facturae 2026: certificado, XAdES y política de firma',
    description: 'Firmar un Facturae en 2026: qué firma exige FACe, qué es XAdES, qué certificado vale y cuándo se firman también la factura B2B y los registros Verifactu.',
    h1: 'Firmar un Facturae: certificado, formato XAdES y pasos',
    intro: 'Elige qué vas a firmar: el simulador te dice qué firma exige la norma, si hace falta firmar y quién debe hacerlo, para Facturae, factura B2B o registros de Verifactu.',
    resume: `Una factura a la Administración solo vale si va firmada. El artículo 5 de la Ley 25/2013 exige que las facturas electrónicas remitidas a las Administraciones estén firmadas con firma electrónica avanzada basada en un certificado reconocido, o con un sello electrónico avanzado de la entidad que identifique su razón social y su NIF. En Facturae la firma va dentro del propio XML, en formato XAdES, y sigue la política de firma publicada en facturae.gob.es, hoy en su versión ${FE.politicaFirma}. Lo normal es firmar con el certificado de representante de la sociedad o, si eres autónomo, con tu certificado de persona física, usando una aplicación de firma instalada en tu ordenador. Ninguna web puede firmar por ti sin acceder a tu certificado, y por eso el creador de este sitio entrega el XML sin firmar. La firma no es solo cosa de FACe: las facturas B2B que circulen por plataformas privadas también llevarán firma avanzada, y en Verifactu los programas que no envían los registros a la Agencia Tributaria deben firmar cada registro en formato ${VF.firma}.`,
    faqs: [
      { q: '¿Qué certificado necesito para firmar un Facturae?', a: 'Un certificado electrónico reconocido, también llamado cualificado. Una sociedad suele usar el certificado de representante de persona jurídica; un autónomo, su certificado de persona física o su DNI electrónico. La ley también admite el sello electrónico avanzado, que identifica a la entidad y no a una persona. Comprueba que el certificado no ha caducado antes de firmar, porque FACe comprueba su validez.' },
      { q: '¿Por qué esta web no firma la factura?', a: 'Porque firmar requiere usar la clave privada de tu certificado, y una página web no puede hacerlo de forma segura sin pedirte que la entregues o que instales un componente. Preferimos no tocarla. El creador genera el XML en tu navegador y la firma la haces tú, con tu certificado y una aplicación de firma en tu propio equipo. Así tu certificado nunca sale de él.' },
      { q: '¿Si modifico un Facturae ya firmado tengo que volver a firmarlo?', a: 'Sí. La firma protege el contenido exacto del fichero: cualquier cambio posterior, aunque sea un espacio o una coma, la invalida, y FACe rechazaría la factura. Si te das cuenta de un error antes de presentarla, corrige el XML sin firmar y firma de nuevo. Si ya la has presentado, el camino es una factura rectificativa, no editar el fichero.' },
    ],
    body: (h) => `
<h2>Qué firma pide cada caso</h2>
${h.table(['Qué firmas', 'Firma exigida', 'Norma'], [
  ['Facturae para la Administración', 'Avanzada con certificado reconocido, o sello electrónico avanzado', 'Ley 25/2013, art. 5'],
  ['Factura B2B por plataforma privada', 'Avanzada, del emisor o delegada', 'RD 238/2026, art. 7.3'],
  ['Factura B2B por la solución pública', 'La garantizan los procedimientos de la AEAT', 'RD 238/2026, art. 11.7'],
  ['Registro VERI*FACTU', 'No se firma: se envía a la AEAT', 'RD 1007/2023, art. 16'],
  ['Registro no VERI*FACTU', VF.firma, 'Orden HAC/1177/2024, art. 14'],
], 'Firma según el destino de la factura o del registro.', ['l', 'l', 'l'])}
<p>La ${h.src('ley25', 'Ley 25/2013')} solo pide firma avanzada basada en certificado reconocido, pero Facturae concreta cómo: la firma se incrusta en el XML siguiendo la ${h.src('facturaeFirma', 'política de firma de Facturae')}, versión ${FE.politicaFirma}, que fija los algoritmos y las propiedades que debe llevar. Por eso un PDF firmado no sirve como Facturae: lo que se firma es el fichero estructurado.</p>
<h2>Cómo firmar paso a paso</h2>
<p>Primero, genera el XML sin firmar, con tu programa, con la aplicación oficial o con el ${h.a('facturae', 'creador de Facturae')} de esta web. Segundo, revisa que todos los datos son correctos, porque después de firmar no podrás tocar nada. Tercero, abre el fichero en una aplicación de firma que admita XAdES, como la aplicación de firma que ofrece la propia Administración, elige tu certificado y guarda el resultado, que suele tener la extensión .xsig. Por último, preséntalo en FACe o en el punto de entrada que corresponda, como explica ${h.a('face', 'FACe')}.</p>
<p>La firma de las facturas entre empresas es distinta según el canal. El ${h.src('rd238', 'artículo 7 del Real Decreto 238/2026')} exige firma avanzada a toda factura emitida por una plataforma privada, mientras que en la solución pública de la Agencia Tributaria la integridad la garantizan sus propios procedimientos. Comprueba qué formato y firma tocan en cada destino:</p>
${h.mini('formato', { p: ['dest'], d: { dest: 'plataforma' }, c: 'Comparar formatos y firmas' })}
<h2>La firma en Verifactu</h2>
<p>Verifactu también tiene su firma, pero para los registros, no para la factura. Según el ${h.src('rd1007', 'Real Decreto 1007/2023')}, los sistemas que envían cada registro a la Agencia Tributaria no necesitan firmarlos. Los que guardan los registros, la modalidad no VERI*FACTU, firman cada uno con certificado cualificado en formato ${VF.firma}, según el ${h.src('orden1177', 'artículo 14 de la Orden HAC/1177/2024')}. Las diferencias entre las dos modalidades están en ${h.a('modalidades', 'VERI*FACTU o no VERI*FACTU')}. Si tu programa trabaja en esta segunda modalidad, el certificado que usa para firmar registros puede ser el mismo con el que firmas tus Facturae.</p>
`,
  },
  en: {
    slug: 'sign-facturae',
    nav: 'Sign a Facturae file', card: 'Which signature each invoice or record needs and how to sign Facturae with your certificate',
    title: 'Sign Facturae in 2026: Certificate, XAdES, Signature Policy',
    description: 'Signing a Facturae file in 2026: the signature FACe requires, what XAdES is, which certificate works, and when B2B invoices and Verifactu records get signed.',
    h1: 'Signing a Facturae file: certificate, XAdES format and steps',
    intro: 'Choose what you are signing: the calculator tells you which signature the rules require, whether signing is needed and who signs, for Facturae, B2B invoices or Verifactu records.',
    resume: `An invoice to a Spanish public body only counts if it is signed. Article 5 of Law 25/2013 requires e-invoices sent to public bodies to carry an advanced electronic signature based on a qualified certificate, or an advanced electronic seal of the entity identifying its name and tax ID. In Facturae the signature sits inside the XML file itself, in XAdES format, and follows the signature policy published on facturae.gob.es, currently version ${FE.politicaFirma}. Companies usually sign with a legal representative certificate and the self-employed with their personal certificate, using a signing application installed on their computer. No website can sign for you without accessing your certificate, which is why the creator on this site delivers the XML unsigned. Signing is not only a FACe matter: B2B invoices carried by private platforms will also bear an advanced signature, and under Verifactu, software that does not send records to the Tax Agency must sign each record in ${VF.firma} format.`,
    faqs: [
      { q: 'Which certificate do I need to sign a Facturae file?', a: 'A recognised, also called qualified, electronic certificate. A company usually uses a legal entity representative certificate; a self-employed person, a personal certificate or their electronic national ID card. The law also accepts an advanced electronic seal, which identifies the entity rather than a person. Check that the certificate has not expired before signing, because FACe checks its validity.' },
      { q: 'Why does this site not sign the invoice?', a: 'Because signing means using your certificate’s private key, and a web page cannot do that safely without asking you to hand it over or install a plug-in. We prefer not to touch it. The creator builds the XML in your browser and you sign it yourself, with your certificate and a signing application on your own device, so your certificate never leaves it.' },
      { q: 'If I change a signed Facturae file, must I sign it again?', a: 'Yes. The signature protects the exact content of the file: any later change, even a space or a comma, breaks it, and FACe would reject the invoice. If you spot an error before filing, fix the unsigned XML and sign again. If you have already filed it, the route is a corrective invoice, not editing the file.' },
    ],
    body: (h) => `
<h2>Which signature each case needs</h2>
${h.table(['What you sign', 'Signature required', 'Rule'], [
  ['Facturae for a public body', 'Advanced with qualified certificate, or advanced electronic seal', 'Law 25/2013, art. 5'],
  ['B2B invoice via private platform', 'Advanced, by the issuer or delegated', 'RD 238/2026, art. 7.3'],
  ['B2B invoice via the public solution', 'Ensured by AEAT procedures', 'RD 238/2026, art. 11.7'],
  ['VERI*FACTU record', 'Not signed: sent to the AEAT', 'RD 1007/2023, art. 16'],
  ['Non-VERI*FACTU record', VF.firma, 'Order HAC/1177/2024, art. 14'],
], 'Signature by destination of the invoice or record.', ['l', 'l', 'l'])}
<p>${h.src('ley25', 'Law 25/2013')} only asks for an advanced signature based on a qualified certificate, but Facturae spells out how: the signature is embedded in the XML following the ${h.src('facturaeFirma', 'Facturae signature policy')}, version ${FE.politicaFirma}, which sets the algorithms and properties it must carry. That is why a signed PDF is no substitute for Facturae: what gets signed is the structured file.</p>
<h2>How to sign, step by step</h2>
<p>First, produce the unsigned XML with your software, the official application or the ${h.a('facturae', 'Facturae creator')} on this site. Second, check that every detail is correct, because after signing you cannot change anything. Third, open the file in a signing application that supports XAdES, such as the signing application offered by the Spanish administration, choose your certificate and save the result, which usually has the .xsig extension. Finally, file it in FACe or the relevant entry point, as explained on ${h.a('face', 'FACe')}.</p>
<p>Signing B2B invoices depends on the channel. ${h.src('rd238', 'Article 7 of Royal Decree 238/2026')} requires an advanced signature on every invoice issued through a private platform, while on the Tax Agency public solution integrity is ensured by the Agency's own procedures. Check which format and signature apply to each destination:</p>
${h.mini('formato', { p: ['dest'], d: { dest: 'plataforma' }, c: 'Compare formats and signatures' })}
<h2>Signatures under Verifactu</h2>
<p>Verifactu has a signature too, but for records, not for the invoice. Under ${h.src('rd1007', 'Royal Decree 1007/2023')}, systems that send each record to the Tax Agency do not need to sign them. Systems that keep records instead, the non-VERI*FACTU mode, sign each one with a qualified certificate in ${VF.firma} format, under ${h.src('orden1177', 'article 14 of Order HAC/1177/2024')}. The differences between the two modes are on ${h.a('modalidades', 'VERI*FACTU or non-VERI*FACTU')}. If your software works in this second mode, the certificate it uses to sign records can be the same one you use for your Facturae files, so keep an eye on its expiry date: once it lapses, both the invoices and the records stop being signed correctly.</p>
`,
  },
});
