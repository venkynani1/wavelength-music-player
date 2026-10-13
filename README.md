# Wavelength

A Spotify-style web music player that streams full-length, free tracks from the open [Audius](https://audius.co) network. No ads, no API key, no backend.

## Features
- Home with trending tracks (filterable by genre) and popular playlists
- Search songs and playlists (debounced, live results)
- Playlist pages with Play all
- Player bar: play/pause, next/previous, seek, volume and mute, shuffle, repeat (all / one)
- Liked Songs and Recently Played (saved in the browser)
- Lock-screen and headphone controls through the Media Session API
- Keyboard: Space = play/pause, Shift + ←/→ = previous/next
- Responsive layout with a bottom nav and mini-player on phones

## Deploy to Vercel
**Option A, GitHub (no tools needed)**
1. Create a new GitHub repo and upload `index.html`, `vercel.json` and this README.
2. On vercel.com, click **Add New → Project**, then import the repo.
3. Set Framework Preset to **Other** and leave the build command empty. Click **Deploy**.

**Option B, CLI**
```bash
npm i -g vercel
cd wavelength
vercel --prod
```

## Run locally
```bash
npx serve .
```
Then open http://localhost:3000.

## Notes
- All music comes from Audius's public API; artists publish it there for free streaming.
- `app_name` in `index.html` identifies the app to Audius. Change it to your own app name.
