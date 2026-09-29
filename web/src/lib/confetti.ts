import confetti from 'canvas-confetti'

// Mismos parámetros que el Konfetti de AboutActivity: 100 piezas, 5 colores,
// cuadros y círculos, en todas direcciones, desvaneciéndose en ~2 s.
export function burstFrom(element: Element): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const rect = element.getBoundingClientRect()
  confetti({
    particleCount: 100,
    spread: 360,
    startVelocity: 30,
    ticks: 120,
    gravity: 0.8,
    scalar: 1.1,
    shapes: ['square', 'circle'],
    colors: ['#FFFF00', '#00FF00', '#FF00FF', '#00FFFF', '#FF0000'],
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: rect.top / window.innerHeight,
    },
    disableForReducedMotion: true,
  })
}
