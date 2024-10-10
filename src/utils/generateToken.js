import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// Function to generate a JWT token
export const generateToken = (user) => {
  try {
    return jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, {
      expiresIn: "1h", // Token expiration time
    });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};
