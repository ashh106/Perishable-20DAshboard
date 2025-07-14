import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  Percent,
  ShoppingCart,
  Sparkles,
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  Lightbulb,
  Users,
  BarChart3,
} from "lucide-react";

const shelfItems = [
  {
    id: 1,
    sku: "MLK-001",
    name: "Whole Milk 1 Gallon",
    origin: "Green Valley Farm",
    bottledDate: "2025-01-15",
    bestByDate: "2025-01-18",
    daysOnShelf: 2,
    daysToExpiry: 1,
    currentPrice: 4.99,
    status: "critical",
    inStock: 24,
    category: "dairy",
    demandScore: 85,
    sellThroughRate: 92,
  },
  {
    id: 2,
    sku: "MLK-002",
    name: "2% Milk 1 Gallon",
    origin: "Sunset Dairy Co.",
    bottledDate: "2025-01-14",
    bestByDate: "2025-01-19",
    daysOnShelf: 3,
    daysToExpiry: 2,
    currentPrice: 4.79,
    status: "warning",
    inStock: 18,
    category: "dairy",
    demandScore: 78,
    sellThroughRate: 88,
  },
  {
    id: 3,
    sku: "MLK-003",
    name: "Skim Milk 1 Gallon",
    origin: "Prairie Fresh Farms",
    bottledDate: "2025-01-13",
    bestByDate: "2025-01-20",
    daysOnShelf: 4,
    daysToExpiry: 3,
    currentPrice: 4.59,
    status: "warning",
    inStock: 15,
    category: "dairy",
    demandScore: 65,
    sellThroughRate: 75,
  },
  {
    id: 4,
    sku: "MLK-004",
    name: "Organic Milk 1 Gallon",
    origin: "Mountain View Organic",
    bottledDate: "2025-01-12",
    bestByDate: "2025-01-22",
    daysOnShelf: 5,
    daysToExpiry: 5,
    currentPrice: 6.99,
    status: "good",
    inStock: 12,
    category: "dairy",
    demandScore: 72,
    sellThroughRate: 68,
  },
];

// GenAI Recommendation Engine
const generateAIRecommendations = (items: any[], selectedCount: number) => {
  const recommendations = {
    optimal: {
      discount: 0,
      reasoning: "",
      confidence: 0,
      expectedSales: 0,
      timeToSell: "",
    },
    aggressive: {
      discount: 0,
      reasoning: "",
      confidence: 0,
      expectedSales: 0,
      timeToSell: "",
    },
    conservative: {
      discount: 0,
      reasoning: "",
      confidence: 0,
      expectedSales: 0,
      timeToSell: "",
    },
  };

  if (items.length === 0) return recommendations;

  const avgDaysToExpiry =
    items.reduce((sum, item) => sum + item.daysToExpiry, 0) / items.length;
  const avgDemandScore =
    items.reduce((sum, item) => sum + item.demandScore, 0) / items.length;
  const totalStock = items.reduce((sum, item) => sum + item.inStock, 0);
  const criticalItems = items.filter((item) => item.daysToExpiry <= 1).length;
  const warningItems = items.filter((item) => item.daysToExpiry <= 3).length;

  // Optimal Strategy
  if (avgDaysToExpiry <= 1) {
    recommendations.optimal = {
      discount: Math.min(35 + selectedCount * 5, 50),
      reasoning:
        "High urgency - items expire within 24 hours. Aggressive pricing needed to prevent waste.",
      confidence: 94,
      expectedSales: Math.ceil(totalStock * 0.85),
      timeToSell: "6-12 hours",
    };
  } else if (avgDaysToExpiry <= 2) {
    recommendations.optimal = {
      discount: Math.min(25 + selectedCount * 4, 45),
      reasoning:
        "Moderate urgency - balance between revenue and waste prevention. Bundle discount attracts customers.",
      confidence: 89,
      expectedSales: Math.ceil(totalStock * 0.72),
      timeToSell: "12-18 hours",
    };
  } else {
    recommendations.optimal = {
      discount: Math.min(15 + selectedCount * 3, 35),
      reasoning:
        "Preventive pricing - early discount to encourage sales before critical period.",
      confidence: 76,
      expectedSales: Math.ceil(totalStock * 0.58),
      timeToSell: "1-2 days",
    };
  }

  // Aggressive Strategy
  recommendations.aggressive = {
    discount: Math.min(recommendations.optimal.discount + 10, 50),
    reasoning:
      "Maximum discount for quick turnover. Best for high-demand periods or clearance goals.",
    confidence: 82,
    expectedSales: Math.ceil(totalStock * 0.95),
    timeToSell: recommendations.optimal.timeToSell.split("-")[0] + " hours",
  };

  // Conservative Strategy
  recommendations.conservative = {
    discount: Math.max(recommendations.optimal.discount - 8, 5),
    reasoning:
      "Minimal discount to maintain margins while still encouraging sales.",
    confidence: 71,
    expectedSales: Math.ceil(totalStock * 0.42),
    timeToSell: "2-3 days",
  };

  return recommendations;
};

// Smart Bundle Recommendations
const getBundleRecommendations = (selectedItems: any[]) => {
  if (selectedItems.length < 2) return null;

  const bundles = [
    {
      name: "Family Pack Deal",
      description: "Perfect for large families - save more with more items!",
      minItems: 2,
      extraDiscount: 5,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Quick Sale Bundle",
      description: "Help us reduce waste - get extra savings!",
      minItems: 3,
      extraDiscount: 8,
      icon: Zap,
      color: "bg-green-500",
    },
    {
      name: "Clearance Combo",
      description: "Maximum savings on expiring items",
      minItems: 4,
      extraDiscount: 12,
      icon: Target,
      color: "bg-red-500",
    },
  ];

  return bundles.filter((bundle) => selectedItems.length >= bundle.minItems);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "critical":
      return "border-status-red bg-status-red/5";
    case "warning":
      return "border-status-yellow bg-status-yellow/5";
    case "good":
      return "border-status-green bg-status-green/5";
    default:
      return "border-gray-200 bg-gray-50";
  }
};

const getStatusBadge = (status: string) => {
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

export default function ShelfEdgeDisplay() {
  const [baseDiscount, setBaseDiscount] = useState([20]);
  const [multiplier, setMultiplier] = useState([1.0]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [animatingPrices, setAnimatingPrices] = useState<number[]>([]);

  const calculateProgressiveDiscount = (itemCount: number) => {
    const totalDiscount = Math.min(
      baseDiscount[0] * itemCount * multiplier[0],
      50,
    ); // Cap at 50%
    return Math.round(totalDiscount);
  };

  const calculateDiscountedPrice = (
    originalPrice: number,
    itemCount: number,
  ) => {
    const discountPercent = calculateProgressiveDiscount(itemCount);
    return originalPrice * (1 - discountPercent / 100);
  };

  const handleItemSelect = (itemId: number) => {
    const newSelected = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    setSelectedItems(newSelected);

    // Animate price changes
    setAnimatingPrices([itemId]);
    setTimeout(() => setAnimatingPrices([]), 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Shelf-Edge Display
          </h2>
          <p className="text-gray-600">
            Real-time transparency and progressive pricing
          </p>
        </div>
        <Badge className="bg-walmart-teal text-white">
          <Brain className="w-4 h-4 mr-1" />
          AI-Powered Pricing
        </Badge>
      </div>

      {/* Progressive Discount Controls */}
      <Card className="bg-gradient-to-r from-walmart-blue/5 to-walmart-teal/5 border-walmart-blue">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-walmart-blue" />
            Progressive Discount Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Base Discount per Item: {baseDiscount[0]}%
              </label>
              <Slider
                value={baseDiscount}
                onValueChange={setBaseDiscount}
                max={30}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Multiplier: {multiplier[0]}x
              </label>
              <Slider
                value={multiplier}
                onValueChange={setMultiplier}
                max={2.0}
                min={0.5}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Preview
              </label>
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-sm text-gray-600">3 items selected:</p>
                <p className="font-bold text-walmart-blue">
                  {calculateProgressiveDiscount(3)}% total discount
                </p>
                <p className="text-xs text-gray-500">(Max: 50%)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shelf Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {shelfItems.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          const discountPercent = isSelected
            ? calculateProgressiveDiscount(selectedItems.length)
            : 0;
          const discountedPrice = isSelected
            ? calculateDiscountedPrice(item.currentPrice, selectedItems.length)
            : item.currentPrice;
          const isAnimating = animatingPrices.includes(item.id);

          return (
            <Card
              key={item.id}
              className={`${getStatusColor(item.status)} border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                isSelected ? "ring-2 ring-walmart-blue" : ""
              }`}
              onClick={() => handleItemSelect(item.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusBadge(item.status)}>
                    {item.daysToExpiry} days left
                  </Badge>
                  {isSelected && (
                    <Badge className="bg-walmart-blue text-white animate-pulse">
                      SELECTED
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Product Info */}
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600">SKU: {item.sku}</p>
                  </div>
                </div>

                {/* Origin & Dates */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{item.origin}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      Bottled: {formatDate(item.bottledDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {item.daysOnShelf} days on shelf
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div
                  className={`bg-white rounded-lg p-3 border-2 transition-all duration-500 ${
                    isAnimating
                      ? "border-walmart-teal shadow-lg"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Price:
                    </span>
                    <div className="text-right">
                      {discountPercent > 0 && (
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs line-through text-gray-400">
                            ${item.currentPrice.toFixed(2)}
                          </span>
                          <Badge className="bg-status-red text-white text-xs">
                            -{discountPercent}%
                          </Badge>
                        </div>
                      )}
                      <div
                        className={`font-bold text-lg transition-all duration-500 ${
                          isAnimating
                            ? "text-walmart-teal scale-110"
                            : "text-gray-900"
                        }`}
                      >
                        ${discountedPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {discountPercent > 0 && (
                    <div className="mt-2 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-walmart-teal" />
                      <span className="text-xs text-walmart-teal font-medium">
                        Progressive discount applied!
                      </span>
                    </div>
                  )}
                </div>

                {/* Stock Info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>In Stock: {item.inStock}</span>
                  <span>Best by: {formatDate(item.bestByDate)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cart Summary */}
      {selectedItems.length > 0 && (
        <Card className="bg-walmart-blue text-white border-walmart-blue">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart Summary ({selectedItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm opacity-80">Total Discount</p>
                <p className="text-2xl font-bold">
                  {calculateProgressiveDiscount(selectedItems.length)}%
                </p>
              </div>
              <div>
                <p className="text-sm opacity-80">Original Total</p>
                <p className="text-2xl font-bold">
                  $
                  {selectedItems
                    .reduce((total, id) => {
                      const item = shelfItems.find((i) => i.id === id);
                      return total + (item?.currentPrice || 0);
                    }, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-80">Final Total</p>
                <p className="text-2xl font-bold text-status-green">
                  $
                  {selectedItems
                    .reduce((total, id) => {
                      const item = shelfItems.find((i) => i.id === id);
                      return (
                        total +
                        (item
                          ? calculateDiscountedPrice(
                              item.currentPrice,
                              selectedItems.length,
                            )
                          : 0)
                      );
                    }, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm opacity-90">
                <strong>Smart Savings:</strong> You saved $
                {(
                  selectedItems.reduce((total, id) => {
                    const item = shelfItems.find((i) => i.id === id);
                    return total + (item?.currentPrice || 0);
                  }, 0) -
                  selectedItems.reduce((total, id) => {
                    const item = shelfItems.find((i) => i.id === id);
                    return (
                      total +
                      (item
                        ? calculateDiscountedPrice(
                            item.currentPrice,
                            selectedItems.length,
                          )
                        : 0)
                    );
                  }, 0)
                ).toFixed(2)}{" "}
                by choosing near-expiry items!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
