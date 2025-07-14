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
  const [baseDiscount, setBaseDiscount] = useState([15]);
  const [multiplier, setMultiplier] = useState([1.0]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [animatingPrices, setAnimatingPrices] = useState<number[]>([]);

  const calculateProgressiveDiscount = (itemCount: number) => {
    const totalDiscount = Math.min(
      baseDiscount[0] + (itemCount - 1) * baseDiscount[0] * multiplier[0],
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
            <Settings className="w-5 h-5 text-walmart-blue" />
            Progressive Discount Configuration
            <Badge className="bg-walmart-teal text-white">
              <Brain className="w-3 h-3 mr-1" />
              Manual Control
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Base Discount: {baseDiscount[0]}%
              </label>
              <Slider
                value={baseDiscount}
                onValueChange={setBaseDiscount}
                max={30}
                min={5}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Starting discount for the first item
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Progressive Multiplier: {multiplier[0]}x
              </label>
              <Slider
                value={multiplier}
                onValueChange={setMultiplier}
                max={2.0}
                min={0.5}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                How much discount increases per additional item
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Preview Calculation
              </label>
              <div className="bg-white rounded-lg p-4 border">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>1 item:</span>
                    <span className="font-medium">{baseDiscount[0]}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>2 items:</span>
                    <span className="font-medium">
                      {calculateProgressiveDiscount(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>3 items:</span>
                    <span className="font-medium">
                      {calculateProgressiveDiscount(3)}%
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm font-bold text-walmart-blue">
                      <span>Max discount:</span>
                      <span>50%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Formula: Base + (Items-1) × Base × Multiplier
                </span>
              </div>
              <span className="text-xs text-gray-500">
                Adjust sliders to control progressive pricing
              </span>
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
              <Badge className="bg-walmart-teal text-white">
                {calculateProgressiveDiscount(selectedItems.length)}% discount
              </Badge>
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
                <strong>Progressive Savings:</strong> You saved $
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
                by buying {selectedItems.length} items together!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
