/**
 *  - We named the main query "RootQuery", but you can name it anything really
 *      Inside it we have subqueries
 *  - "!" means REQUIRED
 *  - Everything we define here, "resolver.js" needs to address
 */

const { buildSchema } = require('graphql');

module.exports = buildSchema(
  /** 2.1 QUERY Schema*/
  //   `
  //   type TestData {
  //     text: String!
  //     views: Int!
  //   }

  //   type RootQuery {
  //     hello: TestData!
  //   }

  //   schema {
  //     query: RootQuery
  //   }
  // `

  /** 2.1 & 2.2 QUERY + MUTATION Schema*/
  `
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    status: String!
    posts: [Post!]!
  }

  input UserInputData {
    email: String!
    name: String!
    password: String!
  }
  
  type RootMutation {
    createUser(userInput: UserInputData): User!
  }
  
  type TestData {
    text: String!
    views: Int!
  }
  
  type RootQuery {
    hello: TestData!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`,
);
