import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePortalScope } from '../../../hooks/usePortalScope'
import ChildSelector from './ChildSelector'
import { fetchFees, fetchFee } from '../../../services/feeService'
import Badge from '../../../components/ui/Badge'

const STATUS_TONE = { paid: 'success', partially_paid: 'warning', pending: 'neutral', overdue: 'danger' }
const STATUS_LABEL = { paid: 'Paid', partially_paid: 'Partially paid', pending: 'Pending', overdue: 'Overdue' }
const METHOD_LABEL = { cash: 'Cash', bank_transfer: 'Bank transfer', card: 'Card', other: 'Other' }

function money(value) {
  return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function PortalFeesPage() {
  const { studentId, isParent, children, selectedId, setSelectedId } = usePortalScope()
  const [expandedFeeId, setExpandedFeeId] = useState(null)

  const { data: fees } = useQuery({
    queryKey: ['portal', 'fees', studentId],
    queryFn: () => fetchFees({ studentId }),
    enabled: !!studentId,
  })

  const { data: feeDetail } = useQuery({
    queryKey: ['portal', 'fee-detail', expandedFeeId],
    queryFn: () => fetchFee(expandedFeeId),
    enabled: !!expandedFeeId,
  })

  if (!studentId) return <p className="text-sm text-ink-500">No linked student found.</p>

  return (
    <div>
      {isParent && <ChildSelector children={children} selectedId={selectedId} onChange={setSelectedId} />}

      <h1 className="mb-4 text-xl font-semibold text-ink-900">Fees</h1>

      <div className="space-y-3">
        {(!fees || fees.data.length === 0) && (
          <p className="rounded-2xl border border-portal-100 bg-white p-5 text-sm text-ink-400">
            No fees recorded.
          </p>
        )}
        {fees?.data.map((f) => (
          <div key={f.id} className="rounded-2xl border border-portal-100 bg-white p-5">
            <button
              className="flex w-full items-center justify-between text-left"
              onClick={() => setExpandedFeeId(expandedFeeId === f.id ? null : f.id)}
            >
              <div>
                <p className="font-medium text-ink-800">{f.fee_type_name}</p>
                <p className="text-sm text-ink-500">
                  {money(f.paid_amount)} paid of {money(f.amount)} · due {f.due_date}
                </p>
              </div>
              <Badge tone={STATUS_TONE[f.status]}>{STATUS_LABEL[f.status]}</Badge>
            </button>

            {expandedFeeId === f.id && feeDetail && (
              <div className="mt-4 border-t border-portal-50 pt-4">
                <p className="mb-2 text-sm font-medium text-ink-700">Payment history</p>
                {feeDetail.payments.length === 0 ? (
                  <p className="text-sm text-ink-400">No payments recorded yet.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {feeDetail.payments.map((p) => (
                      <li key={p.id} className="flex justify-between text-ink-600">
                        <span>
                          {p.payment_date} · {METHOD_LABEL[p.method]}
                          {p.reference && <span className="text-ink-400"> ({p.reference})</span>}
                        </span>
                        <span className="font-medium text-ink-800">{money(p.amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
