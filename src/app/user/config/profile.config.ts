import { registerAs } from "@nestjs/config";
export default registerAs("profileConfig", () => ({
  host: "neon",
  port: 5432,
  user: "admin",
  password: "admin",
  apiKey: process.env.API_KEY
}));
