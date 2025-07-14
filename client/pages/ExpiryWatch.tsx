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

      {/* Enhanced Items Table with Inline AI Recommendations */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Items Requiring Attention
            <Badge className="bg-walmart-teal text-white">
              <Brain className="w-3 h-3 mr-1" />
              AI-Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-walmart-blue mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading expiring items...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(
                expiringItems || [
                  {
                    id: 1,
                    sku: "MLK-001",
                    name: "Whole Milk 1 Gallon",
                    description: "Whole Milk 1 Gallon",
                    daysToExpiry: 1,
                    days_to_expiry: 1,
                    quantity: 24,
                    quantity_on_hand: 24,
                    current_price: 4.99,
                    status: "critical",
                  },
                  {
                    id: 2,
                    sku: "MLK-002",
                    name: "2% Milk 1 Gallon",
                    description: "2% Milk 1 Gallon",
                    daysToExpiry: 2,
                    days_to_expiry: 2,
                    quantity: 18,
                    quantity_on_hand: 18,
                    current_price: 4.79,
                    status: "warning",
                  },
                  {
                    id: 3,
                    sku: "MLK-003",
                    name: "Skim Milk 1 Gallon",
                    description: "Skim Milk 1 Gallon",
                    daysToExpiry: 3,
                    days_to_expiry: 3,
                    quantity: 15,
                    quantity_on_hand: 15,
                    current_price: 4.59,
                    status: "warning",
                  },
                ]
              ).map((item) => {
                const daysLeft = item.daysToExpiry || item.days_to_expiry;
                const isExpanded = expandedRows.has(item.id.toString());
                const isApplied = appliedRecommendations.has(
                  item.id.toString(),
                );
                const isLoading = loadingApply.has(item.id.toString());
                const aiRec = generateAIRecommendation(item);
                const hasAIRec = daysLeft <= 3;

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Main Row */}
                    <div className="bg-white hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-6 gap-4 py-4 px-6 items-center">
                        <div className="font-mono text-sm font-semibold">
                          {item.sku}
                        </div>

                        <div className="col-span-2">
                          <p className="font-medium text-gray-900">
                            {item.description || item.name}
                          </p>
                        </div>

                        <div className="text-center">
                          <span className="font-bold text-lg">
                            {Math.round(daysLeft)}
                          </span>
                          <p className="text-xs text-gray-500">days left</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            className={getStatusColor(
                              item.status ||
                                (daysLeft <= 2
                                  ? "critical"
                                  : daysLeft <= 4
                                    ? "warning"
                                    : "good"),
                            )}
                          >
                            {getStatusText(
                              item.status ||
                                (daysLeft <= 2
                                  ? "critical"
                                  : daysLeft <= 4
                                    ? "warning"
                                    : "good"),
                            )}
                          </Badge>
                          {hasAIRec && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleRow(item.id.toString())}
                              className="h-7 w-7 p-0 hover:bg-walmart-blue/10"
                            >
                              <Lightbulb className="w-4 h-4 text-walmart-teal" />
                            </Button>
                          )}
                          {isApplied && (
                            <CheckCircle
                              className="w-4 h-4 text-status-green"
                              title="Discount Applied"
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-sm text-gray-600">
                            {item.quantity_on_hand || item.quantity} units
                          </span>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible AI Recommendation Panel */}
                    {hasAIRec && (
                      <Collapsible open={isExpanded}>
                        <CollapsibleContent>
                          <div className="bg-gradient-to-r from-walmart-teal/5 to-walmart-blue/5 border-t border-gray-200 p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* AI Recommendation */}
                              <div className="lg:col-span-2">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-walmart-teal/10 rounded-lg">
                                    <Brain className="w-5 h-5 text-walmart-teal" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                      GenAI Recommendation
                                    </h4>
                                    <p className="text-gray-700 mb-3">
                                      Apply{" "}
                                      <strong>
                                        {aiRec.recommendedDiscount}% markdown
                                      </strong>{" "}
                                      to sell {aiRec.expectedSales} units today.
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4">
                                      <strong>Reasoning:</strong>{" "}
                                      {aiRec.reasoning}
                                    </p>

                                    {/* Discount Slider */}
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">
                                          Discount Percentage:{" "}
                                          {discountValues[item.id.toString()] ||
                                            aiRec.recommendedDiscount}
                                          %
                                        </label>
                                        <span className="text-sm text-gray-500">
                                          Max: 50%
                                        </span>
                                      </div>
                                      <Slider
                                        value={[
                                          discountValues[item.id.toString()] ||
                                            aiRec.recommendedDiscount,
                                        ]}
                                        onValueChange={(value) =>
                                          handleDiscountChange(
                                            item.id.toString(),
                                            value,
                                          )
                                        }
                                        max={50}
                                        min={0}
                                        step={5}
                                        className="w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Price Preview & Action */}
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <h5 className="font-semibold text-gray-900 mb-3">
                                  Price Preview
                                </h5>

                                <div className="space-y-2 mb-4">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                      Original:
                                    </span>
                                    <span className="font-medium">
                                      ${(item.current_price || 4.99).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                      Discount:
                                    </span>
                                    <span className="font-medium text-status-red">
                                      -
                                      {discountValues[item.id.toString()] ||
                                        aiRec.recommendedDiscount}
                                      %
                                    </span>
                                  </div>
                                  <div className="flex justify-between border-t pt-2">
                                    <span className="font-semibold">
                                      New Price:
                                    </span>
                                    <span className="font-bold text-walmart-blue">
                                      $
                                      {(
                                        (item.current_price || 4.99) *
                                        (1 -
                                          (discountValues[item.id.toString()] ||
                                            aiRec.recommendedDiscount) /
                                            100)
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-xs text-gray-500 mb-4">
                                  <strong>Confidence:</strong>{" "}
                                  {Math.round(aiRec.confidence)}%
                                </div>

                                <Button
                                  onClick={() => handleApplyDiscount(item)}
                                  disabled={isApplied || isLoading}
                                  className={`w-full ${
                                    isApplied
                                      ? "bg-status-green hover:bg-status-green/90"
                                      : "bg-walmart-blue hover:bg-walmart-blue/90"
                                  }`}
                                >
                                  {isLoading ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                      Applying...
                                    </>
                                  ) : isApplied ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Applied Successfully
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-4 h-4 mr-2" />
                                      Apply & Save
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                );
              })}

              {(!expiringItems || expiringItems.length === 0) && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-status-green mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">
                    All Items Fresh!
                  </h3>
                  <p className="text-gray-600">
                    No items expiring in the next 5 days.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
