import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { getUserFromToken } from "./utils/auth.js";

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server and pass the context (for authentication)
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    context: ({ req, res }) => {
      const user = getUserFromToken(req); // Extract user from Bearer token
      return { user, res }; // Pass user and response object to context
    },
    listen: { port: 4000 },
  });

  console.log(`Server ready at ${url}`);
};

startServer();
