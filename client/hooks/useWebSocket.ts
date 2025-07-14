import { useState, useEffect, useRef } from "react";
import { useAuth } from "./useAuth";

interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
  timestamp?: string;
  dataType?: string;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => void;
  connectionError: string | null;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;
  const reconnectAttemptsRef = useRef(0);

  const connect = () => {
    if (!token) return;

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws?token=${token}`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;

        // Subscribe to alerts immediately
        sendMessage({ type: "subscribe_alerts" });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);

          // Handle specific message types
          switch (message.type) {
            case "expiry_alert":
              // Show notification for expiry alerts
              if (
                "Notification" in window &&
                Notification.permission === "granted"
              ) {
                new Notification("Expiry Alert", {
                  body: message.data.message,
                  icon: "/walmart-icon.png",
                });
              }
              break;

            case "price_update":
              console.log("Price updated:", message.data);
              break;

            case "inventory_update":
              console.log("Inventory updated:", message.data);
              break;
          }
        } catch (error) {
          console.error("WebSocket message parsing error:", error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);

        // Attempt to reconnect if not intentionally closed
        if (
          event.code !== 1000 &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            30000,
          );
          console.log(`Reconnecting in ${delay}ms...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError("Failed to connect after multiple attempts");
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionError("WebSocket connection error");
      };
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      setConnectionError("Failed to establish WebSocket connection");
    }
  };

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, message not sent:", message);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close(1000, "User initiated disconnect");
    }
  };

  useEffect(() => {
    if (token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [token]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connectionError,
  };
};

// Hook for specific real-time data subscriptions
export const useRealTimeData = (storeId: string, dataType: string) => {
  const { sendMessage, lastMessage } = useWebSocket();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Request initial data
    sendMessage({
      type: "request_update",
      dataType,
    });
  }, [storeId, dataType]);

  useEffect(() => {
    if (
      lastMessage &&
      lastMessage.type === "data_update" &&
      lastMessage.dataType === dataType
    ) {
      setData(lastMessage.data);
    }
  }, [lastMessage, dataType]);

  return data;
};

// Hook for expiry alerts
export const useExpiryAlerts = () => {
  const { lastMessage } = useWebSocket();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (lastMessage && lastMessage.type === "expiry_alert") {
      setAlerts((prev) => [lastMessage.data, ...prev.slice(0, 9)]); // Keep last 10 alerts
    }
  }, [lastMessage]);

  const clearAlerts = () => setAlerts([]);

  return { alerts, clearAlerts };
};
