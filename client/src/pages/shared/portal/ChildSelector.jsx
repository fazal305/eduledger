export default function ChildSelector({ children, selectedId, onChange }) {
  if (!children || children.length <= 1) return null

  return (
    <div className="mb-4">
      <select
        value={selectedId ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-portal-100 bg-white px-3 py-2 text-sm"
        aria-label="Select child"
      >
        {children.map((c) => (
          <option key={c.id} value={c.id}>
            {c.first_name} {c.last_name}
          </option>
        ))}
      </select>
    </div>
  )
}
