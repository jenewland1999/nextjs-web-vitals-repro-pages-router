# Pages Router web-vitals repro

## Run

```bash
bun install
bun run dev
```

## What this shows

- Uses documented Pages Router `useReportWebVitals` setup in `pages/_app.js`.
- Includes CLS and INP trigger interactions.
- Includes optional fallback observers (`web-vitals`) toggle for side-by-side comparison.
- Includes `/about` route to trigger Pages Router custom route metrics.

Open the browser console and compare `pages-hook`, `pages-hook-custom`, and `fallback` events.
