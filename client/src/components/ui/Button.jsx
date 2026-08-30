const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60',
  secondary: 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50 disabled:opacity-60',
  danger: 'bg-white text-danger-600 border border-danger-100 hover:bg-danger-100 disabled:opacity-60',
  ghost: 'text-ink-600 hover:bg-ink-50 disabled:opacity-60',
}

export default function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}
