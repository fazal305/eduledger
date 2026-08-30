import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-2xl font-semibold text-ink-900">Page not found</h1>
      <p className="text-sm text-ink-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-2 text-sm font-medium text-brand-600 hover:underline">
        Go home
      </Link>
    </div>
  )
}
