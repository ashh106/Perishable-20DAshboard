import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lightbulb, Search, TrendingUp, Download } from "lucide-react";

const storeData = [
  {
    id: "#1234",
    location: "Dallas, TX",
    spoilageRate: "2.1%",
    topActions: [
      "20% markdown at 2 days",
      "Copia donation weekly",
      "Enhanced QR codes",
    ],
    performance: "excellent",
  },
  {
    id: "#5678",
    location: "Austin, TX",
    spoilageRate: "2.8%",
    topActions: [
      "15% markdown at 3 days",
      "Zero-depack automation",
      "Staff training program",
    ],
    performance: "good",
  },
  {
    id: "#9012",
    location: "Houston, TX",
    spoilageRate: "1.9%",
    topActions: [
      "25% markdown at 1 day",
      "Bi-weekly donations",
      "Smart inventory alerts",
    ],
    performance: "excellent",
  },
];

const getPerformanceBadge = (performance: string) => {
  switch (performance) {
    case "excellent":
      return "bg-status-green text-white";
    case "good":
      return "bg-status-yellow text-gray-900";
    case "needs-improvement":
      return "bg-status-red text-white";
    default:
      return "bg-gray-200 text-gray-900";
  }
};

export default function BestPracticesHub() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Best Practices Hub
          </h2>
          <p className="text-gray-600">Cross-store insights and learnings</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by Store ID or Region"
              className="pl-10 w-64"
            />
          </div>
          <Button
            variant="outline"
            className="bg-white border-gray-200 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-walmart-blue/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-walmart-blue" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">2.3%</p>
                <p className="text-sm text-gray-600">Average Spoilage Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-status-green/10 rounded-lg">
                <Lightbulb className="h-6 w-6 text-status-green" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-sm text-gray-600">Best Practices Shared</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-walmart-teal/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-walmart-teal" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">$2.3M</p>
                <p className="text-sm text-gray-600">Total Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">
            Top Performing Stores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storeData.map((store) => (
              <div
                key={store.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-walmart-blue transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      Store {store.id}
                    </h3>
                    <Badge className={getPerformanceBadge(store.performance)}>
                      {store.performance}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{store.location}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      <strong>Spoilage Rate:</strong> {store.spoilageRate}
                    </span>
                  </div>
                </div>

                <div className="flex-1 mx-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Top 3 Actions:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {store.topActions.map((action, index) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    size="sm"
                    className="bg-walmart-blue hover:bg-walmart-blue/90"
                  >
                    Adopt Settings
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
