import { useState } from 'react';
import type { FormEvent } from 'react';
import { Container } from 'react-bootstrap';
import { fetchParks } from '../utils/API';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SAVE_PARK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';

const SearchParks = () => {
  const [searchedParks, setSearchedParks] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [saveParkMutation] = useMutation(SAVE_PARK, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput) {
      console.error('Please enter a location.');
      return;
    }

    try {
      const response = await fetchParks(searchInput);
      setSearchedParks(response || []);
    } catch (err) {
      console.error('Error fetching parks:', err);
    }
  };

  const handleSavePark = async (park: any) => {
    try {
      await saveParkMutation({
        variables: {
          input: {
            parkId: park.id,
            fullName: park.fullName,
            description: park.description,
            states: park.states,
            images:
              park.images?.map((image: any) => ({
                credit: image.credit,
                title: image.title,
                altText: image.altText,
                caption: image.caption,
                url: image.url,
              })) || [],
          },
        },
      });
    } catch (err) {
      console.error('Error saving park:', err);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('	https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Inspration_Point_Bryce_Canyon_November_2018_panorama.jpg",
      }}
    >
      <div className="bg-black bg-opacity-50 min-h-screen">
        <div className="bg-blue-900 text-light p-5 bg-opacity-80">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4 text-white">
              Search for National Parks near you!
            </h1>
            <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row gap-4">
              <input
                name="searchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                placeholder="Enter your state"
                className="w-full md:w-2/3 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full md:w-1/3 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
              >
                Submit Search
              </button>
            </form>
          </div>
        </div>

        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {searchedParks.map((park) => (
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg" key={park.id}>
                {park.images?.length > 0 ? (
                  <img
                    src={park.images[0].url}
                    alt={`Image of ${park.fullName}`}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{park.fullName}</h3>
                  <p className="text-sm text-gray-500">Location: {park.states}</p>
                  <p className="mt-2 text-gray-700">{park.description}</p>
                  <div className="mt-4 space-y-2">
                    <Link to={`/park/${park.id}`} className="block">
                      <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        View More Details
                      </button>
                    </Link>
                    <button
                      className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                      onClick={() => handleSavePark(park)}
                    >
                      Add to Travel List
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default SearchParks;
