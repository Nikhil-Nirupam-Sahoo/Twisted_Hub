import { Gamepad2, Ghost, Sparkles, Star } from 'lucide-react'

/**
 * Full-screen animated arcade backdrop. Purely decorative, so it is hidden from
 * assistive tech and never intercepts pointer events.
 */
export default function ArcadeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05010f]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(46,16,101,0.95)_0%,transparent_45%),radial-gradient(ellipse_at_85%_0%,rgba(8,145,178,0.35)_0%,transparent_42%),radial-gradient(ellipse_at_50%_100%,rgba(131,24,67,0.4)_0%,transparent_55%)]" />

      <div className="absolute -top-[45vh] left-1/2 h-[120vh] w-[120vh] animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,rgba(34,211,238,0.18),rgba(217,70,239,0.22),rgba(250,204,21,0.08),rgba(34,211,238,0.18))] blur-[110px]" />

      <div className="absolute top-[18%] left-[8%] size-64 animate-float-slow rounded-full bg-fuchsia-600/20 blur-[90px]" />
      <div className="absolute top-[30%] right-[4%] size-72 animate-float rounded-full bg-cyan-500/15 blur-[100px]" />
      <div className="absolute bottom-[10%] left-[32%] size-80 animate-glow rounded-full bg-amber-400/10 blur-[110px]" />

      <div className="arcade-grid absolute inset-x-0 bottom-[-12%] h-[70%] opacity-60" />
      <div className="arcade-stars absolute inset-0 opacity-60" />

      <Gamepad2 className="absolute top-[18%] right-[7%] size-20 rotate-12 animate-float text-fuchsia-400/20" />
      <Ghost className="absolute top-[46%] left-[4%] size-16 -rotate-12 animate-float-slow text-cyan-300/15" />
      <Star className="absolute right-[19%] bottom-[16%] size-10 animate-float text-amber-300/25" />
      <Sparkles className="absolute top-[12%] left-[17%] size-9 animate-glow text-cyan-300/30" />

      <span className="absolute top-[24%] left-[30%] size-2 rotate-45 animate-float bg-cyan-300/70 shadow-[0_0_14px_3px_rgba(34,211,238,0.65)]" />
      <span className="absolute top-[60%] right-[12%] size-2.5 animate-float-slow bg-fuchsia-400/60 shadow-[0_0_16px_3px_rgba(217,70,239,0.55)] [animation-delay:1.4s]" />
      <span className="absolute top-[38%] right-[38%] size-1.5 animate-float bg-amber-300/70 shadow-[0_0_12px_3px_rgba(252,211,77,0.55)] [animation-delay:2.2s]" />
      <span className="absolute top-[72%] left-[16%] size-2 animate-float-slow bg-emerald-300/60 shadow-[0_0_14px_3px_rgba(110,231,183,0.5)] [animation-delay:0.8s]" />

      <div className="arcade-scanlines absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,1,15,0.5)_100%)]" />
    </div>
  )
}
