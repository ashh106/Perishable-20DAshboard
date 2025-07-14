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
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
            Store Performance Hub
            <Badge className="bg-gray-100 text-gray-700">
              {filteredStores.length} stores found
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredStores.map((store) => {
              const isCopied = copiedStores.includes(store.id);
              return (
                <Card
                  key={store.id}
                  className={`border-2 transition-all duration-300 hover:shadow-lg ${
                    store.performance === "excellent"
                      ? "border-status-green/30 bg-status-green/5"
                      : store.performance === "good"
                        ? "border-walmart-blue/30 bg-walmart-blue/5"
                        : "border-status-red/30 bg-status-red/5"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-gray-900">
                          Store {store.id}
                        </h3>
                        <Badge
                          className={getPerformanceBadge(store.performance)}
                        >
                          {store.performance}
                        </Badge>
                        {store.aiRecommendations && (
                          <Badge className="bg-walmart-teal text-white">
                            <Brain className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAdoptSettings(store.id)}
                        className={`transition-all duration-300 ${
                          isCopied
                            ? "bg-status-green hover:bg-status-green/90"
                            : "bg-walmart-blue hover:bg-walmart-blue/90"
                        }`}
                        disabled={isCopied}
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Adopt Settings
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{store.location}</span>
                      <span>•</span>
                      <span>{store.region}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Spoilage Rate</p>
                        <p className="font-bold text-lg text-gray-900">
                          {store.spoilageRate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Weekly Savings</p>
                        <p className="font-bold text-lg text-status-green">
                          {store.savings}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Volume</p>
                        <p className="font-bold text-lg text-walmart-blue">
                          {store.weeklyVolume}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Top Actions:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {store.topActions.map((action, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-walmart-blue rounded-full mr-2 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Success Story:
                      </p>
                      <p className="text-sm text-gray-700 italic">
                        "{store.successStory}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No stores match your current filters.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setSearchTerm("");
                  setRegionFilter("all");
                  setPerformanceFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
