import stateMap from '../constants/stateMap';

const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://roam-ynw2.onrender.com';

export async function fetchParks(userInput: string) {
  userInput = (userInput || '').trim();
  if (!userInput) return [];

  const isState = Object.keys(stateMap).includes(userInput.toLowerCase());
  const isAbbrev = Object.values(stateMap).includes(userInput.toUpperCase());

  const npsParams = new URLSearchParams();
  const ridbParams = new URLSearchParams();

  if (isState) {
    const code = stateMap[userInput.toLowerCase()];
    npsParams.set('stateCode', code);
    ridbParams.set('state', code);
  } else if (isAbbrev) {
    const code = userInput.toUpperCase();
    npsParams.set('stateCode', code);
    ridbParams.set('state', code);
  } else {
    npsParams.set('q', userInput);
    ridbParams.set('query', userInput);
  }

  npsParams.set('limit', '100');
  ridbParams.set('limit', '50');

  try {
    const [npsResult, ridbResult] = await Promise.allSettled([
      fetch(`${BASE}/api/nps?${npsParams.toString()}`),
      fetch(`${BASE}/api/ridb?${ridbParams.toString()}`),
    ]);

    let npsData: any[] = [];
    let ridbData: any[] = [];

    if (npsResult.status === 'fulfilled') {
      const r = npsResult.value;
      if (r.ok) {
        const json = await r.json();
        npsData = Array.isArray(json.data) ? json.data : [];
      }
    }

    if (ridbResult.status === 'fulfilled') {
      const r = ridbResult.value;
      if (r.ok) {
        const json = await r.json();
        const rec = Array.isArray(json.RECDATA) ? json.RECDATA : [];
        ridbData = rec.map((it: any) => {
          const media = Array.isArray(it.FACILITYMEDIA) ? it.FACILITYMEDIA : [];
          const images = media
            .filter((m: any) => /image|photo/i.test(m.MediaType ?? ''))
            .map((m: any) => ({
              url: m.URL ?? m.url ?? '',
              title: m.Title ?? m.title ?? '',
              credit: m.Credits ?? m.credits ?? '',
              caption: m.Caption ?? m.caption ?? '',
              altText: m.Title ?? m.title ?? '',
            }))
            .filter((m: any) => m.url);

          const addr = Array.isArray(it.FACILITYADDRESS) ? it.FACILITYADDRESS[0] : null;
          const stateCode = it.FacilityStateCode ?? addr?.AddressStateCode ?? '';
          const address = addr
            ? [addr.AddressLine1, addr.City, addr.AddressStateCode, addr.PostalCode]
                .filter(Boolean).join(', ')
            : '';

          const activities = Array.isArray(it.FACILITYACTIVITY)
            ? it.FACILITYACTIVITY.map((a: any) => a.ActivityName).filter(Boolean)
            : [];

          return {
            id: String(it.FacilityID ?? it.facilityID ?? it.id ?? ''),
            fullName: it.FacilityName ?? it.facilityName ?? '',
            description: it.FacilityDescription ?? it.FacilityDescriptionBody ?? '',
            url: it.FacilityReservationURL ?? it.ReservableURL ?? '',
            states: stateCode,
            images,
            phone: it.FacilityPhone ?? '',
            email: it.FacilityEmail ?? '',
            facilityType: it.FacilityTypeDescription ?? '',
            activities,
            address,
            parkCode: 'RIDB',
            latitude: it.FacilityLatitude ?? it.Latitude ?? null,
            longitude: it.FacilityLongitude ?? it.Longitude ?? null,
            source: 'ridb',
            raw: it,
          };
        });
      }
    }

    return [...npsData, ...ridbData];
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
