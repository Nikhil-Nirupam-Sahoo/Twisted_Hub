import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PageLoader from '../components/PageLoader'
import { DEMO_ADMIN, friendlyAuthError } from '../lib/auth'
import { isDemoMode } from '../lib/firebase'

export default function LoginPage() {
  const { user, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate(from, { replace: true })
  }, [loading, user, from, navigate])

  if (loading) return <PageLoader label="Checking your session…" />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Enter both your email and password.')
      return
    }

    setSubmitting(true)
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (authError) {
      setError(friendlyAuthError(authError))
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail(DEMO_ADMIN.email)
    setPassword(DEMO_ADMIN.password)
    setError('')
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="absolute -top-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to issue board
        </Link>

        <div className="card p-7 sm:p-8">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-white shadow-[0_0_30px_-6px_rgba(217,70,239,0.9)]">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>

          <p className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.28em] text-fuchsia-300 uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Admin access
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white">
            Admin sign in
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Manage issue statuses on the public board. Student reports stay anonymous.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="field-label">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@campus.edu"
                  autoComplete="email"
                  className="field pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="field-label">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="field pr-11 pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-200"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn btn-primary w-full py-3">
              {submitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {isDemoMode && (
            <div className="mt-6 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4">
              <p className="text-xs font-semibold tracking-wide text-amber-300 uppercase">
                Demo credentials
              </p>
              <dl className="mt-2 space-y-1 text-sm text-amber-100">
                <div className="flex justify-between gap-3">
                  <dt className="text-amber-300/80">Email</dt>
                  <dd className="font-mono text-[13px]">{DEMO_ADMIN.email}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-amber-300/80">Password</dt>
                  <dd className="font-mono text-[13px]">{DEMO_ADMIN.password}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="mt-3 text-xs font-semibold text-amber-300 underline decoration-amber-400/40 underline-offset-2 hover:text-amber-200"
              >
                Fill demo credentials
              </button>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Admin accounts are created in the Firebase console. Not an admin?{' '}
          <Link to="/" className="font-medium text-cyan-300 hover:text-cyan-200">
            Return to the board
          </Link>
        </p>
      </div>
    </div>
  )
}
