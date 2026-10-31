import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  Plus,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isDemoMode } from '../lib/firebase'

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-white/10 text-cyan-300 ring-1 ring-cyan-400/20 ring-inset'
      : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070213]/80 backdrop-blur-2xl">
      {isDemoMode && (
        <div className="border-b border-amber-400/20 bg-amber-400/10 px-4 py-2 text-center text-xs text-amber-200">
          <span className="font-semibold">Demo mode</span>
          <span className="mx-1.5 text-amber-400/60">•</span>
          issues are stored in this browser. Add your Firebase keys in{' '}
          <code className="rounded bg-amber-400/15 px-1 py-0.5 font-mono text-[11px]">.env</code> to
          connect a real project.
        </div>
      )}

      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-white shadow-[0_0_22px_-4px_rgba(217,70,239,0.9)] transition-transform group-hover:-rotate-6">
            <Megaphone className="size-5" strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold tracking-tight text-white">
              Campus Issues
            </span>
            <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Anonymous tracker
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Issue board
          </NavLink>
          {user && (
            <NavLink to="/admin" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="size-4" />
                Dashboard
              </span>
            </NavLink>
          )}
          <Link to="/report" className="btn btn-primary ml-2">
            <Plus className="size-4" strokeWidth={2.5} />
            Report an issue
          </Link>
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              title={`Sign out of ${user.email ?? 'admin'}`}
              className="ml-1 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          ) : (
            <NavLink
              to="/login"
              className="ml-1 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ShieldCheck className="size-4" />
              Admin
            </NavLink>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex size-10 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#070213]/95 px-4 pt-3 pb-4 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Issue board
            </NavLink>
            {user && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin dashboard
              </NavLink>
            )}
            <NavLink to="/report" className={navLinkClass}>
              Report an issue
            </NavLink>
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-1 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/10"
              >
                Sign out ({user.email})
              </button>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                Admin sign in
              </NavLink>
            )}
          </div>
          <Link to="/report" className="btn btn-primary mt-3 w-full">
            <Plus className="size-4" />
            Report an issue
          </Link>
        </div>
      )}
    </header>
  )
}
