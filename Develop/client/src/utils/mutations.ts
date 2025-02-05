import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation($input: AddUserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation AddReview($input: AddReviewInput!) {
    addReview(input: $input) {
      _id
      parkId
      userId
      username
      rating
      comment
      createdAt
    }
  }
`;  

export const UPDATE_REVIEW = gql`
mutation UpdateReview($reviewId: ID!, $comment: String!) {
  updateReview(reviewId: $reviewId, comment: $comment) {
    _id
    comment
  }
}
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId) {
      _id
      comment
    }
  }
`;


export const SAVE_PARK = gql`
  mutation SavePark($input: ParkInput!) {
    savePark(input: $input) {
      _id
      savedParks {
        parkId
        fullName
        description
        states
        images {
      credit
      title
      altText
      caption
      url
    }
      }
    }
  }
`;


export const DELETE_PARK = gql`
  mutation DeletePark($id: ID!) {
    deletePark(id: $id) {
      _id
      savedParks {
        parkId
      }
    }
  }
  `;



