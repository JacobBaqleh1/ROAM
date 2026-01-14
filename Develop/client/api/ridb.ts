export default async function handler(req: any, res: any) {
  const apiKey = process.env.RIDB_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing RIDB API key' });

  const { state, query, limit = '20', start = '0' } = req.query;
  const params = new URLSearchParams();
  params.set('apikey', apiKey);
  params.set('limit', String(limit));
  params.set('offset', String(start));
  if (state) params.set('state', String(state));
  if (query) params.set('query', String(query));

  try {
    const url = `https://ridb.recreation.gov/api/v1/facilities?${params.toString()}`;
    const r = await fetch(url);
    const data = await r.json();
     console.log('RIDB proxy response:', {
      url,
      status: r.status,
      returned: Array.isArray(data.RECDATA) ? data.RECDATA.length : undefined,
      sample: Array.isArray(data.RECDATA) ? data.RECDATA.slice(0, 3) : data,
      raw: (process.env.NODE_ENV === 'development') ? data : undefined, // avoid huge logs in prod
    });
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (err) {
    console.error('RIDB proxy error', err);
    return res.status(500).json({ error: 'RIDB proxy error' });
  }
}