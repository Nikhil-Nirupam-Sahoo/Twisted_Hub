import { Link } from 'react-router-dom'
import { Megaphone } from 'lucide-react'
import { isDemoMode } from '../lib/firebase'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070213]/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white shadow-[0_0_18px_-4px_rgba(217,70,239,0.9)]">
            <Megaphone className="size-4" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-white">Campus Issues</p>
            <p className="text-xs text-slate-400">Anonymous Campus Issue Tracker</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
          <Link to="/" className="transition-colors hover:text-cyan-300">
            Issue board
          </Link>
          <Link to="/report" className="transition-colors hover:text-cyan-300">
            Report an issue
          </Link>
          <Link to="/login" className="transition-colors hover:text-cyan-300">
            Admin
          </Link>
          <span className="hidden text-white/15 sm:inline">|</span>
          <span>
            {isDemoMode ? 'Local demo · ' : ''}Built with React, Tailwind &amp; Firebase
          </span>
        </div>
      </div>
    </footer>
  )
}
