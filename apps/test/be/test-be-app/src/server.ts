import { BaseApp } from "@mono/be-core";
import { AppConfig } from "@mono/be-types";
import { UserPlugin } from "./plugins/UserPlugin";

console.log("🚀 Starting Basic API Service...");

// Application configuration
const config: AppConfig = {
  name: "Basic API Service",
  port: 3002,
  environment: "development",
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP",
  },
  logging: {
    level: "info",
    format: "json",
    httpLogging: true,
  },
};

console.log("🔧 Configuration created:", config);

// Create and configure the application
const app = new BaseApp(config);

console.log("📦 BaseApp created");

// Add plugins
app.use(new UserPlugin());

console.log("🔌 UserPlugin added");

// Start the server
console.log("⚡ Starting server...");
app.start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
