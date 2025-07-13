import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Trash2, Calendar, MapPin } from "lucide-react";

export default function WasteRouting() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Waste Routing</h2>
        <p className="text-gray-600">
          Automated donation and depack scheduling
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-walmart-teal" />
              Copia Donations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Milk Products - Batch #{item}
                  </p>
                  <p className="text-sm text-gray-600">15 gallons</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-walmart-teal text-white">Ready</Badge>
                  <Button size="sm" variant="outline">
                    Schedule Pickup
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-status-red" />
              Zero-Depack Routing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Expired Dairy #{item}
                  </p>
                  <p className="text-sm text-gray-600">8 units</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-status-yellow text-gray-900">
                    Pending
                  </Badge>
                  <Button size="sm" variant="outline">
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                action: "Copia pickup completed",
                time: "2 hours ago",
                icon: Truck,
                color: "text-status-green",
              },
              {
                action: "Zero-depack scheduled",
                time: "4 hours ago",
                icon: Calendar,
                color: "text-walmart-blue",
              },
              {
                action: "Donation route planned",
                time: "6 hours ago",
                icon: MapPin,
                color: "text-walmart-teal",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
                <span className="text-gray-900">{activity.action}</span>
                <span className="text-sm text-gray-500 ml-auto">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
