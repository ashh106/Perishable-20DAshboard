import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Star, Calendar, Clock, Info } from "lucide-react";

export default function FreshnessQR() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Freshness QR</h2>
        <p className="text-gray-600">Customer-facing freshness signals</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-walmart-blue" />
              Interactive Shelf Tag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Digital price tag with embedded QR code
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Click to preview customer view
                </p>
              </div>
              <Button className="w-full bg-walmart-blue hover:bg-walmart-blue/90">
                Generate QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-walmart-teal" />
              Freshness Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Freshness Score:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= 4 ? "fill-status-yellow" : "fill-gray-300"
                      } text-status-yellow`}
                    />
                  ))}
                  <span className="ml-2 font-semibold">4/5</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bottling Date:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Jan 15, 2025 - 6:30 AM</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Time on Shelf:</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">12 hours</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Learn More About Freshness
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Recent QR Code Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { product: "Whole Milk 1 Gal", scans: 24, time: "Last hour" },
              { product: "2% Milk 1 Gal", scans: 18, time: "Last hour" },
              { product: "Skim Milk 1 Gal", scans: 15, time: "Last hour" },
            ].map((scan, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{scan.product}</p>
                  <p className="text-sm text-gray-600">{scan.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-walmart-blue">
                    {scan.scans} scans
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
