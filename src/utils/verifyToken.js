import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export const verifyToken = (token) => {
  if (!token) return null;

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);

    return verified; // Returns the decoded user object
  } catch (err) {
    return null; // Token is invalid
  }
};
