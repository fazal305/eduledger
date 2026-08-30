import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../../components/PageHeader'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { TableLoading, TableEmpty, TableError } from '../../../components/ui/QueryState'
import Pagination from '../../../components/ui/Pagination'
import { fetchFees, fetchFeeSummary } from '../../../services/feeService'
import { fetchAcademicYears } from '../../../services/referenceService'
import FeeFormModal from './FeeFormModal'
import PaymentFormModal from './PaymentFormModal'

const STATUS_TONE = { paid: 'success', partially_paid: 'warning', pending: 'neutral', overdue: 'danger' }
const STATUS_LABEL = { paid: 'Paid', partially_paid: 'Partially paid', pending: 'Pending', overdue: 'Overdue' }

function money(value) {
  return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function FeesListPage() {
  const [status, setStatus] = useState('')
  const [academicYearId, setAcademicYearId] = useState('')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [payingFee, setPayingFee] = useState(null)
  const queryClient = useQueryClient()

  const { data: academicYears } = useQuery({ queryKey: ['academicYears'], queryFn: fetchAcademicYears })
  const { data: summary } = useQuery({
    queryKey: ['fees', 'summary', academicYearId],
    queryFn: () => fetchFeeSummary(academicYearId || undefined),
  })

  const params = { page, pageSize: 20, status: status || undefined, academicYearId: academicYearId || undefined }
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['fees', params],
    queryFn: () => fetchFees(params),
    placeholderData: (prev) => prev,
  })

  function invalidateAll() {
    queryClient.invalidateQueries({ queryKey: ['fees'] })
  }

  return (
    <div>
      <PageHeader title="Fees & Payments" description="Track fees, payments, and outstanding balances" />

      <div className="grid grid-cols-3 gap-4 px-6 py-4">
        <SummaryCard label="Total billed" value={summary ? money(summary.total_billed) : '—'} />
        <SummaryCard label="Collected" value={summary ? money(summary.total_collected) : '—'} tone="success" />
        <SummaryCard label="Outstanding" value={summary ? money(summary.total_outstanding) : '—'} tone="danger" />
      </div>

      <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="partially_paid">Partially paid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={academicYearId}
          onChange={(e) => {
            setAcademicYearId(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm"
          aria-label="Filter by academic year"
        >
          <option value="">All academic years</option>
          {academicYears?.map((y) => (
            <option key={y.id} value={y.id}>
              {y.name}
            </option>
          ))}
        </select>
        <Button className="ml-auto" onClick={() => setShowCreate(true)}>
          + Add fee
        </Button>
      </div>

      <div className="mx-6 overflow-x-auto rounded-xl border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Fee type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Remaining</th>
              <th className="px-4 py-3">Due date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          {isPending && <TableLoading columns={8} />}
          {isError && <TableError columns={8} message={error?.response?.data?.message} onRetry={refetch} />}
          {!isPending && !isError && data.data.length === 0 && (
            <TableEmpty columns={8} message="No fees match your filters." />
          )}
          {!isPending && !isError && data.data.length > 0 && (
            <tbody>
              {data.data.map((fee) => (
                <tr key={fee.id} className="border-t border-ink-100 hover:bg-ink-50">
                  <td className="px-4 py-3 font-medium text-ink-900">
                    {fee.student_first_name} {fee.student_last_name}
                  </td>
                  <td className="px-4 py-3 text-ink-500">{fee.fee_type_name}</td>
                  <td className="px-4 py-3 text-ink-500">{money(fee.amount)}</td>
                  <td className="px-4 py-3 text-ink-500">{money(fee.paid_amount)}</td>
                  <td className="px-4 py-3 text-ink-500">{money(fee.remaining_amount)}</td>
                  <td className="px-4 py-3 text-ink-500">{fee.due_date}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[fee.status]}>{STATUS_LABEL[fee.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {fee.status !== 'paid' && (
                      <button
                        onClick={() => setPayingFee(fee)}
                        className="text-sm font-medium text-brand-600 hover:underline"
                      >
                        Record payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!isPending && !isError && <Pagination meta={data.meta} onPageChange={setPage} />}
      </div>

      {showCreate && (
        <FeeFormModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false)
            invalidateAll()
          }}
        />
      )}

      {payingFee && (
        <PaymentFormModal
          fee={payingFee}
          onClose={() => setPayingFee(null)}
          onSuccess={() => {
            setPayingFee(null)
            invalidateAll()
          }}
        />
      )}
    </div>
  )
}

function SummaryCard({ label, value, tone }) {
  const toneClass = tone === 'success' ? 'text-success-600' : tone === 'danger' ? 'text-danger-600' : 'text-ink-900'
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      <p className="text-sm text-ink-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  )
}
