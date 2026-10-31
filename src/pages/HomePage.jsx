import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  CircleCheck,
  CircleDot,
  Clock,
  Inbox,
  Plus,
  SearchX,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  X,
} from 'lucide-react'
import Filters from '../components/Filters'
import IssueCard from '../components/IssueCard'
import EmptyState from '../components/EmptyState'
import { subscribeToIssues, upvoteIssue } from '../lib/issues'
import { useVotes } from '../hooks/useVotes'

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="group rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_0_40px_-25px_rgba(34,211,238,0.6)] backdrop-blur-xl transition-colors hover:border-cyan-400/30 hover:bg-white/[0.07]">
      <div className="flex items-center gap-2.5">
        <span className={`flex size-8 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="text-xs font-medium text-slate-400">{label}</span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold tabular-nums text-white">{value}</p>
    </div>
  )
}

function IssueCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-slate-950/40 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 rounded-full bg-white/10" />
        <div className="h-6 w-16 rounded-full bg-white/10" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3.5 w-full rounded bg-white/10" />
        <div className="h-3.5 w-11/12 rounded bg-white/10" />
        <div className="h-3.5 w-2/3 rounded bg-white/10" />
      </div>
      <div className="mt-4 h-3 w-1/2 rounded bg-white/10" />
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="h-8 w-24 rounded-full bg-white/10" />
        <div className="h-3 w-14 rounded bg-white/10" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('top')
  const [votingId, setVotingId] = useState(null)
  const votingRef = useRef(false)

  const { hasVoted, markVoted } = useVotes()

  useEffect(() => {
    return subscribeToIssues(
      (data) => {
        setIssues(data)
        setLoading(false)
      },
      () => {
        setLoadError(
          'Could not load issues. Check your connection and Firestore security rules, then refresh.',
        )
        setLoading(false)
      },
    )
  }, [])

  const stats = useMemo(() => {
    return {
      total: issues.length,
      open: issues.filter((issue) => issue.status === 'open').length,
      inProgress: issues.filter((issue) => issue.status === 'in_progress').length,
      resolved: issues.filter((issue) => issue.status === 'resolved').length,
    }
  }, [issues])

  const filteredIssues = useMemo(() => {
    const query = search.trim().toLowerCase()
    let list = issues

    if (category !== 'all') list = list.filter((issue) => issue.category === category)
    if (status !== 'all') list = list.filter((issue) => issue.status === status)
    if (query) {
      list = list.filter(
        (issue) =>
          issue.description.toLowerCase().includes(query) ||
          issue.location.toLowerCase().includes(query),
      )
    }

    return [...list].sort((a, b) => {
      if (sort === 'top') return b.upvotes - a.upvotes || b.createdAt - a.createdAt
      return b.createdAt - a.createdAt
    })
  }, [issues, category, status, search, sort])

  const hasActiveFilters = Boolean(search.trim()) || category !== 'all' || status !== 'all'

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setStatus('all')
    setSort('top')
  }

  const handleUpvote = async (issue) => {
    if (hasVoted(issue.id) || votingRef.current) return

    // Ref guard closes the tiny window between a click and React re-rendering
    // the disabled button, so a fast double-click cannot send two increments.
    votingRef.current = true
    setVotingId(issue.id)
    setActionError('')

    try {
      await upvoteIssue(issue.id)
      markVoted(issue.id)
    } catch (error) {
      console.error('[issues] upvote failed', error)
      setActionError('Your upvote could not be saved. Please try again in a moment.')
    } finally {
      votingRef.current = false
      setVotingId(null)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 shadow-[0_0_30px_-12px_rgba(34,211,238,0.9)] backdrop-blur">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              100% anonymous · No login required
            </span>

            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Speak up.{' '}
              <span className="neon-glow bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                Get it fixed.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Report campus problems without revealing who you are. Upvote the issues that matter
              most and watch them move from{' '}
              <span className="font-semibold text-amber-300">open</span> to{' '}
              <span className="font-semibold text-emerald-300">resolved</span>.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/report" className="btn btn-primary px-5 py-3 text-base">
                <Plus className="size-4" strokeWidth={2.5} aria-hidden="true" />
                Report an issue
              </Link>
              <a href="#issues" className="btn btn-secondary px-5 py-3 text-base">
                Browse issues
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={Inbox}
              label="Total issues"
              value={loading ? '—' : stats.total}
              tone="bg-white/10 text-slate-300"
            />
            <StatCard
              icon={CircleDot}
              label="Open"
              value={loading ? '—' : stats.open}
              tone="bg-amber-400/15 text-amber-300"
            />
            <StatCard
              icon={Clock}
              label="In progress"
              value={loading ? '—' : stats.inProgress}
              tone="bg-cyan-400/15 text-cyan-300"
            />
            <StatCard
              icon={CircleCheck}
              label="Resolved"
              value={loading ? '—' : stats.resolved}
              tone="bg-emerald-400/15 text-emerald-300"
            />
          </div>
        </div>
      </section>

      <section
        id="issues"
        className="mx-auto max-w-6xl scroll-mt-28 px-4 py-10 sm:px-6 sm:py-14"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.28em] text-fuchsia-300 uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Quest log
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Issue board
            </h2>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              </span>
              {sort === 'top' ? 'Sorted by community upvotes' : 'Newest reports first'} · updates
              live
            </p>
          </div>
          <Link to="/report" className="btn btn-secondary sm:hidden">
            <Plus className="size-4" aria-hidden="true" />
            Report
          </Link>
        </div>

        <Filters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
          sort={sort}
          onSortChange={setSort}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
          showing={filteredIssues.length}
          total={issues.length}
        />

        {(loadError || actionError) && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 backdrop-blur"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p className="flex-1">{loadError || actionError}</p>
            <button
              type="button"
              onClick={() => {
                setLoadError('')
                setActionError('')
              }}
              aria-label="Dismiss error"
              className="rounded p-0.5 text-rose-300 hover:bg-rose-500/20 hover:text-rose-100"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <IssueCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredIssues.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredIssues.map((issue, index) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  index={index}
                  hasVoted={hasVoted}
                  onUpvote={handleUpvote}
                  pending={votingId === issue.id}
                />
              ))}
            </div>
          ) : issues.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No issues reported yet"
              description="Be the first to flag something that needs fixing on campus. It only takes a minute and stays anonymous."
              action={
                <Link to="/report" className="btn btn-primary">
                  <Plus className="size-4" aria-hidden="true" />
                  Report the first issue
                </Link>
              }
            />
          ) : (
            <EmptyState
              icon={SearchX}
              title="No matching issues"
              description="Try a different keyword, category, or status — or clear the filters to see the whole board."
              action={
                <button type="button" onClick={clearFilters} className="btn btn-secondary">
                  Clear filters
                </button>
              }
            />
          )}
        </div>
      </section>
    </>
  )
}
