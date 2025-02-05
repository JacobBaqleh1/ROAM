import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query User($username: String!) {
    user(username: $username) {
      _id
      username
      email
      savedParks {
        parkId
        fullName
        description
        images {
          url
          altText
        }
        states
      }
    }
  }
`;

export const QUERY_ME = gql`
  query Me {
    me {
      _id
      username
      email
      savedParks {
        parkId
        fullName
        description
        images {
          url
          altText
        }
        states
      }
    }
  }
`;

export const QUERY_PARK_REVIEWS = gql`
  query GetParkReviews($parkId: String!) {
    getParkReviews(parkId: $parkId) {
      _id
      parkId
      userId
      username
      comment
      rating
      createdAt
    }
  }
`;
