import { RequestHandler } from "express";

// Conditional OpenAI import
let openai: any = null;
if (process.env.OPENAI_API_KEY) {
  try {
    import("openai").then((OpenAI) => {
      openai = new OpenAI.default({
        apiKey: process.env.OPENAI_API_KEY,
      });
    });
  } catch (error) {
    console.warn("OpenAI not available:", error);
  }
}

export const handleChat: RequestHandler = async (req, res) => {
  try {
    const { message, context, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    let aiResponse = null;

    // Try OpenAI if available
    if (openai) {
      try {
        const systemPrompt = `You are a helpful AI assistant for the Walmart Smart Perishables Dashboard. You help store associates with:

1. **Expiry Watch**: Managing items approaching expiration
2. **Dynamic Pricing**: Setting optimal markdowns (max 50%)
3. **Inventory Management**: Understanding stock levels and forecasts
4. **Dashboard Navigation**: How to use different features
5. **Real-time Updates**: Understanding WebSocket notifications

Current context: ${context}

Guidelines:
- Be concise but helpful (2-3 sentences max)
- Reference specific dashboard features when relevant
- Suggest actionable next steps
- Use emojis sparingly for clarity
- Focus on business value and efficiency

If asked about:
- Pricing: Mention the AI recommendations in Expiry Watch (💡 icon)
- Stock: Reference Dashboard Home KPIs and real-time updates
- Expiry: Explain the color-coded system (red ≤2 days, yellow 3-4 days, green ≥5 days)
- Navigation: Guide them to the appropriate dashboard section`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory.slice(-3).map((msg: any) => ({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.content,
            })),
            { role: "user", content: message },
          ],
          max_tokens: 200,
          temperature: 0.7,
        });

        aiResponse = completion.choices[0].message.content;
      } catch (openaiError) {
        console.error("OpenAI chat error:", openaiError);
      }
    }

    // Fallback responses if OpenAI is not available
    if (!aiResponse) {
      aiResponse = generateFallbackResponse(message, context);
    }

    res.json({
      message: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
};

function generateFallbackResponse(message: string, context: string): string {
  const lowerMessage = message.toLowerCase();
  const contextLower = context.toLowerCase();

  // Determine current page from context
  const isExpiryWatch = contextLower.includes("expiry");
  const isDashboard = contextLower.includes("dashboard");
  const isShelfDisplay = contextLower.includes("shelf");

  // Common responses based on keywords
  if (lowerMessage.includes("help") || lowerMessage.includes("what")) {
    if (isExpiryWatch) {
      return "In Expiry Watch, look for the 💡 AI Rec icon next to items with ≤3 days left. Click it to see AI-powered markdown recommendations with adjustable discount sliders!";
    }
    return "I can help you with: 📊 Dashboard metrics, ⚠️ Expiry management, 💰 Pricing strategies, and 🔄 Real-time updates. What specific area interests you?";
  }

  if (
    lowerMessage.includes("expiry") ||
    lowerMessage.includes("expire") ||
    lowerMessage.includes("days")
  ) {
    return "Items are color-coded: 🔴 Red (≤2 days), 🟡 Yellow (3-4 days), 🟢 Green (≥5 days). Click the 💡 icon for AI markdown recommendations on items expiring soon!";
  }

  if (
    lowerMessage.includes("price") ||
    lowerMessage.includes("discount") ||
    lowerMessage.includes("markdown")
  ) {
    return "AI suggests optimal discounts: 30% for 1 day left, 20% for 2 days, 15% for 3 days (max 50%). Use the slider to adjust, then hit 'Apply & Save' for instant updates!";
  }

  if (
    lowerMessage.includes("stock") ||
    lowerMessage.includes("inventory") ||
    lowerMessage.includes("quantity")
  ) {
    return "Check Dashboard Home for real-time KPIs: Stock On-Hand, Items Expiring Soon, Weekly Waste, and AI Forecast Accuracy. Data updates automatically via WebSocket!";
  }

  if (
    lowerMessage.includes("forecast") ||
    lowerMessage.includes("predict") ||
    lowerMessage.includes("ai")
  ) {
    return "Our GenAI provides 97%+ accurate demand forecasting, next-day order recommendations, and smart markdown suggestions. Look for the 🤖 AI badges throughout the dashboard!";
  }

  if (lowerMessage.includes("save") || lowerMessage.includes("apply")) {
    return "When you click 'Apply & Save', discounts are immediately saved to the database and broadcast via WebSocket to update all connected devices in real-time! ⚡";
  }

  if (
    lowerMessage.includes("navigation") ||
    lowerMessage.includes("navigate") ||
    lowerMessage.includes("section")
  ) {
    return "Use the left sidebar to navigate: Dashboard Home (KPIs), Expiry Watch (AI recommendations), Shelf-Edge Display (progressive pricing), and more. Each section has distinct features!";
  }

  if (lowerMessage.includes("real-time") || lowerMessage.includes("update")) {
    return "The dashboard uses WebSocket connections for real-time updates. You'll see automatic refreshes for inventory changes, price updates, and KPI metrics without page reloads! 🔄";
  }

  // Page-specific responses
  if (isExpiryWatch) {
    return "You're in Expiry Watch! This shows items approaching expiration with AI-powered markdown recommendations. Click the 💡 icon next to critical items to see smart pricing suggestions.";
  }

  if (isDashboard) {
    return "Welcome to Dashboard Home! Here you can see real-time KPIs, AI demand forecasting, and quick action items. Check the tiles for current stock levels and waste metrics.";
  }

  if (isShelfDisplay) {
    return "Shelf-Edge Display simulates progressive pricing in real-time. Select multiple items to see bulk discounts, with a 50% maximum cap. Perfect for demonstrating customer value!";
  }

  // Default helpful response
  return "I'm here to help with the Walmart Smart Perishables Dashboard! Ask me about expiry management, pricing strategies, inventory insights, or navigation tips. What would you like to know? 🤖";
}
