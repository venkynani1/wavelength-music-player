// Vercel serverless function: proxies the YouTube Data API so the API key
// stays on the server (set YOUTUBE_API_KEY in Vercel → Settings → Environment Variables).
// Responses are cached at Vercel's edge to save daily quota.

const BASE = 'https://www.googleapis.com/youtube/v3';

const isoToSeconds = d => {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d || '');
  return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
};

async function call(path, params, key) {
  const u = new URL(BASE + path);
  for (const [k, v] of Object.entries({ ...params, key })) u.searchParams.set(k, v);
  const r = await fetch(u);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error?.message || 'YouTube error ' + r.status);
  return j;
}

const toTrack = v => {
  const th = v.snippet?.thumbnails || {};
  return {
    id: 'yt:' + v.id,
    vid: v.id,
    src: 'yt',
    title: v.snippet?.title || 'Untitled',
    user: { name: v.snippet?.channelTitle || '' },
    duration: isoToSeconds(v.contentDetails?.duration),
    genre: 'YouTube',
    artwork: {
      '150x150': (th.medium || th.default)?.url,
      '480x480': (th.high || th.medium || th.default)?.url
    }
  };
};

module.exports = async (req, res) => {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return res.status(500).json({ error: 'YouTube is not set up yet: add YOUTUBE_API_KEY in Vercel and redeploy.' });

  const mode = String(req.query.mode || 'search');
  const region = String(req.query.region || 'IN').slice(0, 2);
  const detail = { part: 'snippet,contentDetails,status' };

  try {
    let items;
    if (mode === 'popular') {
      const j = await call('/videos', { ...detail, chart: 'mostPopular', regionCode: region, videoCategoryId: '10', maxResults: '50' }, key);
      items = j.items || [];
    } else {
      const q = String(req.query.q || '').trim().slice(0, 100);
      if (!q) return res.status(400).json({ error: 'Missing search text' });
      const s = await call('/search', {
        part: 'id', q, type: 'video', videoCategoryId: '10', videoEmbeddable: 'true',
        regionCode: region, maxResults: '50', safeSearch: 'moderate'
      }, key);
      const ids = (s.items || []).map(i => i.id?.videoId).filter(Boolean);
      if (!ids.length) items = [];
      else items = (await call('/videos', { ...detail, id: ids.join(',') }, key)).items || [];
    }

    const tracks = items.filter(v => v.status?.embeddable !== false).map(toTrack);
    res.setHeader('Cache-Control', mode === 'popular'
      ? 's-maxage=3600, stale-while-revalidate=86400'
      : 's-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).json({ data: tracks });
  } catch (e) {
    return res.status(502).json({ error: e.message });
  }
};
