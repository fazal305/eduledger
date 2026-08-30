export function TableLoading({ columns }) {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, row) => (
        <tr key={row} className="border-t border-ink-100">
          {Array.from({ length: columns }).map((_, col) => (
            <td key={col} className="px-4 py-3">
              <div className="h-4 animate-pulse rounded bg-ink-100" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export function TableEmpty({ columns, message = 'No records found.' }) {
  return (
    <tbody>
      <tr>
        <td colSpan={columns} className="px-4 py-10 text-center text-sm text-ink-400">
          {message}
        </td>
      </tr>
    </tbody>
  )
}

export function TableError({ columns, message, onRetry }) {
  return (
    <tbody>
      <tr>
        <td colSpan={columns} className="px-4 py-10 text-center text-sm text-danger-600">
          {message ?? 'Something went wrong loading this data.'}
          {onRetry && (
            <button onClick={onRetry} className="ml-2 font-medium underline">
              Retry
            </button>
          )}
        </td>
      </tr>
    </tbody>
  )
}
