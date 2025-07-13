import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Eye,
  Bell,
} from "lucide-react";

const expiryItems = [
  {
    id: 1,
    sku: "MLK-001",
    description: "Whole Milk 1 Gallon",
    daysToExpiry: 1,
    quantity: 24,
    status: "critical",
  },
  {
    id: 2,
    sku: "MLK-002",
    description: "2% Milk 1 Gallon",
    daysToExpiry: 2,
    quantity: 18,
    status: "warning",
  },
  {
    id: 3,
    sku: "MLK-003",
    description: "Skim Milk 1 Gallon",
    daysToExpiry: 3,
    quantity: 15,
    status: "warning",
  },
  {
    id: 4,
    sku: "MLK-004",
    description: "Organic Milk 1 Gallon",
    daysToExpiry: 5,
    quantity: 12,
    status: "good",
  },
];

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
