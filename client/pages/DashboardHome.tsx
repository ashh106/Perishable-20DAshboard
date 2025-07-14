import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Target,
  ShoppingCart,
  Brain,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

const kpiData = [
  {
    title: "Stock On-Hand",
    value: "1,200 gal",
    icon: Package,
    trend: "+2.5%",
    trendUp: true,
  },
  {
    title: "Items Expiring Soon",
    value: "45 SKUs",
    icon: AlertTriangle,
    trend: "-12%",
    trendUp: false,
  },
  {
    title: "Weekly Waste",
    value: "30 gal (2.5%)",
    icon: TrendingUp,
    trend: "-18%",
    trendUp: false,
  },
  {
    title: "Next-Day Order Qty",
    value: "850 gal",
    icon: ShoppingCart,
    trend: "AI Optimized",
    trendUp: true,
    isNew: true,
  },
];

const dailySalesData = [
  { day: "Mon", sales: 150, forecast: 145 },
  { day: "Tue", sales: 175, forecast: 170 },
  { day: "Wed", sales: 165, forecast: 160 },
  { day: "Thu", sales: 185, forecast: 180 },
  { day: "Fri", sales: 220, forecast: 210 },
  { day: "Sat", sales: 195, forecast: 200 },
  { day: "Sun", sales: 140, forecast: 135 },
];

const wasteData = [
  { category: "Milk", waste: 30, color: "bg-walmart-blue" },
  { category: "Produce", waste: 25, color: "bg-walmart-teal" },
  { category: "Meat", waste: 20, color: "bg-status-red" },
  { category: "Bakery", waste: 15, color: "bg-status-yellow" },
];

const demandForecastData = [
  { date: "Jan 1", actual: 145, predicted: 140, accuracy: 96.5 },
  { date: "Jan 2", actual: 167, predicted: 170, accuracy: 98.2 },
  { date: "Jan 3", actual: 158, predicted: 155, accuracy: 98.1 },
  { date: "Jan 4", actual: 189, predicted: 185, accuracy: 97.9 },
  { date: "Jan 5", actual: 201, predicted: 195, accuracy: 97.0 },
  { date: "Jan 6", actual: 187, predicted: 190, accuracy: 98.4 },
  { date: "Jan 7", actual: 156, predicted: 150, accuracy: 96.2 },
];

const proTips = [
  "Try bundling milk + cereal for a 10% combo deal to increase basket size.",
  "Progressive discounts drive 25% lift in near-expiry sell-through rates.",
  "Reorder 10% less next week based on GenAI analysis to reduce overstocks.",
  "Weather forecast shows rain - expect 15% higher hot beverage sales.",
];

export default function DashboardHome() {
  const [orderSynced, setOrderSynced] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const handleSyncOrder = () => {
    setOrderSynced(true);
    setTimeout(() => setOrderSynced(false), 3000);
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % proTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Tiles */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="bg-white border-gray-200 relative">
            {kpi.isNew && (
              <Badge className="absolute -top-2 -right-2 bg-walmart-teal text-white text-xs">
                NEW
              </Badge>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
                {kpi.isNew && (
                  <Brain className="inline w-4 h-4 ml-1 text-walmart-teal" />
                )}
              </CardTitle>
              <kpi.icon className="h-5 w-5 text-walmart-blue" />
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold text-gray-900">
                {kpi.value}
              </div>
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    kpi.isNew
                      ? "text-walmart-teal"
                      : kpi.trendUp
                        ? "text-status-green"
                        : "text-status-red"
                  }`}
                >
                  {kpi.trend}
                </span>
                {!kpi.isNew && (
                  <span className="text-sm text-gray-500 ml-1">
                    vs last week
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Forecast Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Daily Sales Chart */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Daily Milk Sales vs. Forecast
            </CardTitle>
            <p className="text-sm text-gray-600">Last 7 days performance</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between h-48 space-x-2">
                {dailySalesData.map((data, index) => (
                  <div
                    key={data.day}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="flex items-end space-x-1 mb-2 w-full">
                      <div
                        className="bg-walmart-blue rounded-sm opacity-80 w-1/2"
                        style={{
                          height: `${(data.sales / 220) * 100}%`,
                          minHeight: "20px",
                        }}
                        title={`Sales: ${data.sales}gal`}
                      />
                      <div
                        className="bg-walmart-teal rounded-sm w-1/2"
                        style={{
                          height: `${(data.forecast / 220) * 100}%`,
                          minHeight: "20px",
                        }}
                        title={`Forecast: ${data.forecast}gal`}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{data.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-walmart-blue rounded-sm opacity-80" />
                  <span className="text-sm text-gray-600">Actual Sales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-walmart-teal rounded-sm" />
                  <span className="text-sm text-gray-600">Forecast</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Waste Volume Chart */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Waste Volume by Category
            </CardTitle>
            <p className="text-sm text-gray-600">Current week breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between h-48 space-x-4">
                {wasteData.map((data) => (
                  <div
                    key={data.category}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={`${data.color} rounded-sm mb-2 w-full`}
                      style={{
                        height: `${(data.waste / 30) * 100}%`,
                        minHeight: "20px",
                      }}
                      title={`${data.category}: ${data.waste}gal`}
                    />
                    <span className="text-xs text-gray-600 text-center">
                      {data.category}
                    </span>
                    <span className="text-xs font-medium text-gray-900 mt-1">
                      {data.waste}gal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips Panel */}
        <Card className="bg-gradient-to-br from-walmart-blue to-walmart-teal text-white border-none">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Pro Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col justify-center">
              <div className="text-center space-y-4">
                <div className="text-lg font-medium leading-relaxed">
                  {proTips[currentTipIndex]}
                </div>
                <div className="flex justify-center space-x-2">
                  {proTips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentTipIndex ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demand Forecast Panel */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-walmart-teal" />
              30-Day Demand Forecast
              <Badge className="bg-walmart-teal text-white text-xs">
                Powered by GenAI
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600">
              AI-powered predictions vs actual sales
            </p>
          </div>
          <Button
            onClick={handleSyncOrder}
            className={`${orderSynced ? "bg-status-green" : "bg-walmart-blue"} hover:bg-walmart-blue/90 transition-colors`}
            disabled={orderSynced}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${orderSynced ? "" : "animate-spin"}`}
            />
            {orderSynced ? "Order Synced!" : "Sync Order to ERP"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forecast Chart */}
            <div className="lg:col-span-2">
              <div className="h-48 w-full">
                <div className="flex items-end justify-between h-40 space-x-1">
                  {demandForecastData.map((data, index) => (
                    <div
                      key={data.date}
                      className="flex flex-col items-center flex-1"
                    >
                      <div className="flex items-end space-x-1 mb-2 w-full">
                        <div
                          className="bg-walmart-blue rounded-sm opacity-70 w-1/2"
                          style={{
                            height: `${(data.actual / 220) * 100}%`,
                            minHeight: "15px",
                          }}
                          title={`Actual: ${data.actual}gal`}
                        />
                        <div
                          className="bg-walmart-teal rounded-sm w-1/2"
                          style={{
                            height: `${(data.predicted / 220) * 100}%`,
                            minHeight: "15px",
                          }}
                          title={`Predicted: ${data.predicted}gal`}
                        />
                      </div>
                      <span className="text-xs text-gray-600 text-center">
                        {data.date}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-walmart-blue rounded-sm opacity-70" />
                    <span className="text-sm text-gray-600">Actual</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-walmart-teal rounded-sm" />
                    <span className="text-sm text-gray-600">AI Predicted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Recommendations */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  GenAI Recommendations
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Suggested Order:
                    </span>
                    <span className="font-bold text-walmart-blue">850 gal</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className="font-semibold text-status-green">
                      97.2%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Accuracy:</span>
                    <span className="font-semibold text-gray-900">97.6%</span>
                  </div>
                </div>
              </div>

              <div className="bg-walmart-teal/10 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <strong>AI Insight:</strong> Weekend demand typically 15%
                  higher. Weather forecast shows sunny conditions - expect
                  increased sales.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-walmart-blue transition-colors cursor-pointer">
              <AlertTriangle className="h-8 w-8 text-status-red mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Review 12 Critical Items
                </h3>
                <p className="text-sm text-gray-600">
                  Expiring within 24 hours
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-walmart-blue transition-colors cursor-pointer">
              <Package className="h-8 w-8 text-walmart-teal mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Apply 8 Markdowns
                </h3>
                <p className="text-sm text-gray-600">
                  AI recommendations ready
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-walmart-blue transition-colors cursor-pointer">
              <TrendingUp className="h-8 w-8 text-status-green mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">View Analytics</h3>
                <p className="text-sm text-gray-600">
                  Weekly performance report
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site-Map Footer */}
      <SiteMapFooter />
    </div>
  );
}
