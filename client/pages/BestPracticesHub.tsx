import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Lightbulb,
  Search,
  TrendingUp,
  Download,
  Filter,
  CheckCircle,
  Brain,
  Copy,
} from "lucide-react";

const storeData = [
  {
    id: "#1234",
    location: "Dallas, TX",
    region: "North Texas",
    spoilageRate: "2.1%",
    savings: "$127/week",
    topActions: [
      "20% markdown at 2 days",
      "Copia donation weekly",
      "Enhanced QR codes",
    ],
    performance: "excellent",
    aiRecommendations: true,
    weeklyVolume: "1,200 gal",
    successStory: "Reduced spoilage by 35% using GenAI predictions",
  },
  {
    id: "#5678",
    location: "Austin, TX",
    region: "Central Texas",
    spoilageRate: "2.8%",
    savings: "$98/week",
    topActions: [
      "15% markdown at 3 days",
      "Zero-depack automation",
      "Staff training program",
    ],
    performance: "good",
    aiRecommendations: false,
    weeklyVolume: "950 gal",
    successStory: "Automated routing cut disposal costs by 40%",
  },
  {
    id: "#9012",
    location: "Houston, TX",
    region: "Southeast Texas",
    spoilageRate: "1.9%",
    savings: "$156/week",
    topActions: [
      "25% markdown at 1 day",
      "Bi-weekly donations",
      "Smart inventory alerts",
    ],
    performance: "excellent",
    aiRecommendations: true,
    weeklyVolume: "1,400 gal",
    successStory: "Best-in-class freshness tracking drives customer loyalty",
  },
  {
    id: "#3456",
    location: "San Antonio, TX",
    region: "South Texas",
    spoilageRate: "3.2%",
    savings: "$78/week",
    topActions: [
      "10% markdown at 4 days",
      "Manual donation calls",
      "Basic expiry alerts",
    ],
    performance: "needs-improvement",
    aiRecommendations: false,
    weeklyVolume: "800 gal",
    successStory: "Implementing progressive pricing this quarter",
  },
  {
    id: "#7890",
    location: "Fort Worth, TX",
    region: "North Texas",
    spoilageRate: "2.4%",
    savings: "$112/week",
    topActions: [
      "18% markdown at 2.5 days",
      "Customer feedback integration",
      "Cross-training initiatives",
    ],
    performance: "good",
    aiRecommendations: true,
    weeklyVolume: "1,100 gal",
    successStory: "Customer personalization boosted near-expiry sales 30%",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [copiedStores, setCopiedStores] = useState<string[]>([]);

  const filteredStores = storeData.filter((store) => {
    const matchesSearch =
      store.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion =
      regionFilter === "all" || store.region === regionFilter;
    const matchesPerformance =
      performanceFilter === "all" || store.performance === performanceFilter;
    return matchesSearch && matchesRegion && matchesPerformance;
  });

  const handleAdoptSettings = (storeId: string) => {
    setCopiedStores([...copiedStores, storeId]);
    setTimeout(() => {
      setCopiedStores(copiedStores.filter((id) => id !== storeId));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Best Practices Hub
            <Badge className="bg-walmart-teal text-white">AI-Enhanced</Badge>
          </h2>
          <p className="text-gray-600">
            Cross-store insights and learnings with GenAI analysis
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by Store ID or Region"
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="North Texas">North Texas</SelectItem>
              <SelectItem value="Central Texas">Central Texas</SelectItem>
              <SelectItem value="Southeast Texas">Southeast Texas</SelectItem>
              <SelectItem value="South Texas">South Texas</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={performanceFilter}
            onValueChange={setPerformanceFilter}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Performance</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="needs-improvement">
                Needs Improvement
              </SelectItem>
            </SelectContent>
          </Select>

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
