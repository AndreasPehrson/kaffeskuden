import { useEffect, type RefObject } from 'react'

const PARALLAX_RATE = 0.32

export function useHeroParallax(
  sectionRef: RefObject<HTMLElement | null>,
  layerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const section = sectionRef.current
    const layer = layerRef.current
    if (!section || !layer) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const reset = () => {
      layer.style.transform = ''
    }

    const update = () => {
      frame = 0
      if (reduceMotion.matches) {
        reset()
        return
      }

      const { top, height } = section.getBoundingClientRect()
      const scrolled = Math.max(0, -top)
      const maxTravel = height * 0.22
      const offset = Math.min(maxTravel, scrolled * PARALLAX_RATE)
      layer.style.transform = `translate3d(0, ${offset}px, 0)`
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const onMotionChange = () => {
      schedule()
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    reduceMotion.addEventListener('change', onMotionChange)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reduceMotion.removeEventListener('change', onMotionChange)
      reset()
    }
  }, [sectionRef, layerRef])
}
