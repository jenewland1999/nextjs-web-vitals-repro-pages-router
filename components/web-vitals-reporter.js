import { useEffect, useRef } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

const seen = new Set()

function emitMetric(source, metric) {
  const key = `${source}:${metric.name}:${metric.id}:${metric.value}`
  if (seen.has(key)) {
    return
  }

  seen.add(key)
  const payload = {
    at: Date.now(),
    id: metric.id,
    name: metric.name,
    source,
    value: metric.value,
    rating: metric.rating,
    navigationType: metric.navigationType,
  }

  console.log(`[web-vitals:${source}]`, metric)
  window.dispatchEvent(new CustomEvent('wv-metric', { detail: payload }))
}

export function WebVitalsReporter() {
  const fallbackEnabledRef = useRef(false)

  useReportWebVitals((metric) => {
    const source = metric.name.startsWith('Next.js-') ? 'pages-hook-custom' : 'pages-hook'
    emitMetric(source, metric)
  })

  useEffect(() => {
    const syncFallback = () => {
      fallbackEnabledRef.current = Boolean(window.__wvFallbackEnabled)
    }

    syncFallback()
    window.addEventListener('wv-fallback-toggle', syncFallback)

    let active = true

    import('web-vitals').then(({ onCLS, onINP, onLCP }) => {
      if (!active) {
        return
      }

      onCLS((metric) => {
        if (fallbackEnabledRef.current) {
          emitMetric('fallback', metric)
        }
      }, { reportAllChanges: true })

      onLCP((metric) => {
        if (fallbackEnabledRef.current) {
          emitMetric('fallback', metric)
        }
      }, { reportAllChanges: true })

      onINP((metric) => {
        if (fallbackEnabledRef.current) {
          emitMetric('fallback', metric)
        }
      }, { reportAllChanges: true, durationThreshold: 16 })
    })

    return () => {
      active = false
      window.removeEventListener('wv-fallback-toggle', syncFallback)
    }
  }, [])

  return null
}
