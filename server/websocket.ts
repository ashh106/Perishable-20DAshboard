import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "walmart-perishables-secret";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  storeId?: string;
  role?: string;
}

class PerishablesWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, AuthenticatedWebSocket[]> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: "/ws" });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on("connection", (ws: AuthenticatedWebSocket, req) => {
      console.log("WebSocket connection attempt");

      // Authenticate WebSocket connection
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const token = url.searchParams.get("token");

      if (!token) {
        ws.close(1008, "Authentication required");
        return;
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        ws.userId = decoded.userId;
        ws.storeId = decoded.storeId;
        ws.role = decoded.role;

        // Add client to store-specific group
        if (ws.storeId) {
          if (!this.clients.has(ws.storeId)) {
            this.clients.set(ws.storeId, []);
          }
          this.clients.get(ws.storeId)!.push(ws);
        }

        console.log(
          `WebSocket authenticated: User ${ws.userId} from store ${ws.storeId}`,
        );

        // Send welcome message
        ws.send(
          JSON.stringify({
            type: "connected",
            message: "Real-time updates enabled",
            storeId: ws.storeId,
          }),
        );

        // Handle incoming messages
        ws.on("message", (data) => {
          try {
            const message = JSON.parse(data.toString());
            this.handleMessage(ws, message);
          } catch (error) {
            console.error("WebSocket message error:", error);
          }
        });

        // Handle disconnection
        ws.on("close", () => {
          this.removeClient(ws);
          console.log(`WebSocket disconnected: User ${ws.userId}`);
        });
      } catch (error) {
        console.error("WebSocket authentication failed:", error);
        ws.close(1008, "Invalid token");
      }
    });
  }

  private handleMessage(ws: AuthenticatedWebSocket, message: any) {
    switch (message.type) {
      case "subscribe_alerts":
        // Subscribe to expiry alerts
        this.sendExpiryAlerts(ws.storeId!);
        break;

      case "request_update":
        // Request specific data update
        this.sendDataUpdate(ws.storeId!, message.dataType);
        break;

      case "ping":
        // Heartbeat
        ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
        break;

      default:
        console.log("Unknown WebSocket message type:", message.type);
    }
  }

  private removeClient(ws: AuthenticatedWebSocket) {
    if (ws.storeId && this.clients.has(ws.storeId)) {
      const storeClients = this.clients.get(ws.storeId)!;
      const index = storeClients.indexOf(ws);
      if (index > -1) {
        storeClients.splice(index, 1);
      }
      if (storeClients.length === 0) {
        this.clients.delete(ws.storeId);
      }
    }
  }

  // Public methods for broadcasting updates
  public broadcastToStore(storeId: string, message: any) {
    const storeClients = this.clients.get(storeId);
    if (storeClients) {
      const messageStr = JSON.stringify(message);
      storeClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }

  public broadcastExpiryAlert(storeId: string, item: any) {
    this.broadcastToStore(storeId, {
      type: "expiry_alert",
      data: {
        item,
        message: `${item.name} expires in ${Math.round(item.days_to_expiry)} day(s)`,
        priority: item.days_to_expiry <= 1 ? "critical" : "warning",
        timestamp: new Date().toISOString(),
      },
    });
  }

  public broadcastInventoryUpdate(storeId: string, item: any) {
    this.broadcastToStore(storeId, {
      type: "inventory_update",
      data: {
        item,
        timestamp: new Date().toISOString(),
      },
    });
  }

  public broadcastPriceUpdate(storeId: string, item: any, oldPrice: number) {
    this.broadcastToStore(storeId, {
      type: "price_update",
      data: {
        item,
        oldPrice,
        newPrice: item.current_price,
        discountPercent: Math.round(
          ((oldPrice - item.current_price) / oldPrice) * 100,
        ),
        timestamp: new Date().toISOString(),
      },
    });
  }

  public broadcastKPIUpdate(storeId: string, kpis: any) {
    this.broadcastToStore(storeId, {
      type: "kpi_update",
      data: {
        kpis,
        timestamp: new Date().toISOString(),
      },
    });
  }

  private async sendExpiryAlerts(storeId: string) {
    // This would typically query the database for critical items
    // For demo purposes, we'll send a mock alert
    setTimeout(() => {
      this.broadcastExpiryAlert(storeId, {
        id: "mock-alert",
        name: "Whole Milk 1 Gal",
        sku: "MLK-001",
        days_to_expiry: 1,
        quantity_on_hand: 12,
      });
    }, 5000);
  }

  private sendDataUpdate(storeId: string, dataType: string) {
    // Send specific data updates based on request
    this.broadcastToStore(storeId, {
      type: "data_update",
      dataType,
      message: `${dataType} data updated`,
      timestamp: new Date().toISOString(),
    });
  }

  // Cleanup method
  public close() {
    this.wss.close();
  }
}

export default PerishablesWebSocketServer;
