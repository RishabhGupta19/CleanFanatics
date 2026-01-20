import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "PORT",
  "MONGO_URI",
  "JWT_SECRET"
] as const;

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Environment variable ${key} is missing`);
  }
});

export const ENV = {
  PORT: Number(process.env.PORT),
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  NODE_ENV: process.env.NODE_ENV || "development"
};
