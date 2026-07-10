# AGENTS.md — Maintenance Playbook

This file is for an AI assistant (Claude or otherwise) asked to update this site in a
future session. It captures the process, the design system, and — importantly — the
mistakes made the first time, so they aren't repeated.

Read this whole file before editing anything.

---

## 0. What this site is

A single-page portfolio for **Sakhile Mamba** — software developer and founder
(Crazy8s, Ridesly), based in Matsapha, Eswatini. Three plain files, no build step,
meant to be hosted on GitHub Pages:

- `index.html`
- `style.css`
- `script.js`

Design concept: a **dispatch-board aesthetic**. Sakhile's career is built around
rideshare/mobility ventures and cloud infrastructure, so the site treats his career
history as a literal route — a scroll-driven "trip progress" line runs down the
Experience section, stops are styled like trip waypoints, and labels use dispatch/
mono-terminal language (eyebrow tags, coordinates, timestamps).

Color tokens, fonts, and spacing all live as CSS custom properties at the top of
`style.css` under `:root` — change values there, not inline.

---

## 1. Where to pull updates from

When the person provides new source material, treat it in this rough priority order
(most current/authoritative first):

1. **A CV/resume they upload directly** — usually the most current and the most
   detailed on recent role scope (technical bullet points, dates).
2. **LinkedIn export (PDF or full HTML/SDUI export)** — good for the full history:
   certifications, volunteering, skills, courses, education. **LinkedIn splits a
   full profile export across multiple separate documents/pages, one per section —
   treat each as a distinct source to check for, not just whatever happens to be
   pasted in.** The summary PDF alone is not the full picture.

   When someone provides a LinkedIn export, go through this checklist and note
   which sections you actually have content for and which are missing:

   - [ ] Main profile / summary page (headline, about, top-level experience list)
   - [ ] Experience — full detail view (the summary PDF often truncates bullet
     points; the HTML "detail" export per role does not)
   - [ ] Education — full detail view
   - [ ] Licenses & Certifications
   - [ ] Volunteer Experience
   - [ ] Skills (note: LinkedIn buckets these — Industry Knowledge, Tools &
     Technologies, Interpersonal Skills, Other Skills — pull all buckets, not just
     the default "All" view if a filtered one was pasted)
   - [ ] Courses
   - [ ] Recommendations (received and given)
   - [ ] Accomplishments: Publications, Projects, Honors & Awards, Test Scores,
     Patents, Organizations
   - [ ] Languages (spoken languages with proficiency level — may appear on the
     summary PDF, but check for a dedicated detail page too)
   - [ ] Interests (companies/schools/groups followed) — usually low value for the
     site, but check it isn't hiding something relevant (e.g. a company he's since
     joined) before ignoring it

   If any box can't be checked from what's been provided, say so explicitly to the
   person rather than silently treating the profile as complete — e.g. "I have
   Certifications, Volunteering, Skills, and Courses from your LinkedIn export, but
   not Recommendations or Honors & Awards — let me know if those exist and you'd
   like them pulled in too." Don't assume a missing section means it doesn't exist
   on his profile.

3. **Academic transcript** — use this to verify degree status, GPA, and specific
   grades. It's the ground truth for education claims. Note: an "unofficial"
   transcript may not yet reflect an in-progress term — don't assume a course is
   finished just because a repo for it exists.
4. **GitHub repositories** (github.com/SakhileMamba) — for the Code section. See
   the verification protocol in §3 before touching this section; it is easy to get
   wrong by guessing from repo names alone.

**When sources conflict** (e.g. LinkedIn says a role is "Present" but a newer CV
gives it an end date): prefer the most recently provided, most detailed source, make
the edit, and say so plainly to the person afterward — don't silently pick one and
hide the discrepancy. Give them the chance to correct you.

---

## 2. GitHub verification protocol — read before editing the Code section

**The core lesson from the first pass at this site: do not describe a repo based on
its name, language, or `has_pages` flag alone. This produced two confidently wrong
claims** (see §2.4). Always open the actual files before writing a description.

### 2.1 Tooling constraints you will hit

- `api.github.com` is aggressively rate-limited on this sandbox's shared egress IPs
  (60 req/hour, frequently already exhausted by other traffic). Don't rely on it for
  bulk repo browsing. It's fine for one or two quick calls if it happens to work.
- `*.github.io` (rendered GitHub Pages sites) is **not** reachable via `bash_tool`
  (not on the network allowlist) and **not** fetchable via `web_fetch` unless the
  exact URL already appears in a prior search or fetch result in the conversation.
  Don't waste turns retrying it directly.
- `codeload.github.com` **is** on the network allowlist and is a separate service
  from the rate-limited API — this is the reliable path.

### 2.2 The reliable method: download and read the actual source

```bash
# Confirm the default branch first if unsure (github.com HTML pages are not
# rate-limited the way api.github.com is):
curl -s -L "https://github.com/SakhileMamba/<repo>" -o page.html
grep -o 'defaultBranch\":\"[^\"]*\"' page.html

# Download the real source:
curl -s -o repo.tar.gz \
  "https://codeload.github.com/SakhileMamba/<repo>/tar.gz/refs/heads/<branch>"
mkdir -p repo_extracted && tar xzf repo.tar.gz -C repo_extracted --strip-components=1
find repo_extracted -type f -iname "*.html" | sort
```

Then actually read the files:

- Check the **root `index.html`** for a `<title>` and, critically, its **nav links**
  — course/repo home pages often link out to the real sub-projects. Crawl those
  links, don't guess from the file tree.
- Check whether linked pages are live content or **dead placeholders**
  (`href="#"`, unfilled template text like `[Your Name]`). A repo can have
  `has_pages: true` and still contain nothing finished.
- Pull the actual `<title>`/`<h1>` of any sub-project you plan to feature, and use
  that real name rather than inventing one.

### 2.3 Constructing the live Pages URL

Standard GitHub Pages project-site pattern: `https://sakhilemamba.github.io/<repo>/`.
If the real content lives in a subfolder (common for course repos with multiple
weekly exercises plus a named project), link directly to that subfolder's
`index.html` rather than the generic repo home page — e.g.
`https://sakhilemamba.github.io/wdd230/chamber/index.html`, not just
`.../wdd230/`.

### 2.4 What went wrong the first time (don't repeat this)

- Assumed `wdd231` was the finished "Chamber of Commerce" capstone because of course
  numbering intuition. Actually opening it showed the nav's Chamber/Final links were
  both `href="#"` — unbuilt. The real Chamber of Commerce project was in `wdd230`.
- Featured `Group05` as "a collaborative team project" based on `has_pages: true`
  and a plausible-sounding name. Actually opening it showed an untouched starter
  template — the README and homepage still had literal `[Your Name]` placeholders.

Both were corrected once the repos were actually downloaded and read. The fix going
forward is simple: never write a project description or pick a "most impressive"
ranking without opening the files first.

### 2.5 Curating what to feature

Not every repo belongs on the site. Skip:
- Bare weekly coursework exercises with no cohesive "project" framing.
- Unmodified forks or starter templates (check `fork: false` via the API when
  available, but also verify the content isn't just an untouched template even when
  `fork: false`).
- Anything you can't verify is finished/live.

Prefer repos that map to a real story: a venture's actual mobile app, a live payment
integration, a capstone with a real API integration built around Sakhile's own
hometown, etc. One clearly-labeled "featured" item (see `.repo-item--featured` in
`style.css`) plus a handful of solid supporting cards beats a long uncurated list.

---

## 3. Section-by-section update map

| Section (id)        | Source of truth                                   | Notes |
|----------------------|----------------------------------------------------|-------|
| `#top` (hero)         | CV summary, current venture status                | "Currently building" in the manifest should only list ventures with an active/ongoing end date — drop ones with a past end date. |
| `#route` (experience) | CV (dates/details) + LinkedIn (full history)      | Stop order is most-recent-first. `--seg` inline style height is a rough visual encoding of tenure length — keep it proportionate, not exact. |
| `#ventures`           | CV bullet points + press coverage                  | Link each card to real press coverage if a URL is available; never fabricate one. |
| `#toolkit`            | LinkedIn skills export, CV competencies, certs, transcript, volunteer experience | Pills for skills, `cert-list` rows for certifications (name + issuer + date), `edu-list` style reused for Community & Leadership. |
| `#code`               | GitHub — see §2                                    | One featured item + supporting grid. Always re-verify before adding/removing entries; don't just append. |
| `#press`              | LinkedIn "Publications" + any URLs from the CV     | Only make an item a link if you have a real URL. Plain text otherwise — don't invent URLs. |
| `#contact` / footer    | CV contact details                                 | Confirm before publishing a phone number or email that wasn't already public. |

---

## 4. Validation & deploy checklist

Before presenting updated files to the person, always:

1. Check tag balance (`div`, `ul`, `li`, `section`, `article`, `a`) with a quick
   regex count of opens vs. closes — copy/paste edits are the most common source of
   duplicated or orphaned closing tags.
2. Check CSS brace balance the same way.
3. `node --check script.js` to catch JS syntax errors.
4. Copy the three files into `/mnt/user-data/outputs/` and call `present_files` —
   editing in place in a working directory doesn't make changes visible to the
   person.

---

## 5. Editorial principles

- **Verify, don't infer.** This applies to GitHub repos (§2) but also to any new
  source document — read the actual content before writing a claim from it.
- **Surface conflicts, don't silently resolve them.** If two source documents
  disagree, say so.
- **Don't fabricate contact details, URLs, or press coverage.** Only include what's
  explicitly present in a source the person provided.
- **Keep the "dispatch board" concept intact.** New sections or content should use
  the existing tokens (`--amber`, `--teal`, mono eyebrow labels, pill/chip patterns)
  rather than introducing a new visual language.
- **Correct past mistakes plainly.** If a re-check turns up something wrong that's
  already live on the site (as happened with `wdd231`/`Group05`), fix it and tell
  the person what changed and why, rather than quietly patching it.
