import Button from './Button'

export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-ink-100 px-4 py-3">
      <p className="text-xs text-ink-500">
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
