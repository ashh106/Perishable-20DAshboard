import { RequestHandler } from "express";
import { dbAll, dbGet, dbRun } from "../database.js";
import { v4 as uuidv4 } from "uuid";

export const submitCustomerFeedback: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { customerName, usageType, quantityPreference, feedback, rating } =
      req.body;

    const feedbackId = uuidv4();

    await dbRun(
      `INSERT INTO customer_feedback 
       (id, store_id, customer_name, usage_type, quantity_preference, feedback, rating) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        feedbackId,
        storeId,
        customerName,
        usageType,
        quantityPreference,
        feedback,
        rating,
      ],
    );

    // Generate a coupon code
    const couponCode = `FRESH${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    res.status(201).json({
      success: true,
      feedbackId,
      coupon: {
        code: couponCode,
        discount: 20,
        validDays: 30,
      },
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};

export const getFeedbackAnalytics: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Get usage analytics
    const usageStats = await dbAll(
      `SELECT 
        usage_type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer_feedback WHERE store_id = ?), 1) as percentage
       FROM customer_feedback 
       WHERE store_id = ?
       GROUP BY usage_type 
       ORDER BY count DESC`,
      [storeId, storeId],
    );

    // Get recent feedback
    const recentFeedback = await dbAll(
      `SELECT * FROM customer_feedback 
       WHERE store_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [storeId],
    );

    // Get overall metrics
    const overallMetrics = await dbGet(
      `SELECT 
        COUNT(*) as total_responses,
        AVG(rating) as avg_rating,
        COUNT(DISTINCT usage_type) as usage_variety
       FROM customer_feedback 
       WHERE store_id = ?`,
      [storeId],
    );

    res.json({
      usageStats,
      recentFeedback,
      overallMetrics,
    });
  } catch (error) {
    console.error("Error getting feedback analytics:", error);
    res.status(500).json({ error: "Failed to get feedback analytics" });
  }
};

export const getSalesAnalytics: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { period = "7d" } = req.query;

    let dateFilter = "7";
    if (period === "30d") dateFilter = "30";
    else if (period === "90d") dateFilter = "90";

    // Get sales data
    const salesData = await dbAll(
      `SELECT 
        DATE(sale_date) as date,
        SUM(quantity_sold) as total_sold,
        SUM(quantity_sold * sale_price) as total_revenue,
        AVG(discount_percent) as avg_discount,
        COUNT(DISTINCT item_id) as unique_items
       FROM sales_data 
       WHERE store_id = ? 
       AND sale_date >= date('now', '-${dateFilter} days')
       GROUP BY DATE(sale_date)
       ORDER BY date ASC`,
      [storeId],
    );

    // Get top performing items
    const topItems = await dbAll(
      `SELECT 
        i.name,
        i.sku,
        SUM(s.quantity_sold) as total_sold,
        SUM(s.quantity_sold * s.sale_price) as revenue
       FROM sales_data s
       JOIN inventory_items i ON s.item_id = i.id
       WHERE s.store_id = ? 
       AND s.sale_date >= date('now', '-${dateFilter} days')
       GROUP BY i.id, i.name, i.sku
       ORDER BY total_sold DESC
       LIMIT 10`,
      [storeId],
    );

    // Get waste metrics
    const wasteMetrics = await dbGet(
      `SELECT 
        COUNT(*) as expired_items,
        SUM(quantity_on_hand) as wasted_quantity,
        SUM(quantity_on_hand * current_price) as waste_value
       FROM inventory_items 
       WHERE store_id = ? 
       AND julianday('now') > julianday(best_by_date)`,
      [storeId],
    );

    res.json({
      salesData,
      topItems,
      wasteMetrics,
      period,
    });
  } catch (error) {
    console.error("Error getting sales analytics:", error);
    res.status(500).json({ error: "Failed to get sales analytics" });
  }
};

export const getKPIData: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Stock on hand
    const stockData = await dbGet(
      `SELECT 
        SUM(quantity_on_hand) as total_quantity,
        COUNT(*) as total_items,
        SUM(quantity_on_hand * current_price) as total_value
       FROM inventory_items 
       WHERE store_id = ?`,
      [storeId],
    );

    // Items expiring soon
    const expiringData = await dbGet(
      `SELECT 
        COUNT(*) as expiring_count,
        SUM(quantity_on_hand) as expiring_quantity
       FROM inventory_items 
       WHERE store_id = ? 
       AND julianday(best_by_date) - julianday('now') <= 5
       AND julianday(best_by_date) - julianday('now') > 0`,
      [storeId],
    );

    // Weekly waste
    const wasteData = await dbGet(
      `SELECT 
        COUNT(*) as waste_items,
        SUM(quantity_on_hand) as waste_quantity,
        SUM(quantity_on_hand * current_price) as waste_value
       FROM inventory_items 
       WHERE store_id = ? 
       AND julianday('now') > julianday(best_by_date)
       AND created_at >= date('now', '-7 days')`,
      [storeId],
    );

    // Forecast accuracy (mock calculation)
    const forecastAccuracy = await dbGet(
      `SELECT 
        AVG(
          CASE 
            WHEN actual_demand IS NOT NULL AND predicted_demand > 0 
            THEN 100 - ABS(actual_demand - predicted_demand) / predicted_demand * 100
            ELSE 85 
          END
        ) as accuracy
       FROM demand_forecasts 
       WHERE store_id = ? 
       AND forecast_date >= date('now', '-30 days')`,
      [storeId],
    );

    res.json({
      stockOnHand: {
        value: `${stockData.total_quantity || 0} gal`,
        items: stockData.total_items || 0,
        value_dollars: stockData.total_value || 0,
      },
      itemsExpiring: {
        count: expiringData.expiring_count || 0,
        quantity: expiringData.expiring_quantity || 0,
      },
      weeklyWaste: {
        quantity: wasteData.waste_quantity || 0,
        percentage: stockData.total_quantity
          ? ((wasteData.waste_quantity || 0) / stockData.total_quantity) * 100
          : 0,
        value: wasteData.waste_value || 0,
      },
      forecastAccuracy: {
        percentage: Math.round(forecastAccuracy.accuracy || 85),
      },
    });
  } catch (error) {
    console.error("Error getting KPI data:", error);
    res.status(500).json({ error: "Failed to get KPI data" });
  }
};

export const getStoreComparison: RequestHandler = async (req, res) => {
  try {
    // Get all stores with their performance metrics
    const storeMetrics = await dbAll(`
      SELECT 
        s.id,
        s.name,
        s.location,
        s.region,
        COUNT(i.id) as total_items,
        SUM(i.quantity_on_hand) as total_quantity,
        COUNT(CASE WHEN julianday('now') > julianday(i.best_by_date) THEN 1 END) as waste_items,
        AVG(CASE WHEN cf.rating IS NOT NULL THEN cf.rating ELSE 4.2 END) as avg_rating
      FROM stores s
      LEFT JOIN inventory_items i ON s.id = i.store_id
      LEFT JOIN customer_feedback cf ON s.id = cf.store_id
      GROUP BY s.id, s.name, s.location, s.region
    `);

    // Calculate performance metrics and mock success stories
    const storesWithMetrics = storeMetrics.map((store: any) => {
      const spoilageRate = store.total_quantity
        ? (store.waste_items / store.total_quantity) * 100
        : Math.random() * 3 + 1; // Random between 1-4%

      const successStories = [
        "Reduced spoilage by 35% using GenAI predictions",
        "Automated routing cut disposal costs by 40%",
        "Best-in-class freshness tracking drives customer loyalty",
        "Implementing progressive pricing this quarter",
        "Customer personalization boosted near-expiry sales 30%",
      ];

      return {
        ...store,
        spoilageRate: spoilageRate.toFixed(1),
        performance:
          spoilageRate < 2.5
            ? "excellent"
            : spoilageRate < 3.5
              ? "good"
              : "needs-improvement",
        successStory:
          successStories[Math.floor(Math.random() * successStories.length)],
        weeklyVolume: `${Math.floor(Math.random() * 600 + 800)} gal`,
        savings: `$${Math.floor(Math.random() * 80 + 75)}/week`,
        aiRecommendations: Math.random() > 0.3,
      };
    });

    res.json(storesWithMetrics);
  } catch (error) {
    console.error("Error getting store comparison:", error);
    res.status(500).json({ error: "Failed to get store comparison" });
  }
};
