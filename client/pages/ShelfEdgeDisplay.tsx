import React, { useState } from "react";
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
  Settings,
  TrendingUp,
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
  },
];

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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [animatingPrices, setAnimatingPrices] = useState<number[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<
    "conservative" | "optimal" | "aggressive"
  >("optimal");
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [bundleRecommendations, setBundleRecommendations] = useState<any[]>([]);

  const selectedItemsData = shelfItems.filter((item) =>
    selectedItems.includes(item.id),
  );
  const aiRecommendations = generateAIRecommendations(
    selectedItemsData,
    selectedItems.length,
  );
  const currentRecommendation = aiRecommendations[selectedStrategy];

  useEffect(() => {
    const bundles = getBundleRecommendations(selectedItemsData);
    setBundleRecommendations(bundles || []);
  }, [selectedItems]);

  const calculateSmartDiscount = (item: any, baseDiscount: number) => {
    let smartDiscount = baseDiscount;

    // AI-enhanced discount calculation
    if (item.daysToExpiry <= 1) smartDiscount += 10; // Critical urgency
    if (item.demandScore > 80) smartDiscount += 5; // High demand item
    if (item.sellThroughRate < 70) smartDiscount += 8; // Low sell-through

    // Progressive bundle discount
    const bundleBonus = Math.min(selectedItems.length * 2, 15);
    smartDiscount += bundleBonus;

    // Apply bundle recommendations
    const applicableBundles = bundleRecommendations.filter(
      (bundle) => selectedItems.length >= bundle.minItems,
    );
    if (applicableBundles.length > 0) {
      const bestBundle = applicableBundles[applicableBundles.length - 1];
      smartDiscount += bestBundle.extraDiscount;
    }

    return Math.min(smartDiscount, 50); // Cap at 50%
  };

  const calculateDiscountedPrice = (item: any) => {
    const discountPercent = selectedItems.includes(item.id)
      ? calculateSmartDiscount(item, currentRecommendation.discount)
      : 0;
    return item.currentPrice * (1 - discountPercent / 100);
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

      {/* GenAI Pricing Recommendations */}
      {selectedItems.length > 0 && (
        <Card className="bg-gradient-to-r from-walmart-blue/5 to-walmart-teal/5 border-walmart-blue">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-walmart-blue" />
              GenAI Pricing Recommendations
              <Badge className="bg-walmart-teal text-white">
                {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
                selected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {/* Conservative Strategy */}
              <Card
                className={`cursor-pointer transition-all ${selectedStrategy === "conservative" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"}`}
                onClick={() => setSelectedStrategy("conservative")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">
                      Conservative
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-blue-600">
                      {aiRecommendations.conservative.discount}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {aiRecommendations.conservative.reasoning}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        Expected sales:{" "}
                        {aiRecommendations.conservative.expectedSales}
                      </span>
                      <span>
                        Confidence: {aiRecommendations.conservative.confidence}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimal Strategy */}
              <Card
                className={`cursor-pointer transition-all ${selectedStrategy === "optimal" ? "ring-2 ring-green-500 bg-green-50" : "hover:shadow-md"}`}
                onClick={() => setSelectedStrategy("optimal")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold text-green-900">Optimal</h4>
                    <Badge className="bg-green-500 text-white text-xs">
                      RECOMMENDED
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-green-600">
                      {aiRecommendations.optimal.discount}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {aiRecommendations.optimal.reasoning}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        Expected sales:{" "}
                        {aiRecommendations.optimal.expectedSales}
                      </span>
                      <span>
                        Confidence: {aiRecommendations.optimal.confidence}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Aggressive Strategy */}
              <Card
                className={`cursor-pointer transition-all ${selectedStrategy === "aggressive" ? "ring-2 ring-red-500 bg-red-50" : "hover:shadow-md"}`}
                onClick={() => setSelectedStrategy("aggressive")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-red-600" />
                    <h4 className="font-semibold text-red-900">Aggressive</h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-red-600">
                      {aiRecommendations.aggressive.discount}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {aiRecommendations.aggressive.reasoning}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        Expected sales:{" "}
                        {aiRecommendations.aggressive.expectedSales}
                      </span>
                      <span>
                        Confidence: {aiRecommendations.aggressive.confidence}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bundle Recommendations */}
            {bundleRecommendations.length > 0 && (
              <div className="space-y-3">
                <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Smart Bundle Deals Available
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {bundleRecommendations.map((bundle, index) => (
                    <div
                      key={index}
                      className="bg-white border border-yellow-200 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-8 h-8 ${bundle.color} rounded-full flex items-center justify-center`}
                        >
                          <bundle.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-sm">
                            {bundle.name}
                          </h6>
                          <p className="text-xs text-gray-600">
                            +{bundle.extraDiscount}% extra discount
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {bundle.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights Toggle */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Time to sell: {currentRecommendation.timeToSell}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIInsights(!showAIInsights)}
                className="flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                {showAIInsights ? "Hide" : "Show"} AI Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shelf Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {shelfItems.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          const discountPercent = isSelected
            ? calculateSmartDiscount(item, currentRecommendation.discount)
            : 0;
          const discountedPrice = calculateDiscountedPrice(item);
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
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-walmart-teal" />
                        <span className="text-xs text-walmart-teal font-medium">
                          Smart discount applied!
                        </span>
                      </div>
                      {showAIInsights && (
                        <div className="bg-gray-50 rounded p-2 text-xs">
                          <div className="flex items-center gap-1 mb-1">
                            <Brain className="w-3 h-3 text-gray-400" />
                            <span className="font-medium text-gray-700">
                              AI Insights:
                            </span>
                          </div>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex justify-between">
                              <span>Demand Score:</span>
                              <span
                                className={
                                  item.demandScore > 80
                                    ? "text-green-600"
                                    : item.demandScore > 60
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }
                              >
                                {item.demandScore}/100
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sell-through:</span>
                              <span
                                className={
                                  item.sellThroughRate > 85
                                    ? "text-green-600"
                                    : item.sellThroughRate > 70
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }
                              >
                                {item.sellThroughRate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
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

      {/* Enhanced Cart Summary */}
      {selectedItems.length > 0 && (
        <Card className="bg-gradient-to-r from-walmart-blue to-walmart-teal text-white border-walmart-blue">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Smart Cart Summary ({selectedItems.length} items)
              <Badge className="bg-white/20 text-white">
                {selectedStrategy.toUpperCase()} Strategy
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm opacity-80">Avg Discount</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    selectedItems.reduce((sum, id) => {
                      const item = shelfItems.find((i) => i.id === id);
                      return (
                        sum +
                        (item
                          ? calculateSmartDiscount(
                              item,
                              currentRecommendation.discount,
                            )
                          : 0)
                      );
                    }, 0) / selectedItems.length,
                  )}
                  %
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
                <p className="text-2xl font-bold text-yellow-300">
                  $
                  {selectedItems
                    .reduce((total, id) => {
                      const item = shelfItems.find((i) => i.id === id);
                      return (
                        total + (item ? calculateDiscountedPrice(item) : 0)
                      );
                    }, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-80">You Save</p>
                <p className="text-2xl font-bold text-yellow-300">
                  $
                  {(
                    selectedItems.reduce((total, id) => {
                      const item = shelfItems.find((i) => i.id === id);
                      return total + (item?.currentPrice || 0);
                    }, 0) -
                    selectedItems.reduce((total, id) => {
                      const item = shelfItems.find((i) => i.id === id);
                      return (
                        total + (item ? calculateDiscountedPrice(item) : 0)
                      );
                    }, 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            {/* AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">Expected Outcome</span>
                </div>
                <div className="space-y-1 text-sm opacity-90">
                  <p>
                    📈 Expected sales: {currentRecommendation.expectedSales}{" "}
                    units
                  </p>
                  <p>⏱️ Time to sell: {currentRecommendation.timeToSell}</p>
                  <p>🎯 AI Confidence: {currentRecommendation.confidence}%</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">Impact</span>
                </div>
                <div className="space-y-1 text-sm opacity-90">
                  <p>🛡️ Waste prevention priority</p>
                  <p>💰 Revenue optimization</p>
                  <p>👥 Customer satisfaction boost</p>
                </div>
              </div>
            </div>

            {/* Bundle Benefits */}
            {bundleRecommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold">Bundle Benefits Active</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bundleRecommendations.map((bundle, index) => (
                    <Badge key={index} className="bg-white/20 text-white">
                      {bundle.name}: +{bundle.extraDiscount}%
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
