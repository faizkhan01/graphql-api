import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GraphQLLong, GraphQLJSON } from "graphql-scalars";
import { users } from "../data/user.js";
import { generateToken } from "../../generateToken.js";

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to node.json
const dataPath = path.resolve(__dirname, "../data/node.json");

// Read JSON data
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

console.log("data>>>", data);

export const resolvers = {
  Long: GraphQLLong,
  JSON: GraphQLJSON,

  Query: {
    node: (parent, { nodeId }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      // Find the NodeObject
      const nodeObject = data.find((node) => node._id === nodeId);
      if (!nodeObject) {
        return null; // Or throw an error if needed
      }
      return nodeObject;
    },
  },
  NodeObject: {
    responses: (parent) => {
      // Assuming `responses` is an array of IDs in the NodeObject
      return parent.responses.map((responseId) => {
        // Find and return the corresponding Response
        return (
          data.responses.find((response) => response._id === responseId) || null
        );
      });
    },
    actions: (parent) => {
      return parent.actionIds.map((actionId) => {
        // Find and return the corresponding Action
        return data.actions.find((action) => action._id === actionId) || null;
      });
    },
  },

  Mutation: {
    login: (parent, { username, password }, { res }) => {
      // Find the user by username
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (!user) {
        throw new Error("Invalid credentials"); // Handle invalid login
      }

      const token = generateToken(user); // Generate token
      // Set the token in headers (if using an Express app, this is normally handled on the client)
      res.set("Authorization", `Bearer ${token}`); // Set token in response headers (for demo purposes)

      return { token }; // Return token
    },
  },
};
