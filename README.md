# Sakhile Mamba — Portfolio

A single-page portfolio site. Pure HTML, CSS, and JS — no build step, no dependencies to install.

## Run it locally

Just open `index.html` in a browser. That's it.

(Optional, for a local server instead of the `file://` protocol:
`python3 -m http.server 8000` from this folder, then visit `http://localhost:8000`.)

## Host it on GitHub Pages

1. Create a new repository on GitHub (e.g. `sakhile-portfolio`).
2. Add these three files to the repo root: `index.html`, `style.css`, `script.js`.
3. Commit and push:
   ```
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
4. On GitHub, go to **Settings → Pages**.
5. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
6. Save. Your site will be live within a minute or two at:
   `https://<your-username>.github.io/<repo-name>/`

## Editing content

- All text content lives directly in `index.html` — job titles, dates, and copy are in plain markup, easy to find and edit.
- Colors, fonts, and spacing are all defined as CSS variables at the top of `style.css` under `:root` — change a value once and it updates everywhere.
- `script.js` handles the scroll-reveal animations, the live Eswatini clock in the header, the timeline progress line, and the mobile nav toggle.

## Updating this site with AI help

If you come back and ask an AI assistant (Claude or otherwise) to add or update
content on this site, point it at **`AGENTS.md`** first. It documents the design
system, where to pull updated info from, and — important — the exact process for
verifying GitHub repositories before featuring them, including a couple of mistakes
made the first time around that are worth not repeating.

## Notes

- Fonts (Space Grotesk, Inter, IBM Plex Mono) load from Google Fonts via CDN — an internet connection is needed for them to render with the intended typefaces, but the site still works without one (falls back to system fonts).
- Respects `prefers-reduced-motion` — animations are disabled for users who have that OS setting on.
