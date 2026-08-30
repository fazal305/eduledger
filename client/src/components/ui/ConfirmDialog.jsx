import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel, isLoading }) {
  return (
    <Modal title={title} onClose={onCancel} width="max-w-sm">
      <p className="text-sm text-ink-600">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Working…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
