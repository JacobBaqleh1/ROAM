// api/weather.ts
export default async function handler(req: any, res: any) {
  const { lat, lon } = req.query;

  // 1. VALIDATION: Check if they actually sent numbers
  if (!lat || !lon || isNaN(Number(lat)) || isNaN(Number(lon))) {
    return res.status(400).json({ error: "Invalid coordinates provided" });
  }

  // 2. SECRET KEY: Stays safe on the server
  const key = process.env.WEATHER_API_KEY ; 
if (!key) return res.status(500).json({error: 'Missing Weather api key'})
    
 try{
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${key}&q=${lat},${lon}`
  );
    const data = await response.json();
res.status(200).json(data);
} catch (err) {
    console.error('Weather preoxy error', err);
    return res.status(500).json({error: 'Weather proxy error'})
}
} 