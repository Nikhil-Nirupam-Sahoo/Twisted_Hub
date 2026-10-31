import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/25 shadow-[0_0_35px_-10px_rgba(34,211,238,0.9)]">
        <Compass className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-semibold tracking-wider text-fuchsia-300 uppercase">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        The page you are looking for does not exist. Head back to the issue board to see what the
        campus is talking about.
      </p>
      <Link to="/" className="btn btn-primary mt-6">
        Back to the issue board
      </Link>
    </div>
  )
}
