const stateMap: Record<string, string> = {
    "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR", "california": "CA",
    "colorado": "CO", "connecticut": "CT", "delaware": "DE", "florida": "FL", "georgia": "GA",
    "hawaii": "HI", "idaho": "ID", "illinois": "IL", "indiana": "IN", "iowa": "IA",
    "kansas": "KS", "kentucky": "KY", "louisiana": "LA", "maine": "ME", "maryland": "MD",
    "massachusetts": "MA", "michigan": "MI", "minnesota": "MN", "mississippi": "MS", "missouri": "MO",
    "montana": "MT", "nebraska": "NE", "nevada": "NV", "new hampshire": "NH", "new jersey": "NJ",
    "new mexico": "NM", "new york": "NY", "north carolina": "NC", "north dakota": "ND", "ohio": "OH",
    "oklahoma": "OK", "oregon": "OR", "pennsylvania": "PA", "rhode island": "RI", "south carolina": "SC",
    "south dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT", "vermont": "VT",
    "virginia": "VA", "washington": "WA", "west virginia": "WV", "wisconsin": "WI", "wyoming": "WY"
};

export 
async function fetchParks(userInput: string) {
  userInput = (userInput || '').trim();
  if (!userInput) return [];

  const isState = Object.keys(stateMap).includes(userInput.toLowerCase());
  const isAbbrev = Object.values(stateMap).includes(userInput.toUpperCase());

  // build NPS params
  const npsParams = new URLSearchParams();
  // const ridbParams = new URLSearchParams(); // RIDB disabled — re-enable when campsite UI is ready

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
    const npsResponse = await fetch(`/api/nps?${npsParams.toString()}`);

    let npsData: any[] = [];

    if (npsResponse.ok) {
      const json = await npsResponse.json();
      npsData = Array.isArray(json.data) ? json.data : [];
    } else {
      console.warn('NPS proxy returned status', npsResponse.status);
    }

    // RIDB campsite fetch disabled — preserved for future re-enable
    // const ridbResponse = await fetch(`/api/ridb?${ridbParams.toString()}`);
    // let ridbData: any[] = [];
    // if (ridbResponse.ok) {
    //   const json = await ridbResponse.json();
    //   const rec = Array.isArray(json.RECDATA) ? json.RECDATA : [];
    //   ridbData = rec.map((it: any) => ({
    //     id: String(it.FacilityID ?? it.facilityID ?? it.id ?? ''),
    //     fullName: it.FacilityName ?? it.facilityName ?? '',
    //     description: it.FacilityDescription ?? it.FacilityDescriptionBody ?? '',
    //     url: it.FacilityReservationURL ?? it.ReservableURL ?? '',
    //     parkCode: 'RIDB',
    //     latitude: it.FacilityLatitude ?? it.Latitude ?? null,
    //     longitude: it.FacilityLongitude ?? it.Longitude ?? null,
    //     source: 'ridb',
    //     raw: it
    //   }));
    // }

    return npsData; // return [...npsData, ...ridbData] when RIDB is re-enabled
  } catch (err) {
    console.error('Error fetching parks from proxies', err);
    return [];
  }
}

export async function fetchParkById(id: string) {
  const res = await fetch(`/api/nps?id=${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data.data) && data.data.length ? data.data[0] : null;
}

export async function fetchWeatherCoords(lat: string, lon: string) {
  const res = await fetch(`/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
  if (!res.ok) return null;
  return await res.json();
}

export async function fetchRIDBFacilities(query: string) {
  const res = await fetch(`/api/ridb?${new URLSearchParams({ query })}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.RECDATA || [];
}

// Example Usage
// fetchParks("Oregon"); // ✅ Works with full state name
// fetchParks("or");      // ✅ Works with lowercase abbreviation
// fetchParks("OR");      // ✅ Works with uppercase abbreviation
// fetchParks("97205");   // ✅ Works with ZIP code
// fetchParks("NotAState"); // ❌ Shows error message
