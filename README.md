# AMU Hub — Real Production Website

Mobile-first student community for AMU.

## How to run (beginner friendly)

### Option A: Edit directly on GitHub (easiest, no VS Code needed)
1. Create a new repo on github.com called `amu-hub` (Public)
2. Click "Add file" > "Upload files" > drag all files from this folder
3. Commit
4. Go to vercel.com > Add New Project > Import your `amu-hub` repo > Deploy
5. Done — you get a live link like `amu-hub.vercel.app`
6. To change text: go to GitHub > `app/page.tsx` > click pencil icon > edit > Commit. Vercel auto-deploys.

### Option B: Local edit (VS Code)
1. Install Node.js from nodejs.org
2. Open terminal in this folder
3. Run: `npm install`
4. Run: `npm run dev`
5. Open http://localhost:3000

## Where to edit what?
- All UI is in `app/page.tsx` — search for text like "AMU students. One place." and change it
- Categories: find `CATEGORIES` array at top
- Posts: find `INITIAL_POSTS`
- Colors: search for `#132E26` (deep green) and `#FEFEFD`
- Images: in `public/images/` — replace with your own AMU pics, keep same filenames

## Next steps
- Add Supabase: create project at supabase.com, add tables as per spec (users, posts, comments, messages, etc)
- Connect auth
- Add real image upload

Built for MVP — no followers, no ads, no AI chatbot. Just searchable anonymous help.
