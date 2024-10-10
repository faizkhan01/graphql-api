import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { verifyToken } from "./utils/verifyToken.js";

// Helper function to parse cookies from the request headers
const parseCookies = (req) => {
  const cookieHeader = req.headers.cookie || "";
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
};

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server and pass the context for authentication
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    context: ({ req, res }) => {
      const cookies = parseCookies(req);
      const token = cookies.token;
      // Extract user from token
      const user = verifyToken(token);
      // Pass user and response object to context
      return { user, res };
    },
    listen: { port: process.env.PORT },
  });

  console.info(
    "\x1b[47m\x1b[46m%s\x1b[0m",
    `🧠 Apollo Server running on 👀  `,
    "\x1b[1m\x1b[5m",
    `${url}graphql🔥🚀`
  );
};

startServer();
