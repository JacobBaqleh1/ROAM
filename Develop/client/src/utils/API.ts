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

export async function fetchParks(userInput: string) {
    const apiKey = 'IjtCC2uKsdG5k1DIn07ABIZDFBvB0shlKY0Whu2i';
    let url;
    userInput = userInput.trim().toLowerCase();

     if (stateMap[userInput]) {
        // If input is a full state name, convert to abbreviation
        const stateCode = stateMap[userInput];
        url = `https://developer.nps.gov/api/v1/parks?limit=10&stateCode=${stateCode}&api_key=${apiKey}`;
    } else if (Object.values(stateMap).includes(userInput.toUpperCase())) {
        // If input is already a valid state abbreviation
        const stateCode = userInput.toUpperCase();
        url = `https://developer.nps.gov/api/v1/parks?limit=10&stateCode=${stateCode}&api_key=${apiKey}`;
    } 
    
   else {
        // General search by park name
        url = `https://developer.nps.gov/api/v1/parks?limit=10&q=${encodeURIComponent(userInput)}&api_key=${apiKey}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.data.length === 0) {
            console.log("No parks found.");
        } else {
           console.log("Parks found:", data.data);
            return data.data;
        }
    } catch (error) {
        console.error("Error fetching parks:", error);
    }
}

export async function fetchParkById(id: string) {
  const apiKey = 'IjtCC2uKsdG5k1DIn07ABIZDFBvB0shlKY0Whu2i';
  const url = `https://developer.nps.gov/api/v1/parks?id=${id}&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data[0]; // API returns an array, so get the first item
  } catch (error) {
    console.error('Error fetching park details:', error);
    return null;
  }
}

// Example Usage
// fetchParks("Oregon"); // ✅ Works with full state name
// fetchParks("or");      // ✅ Works with lowercase abbreviation
// fetchParks("OR");      // ✅ Works with uppercase abbreviation
// fetchParks("97205");   // ✅ Works with ZIP code
// fetchParks("NotAState"); // ❌ Shows error message
