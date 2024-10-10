import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GraphQLLong, GraphQLJSON } from "graphql-scalars";
import { generateToken } from "../utils/generateToken.js";

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to node.json and user.json
const nodeDataPath = path.resolve(__dirname, "../data/node.json");
const userDataPath = path.resolve(__dirname, "../data/user.json");
const responseDataPath = path.resolve(__dirname, "../data/response.json");
const actionDataPath = path.resolve(__dirname, "../data/action.json");
const triggerDataPath = path.resolve(__dirname, "../data/trigger.json");
const resourceTemplateDataPath = path.resolve(
  __dirname,
  "../data/resourceTemplate.json"
);

// Read JSON data
const nodeData = JSON.parse(fs.readFileSync(nodeDataPath, "utf-8"));
const users = JSON.parse(fs.readFileSync(userDataPath, "utf-8"));
const responseData = JSON.parse(fs.readFileSync(responseDataPath, "utf-8"));
const actionData = JSON.parse(fs.readFileSync(actionDataPath, "utf-8"));
const triggerData = JSON.parse(fs.readFileSync(triggerDataPath, "utf-8"));
const resourceTemplateData = JSON.parse(
  fs.readFileSync(resourceTemplateDataPath, "utf-8")
);

export const resolvers = {
  Long: GraphQLLong,
  JSON: GraphQLJSON,

  Query: {
    node: (_, { nodeId }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      // Find the NodeObject
      const nodeObject = nodeData.find((node) => node._id === nodeId);
      if (!nodeObject) {
        return null; // Or throw an error if needed
      }
      return nodeObject;
    },
  },
  NodeObject: {
    responses: (parent) => {
      if (!parent.responses) return null;
      // Map the responses to their actual objects
      return parent.responses.map((responseId) => {
        return (
          responseData.find((response) => response._id === responseId) || null
        );
      });
    },
    actions: (parent) => {
      if (!parent.actions) return null;
      // Map the actions to their actual objects
      return parent.actions.map((actionId) => {
        return actionData.find((action) => action._id === actionId) || null;
      });
    },
    postActions: (parent) => {
      if (!parent.postActions) return null;
      return parent.postActions.map((postActionId) => {
        return actionData.find((action) => action._id === postActionId) || null;
      });
    },

    trigger: (parent) => {
      return (
        triggerData.find((trigger) => trigger._id === parent.trigger) || null
      );
    },

    parents: (parent) => {
      // Ensure parents is an array
      if (!parent.parents || !Array.isArray(parent.parents)) return null;
      return parent.parents.map((compositeId) => {
        return (
          nodeData.find((node) => node.compositeId === compositeId) || null
        );
      });
    },
  },

  Action: {
    resourceTemplate: (parent) => {
      // Map the resourceTemplateId to the actual resourceTemplate object
      return (
        resourceTemplateData.find(
          (template) => template._id === parent.resourceTemplateId
        ) || null
      );
    },
  },

  Trigger: {
    resourceTemplate: (parent) => {
      // Map the resourceTemplateId to the actual resourceTemplate object
      return (
        resourceTemplateData.find(
          (template) => template._id === parent.resourceTemplateId
        ) || null
      );
    },
  },

  Mutation: {
    login: (_, { username, password }, { res }) => {
      // Find the user by username
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (!user) {
        throw new Error("Invalid credentials"); // Handle invalid login
      }

      const token = generateToken(user); // Generate token

      res.cookie("token", `Bearer ${token}`, {
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 3600000, // 1 hour
      });

      return { token }; // Return token
    },
  },
};
