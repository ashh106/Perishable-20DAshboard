import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./database.js";

// Route imports
import { handleDemo } from "./routes/demo.js";
import {
  getInventoryItems,
  updateInventoryItem,
  getExpiringItems,
  addInventoryItem,
} from "./routes/inventory.js";
import {
  getDemandForecast,
  getMarkdownRecommendations,
  syncOrderToERP,
  getOptimizationInsights,
} from "./routes/genai.js";
import {
  submitCustomerFeedback,
  getFeedbackAnalytics,
  getSalesAnalytics,
  getKPIData,
  getStoreComparison,
} from "./routes/analytics.js";
import {
  register,
  login,
  authMiddleware,
  roleMiddleware,
  getProfile,
  updateProfile,
  createDefaultAdmin,
} from "./routes/auth.js";
import { handleChat } from "./routes/chat.js";

// Load environment variables
dotenv.config();

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (req, res) => {
    res.json({
      message: "Walmart Smart Perishables API v2.0",
      timestamp: new Date().toISOString(),
      database: "SQLite",
      ai: process.env.OPENAI_API_KEY ? "OpenAI Enabled" : "Mock Mode",
    });
  });

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // Authentication routes (public)
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);

  // Protected routes (require authentication)
  app.use("/api/protected", authMiddleware);

  // User profile routes
  app.get("/api/protected/profile", getProfile);
  app.put("/api/protected/profile", updateProfile);

  // Inventory management routes
  app.get("/api/protected/stores/:storeId/inventory", getInventoryItems);
  app.put("/api/protected/inventory/:itemId", updateInventoryItem);
  app.get("/api/protected/stores/:storeId/expiring", getExpiringItems);
  app.post("/api/protected/stores/:storeId/inventory", addInventoryItem);

  // GenAI and forecasting routes
  app.get("/api/protected/stores/:storeId/forecast", getDemandForecast);
  app.get(
    "/api/protected/stores/:storeId/markdown-recommendations",
    getMarkdownRecommendations,
  );
  app.post("/api/protected/stores/:storeId/sync-order", syncOrderToERP);
  app.get("/api/protected/stores/:storeId/insights", getOptimizationInsights);

  // Analytics and reporting routes
  app.post("/api/protected/stores/:storeId/feedback", submitCustomerFeedback);
  app.get(
    "/api/protected/stores/:storeId/feedback-analytics",
    getFeedbackAnalytics,
  );
  app.get("/api/protected/stores/:storeId/sales-analytics", getSalesAnalytics);
  app.get("/api/protected/stores/:storeId/kpis", getKPIData);
  app.get("/api/protected/stores/comparison", getStoreComparison);

  // Admin routes (require admin role)
  app.use("/api/admin", authMiddleware, roleMiddleware(["admin", "manager"]));
  app.get("/api/admin/stores", getStoreComparison);

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const app = createServer();
  const PORT = process.env.PORT || 3001;

  // Initialize database and start server
  initializeDatabase()
    .then(async () => {
      await createDefaultAdmin();
      app.listen(PORT, () => {
        console.log(`🚀 Smart Perishables API Server Started`);
        console.log(`📍 URL: http://localhost:${PORT}`);
        console.log(`📊 Dashboard: http://localhost:${PORT}`);
        console.log(`🔌 API: http://localhost:${PORT}/api`);
        console.log(`💾 Database: SQLite (walmart_perishables.db)`);

        if (process.env.OPENAI_API_KEY) {
          console.log(`🤖 GenAI: OpenAI integration enabled`);
        } else {
          console.log(
            `🤖 GenAI: Using mock responses (set OPENAI_API_KEY to enable)`,
          );
        }

        console.log(`\n🔐 Default Admin Account:`);
        console.log(`   Email: admin@walmart.com`);
        console.log(`   Password: admin123`);
        console.log(`\n📚 API Documentation:`);
        console.log(`   POST /api/auth/login - Authenticate user`);
        console.log(
          `   GET  /api/protected/stores/1234/inventory - Get inventory`,
        );
        console.log(
          `   GET  /api/protected/stores/1234/forecast - AI demand forecast`,
        );
        console.log(
          `   POST /api/protected/stores/1234/feedback - Submit feedback`,
        );
      });
    })
    .catch((error) => {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    });
}
