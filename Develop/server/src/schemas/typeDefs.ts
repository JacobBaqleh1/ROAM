

const typeDefs = `
  type User {
    _id: ID
    username: String!
    email: String!
     savedParks: [String] # Array of saved park IDs
    
  }

  type Review {
  _id: ID
  parkId: String!
  userId: ID!
  username: String!
  comment: String
  rating: Int
  createdAt: String!
}


  type Auth {
    token: ID!
    user: User
  }


  type Query {
    user(username: String!): User
    me: User
    getParkReviews(parkId: String!): [Review]
  }

input AddUserInput {
  username: String!
  email: String!
  password: String!
}

input AddReviewInput {
  parkId: String!
  comment: String!
  rating: Int
}

type Mutation {
  addUser(input: AddUserInput!): Auth
  login(email: String!, password: String!): Auth
  addReview(input: AddReviewInput!): Review
  updateReview(reviewId: ID!, comment: String!): Review
  deleteReview(reviewId: ID!): Review
}
`;

export default typeDefs;
