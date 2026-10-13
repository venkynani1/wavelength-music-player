# Wavelength

A Spotify-style web music player with two legal sources:

- **Indian hits (YouTube):** Telugu, Hindi and Tamil film songs, new and old, played through YouTube's official embedded player from the labels' official channels. YouTube may show its own ads unless the listener has YouTube Premium.
- **Free & independent (Audius):** full-length, ad-free tracks from the open Audius network.

## Features
- Home: Indian hits tabs (Trending in India, Telugu/Hindi/Tamil Latest and Old Hits), plus Audius trending by genre and playlists
- Search across YouTube songs, Audius tracks and playlists
- Player bar: play/pause, next/previous, seek, volume and mute, shuffle, repeat (all / one)
- Liked Songs and Recently Played (saved in the browser), mixing both sources
- Lock-screen controls for Audius tracks, keyboard shortcuts (Space, Shift + ←/→)
- Responsive layout with a bottom nav and mini-player on phones

## Setup

### 1. Get a free YouTube API key
1. Open https://console.cloud.google.com and create a project (any name).
2. Go to **APIs & Services → Library**, search **YouTube Data API v3**, and click **Enable**.
3. Go to **APIs & Services → Credentials → Create credentials → API key** and copy the key.
4. Optional but recommended: edit the key and restrict it to **YouTube Data API v3**.

### 2. Deploy on Vercel
1. On vercel.com, click **Add New → Project** and import this repo (Framework Preset: **Other**).
2. Under **Settings → Environment Variables**, add `YOUTUBE_API_KEY` with your key.
3. Deploy, or redeploy if the project already existed, so the key takes effect.

The key stays on the server: the page calls `/api/yt`, a small Vercel function that talks to YouTube.

## Install as an app
Wavelength is a Progressive Web App (PWA).
- **Android (Chrome):** open the site and tap **Install app** on Home, or use ⋮ → **Install app**.
- **iPhone (Safari):** tap **Share → Add to Home Screen**.

It then opens full-screen from its own icon. Updates arrive automatically whenever you push to `main`.

## Quota
The free YouTube quota is 10,000 units a day. A search costs about 101 units and "Trending in India" about 1. Results are cached on Vercel for up to 6 hours, so repeated searches and tabs are almost free. For heavy use, request a quota increase in Google Cloud.

## Known limits
- YouTube songs need the video player visible, as YouTube's rules require, and usually stop when a phone screen locks.
- Audius tracks keep playing in the background.

## Run locally
```bash
npm i -g vercel
vercel dev
```
`vercel dev` runs the `/api/yt` function too. Put the key in a `.env` file as `YOUTUBE_API_KEY=...` and never commit that file.
