const KEY = 'cube-runner-lb';
const MAX = 100;
const PREVIEW = 10;

async function upstash(commands) {
  const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  return (await res.json()).map(r => r.result);
}

function parseScores(raw) {
  const out = [];
  for (let i = 0; i + 1 < raw.length; i += 2) {
    out.push({ initials: raw[i].split(':')[0], score: parseInt(raw[i + 1]) });
  }
  return out;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const full = req.query.full === '1';
    const limit = full ? MAX : PREVIEW;
    try {
      const [raw] = await upstash([['ZREVRANGE', KEY, 0, limit - 1, 'WITHSCORES']]);
      return res.json({ scores: parseScores(raw || []) });
    } catch {
      return res.status(503).json({ scores: [] });
    }
  }

  if (req.method === 'POST') {
    const { initials, score } = req.body || {};
    if (typeof initials !== 'string' || !/^[A-Z0-9]{1,3}$/i.test(initials.trim())) {
      return res.status(400).json({ error: 'Bad initials' });
    }
    const s = Math.floor(Number(score));
    if (!isFinite(s) || s < 1 || s > 99999) {
      return res.status(400).json({ error: 'Bad score' });
    }
    try {
      const member = `${initials.trim().toUpperCase()}:${Date.now()}`;
      const [, card] = await upstash([
        ['ZADD', KEY, s, member],
        ['ZCARD', KEY],
      ]);
      if (card > MAX) {
        await upstash([['ZREMRANGEBYRANK', KEY, 0, card - MAX - 1]]);
      }
      const [raw] = await upstash([['ZREVRANGE', KEY, 0, MAX - 1, 'WITHSCORES']]);
      return res.json({ scores: parseScores(raw || []) });
    } catch {
      return res.status(503).json({ error: 'Service unavailable' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
