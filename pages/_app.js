import { WebVitalsReporter } from '../components/web-vitals-reporter'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <WebVitalsReporter />
      <Component {...pageProps} />
    </>
  )
}
