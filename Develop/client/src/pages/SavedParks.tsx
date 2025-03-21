import { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';

import Auth from '../utils/auth.js';
import { QUERY_ME } from '../utils/queries.js';
import { DELETE_PARK } from '../utils/mutations.js';
import { Park } from '../models/Park.js';

interface UserData {
  _id: string;
  username: string;
  email: string;
  savedParks: Park[];
}

const SavedParks = () => {
  // Fetch user data
  const { loading, error, data } = useQuery(QUERY_ME, {
    skip: !Auth.loggedIn(),// Avoid fetching if user is not logged in

  });

  // Delete park mutation
  const [deletePark] = useMutation(DELETE_PARK, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  // State to hold user data
  const [userData, setUserData] = useState<UserData | null>(null);

  // Update user data when query returns
  useEffect(() => {
    if (data) {
      setUserData(data.me);
    }
  }, [data]);

  // Function to remove a saved park
  const handleDeletePark = async (parkId: string) => {
    try {
      await deletePark({
        variables: { parkId },
      });
      // Update local state manually instead of waiting for refetch()
      setUserData((prevUserData) => {
        if (!prevUserData) return null;
        return {
          ...prevUserData,
          savedParks: prevUserData.savedParks.filter((park) => park.parkId !== parkId),
        };
      });
    } catch (err) {
      console.error('Error deleting park:', err);
    }
  };

  // Loading state
  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="light" /></div>;

  // Error state
  if (error) return <p className="text-center text-danger">Error: {error.message}</p>;

  // If user is not logged in
  if (!Auth.loggedIn()) {
    return <h2 className="text-center text-light py-5">Please log in to view saved parks.</h2>;
  }

  return (
    <div className="bg-white text-black py-5">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-center text-xl font-semibold mb-6">
          {userData?.savedParks.length
            ? `Viewing ${userData.savedParks.length} saved ${userData.savedParks.length === 1 ? 'park' : 'parks'}:`
            : 'You have no saved parks!'}
        </h2>

        {userData?.savedParks.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {userData.savedParks.map((park) => (
              <div key={park.parkId} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
                {park.images?.length > 0 && (
                  <img src={park.images[0].url} alt={`View of ${park.fullName}`} className="w-full h-40 object-cover" />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg text-white font-semibold">{park.fullName}</h3>
                  <p className="text-sm text-gray-400">Location: {park.states}</p>
                  <p className="text-gray-300 flex-grow">{park.description}</p>
                  <button
                    className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-all"
                    onClick={() => handleDeletePark(park.parkId)}
                  >
                    Remove from Travel List
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No saved parks found. Explore some parks and save them to your list!</p>
        )}
      </div>
    </div>

  );
};

export default SavedParks;
