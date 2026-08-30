export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-2xl font-semibold text-ink-900">Access denied</h1>
      <p className="text-sm text-ink-500">
        Your account doesn't have permission to view this page.
      </p>
    </div>
  )
}
