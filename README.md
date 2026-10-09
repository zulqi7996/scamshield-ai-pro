# ScamShield AI · Community MVP v0.2

A modern, responsive, privacy-first scam warning-sign checker. **This is a rule-based educational scanner, not a trained AI model, online phishing database, malware scanner, or safety guarantee.** It can miss scams and flag legitimate messages.

## Features actually working

- Responsive landing page, free scanner, how-it-works, features, proposed pricing, FAQ
- Browser-only suspicious message heuristic scanning
- Browser-only URL text analysis (no requests to the inspected domain)
- Warning-sign scores and explanations; sample messages; copy and download TXT report
- Zero account, backend, payment gateway or API requirement

## Quick start

Open `index.html` in your browser, or run `python -m http.server 8000` and visit `http://localhost:8000`.

## Deploy for free on Cloudflare

1. Extract this archive locally.
2. Upload **only `index.html` and the `assets/` folder** to the root of your GitHub repository. Preserve `assets/style.css` and `assets/app.js` exactly.
3. On Cloudflare Workers & Pages, connect the GitHub repository as a **Pages** project (rather than Wrangler Worker deployment), or use static asset hosting with an explicit assets directory.
4. For Pages select framework preset **None**, blank build command, output directory `.` (root).
5. Deploy and visit the resulting `.pages.dev` URL. Test the actual UI and scanner.
6. Do not upload the ZIP to the public website repository and do not expose `.git` internals as assets.

> Existing Worker deployments that use `npx wrangler deploy` might not publish the files you expect. Prefer Pages for this static project. If you keep Workers, explicitly configure static assets through Wrangler and point `assets.directory` to a dedicated public directory.

## Repository layout

```text
index.html
assets/
  style.css
  app.js
README.md
LICENSE
docs/
  PRODUCT.md
  BUSINESS.md
  ROADMAP.md
  SECURITY.md
  DEPLOYMENT.md
  TESTING.md
```

## Important product truth

The Pro and Teams plans are **visually presented as planned**. Paid features and payments are **not implemented**. Prices are illustrative and need customer validation. Never describe a scan result as verified safe.

See `docs/` for the business model, growth plan, technical constraints, and tests.
