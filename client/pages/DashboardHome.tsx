import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Package, AlertTriangle, Target } from "lucide-react";

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
    title: "Forecast Accuracy",
    value: "85%",
    icon: Target,
    trend: "+5%",
    trendUp: true,
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

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* KPI Tiles */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
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
                    kpi.trendUp ? "text-status-green" : "text-status-red"
                  }`}
                >
                  {kpi.trend}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
      </div>

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
    </div>
  );
}
