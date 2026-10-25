/**
 * Kit de redacción (CONTRIBUTING-PAGINAS.md): toda cifra escrita en una página viene de aquí, nunca tecleada a mano.
 *   K.P                 parámetros fechados (params-2026.json)
 *   K.verifactu, K.b2b, K.sancion, K.plazoHabil …   reglas puras (engine/reglas.ts)
 *   K.tool(kind, lang, args, valores)  ejecuta un simulador de tool-specs.ts
 */
import P from '../data/params-2026.json';
import * as R from './engine/reglas';
import { runTool } from './tool-specs';
import { LAST_UPDATED } from '../data/site-config';

export const KIT = { P, ...R, tool: runTool, LECTURA: LAST_UPDATED };
export type Kit = typeof KIT;
