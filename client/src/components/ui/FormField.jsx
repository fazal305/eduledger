export default function FormField({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink-700">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
    </div>
  )
}

export const inputClass =
  'w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500'
