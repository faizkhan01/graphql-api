# GraphQL API

This repository contains a GraphQL API developed with Node.js and Apollo Server. The API is authenticated using Bearer token.

# Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Queries](#queries)
  - [Mutations](#mutations)
- [Authentication](#authentication)

# Features

- User authentication via JWT tokens
- CRUD operations for nodes
- Middleware for extracting user information from JWT in cookies

# Technologies

- Node.js
- Express
- Apollo Server
- GraphQL
- JWT (JSON Web Tokens)
- dotenv (for environment variable management)
- graphql-scalars (for additional scalar types)

# Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:faizkhan01/graphql-api.git
   cd graphql-api
   ```
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a .env file in the root directory and add your environment variables:

   ```bash
   NODE_ENV=development
   PORT=4000
   SECRET_KEY=5636d08fd8231129c1d6a1664b87d8e76036ce0268e1837b222463b8373c61b2
   ```

# Usage

Start the server:

```bash
npm start
```

Once the server is running, you can access the Apollo Server at the following link:

```bash
http://localhost:4000/graphql
```

Here you can start querying the API or running mutations.

# API Endpoints

# Mutations

- login(username: String!, password: String!): Authenticate a user and return a JWT token.

  ```bash
  mutation Mutation($username: String!, $password: String!) {
  login(username: $username, password: $password) {
   token
  }
  }
  ```

Here you can use the following credentials to login:

```bash
{
"username": "testuser",
"password": "password123"
}
```

# Queries

- node(nodeId: String!): Fetch a node by its ID with actions, responses, postActions and other relational datas.

  ```bash
  query Node($nodeId: ID) {
  node(nodeId: $nodeId) {
   name
   responses {
     name
     platforms {
       build
     }
   }
   actions {
     name
   }
   postActions {
     name
   }
   trigger {
     name
   }
   parents {
     name
   }
  }
  }
  ```

# Authentication

The API uses JWT for authentication. When a user logs in, a token is generated and sent as a cookie. This token should be included in the headers of subsequent requests for protected routes.

# Token Generation

The generateToken function creates a JWT token with user information, which is returned upon successful login. The token is signed with a secret key defined in the .env file.

# Getting User from Token

The getUserFromToken function extracts the token from the cookies, verifies it, and retrieves the user information. If the token is invalid or not present, it returns null.

# Context Creation

The context function in the Apollo Server setup extracts user information from the token and provides it to resolvers for authentication.
