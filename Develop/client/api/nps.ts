export default async function handler(req: any, res: any) {
  const apiKey = process.env.NPS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing server NPS API key' });

  const { id, stateCode, q, start = '0', limit = '100' } = req.query;

  const params = new URLSearchParams();
  params.set('api_key', apiKey);
  params.set('limit', String(limit));
  params.set('start', String(start));

  if (id) {
    params.set('id', String(id));
  } else {
    if (stateCode) params.set('stateCode', String(stateCode));
    if (q) params.set('q', String(q));
  }

  try {
    const url = `https://developer.nps.gov/api/v1/parks?${params.toString()}`;
    const r = await fetch(url);
    const data = await r.json();
    console.log('NPS proxy response:', {
      url,
      status: r.status,
      total: data?.total,
      start: data?.start,
      returned: Array.isArray(data?.data) ? data.data.length : undefined,
    });
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (err) {
    console.error('NPS proxy error', err);
    return res.status(500).json({ error: 'NPS proxy error' });
  }
}