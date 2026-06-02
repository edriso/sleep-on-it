# Sleep On It

A **frontend-only** 24-hour pause for impulse buys — a speed-bump for spending.
Park what you want to buy with its price and your reason; when the wait is over,
keep it or let it go. Letting go adds the price to a quiet **"not spent"** total.
No backend, no accounts, works offline.

## The idea

Add an item → it joins an **on-hold** list with a live countdown (default 24h) →
when it's ripe, **Buy it** or **Let it go**. If you still want it tomorrow, it's
probably real. If not, you just saved the money — and you can see how much.

## Tech

React 19 + TypeScript (strict), Vite, Tailwind v4, Zustand, Zod-validated
localStorage, PWA. Tested with Vitest + Testing Library and Playwright.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

## Notes

- The hold-timer maths (`lib/hold.ts`) is pure and unit-tested (ripeness boundary,
  the countdown label).
- Entrances animate transform only and keep `opacity: 1`. Two themes (calm dark +
  light); reduced motion honored.

## License

MIT.
