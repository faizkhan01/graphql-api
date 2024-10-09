import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.SECRET_KEY; // Export the JWT secret from .env
