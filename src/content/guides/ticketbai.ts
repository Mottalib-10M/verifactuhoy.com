import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

/* TicketBAI y Navarra: RD 1007/2023 art. 1.3, «sin perjuicio de los regímenes tributarios forales» (sources.rd1007);
   páginas de las Haciendas forales (sources.gipuzkoa, araba, batuz, navarra); RD 238/2026 disposición adicional tercera
   (sources.rd238). Sin fechas forales: cada Diputación fija las suyas y se remiten a su web. */
const VF = K.P.verifactu, B = K.P.b2b;

export default defineGuide({
  id: 'ticketbai', group: 'verifactu', order: 8,
  tool: 'territorio',
  related: ['que-es', 'lector', 'b2b', 'sii', 'autonomos'],
  sources: ['rd1007', 'gipuzkoa', 'araba', 'batuz', 'navarra', 'rd238'],
  es: {
    slug: 'ticketbai',
    nav: 'TicketBAI y Navarra', card: 'País Vasco y Navarra: por qué no se aplica Verifactu y qué rige allí',
    title: 'TicketBAI 2026: qué es, País Vasco, Navarra y Verifactu',
    description: 'TicketBAI 2026: por qué Verifactu no se aplica igual en el País Vasco y Navarra, qué decide tu régimen, cómo se comprueba un QR foral y la factura B2B.',
    h1: 'TicketBAI, Navarra y Verifactu: qué norma te toca',
    intro: 'Elige dónde tienes el domicilio fiscal: la herramienta dice qué sistema de control de la facturación te corresponde y dónde consultar la norma vigente.',
    resume: `El Real Decreto 1007/2023, que regula Verifactu, se aplica en todo el territorio español «sin perjuicio de los regímenes tributarios forales de concierto y convenio económico», como dice su artículo 1.3. Eso significa que en Álava, Bizkaia y Gipuzkoa rige TicketBAI, un sistema propio de control de la facturación regulado por la norma foral de cada Diputación, y que Navarra tiene su propio régimen. Qué norma te corresponde no depende de dónde vendas, sino de a qué Administración tributaria estás sometido según el Concierto Económico con el País Vasco o el Convenio Económico con Navarra, en general por tu domicilio fiscal, con reglas propias para empresas que superan cierto volumen y operan en varios territorios. TicketBAI comparte la idea de Verifactu: cada factura genera un registro encadenado y lleva un código QR con su identificador, que se comprueba en la sede de la Hacienda foral, no en la Agencia Tributaria. La factura electrónica entre empresas, en cambio, nace de una ley estatal, y el Real Decreto 238/2026 prevé acuerdos entre las Haciendas forales y la Agencia Tributaria para la solución pública. Las fechas forales se consultan en cada Hacienda.`,
    faqs: [
      { q: 'Tengo domicilio en Bilbao y vendo en Madrid: ¿TicketBAI o Verifactu?', a: 'En general, la norma que te toca depende de la Administración tributaria a la que estás sometido, no de dónde están tus clientes. Si tu domicilio fiscal está en Bizkaia y tributas allí, aplicas el sistema de la Hacienda Foral de Bizkaia aunque vendas en Madrid. Las empresas que superan cierto volumen y operan en varios territorios tienen reglas propias en el Concierto Económico: consúltalas con tu asesor.' },
      { q: '¿Cómo compruebo el QR de una factura emitida con TicketBAI?', a: 'El QR de TicketBAI lleva un identificador propio y se comprueba en la sede electrónica de la Hacienda foral que corresponde al emisor, no en la de la Agencia Tributaria. Si lo pasas por nuestro lector, lo reconoce como QR de TicketBAI y te indica que el cotejo se hace en la Hacienda foral. Cada Diputación ofrece en su web un servicio de lectura de QR.' },
      { q: '¿Qué régimen se aplica en Navarra?', a: 'El Reglamento estatal se aplica sin perjuicio del Convenio Económico con Navarra, que tiene competencia propia en esta materia. No hemos encontrado en la Hacienda Foral de Navarra, a la fecha de nuestra lectura, una norma con fechas que podamos citar con seguridad. Si tributas en Navarra, consulta directamente su web o a tu asesor antes de cambiar de programa.' },
      { q: '¿Me sirve un programa adaptado a Verifactu si tributo en Gipuzkoa?', a: 'No por el mero hecho de cumplir Verifactu. En Gipuzkoa, como en Álava y Bizkaia, el programa debe cumplir TicketBAI y estar dado de alta conforme a la norma foral, con su propio formato de registro y su propio QR. Algunos programas cumplen los dos sistemas, pero debes comprobar que el tuyo trabaja con TicketBAI para tu Diputación.' },
    ],
    body: (h) => `
<h2>Qué sistema se aplica en cada territorio</h2>
${h.table(['Territorio', 'Sistema', 'Dónde consultar'], [
  ['Álava / Araba', 'TicketBAI, norma foral de Álava', h.src('araba', 'Diputación Foral de Álava')],
  ['Bizkaia', 'TicketBAI dentro de Batuz', h.src('batuz', 'Hacienda Foral de Bizkaia')],
  ['Gipuzkoa', 'TicketBAI, norma foral de Gipuzkoa', h.src('gipuzkoa', 'Diputación Foral de Gipuzkoa')],
  ['Navarra', 'Régimen foral propio', h.src('navarra', 'Hacienda Foral de Navarra')],
  ['Resto de España', `Verifactu, antes del ${h.day(VF.sociedadesAntes)} o del ${h.day(VF.restoAntes)}`, h.src('rd1007', 'RD 1007/2023')],
], 'Sistemas de control de la facturación por territorio, según las fuentes leídas.', ['l', 'l', 'l'])}
<p>El ${h.src('rd1007', 'artículo 1.3 del reglamento')} no excluye a nadie por su nombre: dice que se aplica en todo el territorio sin perjuicio de los regímenes forales. En la práctica, el País Vasco y Navarra regulan sus propios sistemas, y en el País Vasco ese sistema es TicketBAI. Las tres Diputaciones lo comparten en lo esencial, pero cada una tiene su norma, su calendario y su lista de programas. En Bizkaia forma parte de Batuz, un modelo más amplio que incluye también los libros registro.</p>
<h2>Parecidos y diferencias con Verifactu</h2>
<p>Ambos sistemas persiguen lo mismo: que ninguna factura se borre o se altere sin dejar rastro. En los dos, cada factura genera un registro encadenado con el anterior y lleva un código QR que el cliente puede comprobar. La diferencia está en quién recibe y comprueba los datos, en el formato técnico del registro y en las fechas. Por eso un programa preparado solo para Verifactu no basta en el País Vasco, ni uno preparado solo para TicketBAI basta en el territorio común.</p>
<p>Comprueba qué te corresponde según tu forma de tributar y tu territorio:</p>
${h.mini('verifactu', { p: ['terr', 'tipo'], d: { terr: 'paisvasco' }, c: 'Diagnóstico completo de Verifactu' })}
<h2>La factura electrónica B2B también llega a los territorios forales</h2>
<p>La obligación de factura electrónica entre empresas nace de la Ley 18/2022, una ley estatal. El ${h.src('rd238', 'RD 238/2026, en su disposición adicional tercera')}, prevé que la solución pública para quienes tributan con normativa foral se organice mediante acuerdos entre las Haciendas forales y la Agencia Tributaria. Las fechas que calculamos, el ${h.day(B.fechaGrandes)} y el ${h.day(B.fechaResto)}, salen de esa norma estatal; cómo se articula en cada territorio foral dependerá de esos acuerdos.</p>
<p>Si recibes facturas de proveedores vascos, el ${h.a('lector', 'lector del QR')} distingue un QR de TicketBAI de uno de la AEAT. Para el resto del país, empieza por ${h.a('que-es', 'qué es Verifactu')}; si llevas los libros en tiempo real, mira el ${h.a('sii', 'SII')}.</p>
`,
  },
  en: {
    slug: 'ticketbai-basque-country',
    nav: 'TicketBAI and Navarre', card: 'Basque Country and Navarre: why Verifactu does not apply and what does',
    title: 'TicketBAI 2026: Basque Country, Navarre and Verifactu Gap',
    description: 'TicketBAI 2026: why Verifactu works differently in the Basque Country and Navarre, what decides your regime, how foral QR codes are checked and B2B rules.',
    h1: 'TicketBAI, Navarre and Verifactu: which rules apply to you',
    intro: 'Choose where your tax domicile is: the tool tells you which invoicing control system applies and where to check the rules in force.',
    resume: `Royal Decree 1007/2023, which governs Verifactu, applies throughout Spain “without prejudice to the foral tax regimes of the economic agreement and covenant”, as its article 1.3 says. That means Álava, Bizkaia and Gipuzkoa apply TicketBAI, their own invoicing control system regulated by each Provincial Council’s foral rules, and Navarre has its own regime. Which rules apply to you depends not on where you sell but on which tax administration you answer to under the Economic Agreement with the Basque Country or the Economic Covenant with Navarre, generally by your tax domicile, with special rules for businesses above a certain size operating in several territories. TicketBAI shares Verifactu’s idea: each invoice creates a chained record and carries a QR code with its identifier, checked on the provincial treasury website rather than with the Spanish Tax Agency. B2B e-invoicing, on the other hand, comes from a national law, and Royal Decree 238/2026 provides for agreements between the provincial treasuries and the Tax Agency on the public solution. Foral dates are set by each treasury.`,
    faqs: [
      { q: 'My domicile is in Bilbao and I sell in Madrid: TicketBAI or Verifactu?', a: 'In general, the rules that apply depend on the tax administration you answer to, not on where your customers are. If your tax domicile is in Bizkaia and you are taxed there, you use the Bizkaia system even when selling in Madrid. Businesses above a certain size operating in several territories have special rules under the Economic Agreement: check them with your adviser.' },
      { q: 'How do I check the QR on a TicketBAI invoice?', a: 'The TicketBAI QR carries its own identifier and is checked on the website of the issuer’s provincial treasury, not the Spanish Tax Agency. If you run it through our reader, it recognises it as a TicketBAI QR and tells you the check happens with the provincial treasury. Each Provincial Council offers a QR reading service on its website.' },
      { q: 'Which regime applies in Navarre?', a: 'The national regulation applies without prejudice to the Economic Covenant with Navarre, which has its own powers in this area. At the time of our reading we found no rule with dates on the Navarre treasury website that we could cite with confidence. If you are taxed in Navarre, check its website directly or ask your adviser before changing software.' },
      { q: 'Is Verifactu-ready software enough if I am taxed in Gipuzkoa?', a: 'Not just because it meets Verifactu. In Gipuzkoa, as in Álava and Bizkaia, the software must comply with TicketBAI and be registered under the foral rules, with its own record format and its own QR. Some software supports both systems, but check that yours works with TicketBAI for your Provincial Council.' },
    ],
    body: (h) => `
<h2>Which system applies in each territory</h2>
${h.table(['Territory', 'System', 'Where to check'], [
  ['Álava / Araba', 'TicketBAI, Álava foral rules', h.src('araba', 'Álava Provincial Council')],
  ['Bizkaia', 'TicketBAI within Batuz', h.src('batuz', 'Bizkaia Provincial Treasury')],
  ['Gipuzkoa', 'TicketBAI, Gipuzkoa foral rules', h.src('gipuzkoa', 'Gipuzkoa Provincial Council')],
  ['Navarre', 'Own foral regime', h.src('navarra', 'Navarre Provincial Treasury')],
  ['Rest of Spain', `Verifactu, before ${h.day(VF.sociedadesAntes)} or ${h.day(VF.restoAntes)}`, h.src('rd1007', 'RD 1007/2023')],
], 'Invoicing control systems by territory, from the sources read.', ['l', 'l', 'l'])}
<p>${h.src('rd1007', 'Article 1.3 of the regulation')} excludes no one by name: it says it applies throughout Spain without prejudice to the foral regimes. In practice the Basque Country and Navarre regulate their own systems, and in the Basque Country that system is TicketBAI. The three Provincial Councils share its essentials, but each has its own rules, timetable and software list. In Bizkaia it is part of Batuz, a broader model that also covers the VAT books.</p>
<h2>Similarities and differences with Verifactu</h2>
<p>Both systems aim at the same thing: no invoice deleted or altered without a trace. In both, each invoice creates a record chained to the previous one and carries a QR code the customer can check. The difference lies in who receives and checks the data, the technical format of the record and the dates. That is why software built only for Verifactu is not enough in the Basque Country, and software built only for TicketBAI is not enough in the common territory.</p>
<p>Check what applies to you based on how you are taxed and your territory:</p>
${h.mini('verifactu', { p: ['terr', 'tipo'], d: { terr: 'paisvasco' }, c: 'Full Verifactu check' })}
<h2>B2B e-invoicing also reaches the foral territories</h2>
<p>The duty to e-invoice between businesses comes from Law 18/2022, a national law. ${h.src('rd238', 'RD 238/2026, in its third additional provision')}, provides that the public solution for businesses taxed under foral rules will be organised through agreements between the provincial treasuries and the Tax Agency. The dates we calculate, ${h.day(B.fechaGrandes)} and ${h.day(B.fechaResto)}, come from that national rule; how it works in each foral territory will depend on those agreements.</p>
<p>If you receive invoices from Basque suppliers, the ${h.a('lector', 'QR reader')} tells a TicketBAI QR apart from an AEAT one. For the rest of the country, start with ${h.a('que-es', 'what Verifactu is')}; if you keep your VAT books in real time, see the ${h.a('sii', 'SII')}.</p>
`,
  },
});
