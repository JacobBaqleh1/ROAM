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
}`;



export const QUERY_ME = gql`
  query Me {
     me {
    savedParks {
      description
      fullName
      images {
        url
        altText
        caption
        credit
        title
      }
      location
      states
      parkId
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
}`;

export const QUERY_ALL_REVIEWS = gql`
query GetAllReviews {
getAllReviews {
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

export const QUERY_SAVED_PARKS = gql`
  query GetSavedParks {
    getSavedParks {
      parkId
      fullName
      description
      images {
        url
        altText
        credit
        title
        caption
      }
      states
    }
  }
`;



export const QUERY_USER_REVIEWS = gql`
  query GetUserReviews {
    getUserReviews {
      _id
      parkId
      parkFullName
      username
      comment
      rating
      createdAt
    }
  }
`;
