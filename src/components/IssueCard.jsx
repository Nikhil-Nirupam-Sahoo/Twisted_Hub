import { ArrowUp, Check, Clock, Loader2, MapPin } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { getCategory } from '../lib/constants'
import { timeAgo } from '../lib/utils'

export default function IssueCard({
  issue,
  hasVoted,
  onUpvote,
  pending = false,
  index = 0,
}) {
  const category = getCategory(issue.category)
  const voted = hasVoted(issue.id)

  return (
    <article
      className="group flex h-full animate-fade-in-up flex-col rounded-2xl border border-white/10 bg-slate-950/55 p-5 shadow-[0_10px_50px_-25px_rgba(0,0,0,0.9)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_45px_-12px_rgba(34,211,238,0.4)]"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10 ring-inset">
          <span aria-hidden="true">{category.emoji}</span>
          {category.label}
        </span>
        <StatusBadge status={issue.status} />
      </div>

      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-slate-100">
        {issue.description}
      </p>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <MapPin className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
        <span className="truncate">{issue.location}</span>
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => onUpvote(issue)}
          disabled={voted || pending}
          aria-pressed={voted}
          aria-label={`${voted ? 'Voted' : 'Upvote'} — ${issue.upvotes} ${
            issue.upvotes === 1 ? 'upvote' : 'upvotes'
          }`}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-all disabled:cursor-default ${
            voted
              ? 'border-fuchsia-400/60 bg-fuchsia-500 text-white shadow-[0_0_22px_-3px_rgba(217,70,239,0.9)]'
              : 'border-white/15 bg-white/5 text-slate-200 hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:text-cyan-200'
          }`}
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : voted ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <ArrowUp className="size-4" strokeWidth={2.5} aria-hidden="true" />
          )}
          <span className="tabular-nums">{issue.upvotes}</span>
          <span className="text-xs font-medium opacity-80">{voted ? 'Voted' : 'Upvote'}</span>
        </button>

        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="size-3.5" aria-hidden="true" />
          {timeAgo(issue.createdAt)}
        </span>
      </div>
    </article>
  )
}
