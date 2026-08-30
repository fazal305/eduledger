import PageHeader from './PageHeader'

export default function PlaceholderPage({ title, description, note }) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="p-6 text-sm text-ink-500">{note}</div>
    </div>
  )
}
