import Link from 'next/link'

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1>About route</h1>
      <p>Use this route to trigger Pages Router custom metrics on route transitions.</p>
      <Link href="/">Back to home</Link>
    </main>
  )
}
