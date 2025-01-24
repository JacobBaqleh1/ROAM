export async function fetchParks() {
    try {
        const response = await fetch("https://developer.nps.gov/api/v1/parks", {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                ...(process.env.NEXT_PUBLIC_PARK_API && { 'X-Api-Key': process.env.NEXT_PUBLIC_PARK_API })
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching parks:', error);
    }
}