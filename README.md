# SOUPS 2026 — Hannover Guide (PWA)

An installable, offline-capable guide to Hannover for SOUPS 2026 attendees.
Static files only — no build step, no dependencies to install.

## Deploy to GitHub Pages

1. Create a new **public** repository, e.g. `soups26-guide`.
2. Upload the entire contents of this folder to the repository root
   (`index.html` must sit at the top level, not inside a subfolder).
   Make sure the dotfiles come along: **`.nojekyll`** and
   **`.image-slots.state.json`**. Drag-and-drop in the GitHub web UI
   silently skips dotfiles — use git:

   ```bash
   git init && git add -A && git commit -m "SOUPS 2026 guide"
   git branch -M main
   git remote add origin git@github.com:<owner>/soups26-guide.git
   git push -u origin main
   ```

3. Repository → **Settings → Pages** → Source: *Deploy from a branch*,
   Branch: `main`, folder: `/ (root)`. Save.
4. Wait a minute, then open `https://<owner>.github.io/soups26-guide/`.

A custom domain (Settings → Pages → Custom domain) makes a nicer QR target,
e.g. `guide.soups.page` as a CNAME to `<owner>.github.io`.

## Why the two dotfiles matter

- **`.nojekyll`** — without it GitHub Pages runs Jekyll, which refuses to
  publish anything under a folder starting with an underscore. The design
  system lives in `_ds/`, so the whole app would load unstyled.
- **`.image-slots.state.json`** — carries the photographs for the place
  cards. Without it every card falls back to its empty placeholder.

## Installing on a phone

HTTPS is required, and GitHub Pages provides it. On first visit the app
offers an install banner:

- **Android / Chrome** — an "Add to home screen" button appears in the banner.
- **iOS / Safari** — Share → Add to Home Screen (the banner says so; iOS
  gives no programmatic install prompt).

Once installed the service worker (`sw.js`) serves the whole app offline,
including the design system, fonts and icons. Map tiles are cached as they
are viewed, so panning the map over new areas still needs a connection.

## Updating the guide after it is live

Edit the design, re-export this folder, and push again. Bump `VERSION` in
`sw.js` (`soups26-guide-v1` → `v2`) whenever you change content —
otherwise installed copies keep serving the old cache.

## What's in here

| File | What it is |
| --- | --- |
| `index.html` | The whole app — feed, map tab, programme, practical info |
| `map.html` | The Leaflet map, embedded by the Map tab |
| `support.js` | Runtime that renders `index.html` |
| `image-slot.js` | Photograph slots |
| `sw.js` | Service worker — offline caching |
| `manifest.webmanifest` | Install metadata: name, icons, colours |
| `icons/` | Home-screen icons (192 / 512 / 1024 px) |
| `_ds/` | The Broadsheet design system (tokens + stylesheet) |
| `.image-slots.state.json` | The place photographs |
| `.nojekyll` | Tells GitHub Pages to serve files verbatim |

## Privacy

No analytics, no cookies, no accounts, no network calls to us. Saved places
live in the browser's `localStorage` on the attendee's own device. Outbound
requests go only to Google Fonts, unpkg (icon font, Leaflet) and
OpenStreetMap tiles — all cached locally after first load.
