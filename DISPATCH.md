# DISPATCH: Deploy Cube Master
# Owner: Ethan Peterson
# Goal: GitHub repo + live Vercel URL
# Time: ~10 minutes

## What this is
A single-page web game (static HTML, no build step). The folder
`cube-runner-2026/` is already a git repo with one commit. Your job:
push it to GitHub under Ethan's account and deploy it on Vercel.

## Prerequisites (check first)
Open Terminal and verify:

    git --version          # any version is fine
    gh --version           # GitHub CLI — if missing: brew install gh
    node --version         # needed only for vercel CLI fallback

If `gh` is not logged in:

    gh auth login          # choose GitHub.com → HTTPS → login via browser
                           # use Ethan's GitHub account

## Step 1 — Unzip and enter the project

    cd ~/Downloads
    unzip cube-runner-2026-dispatch.zip
    cd cube-runner-2026

Confirm contents: index.html, README.md, vercel.json, .gitignore, .git/

## Step 2 — Create the GitHub repo and push

    gh repo create cube-runner-2026 --public --source=. --push

Expected output ends with a repo URL like:
https://github.com/<ethans-username>/cube-runner-2026

If `gh` is unavailable, fallback:
1. Create an empty public repo named `cube-runner-2026` at github.com/new
   (no README, no .gitignore — repo must be empty)
2. Then:

    git remote add origin https://github.com/<USERNAME>/cube-runner-2026.git
    git push -u origin main

   (If push fails on branch name: `git branch -M main` then push again.)

## Step 3 — Deploy on Vercel (dashboard, recommended)
1. Go to vercel.com → log in with Ethan's account
2. Add New → Project
3. Import `cube-runner-2026` from the GitHub list
   (If it doesn't appear: "Adjust GitHub App Permissions" → grant access
   to the new repo)
4. Leave ALL settings default — Framework Preset: "Other", no build
   command, no output directory. It is a plain static site.
5. Click Deploy

CLI alternative:

    npx vercel@latest login
    npx vercel@latest --prod

## Step 4 — Verify
1. Open the production URL Vercel gives you (something like
   https://cube-runner-2026.vercel.app)
2. On a desktop browser: page loads, "Run" button works, arrow keys steer.
3. THE REAL TEST — on an iPhone in Safari:
   - Open the URL
   - Tap "Run"
   - iOS will prompt: "...would like to access Motion and Orientation" → Allow
   - The small status line should read: "Tilt: active"
   - Tilt the phone — the arrow should steer. Rotate to landscape — it
     should recalibrate and keep working.

## Step 5 — Report back
Send Ethan:
- The GitHub repo URL
- The Vercel production URL
- Confirmation that "Tilt: active" appeared on iPhone

## Troubleshooting
- Tilt says "unavailable": make sure you're on the https:// Vercel URL,
  not a file opened locally. Motion sensors require HTTPS.
- Permission prompt never appeared: Settings → Safari → make sure
  "Motion & Orientation Access" is on (older iOS), or clear website data
  for the domain and retry.
- Vercel asks for a root directory: it's the repo root (where index.html
  lives).
- Do NOT add a build command. There is nothing to build.
