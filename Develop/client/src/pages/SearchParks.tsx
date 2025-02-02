import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import { fetchParks } from '../utils/API';
import { Link } from 'react-router-dom';

const SearchParks = () => {
  const [searchedParks, setSearchedParks] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    console.log('Parks updated:', searchedParks);
  }, [searchedParks]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput) {
      console.error("Please enter a location.");
      return;
    }

    try {
      const response = await fetchParks(searchInput);

   

      if (response) {
        setSearchedParks(response); // Store parks instead of books
      } else {
        setSearchedParks([]); // Set an empty array if response is undefined
      }
    } catch (err) {
      console.error("Error fetching parks:", err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for National Parks near you!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Enter your zipcode or state'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedParks.length
            ? `Viewing ${searchedParks.length} results:`
            : 'Enter your location to begin'}
        </h2>
        <Row>
          {searchedParks.map((park) => (
            <Col md="4" key={park.id}>
              <Card border='dark'>
                {park.images?.length > 0 ? (
                  <Card.Img src={park.images[0].url} alt={`Image of ${park.fullName}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{park.fullName}</Card.Title>
                  <p className='small'>Location: {park.states}</p>
                  <Card.Text>{park.description}</Card.Text>
                 <Link to={`/park/${park.id}`}>
                    <Button className='btn-block btn-info'>View More Details</Button>
                    </Link>
                  <Button className='btn-block btn-info' >
                    View On Map
                  </Button>
                  <Button className='btn-block btn-info' >
                    Add to Travel List
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchParks;
