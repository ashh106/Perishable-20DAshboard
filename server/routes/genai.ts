import { RequestHandler } from "express";
import { dbAll, dbGet, dbRun } from "../database.js";
import { v4 as uuidv4 } from "uuid";

// Conditional OpenAI import
let openai: any = null;
if (process.env.OPENAI_API_KEY) {
  try {
    const OpenAI = (await import("openai")).default;
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.warn("OpenAI not available:", error);
  }
}

export const getDemandForecast: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Get historical sales data
    const salesData = await dbAll(
      `SELECT 
        DATE(sale_date) as date,
        SUM(quantity_sold) as total_sold,
        AVG(sale_price) as avg_price
       FROM sales_data 
       WHERE store_id = ? 
       AND sale_date >= date('now', '-30 days')
       GROUP BY DATE(sale_date)
       ORDER BY date ASC`,
      [storeId],
    );

    // Get existing forecasts
    const existingForecasts = await dbAll(
      `SELECT * FROM demand_forecasts 
       WHERE store_id = ? 
       AND forecast_date >= date('now', '-7 days')
       ORDER BY forecast_date ASC`,
      [storeId],
    );

    let aiRecommendation = null;

    // Only call OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const prompt = `You are a Walmart AI assistant for perishables management. 
        Based on the last 30 days of milk sales data: ${JSON.stringify(salesData.slice(-7))}, 
        current inventory, and seasonal patterns, provide:
        1. Tomorrow's recommended order quantity
        2. Confidence level (0-100%)
        3. Key factors influencing the forecast
        4. Recommended markdown strategy for items expiring in 1-2 days
        
        Respond in JSON format with: {
          "orderQuantity": number,
          "confidence": number,
          "factors": string[],
          "markdownStrategy": {
            "baseDiscount": number,
            "aggressiveDiscount": number
          }
        }`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.3,
        });

        aiRecommendation = JSON.parse(
          completion.choices[0].message.content || "{}",
        );
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);
        // Fallback to mock data if OpenAI fails
      }
    }

    // Mock data if no OpenAI or on error
    if (!aiRecommendation) {
      aiRecommendation = {
        orderQuantity: 850,
        confidence: 97.2,
        factors: [
          "Weekend demand typically 15% higher",
          "Weather forecast shows sunny conditions",
          "Historical pattern shows increased sales on Fridays",
        ],
        markdownStrategy: {
          baseDiscount: 20,
          aggressiveDiscount: 35,
        },
      };
    }

    res.json({
      historicalData: salesData,
      forecasts: existingForecasts,
      aiRecommendation,
    });
  } catch (error) {
    console.error("Error generating demand forecast:", error);
    res.status(500).json({ error: "Failed to generate demand forecast" });
  }
};

export const getMarkdownRecommendations: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Get items expiring soon
    const expiringItems = await dbAll(
      `SELECT 
        i.*,
        julianday(i.best_by_date) - julianday('now') as days_to_expiry
       FROM inventory_items i 
       WHERE i.store_id = ? 
       AND julianday(i.best_by_date) - julianday('now') <= 5
       AND julianday(i.best_by_date) - julianday('now') > 0
       ORDER BY days_to_expiry ASC`,
      [storeId],
    );

    let aiRecommendations = [];

    if (process.env.OPENAI_API_KEY && expiringItems.length > 0) {
      try {
        const prompt = `As a Walmart AI pricing assistant, recommend markdown percentages for these expiring milk items:
        ${JSON.stringify(
          expiringItems.map((item) => ({
            sku: item.sku,
            name: item.name,
            daysToExpiry: Math.round(item.days_to_expiry),
            currentPrice: item.current_price,
            quantity: item.quantity_on_hand,
          })),
        )}
        
        Consider:
        - Items with 1 day left should have aggressive markdowns
        - Items with 2-3 days can have moderate markdowns
        - Higher quantities may need steeper discounts
        - Maintain minimum 30% margin
        
        Respond in JSON array format: [{
          "sku": string,
          "recommendedDiscount": number,
          "newPrice": number,
          "reasoning": string
        }]`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800,
          temperature: 0.2,
        });

        aiRecommendations = JSON.parse(
          completion.choices[0].message.content || "[]",
        );
      } catch (openaiError) {
        console.error("OpenAI markdown error:", openaiError);
      }
    }

    // Generate mock recommendations if no AI response
    if (aiRecommendations.length === 0) {
      aiRecommendations = expiringItems.map((item: any) => {
        const daysLeft = Math.round(item.days_to_expiry);
        let discount = 10;

        if (daysLeft <= 1) discount = 30;
        else if (daysLeft <= 2) discount = 20;
        else if (daysLeft <= 3) discount = 15;

        return {
          sku: item.sku,
          recommendedDiscount: discount,
          newPrice: Number(
            (item.current_price * (1 - discount / 100)).toFixed(2),
          ),
          reasoning: `${daysLeft} day(s) to expiry - ${discount}% discount to ensure sale`,
        };
      });
    }

    res.json({
      items: expiringItems,
      recommendations: aiRecommendations,
    });
  } catch (error) {
    console.error("Error getting markdown recommendations:", error);
    res.status(500).json({ error: "Failed to get markdown recommendations" });
  }
};

export const syncOrderToERP: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { orderQuantity, items } = req.body;

    // Simulate ERP integration delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real implementation, this would:
    // 1. Connect to Walmart's ERP system
    // 2. Submit purchase order
    // 3. Update inventory forecasts
    // 4. Schedule delivery

    // Log the order for audit trail
    const orderId = uuidv4();
    await dbRun(
      `INSERT INTO demand_forecasts 
       (id, store_id, item_category, forecast_date, predicted_demand, confidence) 
       VALUES (?, ?, ?, date('now', '+1 day'), ?, ?)`,
      [orderId, storeId, "Dairy", orderQuantity, 95.0],
    );

    res.json({
      success: true,
      orderId,
      message: "Order successfully synced to ERP system",
      estimatedDelivery: "Tomorrow 6:00 AM",
    });
  } catch (error) {
    console.error("Error syncing order:", error);
    res.status(500).json({ error: "Failed to sync order to ERP" });
  }
};

export const getOptimizationInsights: RequestHandler = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Get current inventory metrics
    const metrics = await dbGet(
      `SELECT 
        COUNT(*) as total_items,
        SUM(CASE WHEN julianday(best_by_date) - julianday('now') <= 2 THEN 1 ELSE 0 END) as critical_items,
        AVG(current_price) as avg_price,
        SUM(quantity_on_hand) as total_quantity
       FROM inventory_items 
       WHERE store_id = ?`,
      [storeId],
    );

    let aiInsights = null;

    if (process.env.OPENAI_API_KEY) {
      try {
        const prompt = `As a Walmart AI optimization expert, analyze this store's current metrics:
        ${JSON.stringify(metrics)}
        
        Provide 3-4 actionable insights to:
        1. Reduce spoilage
        2. Optimize pricing
        3. Improve inventory turnover
        4. Enhance customer satisfaction
        
        Format as JSON: {
          "insights": [
            {
              "title": string,
              "description": string,
              "priority": "high" | "medium" | "low",
              "expectedImpact": string
            }
          ],
          "scorecard": {
            "spoilageRisk": number,
            "pricingEfficiency": number,
            "inventoryHealth": number
          }
        }`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 600,
          temperature: 0.4,
        });

        aiInsights = JSON.parse(completion.choices[0].message.content || "{}");
      } catch (openaiError) {
        console.error("OpenAI insights error:", openaiError);
      }
    }

    // Fallback insights
    if (!aiInsights) {
      aiInsights = {
        insights: [
          {
            title: "Implement Progressive Pricing",
            description:
              "Enable automatic discount escalation for items with 1-2 days remaining",
            priority: "high",
            expectedImpact: "25% reduction in spoilage",
          },
          {
            title: "Optimize Reorder Timing",
            description:
              "Reduce order quantity by 10% next week based on demand patterns",
            priority: "medium",
            expectedImpact: "$500 weekly savings",
          },
          {
            title: "Enhanced Customer Communication",
            description:
              "Use QR codes to promote near-expiry items with recipe suggestions",
            priority: "medium",
            expectedImpact: "15% increase in near-expiry sales",
          },
        ],
        scorecard: {
          spoilageRisk: 78,
          pricingEfficiency: 85,
          inventoryHealth: 92,
        },
      };
    }

    res.json({
      metrics,
      insights: aiInsights.insights,
      scorecard: aiInsights.scorecard,
    });
  } catch (error) {
    console.error("Error getting optimization insights:", error);
    res.status(500).json({ error: "Failed to get optimization insights" });
  }
};
