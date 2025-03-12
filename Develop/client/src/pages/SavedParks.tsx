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
  const [deletePark] = useMutation(DELETE_PARK,{
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
    <div className="bg-dark text-light py-5">
      <Container>
        <h2 className="text-center">
          {userData?.savedParks.length
            ? `Viewing ${userData.savedParks.length} saved ${userData.savedParks.length === 1 ? 'park' : 'parks'}:`
            : 'You have no saved parks!'}
        </h2>

        {userData?.savedParks.length ? (
          <Row className="gy-4">
            {userData.savedParks.map((park) => (
              <Col md="4" key={park.parkId} className="d-flex">
                <Card className="flex-fill" border="dark">
                  {park.images?.length > 0 && (
  <Card.Img src={park.images[0].url} alt={`View of ${park.fullName}`} variant="top" />
)}
                  <Card.Body>
                    <Card.Title>{park.fullName}</Card.Title>
                    <p className="small text-muted">Location: {park.states}</p>
                    <Card.Text>{park.description}</Card.Text>
                    <Button
                      variant="danger"
                      className="w-100"
                      onClick={() => handleDeletePark(park.parkId)}
                    >
                      Remove from Travel List
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center">No saved parks found. Explore some parks and save them to your list!</p>
        )}
      </Container>
    </div>
  );
};

export default SavedParks;
