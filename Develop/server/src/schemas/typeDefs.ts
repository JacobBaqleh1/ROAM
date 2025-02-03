

const typeDefs = `
  type User {
    _id: ID
    username: String!
    email: String!
    
  }



  type Auth {
    token: ID!
    user: User
  }


  type Query {
    user(username: String!): User
    me: User
  }
input AddUserInput {
  username: String!
  email: String!
  password: String!
}
  type Mutation {
   addUser(input: AddUserInput!): Auth
    login(email: String!, password: String!): Auth
 
  }
`;

export default typeDefs;
