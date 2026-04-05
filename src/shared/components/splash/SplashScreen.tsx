'use client'

import { useEffect, useRef } from 'react'
import { useSplashStore } from '@/store/splashStore'
import { useAppInitializer } from '@/shared/hooks/useAppInitializer'

export function SplashScreen() {
  const { status, isVisible, setVisible, reset } = useSplashStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useAppInitializer()

  useEffect(() => {
    if (status === 'ready') {
      const id = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(id)
    }
  }, [status, setVisible])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const cx = W / 2
    const cy = H / 2 - 80

    /* Partículas */
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.3,
      a: Math.random() * 0.45 + 0.08,
      col: ['#386EFA', '#00C8FF', '#7B3CFF'][Math.floor(Math.random() * 3)],
    }))

    let t = 0
    let fadeIn = 0

    function drawBrain(ox: number, oy: number, alpha: number) {
      ctx!.save()
      ctx!.translate(ox, oy)
      ctx!.globalAlpha = alpha

      /* Glow */
      const grd = ctx!.createRadialGradient(0, 0, 10, 0, 0, 90)
      grd.addColorStop(0, 'rgba(56,110,250,0.18)')
      grd.addColorStop(1, 'rgba(56,110,250,0)')
      ctx!.fillStyle = grd
      ctx!.beginPath(); ctx!.arc(0, 0, 90, 0, Math.PI * 2); ctx!.fill()

      /* Divisor central */
      ctx!.setLineDash([4, 3])
      ctx!.strokeStyle = 'rgba(56,110,250,0.3)'
      ctx!.lineWidth = 1
      ctx!.beginPath(); ctx!.moveTo(0, -60)
      for (let i = -60; i <= 42; i += 4) ctx!.lineTo(Math.sin(i / 15 + t) * 2.5, i)
      ctx!.stroke(); ctx!.setLineDash([])

      function gyrus(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color: string, lw: number) {
        ctx!.strokeStyle = color; ctx!.lineWidth = lw; ctx!.lineCap = 'round'
        ctx!.beginPath(); ctx!.moveTo(x1, y1)
        ctx!.bezierCurveTo(x2, y2, x3, y3, x4, y4); ctx!.stroke()
      }

      /* Hemisferio izquierdo */
      ctx!.strokeStyle = '#386EFA'; ctx!.lineWidth = 2; ctx!.lineJoin = 'round'
      ctx!.beginPath()
      ctx!.moveTo(0, -62)
      ctx!.bezierCurveTo(-18, -65, -42, -52, -52, -36)
      ctx!.bezierCurveTo(-62, -20, -64, -5, -60, 12)
      ctx!.bezierCurveTo(-56, 28, -46, 44, -30, 54)
      ctx!.bezierCurveTo(-18, 62, -6, 62, 0, 60)
      ctx!.stroke()
      gyrus(-28, -52, -38, -40, -40, -28, -30, -22, '#4d8bff', 1.4)
      gyrus(-44, -28, -52, -16, -52, -4, -42, 2, '#386EFA', 1.3)
      gyrus(-42, 4, -50, 14, -48, 26, -36, 30, '#386EFA', 1.4)
      gyrus(-34, 30, -44, 40, -42, 50, -28, 52, '#4d8bff', 1.3)

      /* Hemisferio derecho */
      ctx!.strokeStyle = '#00C8FF'; ctx!.lineWidth = 2
      ctx!.beginPath()
      ctx!.moveTo(0, -62)
      ctx!.bezierCurveTo(18, -65, 42, -52, 52, -36)
      ctx!.bezierCurveTo(62, -20, 64, -5, 60, 12)
      ctx!.bezierCurveTo(56, 28, 46, 44, 30, 54)
      ctx!.bezierCurveTo(18, 62, 6, 62, 0, 60)
      ctx!.stroke()
      gyrus(28, -52, 38, -40, 40, -28, 30, -22, '#00C8FF', 1.4)
      gyrus(44, -28, 52, -16, 52, -4, 42, 2, '#00aadd', 1.3)
      gyrus(42, 4, 50, 14, 48, 26, 36, 30, '#00C8FF', 1.4)
      gyrus(34, 30, 44, 40, 42, 50, 28, 52, '#00aadd', 1.3)

      /* Tronco */
      ctx!.strokeStyle = '#7B3CFF'; ctx!.lineWidth = 2.2; ctx!.lineCap = 'round'
      ctx!.beginPath()
      ctx!.moveTo(-8, 60); ctx!.bezierCurveTo(-10, 72, -8, 82, -4, 88)
      ctx!.bezierCurveTo(-2, 92, 2, 92, 4, 88); ctx!.bezierCurveTo(8, 82, 10, 72, 8, 60)
      ctx!.stroke()

      /* Cerebelo */
      ctx!.strokeStyle = '#7B3CFF'; ctx!.lineWidth = 1.5
      ctx!.beginPath(); ctx!.ellipse(0, 72, 22, 12, 0, 0, Math.PI * 2); ctx!.stroke()

      /* Nodos sinapsis */
      const nodes: [number, number, string][] = [
        [-34, -42, '#386EFA'], [34, -42, '#00C8FF'],
        [-52, -8, '#4d8bff'], [52, -8, '#00aadd'],
        [-38, 22, '#386EFA'], [38, 22, '#00C8FF'],
      ]
      nodes.forEach(([nx, ny, col], i) => {
        const pulse = 0.6 + Math.sin(t * 2.5 + i * 0.8) * 0.4
        ctx!.beginPath(); ctx!.arc(nx, ny, 3.5, 0, Math.PI * 2)
        ctx!.fillStyle = col; ctx!.globalAlpha = alpha * pulse; ctx!.fill()
        const halo = ctx!.createRadialGradient(nx, ny, 1, nx, ny, 8)
        halo.addColorStop(0, col + '88'); halo.addColorStop(1, col + '00')
        ctx!.fillStyle = halo; ctx!.beginPath(); ctx!.arc(nx, ny, 8, 0, Math.PI * 2); ctx!.fill()
        ctx!.globalAlpha = alpha
      })

      ctx!.restore()
    }

    function loop() {
      animRef.current = requestAnimationFrame(loop)
      t += 0.016
      if (fadeIn < 1) fadeIn = Math.min(1, fadeIn + 0.012)
      ctx!.clearRect(0, 0, W, H)

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = p.col + Math.floor(p.a * fadeIn * 255).toString(16).padStart(2, '0')
        ctx!.fill()
      })

      const bobY = Math.sin(t * 0.6) * 4
      const bobX = Math.sin(t * 0.4) * 2
      drawBrain(cx + bobX, cy + bobY, Math.pow(fadeIn, 1.2))
    }

    loop()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#050A14',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20,
      opacity: status === 'ready' ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Esquinas */}
      {[
        { top: 18, left: 18, borderTop: '1px solid #386EFA', borderLeft: '1px solid #386EFA' },
        { top: 18, right: 18, borderTop: '1px solid #386EFA', borderRight: '1px solid #386EFA' },
        { bottom: 18, left: 18, borderBottom: '1px solid #386EFA', borderLeft: '1px solid #386EFA' },
        { bottom: 18, right: 18, borderBottom: '1px solid #386EFA', borderRight: '1px solid #386EFA' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 18, height: 18, opacity: 0.22, ...s }} />
      ))}

      {/* Contenido */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 180 }}>

        {/* Letras */}
        <WordmarkAnimated />

        <p style={{
          fontFamily: 'var(--font-poppins), sans-serif',
          fontWeight: 300, fontSize: 11, letterSpacing: '4px',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
          animation: 'smFadeIn 1s ease 1.8s both',
        }}>
          Learn · Grow · Master
        </p>

        {/* Contador */}
        {status === 'loading' && <ProgressCounter />}

        {/* Error */}
        {status === 'error' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <p style={{ color: 'rgba(255,100,100,0.8)', fontSize: 13, fontFamily: 'var(--font-poppins)' }}>
              We&apos;re having trouble loading SkillMind. Please try again.
            </p>
            <button onClick={reset} style={{
              background: 'transparent', border: '1px solid rgba(56,110,250,0.5)',
              color: '#fff', borderRadius: 8, padding: '10px 28px',
              fontFamily: 'var(--font-poppins)', cursor: 'pointer', fontSize: 13,
            }}>
              Try Again
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes smFadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes smLetterIn { from { opacity:0; transform:translateY(28px) scale(1.4); filter:blur(10px) } to { opacity:1; transform:translateY(0) scale(1); filter:blur(0) } }
        @keyframes smPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>
    </div>
  )
}

/* ── Wordmark ── */
function WordmarkAnimated() {
  const letters = 'SkillMind'.split('')
  const blueIdx = new Set([5, 6, 7, 8])
  return (
    <div style={{ display: 'flex' }} aria-label="SkillMind">
      {letters.map((ch, i) => (
        <span key={i} style={{
          fontFamily: 'var(--font-poppins), sans-serif',
          fontWeight: 800, fontSize: 'clamp(40px,7vw,56px)',
          letterSpacing: '-1.5px', lineHeight: 1,
          color: blueIdx.has(i) ? '#386EFA' : '#ffffff',
          display: 'inline-block',
          animation: `smLetterIn 0.55s cubic-bezier(0.22,1,0.36,1) ${0.6 + i * 0.09}s both`,
        }}>
          {ch}
        </span>
      ))}
    </div>
  )
}

/* ── Contador ── */
function ProgressCounter() {
  const labels = ['Initializing…', 'Loading session…', 'Fetching config…', 'Preparing…', 'Almost ready!']

  useEffect(() => {
    let pct = 0; let lIdx = 0
    const bf = document.getElementById('sm-bar')
    const pn = document.getElementById('sm-pct')
    const pl = document.getElementById('sm-lbl')
    if (!bf || !pn || !pl) return

    function tick() {
      if (pct >= 100) { pn!.textContent = '100%'; bf!.style.width = '100%'; return }
      pct = Math.min(100, pct + (pct < 40 ? 0.3 : pct < 75 ? 0.5 : pct < 90 ? 0.75 : 1.4))
      pn!.textContent = Math.round(pct) + '%'
      bf!.style.width = pct + '%'
      const ni = Math.floor(pct / 20)
      if (ni !== lIdx && ni < labels.length) { lIdx = ni; pl!.textContent = labels[ni] }
      requestAnimationFrame(tick)
    }
    tick()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'smFadeIn 0.6s ease 2s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span id="sm-pct" style={{ fontFamily: 'var(--font-poppins)', fontWeight: 700, fontSize: 13, color: '#386EFA', minWidth: 42, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>0%</span>
        <div style={{ width: 160, height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
          <div id="sm-bar" style={{ height: '100%', width: '0%', background: 'linear-gradient(90deg,#386EFA,#00C8FF,#7B3CFF)', borderRadius: 2 }} />
        </div>
      </div>
      <span id="sm-lbl" style={{ fontFamily: 'var(--font-poppins)', fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Initializing…</span>
      <div style={{ display: 'flex', gap: 6 }}>
        {['#386EFA', '#00C8FF', '#7B3CFF'].map((col, i) => (
          <span key={i} style={{ display: 'block', width: 4, height: 4, borderRadius: '50%', background: col, animation: `smPulse 1.2s ease-in-out ${i * 0.15}s infinite` }} />
        ))}
      </div>
    </div>
  )
}