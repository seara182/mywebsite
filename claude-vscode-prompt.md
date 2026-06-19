# Task: Create website repo "mywebsite" on GitHub

## Step 1: Create the GitHub repo

Use the GitHub CLI or VS Code's GitHub integration to create a new **public** repository named `mywebsite` under the authenticated GitHub account. Initialize it with a README.

```bash
gh repo create mywebsite --public --clone --description "Personal website"
cd mywebsite
```

---

## Step 2: Create the file structure

Create the following files **with no CSS, no styling, no design** — pure semantic HTML skeleton only:

```
mywebsite/
├── index.html               ← "Under Construction"
├── app/
│   └── index.html           ← Bay Window App page (release date TBD)
└── private/
    ├── index.html           ← Password gate (JS-based, SHA-256)
    └── haribo-monster.html  ← Placeholder page "Harribo-Monster" (own project, TBD)
```

---

## Step 3: File contents

### `index.html`
Plain HTML5 boilerplate. Body content: heading "Under Construction" and a short note that the site is being built. No nav, no links yet.

### `app/index.html`
Page introducing a sports dashboard app called **Bay Window**. Sections:
- App name + tagline (placeholder text)
- Short description (placeholder)
- "Release date: TBD"
- Placeholder for screenshots

### `private/index.html`
Password gate page. Requirements:
- Password input field + submit button
- SHA-256 check via `window.crypto.subtle` (no external libraries)
- On correct password: show a simple `<ul>` list of links to subpages
- On wrong password: inline error message (no alert())
- Hash placeholder: use the SHA-256 hash of the string `changeme` for now
- Session persistence: store auth in `sessionStorage` so the user doesn't re-enter on refresh
- The link list should include: `haribo-monster.html`

### `private/haribo-monster.html`
Minimal placeholder page. Just a heading "Harribo-Monster" and "— coming soon —". No nav.

---

## Step 4: Initial commit and push

```bash
git add .
git commit -m "Initial commit: bare HTML skeleton, no styling"
git push -u origin main
```

---

## Notes for Claude Code
- No CSS whatsoever — not even inline styles
- No JavaScript except the SHA-256 auth on `private/index.html`
- No external libraries, no CDN links
- Valid HTML5 with `lang="de"` and proper `<meta charset="UTF-8">`
- Filenames lowercase, no spaces
