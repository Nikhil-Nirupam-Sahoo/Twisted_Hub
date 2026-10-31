import { Search, SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, STATUSES } from '../lib/constants'

const statusOptions = [{ value: 'all', label: 'All' }, ...STATUSES]

export default function Filters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onClear,
  hasActiveFilters,
  showing,
  total,
}) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <label htmlFor="issue-search" className="sr-only">
            Search issues
          </label>
          <input
            id="issue-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by keyword or location…"
            className="field pl-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <div className="relative">
            <label htmlFor="category-filter" className="sr-only">
              Filter by category
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
              className="field cursor-pointer appearance-none pr-8 sm:w-44"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.emoji} {item.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal
              className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </div>

          <div>
            <label htmlFor="sort-order" className="sr-only">
              Sort issues
            </label>
            <select
              id="sort-order"
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
              className="field cursor-pointer sm:w-40"
            >
              <option value="top">Most upvoted</option>
              <option value="newest">Newest first</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3.5">
        <span className="mr-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Status
        </span>
        {statusOptions.map((option) => {
          const active = status === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatusChange(option.value)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? 'bg-cyan-300 text-slate-950 shadow-[0_0_20px_-4px_rgba(34,211,238,0.9)]'
                  : 'bg-white/5 text-slate-300 ring-1 ring-white/10 ring-inset hover:bg-white/10 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          )
        })}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
          >
            <X className="size-3.5" aria-hidden="true" />
            Clear
          </button>
        )}

        <span className="ml-auto text-xs text-slate-400" aria-live="polite">
          {showing} of {total} {total === 1 ? 'issue' : 'issues'}
        </span>
      </div>
    </div>
  )
}
