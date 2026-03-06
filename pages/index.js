import Link from 'next/link'
import { useEffect, useState } from 'react'

function blockMainThread(ms) {
  const start = performance.now()
  while (performance.now() - start < ms) {
    // Intentional blocking for INP repro.
  }
}

export default function HomePage() {
  const [events, setEvents] = useState([])
  const [fallbackEnabled, setFallbackEnabled] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [expandSlot, setExpandSlot] = useState(false)

  useEffect(() => {
    const onMetric = (event) => {
      setEvents((prev) => [event.detail, ...prev].slice(0, 30))
    }

    window.__wvFallbackEnabled = fallbackEnabled
    window.dispatchEvent(new Event('wv-fallback-toggle'))

    window.addEventListener('wv-metric', onMetric)

    const t1 = setTimeout(() => setExpandSlot(true), 1200)
    const t2 = setTimeout(() => setShowBanner(true), 2200)

    return () => {
      window.removeEventListener('wv-metric', onMetric)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [fallbackEnabled])

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Pages Router: useReportWebVitals repro</h1>
      <p>
        Hard refresh while tab is visible. Do not interact for ~3s for CLS. Click the
        INP button, then hide tab or reload to finalize INP.
      </p>

      <p>
        <Link href="/about">Go to /about</Link>
      </p>

      <label style={{ display: 'block', marginBottom: 12 }}>
        <input
          type="checkbox"
          checked={fallbackEnabled}
          onChange={(e) => setFallbackEnabled(e.target.checked)}
        />{' '}
        Enable fallback observers (web-vitals)
      </label>

      {showBanner ? (
        <div style={{ background: '#fde68a', padding: 10, borderRadius: 6, marginBottom: 12 }}>
          Late inserted banner (CLS trigger)
        </div>
      ) : null}

      <div
        style={{
          background: '#dbeafe',
          minHeight: expandSlot ? 150 : 2,
          padding: expandSlot ? 10 : 0,
          borderRadius: 6,
          marginBottom: 16,
        }}
      >
        {expandSlot ? 'Expanded content slot (CLS trigger)' : null}
      </div>

      <button onClick={() => blockMainThread(450)} style={{ marginBottom: 16 }}>
        Trigger slow interaction (INP)
      </button>

      <table width="100%" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Source</th>
            <th align="left">Metric</th>
            <th align="left">Value</th>
            <th align="left">Time</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={4}>No metrics yet</td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={`${event.source}:${event.name}:${event.id}:${event.value}:${event.at}`}>
                <td>{event.source}</td>
                <td>{event.name}</td>
                <td>{Number(event.value).toFixed(2)}</td>
                <td>{new Date(event.at).toLocaleTimeString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  )
}
