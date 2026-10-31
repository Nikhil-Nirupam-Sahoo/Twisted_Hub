import { Loader2 } from 'lucide-react'

export default function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-slate-400">
      <Loader2 className="size-6 animate-spin text-cyan-300" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
