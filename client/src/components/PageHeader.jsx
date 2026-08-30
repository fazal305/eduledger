export default function PageHeader({ title, description }) {
  return (
    <div className="border-b border-ink-100 bg-white px-6 py-5">
      <h1 className="text-lg font-semibold text-ink-900">{title}</h1>
      {description && <p className="mt-0.5 text-sm text-ink-500">{description}</p>}
    </div>
  )
}
