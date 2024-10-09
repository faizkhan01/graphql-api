import { expressjwt as jwtMiddleware } from "express-jwt";
import { JWT_SECRET } from "../config/auth.js";

// JWT Middleware to protect routes
const jwtAuthMiddleware = jwtMiddleware({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: true,
  getToken: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    return null;
  },
}).unless({ path: ["/"] }); // Allow unauthenticated access to the home route

// Custom error handling for authentication
const handleAuthErrors = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Invalid or missing token");
  } else {
    next();
  }
};

export { jwtAuthMiddleware, handleAuthErrors };
