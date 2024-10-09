import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Replace with your secret
const SECRET_KEY = process.env.SECRET_KEY;

export const getUserFromToken = (req) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    console.log("verified");
    return verified; // Returns the decoded user object
  } catch (err) {
    return null; // Token is invalid
  }
};
