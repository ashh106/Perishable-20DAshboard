import { initializeDatabase } from "./server/database.js";

console.log("Testing database initialization...");
try {
  await initializeDatabase();
  console.log("✅ Database initialization successful!");
} catch (error) {
  console.error("❌ Database initialization failed:", error);
  process.exit(1);
}
