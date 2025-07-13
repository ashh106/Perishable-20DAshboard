import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, TrendingDown, Package, CheckCircle } from "lucide-react";

export default function MarkdownRecommendations() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Markdown Recommendations
          </h2>
          <p className="text-gray-600">Dynamic pricing for expiring items</p>
        </div>
        <Button className="bg-walmart-blue hover:bg-walmart-blue/90">
          <CheckCircle className="w-4 h-4 mr-2" />
          Apply All Recommendations
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Tag className="h-5 w-5 text-walmart-blue" />
                <Badge className="bg-status-yellow text-gray-900">
                  2 days left
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Whole Milk 1 Gal
                    </h3>
                    <p className="text-sm text-gray-600">SKU: MLK-00{item}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Recommended Discount:
                    </span>
                    <span className="font-semibold text-walmart-blue">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">New Price:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm line-through text-gray-400">
                        $4.99
                      </span>
                      <span className="font-semibold text-gray-900">$3.49</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-walmart-blue hover:bg-walmart-blue/90">
                  Apply Markdown
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
