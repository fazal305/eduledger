import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-danger-100 px-4 py-2 text-sm font-medium text-danger-600"
    >
      You're offline. Changes won't save until your connection is back.
    </div>
  )
}
