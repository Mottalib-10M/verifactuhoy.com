/** Campos de texto de las herramientas de fichero: siempre type=text (nunca textarea ni email, RECETTE §10). */
import type { ReactNode } from 'react';

export function Field({ id, label, value, onChange, bad, mono, mode, wide, placeholder, help }: { id: string; label: string; value: string; onChange: (v: string) => void; bad?: boolean; mono?: boolean; mode?: 'tel' | 'decimal' | 'text' | 'numeric'; wide?: boolean; placeholder?: string; help?: string }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="text" inputMode={mode ?? 'text'} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} autoComplete="off" spellCheck={false} aria-invalid={bad || undefined} aria-describedby={help ? `${id}-help` : undefined}
        className={`h-12 w-full min-w-0 rounded-lg border bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 ${mono ? 'font-mono text-sm' : ''} ${bad ? 'border-red-600' : 'border-navy-300'}`} />
      {help && <p id={`${id}-help`} className="mt-1 text-xs text-navy-500">{help}</p>}
    </div>
  );
}
export function DateField({ id, label, value, onChange, bad }: { id: string; label: string; value: string; onChange: (v: string) => void; bad?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={bad || undefined}
        className={`h-12 w-full min-w-0 rounded-lg border bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none ${bad ? 'border-red-600' : 'border-navy-300'}`} />
    </div>
  );
}
export const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <fieldset className="min-w-0 rounded-lg border border-navy-200 p-3 sm:p-4">
    <legend className="px-1 text-sm font-semibold text-navy-900">{title}</legend>
    <div className="grid gap-3 sm:grid-cols-2">{children}</div>
  </fieldset>
);
