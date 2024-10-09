import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// Function to generate a JWT token
export const generateToken = (user) => {
  // Create a token with user ID and other payload data as needed
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h", // Token expiration time
    }
  );
};
