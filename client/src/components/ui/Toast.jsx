import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useToastStore } from '../../store/toastStore'

const TONES = {
  success: 'bg-success-100 text-success-600',
  danger: 'bg-danger-100 text-danger-600',
}

function ToastItem({ id, message, tone }) {
  const removeToast = useToastStore((s) => s.removeToast)

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 3500)
    return () => clearTimeout(timer)
  }, [id, removeToast])

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg animate-[fade-in_0.15s_ease-out] ${TONES[tone] ?? TONES.success}`}
    >
      {message}
      <button
        onClick={() => removeToast(id)}
        aria-label="Dismiss"
        className="text-current opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>,
    document.body,
  )
}
