import stateMap from '../constants/stateMap';

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://roam-ynw2.onrender.com';

export async function fetchParks(userInput: string) {
  userInput = (userInput || '').trim();
  if (!userInput) return [];

  const isState = Object.keys(stateMap).includes(userInput.toLowerCase());
  const isAbbrev = Object.values(stateMap).includes(userInput.toUpperCase());

  const npsParams = new URLSearchParams();
  // ridbParams kept for when campground feature is re-enabled
  // const ridbParams = new URLSearchParams();

  if (isState) {
    const code = stateMap[userInput.toLowerCase()];
    npsParams.set('stateCode', code);
    // ridbParams.set('state', code);
  } else if (isAbbrev) {
    const code = userInput.toUpperCase();
    npsParams.set('stateCode', code);
    // ridbParams.set('state', code);
  } else {
    npsParams.set('q', userInput);
    // ridbParams.set('query', userInput);
  }

  npsParams.set('limit', '100');
  // ridbParams.set('limit', '50');

  try {
    const npsResult = await fetch(`${BASE}/api/nps?${npsParams.toString()}`).catch(() => null);

    let npsData: any[] = [];

    if (npsResult?.ok) {
      const json = await npsResult.json();
      npsData = Array.isArray(json.data) ? json.data : [];
    }

    // RIDB campsite results are paused — re-enable when campground feature is ready
    // const ridbResult = await fetch(`${BASE}/api/ridb?${ridbParams.toString()}`).catch(() => null);
    // let ridbData: any[] = [];
    // if (ridbResult?.ok) { ... map RIDB facilities ... }

    return [...npsData];
  } catch (err) {
    console.error('Error fetching parks', err);
    return [];
  }
}

export async function fetchParkById(id: string) {
  const res = await fetch(`${BASE}/api/nps?id=${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data.data) && data.data.length ? data.data[0] : null;
}

export async function fetchWeatherCoords(lat: string, lon: string) {
  const res = await fetch(`${BASE}/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
  if (!res.ok) return null;
  return await res.json();
}

export async function fetchRIDBFacilities(query: string) {
  const res = await fetch(`${BASE}/api/ridb?${new URLSearchParams({ query })}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.RECDATA || [];
}
