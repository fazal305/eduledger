import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginSchema } from '../../schemas/auth'
import { login } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'

const HOME_BY_ROLE = {
  admin: '/admin',
  staff: '/staff',
  teacher: '/teacher',
  parent: '/parent',
  student: '/student',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values) {
    setServerError('')
    try {
      const user = await login(values.email, values.password)
      setUser(user)
      navigate(HOME_BY_ROLE[user.role] ?? '/', { replace: true })
    } catch (err) {
      setServerError(
        err.response?.data?.message ?? 'Unable to sign in. Check your credentials and try again.',
      )
    }
  }

  return (
    <div data-theme="portal" className="flex min-h-screen items-center justify-center bg-portal-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-portal-100 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-ink-900">Sign in to EduLedger</h1>
        <p className="mt-1 text-sm text-ink-500">
          [DEMO] Greenwood Academy — demo environment
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              aria-invalid={!!errors.email}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-portal-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              aria-invalid={!!errors.password}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-portal-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-danger-600">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="rounded-lg bg-danger-100 px-3 py-2 text-sm text-danger-600">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-portal-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-portal-500 disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
