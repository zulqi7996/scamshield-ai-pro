# Deployment guide for zulqi7996/scamshield-ai

## GitHub upload
The website needs this exact structure:

```text
index.html
assets/style.css
assets/app.js
```

**Do not leave CSS or JS in the repository root.** If you do, the page appears unstyled. Upload the contents of `assets/` inside the `assets` directory. Existing root-level `app.js`, `style.css`, duplicate fixed-index HTML files and ZIP are not needed for the live site.

## Cloudflare Pages
Dashboard → Workers & Pages → Create → Pages / import GitHub repository → choose `zulqi7996/scamshield-ai`. Use production branch `main`, framework `None`, build command blank, output directory `.`. Deploy.

If continuing to use a **Worker** instead of Pages, check the Worker static assets configuration. `npx wrangler deploy` alone is not an equivalent generic Pages deployment.

## Verify
Open browser developer tools → Network: `/assets/style.css` and `/assets/app.js` should each return HTTP 200. Check a sample message and link; both must display explanations. Hard refresh with Ctrl+Shift+R after deploy.
