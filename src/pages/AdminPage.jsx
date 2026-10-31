import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowUp,
  ChevronDown,
  CircleCheck,
  CircleDot,
  Clock,
  Inbox,
  LoaderCircle,
  LogOut,
  MapPin,
  RefreshCw,
  Sparkles,
  TriangleAlert,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import EmptyState from '../components/EmptyState'
import { STATUSES, getCategory, getStatus } from '../lib/constants'
import { subscribeToIssues, updateIssueStatus } from '../lib/issues'
import { timeAgo } from '../lib/utils'

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="font-display text-xl font-bold tabular-nums text-white">{value}</p>
      </div>
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className="animate-pulse p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-white/10" />
          <div className="h-3.5 w-3/4 rounded bg-white/10" />
        </div>
        <div className="h-9 w-36 rounded-xl bg-white/10" />
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [optimisticStatuses, setOptimisticStatuses] = useState({})
  const [toast, setToast] = useState('')

  useEffect(() => {
    return subscribeToIssues(
      (data) => {
        setIssues(data)
        setLoading(false)
      },
      () => {
        setError('Could not load issues. Check your Firestore rules and connection.')
        setLoading(false)
      },
    )
  }, [])

  // Drop optimistic values once Firestore catches up (or the issue disappears).
  useEffect(() => {
    setOptimisticStatuses((current) => {
      const entries = Object.entries(current)
      if (entries.length === 0) return current

      let changed = false
      const next = { ...current }
      for (const [issueId, status] of entries) {
        const issue = issues.find((item) => item.id === issueId)
        if (!issue || issue.status === status) {
          delete next[issueId]
          changed = true
        }
      }
      return changed ? next : current
    })
  }, [issues])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  const stats = useMemo(
    () => ({
      total: issues.length,
      open: issues.filter((issue) => issue.status === 'open').length,
      inProgress: issues.filter((issue) => issue.status === 'in_progress').length,
      resolved: issues.filter((issue) => issue.status === 'resolved').length,
    }),
    [issues],
  )

  const sortedIssues = useMemo(
    () => [...issues].sort((a, b) => b.createdAt - a.createdAt),
    [issues],
  )

  const handleStatusChange = async (issue, nextStatus) => {
    const currentStatus = optimisticStatuses[issue.id] ?? issue.status
    if (nextStatus === currentStatus) return

    setOptimisticStatuses((current) => ({ ...current, [issue.id]: nextStatus }))
    setSavingId(issue.id)
    setError('')

    try {
      await updateIssueStatus(issue.id, nextStatus)
      setToast(`Status changed to ${getStatus(nextStatus).label}`)
    } catch (updateError) {
      console.error('[issues] status update failed', updateError)
      setOptimisticStatuses((current) => {
        const next = { ...current }
        delete next[issue.id]
        return next
      })
      setError('That status change could not be saved. Please try again.')
    } finally {
      setSavingId(null)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.28em] text-fuchsia-300 uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Mission control
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Manage campus issues
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Signed in as <span className="font-medium text-cyan-300">{user?.email ?? 'admin'}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/" className="btn btn-secondary">
            <Users className="size-4" aria-hidden="true" />
            Public board
          </Link>
          <button type="button" onClick={handleSignOut} className="btn btn-secondary">
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Inbox}
          label="Total issues"
          value={stats.total}
          tone="bg-white/10 text-slate-200"
        />
        <StatCard
          icon={CircleDot}
          label="Open"
          value={stats.open}
          tone="bg-amber-400/15 text-amber-300"
        />
        <StatCard
          icon={RefreshCw}
          label="In progress"
          value={stats.inProgress}
          tone="bg-cyan-400/15 text-cyan-300"
        />
        <StatCard
          icon={CircleCheck}
          label="Resolved"
          value={stats.resolved}
          tone="bg-emerald-400/15 text-emerald-300"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 backdrop-blur"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p className="flex-1">{error}</p>
          <button
            type="button"
            onClick={() => setError('')}
            aria-label="Dismiss error"
            className="rounded p-0.5 text-rose-300 hover:bg-rose-500/20 hover:text-rose-100"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="card mt-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="font-display text-sm font-semibold text-white">All issues</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Newest first · change a status to publish an update instantly
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
            <Clock className="size-3.5" aria-hidden="true" />
            Live
          </span>
        </div>

        {loading ? (
          <div className="divide-y divide-white/10">
            {Array.from({ length: 4 }).map((_, index) => (
              <RowSkeleton key={index} />
            ))}
          </div>
        ) : sortedIssues.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Inbox}
              title="No issues to manage"
              description="Once students submit reports, they will show up here for you to triage."
              action={
                <Link to="/report" className="btn btn-secondary">
                  Open the report form
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {sortedIssues.map((issue) => {
              const category = getCategory(issue.category)
              const effectiveStatus = optimisticStatuses[issue.id] ?? issue.status
              const statusMeta = getStatus(effectiveStatus)
              const saving = savingId === issue.id

              return (
                <li
                  key={issue.id}
                  className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-white/[0.04] lg:flex-row lg:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 font-medium text-slate-300 ring-1 ring-white/10 ring-inset">
                        <span aria-hidden="true">{category.emoji}</span>
                        {category.label}
                      </span>
                      <span className="inline-flex min-w-0 items-center gap-1">
                        <MapPin className="size-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{issue.location}</span>
                      </span>
                      <span className="text-white/20" aria-hidden="true">
                        •
                      </span>
                      <span className="whitespace-nowrap">{timeAgo(issue.createdAt)}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-200">
                      {issue.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300 tabular-nums ring-1 ring-white/10 ring-inset"
                      title={`${issue.upvotes} upvotes`}
                    >
                      <ArrowUp className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                      {issue.upvotes}
                    </span>

                    <div className="relative">
                      <label htmlFor={`status-${issue.id}`} className="sr-only">
                        Status for {issue.location}
                      </label>
                      <select
                        id={`status-${issue.id}`}
                        value={effectiveStatus}
                        onChange={(event) => handleStatusChange(issue, event.target.value)}
                        disabled={saving}
                        className={`cursor-pointer appearance-none rounded-xl border py-2 pr-9 pl-3 text-sm font-medium shadow-sm outline-none transition focus:ring-4 focus:ring-cyan-400/15 disabled:cursor-wait disabled:opacity-70 ${statusMeta.select}`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      {saving ? (
                        <LoaderCircle
                          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-slate-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <ChevronDown
                          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-60"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 animate-fade-in-up items-center gap-2 rounded-xl border border-white/15 bg-slate-950/90 px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_35px_-8px_rgba(34,211,238,0.6)] backdrop-blur-xl"
        >
          <CircleCheck className="size-4 text-emerald-300" aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  )
}
