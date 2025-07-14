import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Eye,
  Bell,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Save,
  Brain,
} from "lucide-react";
import { useExpiringItems, useInventoryMutations } from "@/hooks/useApiData";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks/useAuth";

// AI Recommendation generator
const generateAIRecommendation = (item: any) => {
  const daysLeft = item.daysToExpiry || item.days_to_expiry;
  let recommendedDiscount = 10;
  let reasoning = "Standard markdown for expiring item";

  if (daysLeft <= 1) {
    recommendedDiscount = 30;
    reasoning = "Aggressive markdown needed - expires tomorrow";
  } else if (daysLeft <= 2) {
    recommendedDiscount = 20;
    reasoning = "Moderate markdown to ensure sale within 2 days";
  } else if (daysLeft <= 3) {
    recommendedDiscount = 15;
    reasoning = "Light markdown to start moving inventory";
  }

  return {
    recommendedDiscount,
    reasoning,
    expectedSales: Math.min(
      item.quantity || item.quantity_on_hand,
      Math.ceil(
        (item.quantity || item.quantity_on_hand) *
          (recommendedDiscount / 100) *
          2,
      ),
    ),
    confidence: 85 + Math.random() * 10, // 85-95% confidence
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "critical":
      return "bg-status-red text-white";
    case "warning":
      return "bg-status-yellow text-gray-900";
    case "good":
      return "bg-status-green text-white";
    default:
      return "bg-gray-200 text-gray-900";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "critical":
      return "≤2 days";
    case "warning":
      return "3-4 days";
    case "good":
      return "≥5 days";
    default:
      return "Unknown";
  }
};

export default function ExpiryWatch() {
  const { user } = useAuth();
  const {
    data: expiringItems,
    loading,
    refetch,
  } = useExpiringItems(user?.storeId || "1234", 5);
  const { updateItem } = useInventoryMutations();
  const { sendMessage, lastMessage } = useWebSocket();

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [discountValues, setDiscountValues] = useState<Record<string, number>>(
    {},
  );
  const [appliedRecommendations, setAppliedRecommendations] = useState<
    Set<string>
  >(new Set());
  const [loadingApply, setLoadingApply] = useState<Set<string>>(new Set());

  // Listen for real-time updates
  useEffect(() => {
    if (
      lastMessage?.type === "inventory_update" ||
      lastMessage?.type === "price_update"
    ) {
      refetch(); // Refresh data when real-time updates come in
    }
  }, [lastMessage, refetch]);

  const toggleRow = (itemId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
      // Initialize discount value if not set
      if (!discountValues[itemId]) {
        const item = expiringItems?.find((i) => i.id === itemId);
        if (item) {
          const aiRec = generateAIRecommendation(item);
          setDiscountValues((prev) => ({
            ...prev,
            [itemId]: aiRec.recommendedDiscount,
          }));
        }
      }
    }
    setExpandedRows(newExpanded);
  };

  const handleDiscountChange = (itemId: string, value: number[]) => {
    setDiscountValues((prev) => ({
      ...prev,
      [itemId]: value[0],
    }));
  };

  const handleApplyDiscount = async (item: any) => {
    const discount = discountValues[item.id] || 0;
    const newPrice = item.current_price * (1 - discount / 100);

    setLoadingApply((prev) => new Set([...prev, item.id]));

    try {
      // Update item in database
      const success = await updateItem(item.id, {
        current_price: newPrice,
        discount_percent: discount,
      });

      if (success) {
        // Add to applied recommendations
        setAppliedRecommendations((prev) => new Set([...prev, item.id]));

        // Send real-time update via WebSocket
        sendMessage({
          type: "price_update",
          data: {
            storeId: user?.storeId,
            itemId: item.id,
            oldPrice: item.current_price,
            newPrice,
            discountPercent: discount,
          },
        });

        // Collapse the row after successful application
        setTimeout(() => {
          setExpandedRows((prev) => {
            const newSet = new Set(prev);
            newSet.delete(item.id);
            return newSet;
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to apply discount:", error);
    } finally {
      setLoadingApply((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expiry Watch</h2>
          <p className="text-gray-600">Proactive alerts for expiring items</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-white border-gray-200 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-walmart-blue hover:bg-walmart-blue/90">
            <CheckCircle className="w-4 h-4 mr-2" />
            Acknowledge All Red Alerts
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-status-red/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-status-red" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Critical Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-status-yellow/10 rounded-lg">
                <Clock className="h-6 w-6 text-status-yellow" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">33</p>
                <p className="text-sm text-gray-600">Warning Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-status-green/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-status-green" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Good Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">
            Items Requiring Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    SKU
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Days to Expiry
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {expiryItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-mono text-sm">{item.sku}</td>
                    <td className="py-3 px-4">{item.description}</td>
                    <td className="py-3 px-4 font-semibold">
                      {item.daysToExpiry} days
                    </td>
                    <td className="py-3 px-4">{item.quantity} units</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
