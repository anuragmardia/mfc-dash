# Mardia Family Financial Cockpit

Single source of truth for the family net worth dashboard.

- `index.html` — the dashboard. Deployed via GitHub Pages.
- `Code.js` — the Apps Script bridge. Deployed via `clasp` (not the web editor).
- `appsscript.json` — clasp project manifest.

## Architecture

```
Google Sheet (data)
   |
Apps Script Web App (Code.js) — verifies Google Sign-In token, serves JSON
   |
index.html (GitHub Pages) — Google Sign-In button, fetches from the bridge
   |
Cloudflare Access — gates the whole domain behind an email login
```

## One-time setup (see SETUP.md for the full checklist)

1. Google Cloud Console → OAuth Client ID → paste into `index.html` (`clientId`) and `Code.js` (`CLIENT_ID`)
2. `clasp login` and `clasp clone` this Apps Script project, then `clasp push && clasp deploy`
3. `git push` this repo → GitHub Pages builds `index.html` automatically
4. Cloudflare Access → new Access application pointed at the Pages domain

## Making changes going forward

- **Data changes**: edit the Google Sheet directly. Nothing to redeploy.
- **Dashboard/logic changes**: edit `index.html` or `Code.js` in this repo, then:
  - `git push` (frontend, auto-deploys)
  - `clasp push && clasp deploy` (backend, needs an explicit deploy)
- Never paste code directly into the Apps Script web editor again — it will fall out of sync with this repo.
