

const typeDefs = `
  type User {
    _id: ID
    username: String!
    email: String!
     savedParks: [Park] # Array of saved park IDs
    
  }

  type Review {
  _id: ID
  parkId: String!
  userId: ID!
  parkFullName: String
  username: String!
  comment: String
  rating: Int
  createdAt: String!
}

type Image {
  credit: String
  title: String
  altText: String
  caption: String
  url: String
}

 type Park {
    parkId: String!
    fullName: String!
    description: String
    location: String
    images: [Image]
    states: String
  }
    
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(username: String!): User
    me: User
    getParkReviews(parkId: String!): [Review]
    getSavedParks: [Park]
      getUserReviews: [Review]
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
  parkFullName: String!
}
  input ImageInput {
  credit: String
  title: String
  altText: String
  caption: String
  url: String
}

input ParkInput {
  parkId: String!
    fullName: String!
    description: String
    states: String
    images: [ImageInput]
  }

type Mutation {
  addUser(input: AddUserInput!): Auth
  login(email: String!, password: String!): Auth
  addReview(input: AddReviewInput!): Review
  updateReview(reviewId: ID!, comment: String!, rating: Int): Review
  deleteReview(reviewId: ID!): Review
  savePark(input: ParkInput!): User
  removePark(parkId: String!): User
}
`;




export default typeDefs;
