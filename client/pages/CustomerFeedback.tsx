import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Coffee,
  Cake,
  Cookie,
  Gift,
  ShoppingCart,
  TrendingUp,
  Users,
  Star,
  Brain,
} from "lucide-react";

const feedbackData = [
  { usage: "Tea", percentage: 35, icon: Coffee },
  { usage: "Cereal", percentage: 28, icon: Cookie },
  { usage: "Baking", percentage: 22, icon: Cake },
  { usage: "Coffee", percentage: 15, icon: Coffee },
];

const recentFeedback = [
  {
    id: 1,
    customer: "Sarah M.",
    usage: "Tea",
    quantity: "2 gal/week",
    feedback:
      "Love the freshness QR codes! Really helps me choose the best milk.",
    rating: 5,
    date: "2 hours ago",
  },
  {
    id: 2,
    customer: "Mike R.",
    usage: "Cereal",
    quantity: "3 gal/week",
    feedback:
      "Progressive discounts are great for families. Saved $8 last week!",
    rating: 5,
    date: "5 hours ago",
  },
  {
    id: 3,
    customer: "Lisa K.",
    usage: "Baking",
    quantity: "1 gal/month",
    feedback: "Would love to see more organic options with freshness tracking.",
    rating: 4,
    date: "1 day ago",
  },
];

const recommendedPairings = {
  Tea: [
    { name: "Honey", discount: "15% off" },
    { name: "Tea Bags Variety Pack", discount: "20% off" },
    { name: "Sugar Cubes", discount: "10% off" },
  ],
  Cereal: [
    { name: "Whole Grain Cereals", discount: "25% off" },
    { name: "Fresh Bananas", discount: "Free with milk" },
    { name: "Granola Mix", discount: "30% off" },
  ],
  Baking: [
    { name: "Organic Flour", discount: "20% off" },
    { name: "Vanilla Extract", discount: "15% off" },
    { name: "Baking Powder", discount: "Buy 2 Get 1" },
  ],
  Coffee: [
    { name: "Coffee Beans", discount: "30% off" },
    { name: "Coffee Creamer", discount: "25% off" },
    { name: "Sugar & Sweeteners", discount: "20% off" },
  ],
};

export default function CustomerFeedback() {
  const [formData, setFormData] = useState({
    usage: "",
    quantity: "",
    feedback: "",
  });
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate random coupon code
    const code = `FRESH${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setCouponCode(code);
    setShowCoupon(true);

    // Reset form
    setFormData({ usage: "", quantity: "", feedback: "" });
  };

  const getRecommendations = (usage: string) => {
    return recommendedPairings[usage as keyof typeof recommendedPairings] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Feedback & Personalization
        </h2>
        <p className="text-gray-600">
          Understanding customer needs to improve experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-walmart-blue" />
                Share Your Milk Usage
                <Badge className="bg-walmart-teal text-white">
                  Earn Rewards!
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    What do you primarily use milk for?
                  </label>
                  <Select
                    value={formData.usage}
                    onValueChange={(value) =>
                      setFormData({ ...formData, usage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tea">Tea</SelectItem>
                      <SelectItem value="Cereal">Cereal</SelectItem>
                      <SelectItem value="Baking">Baking</SelectItem>
                      <SelectItem value="Coffee">Coffee</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    How much milk do you typically buy?
                  </label>
                  <Select
                    value={formData.quantity}
                    onValueChange={(value) =>
                      setFormData({ ...formData, quantity: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 gal/week">
                        1-2 gallons/week
                      </SelectItem>
                      <SelectItem value="3-4 gal/week">
                        3-4 gallons/week
                      </SelectItem>
                      <SelectItem value="5+ gal/week">
                        5+ gallons/week
                      </SelectItem>
                      <SelectItem value="1-2 gal/month">
                        1-2 gallons/month
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Any feedback or suggestions? (Optional)
                  </label>
                  <Textarea
                    value={formData.feedback}
                    onChange={(e) =>
                      setFormData({ ...formData, feedback: e.target.value })
                    }
                    placeholder="Tell us how we can improve your milk shopping experience..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-walmart-blue hover:bg-walmart-blue/90"
                  disabled={!formData.usage || !formData.quantity}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Submit & Get Reward
                </Button>
              </form>

              {/* Personalized Recommendations */}
              {formData.usage && (
                <div className="mt-6 p-4 bg-walmart-teal/10 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-walmart-teal" />
                    Recommended Pairings for {formData.usage}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {getRecommendations(formData.usage).map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-walmart-teal/20"
                      >
                        <p className="font-medium text-gray-900 text-sm">
                          {item.name}
                        </p>
                        <Badge className="bg-status-green text-white text-xs mt-1">
                          {item.discount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Customer Feedback */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-walmart-blue" />
                Recent Customer Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {feedback.customer}
                        </p>
                        <p className="text-sm text-gray-600">
                          Uses for: {feedback.usage} • {feedback.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating
                                ? "fill-status-yellow text-status-yellow"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      "{feedback.feedback}"
                    </p>
                    <p className="text-xs text-gray-500">{feedback.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics & Coupon */}
        <div className="space-y-6">
          {/* Usage Statistics */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-walmart-blue" />
                Usage Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackData.map((data) => {
                  const IconComponent = data.icon;
                  return (
                    <div key={data.usage} className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-walmart-blue" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {data.usage}
                          </span>
                          <span className="text-sm font-bold text-walmart-blue">
                            {data.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-walmart-blue h-2 rounded-full transition-all duration-300"
                            style={{ width: `${data.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Total Responses:</strong> 1,247 customers
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Avg Purchase:</strong> 2.3 gal/week
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Coupon Display */}
          {showCoupon && (
            <Card className="bg-gradient-to-br from-walmart-blue to-walmart-teal text-white border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Thank You Coupon!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-2xl font-bold tracking-wider">
                      {couponCode}
                    </p>
                    <p className="text-sm opacity-90 mt-2">
                      Show this code at checkout
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold">20% OFF</p>
                    <p className="text-sm opacity-90">
                      Your next milk purchase
                    </p>
                    <p className="text-xs opacity-75">
                      Valid for 30 days • One time use
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => setShowCoupon(false)}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="bg-gradient-to-r from-status-green/10 to-walmart-teal/10 border-status-green">
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <div className="p-3 bg-status-green/20 rounded-full w-fit mx-auto">
                  <ShoppingCart className="w-6 h-6 text-status-green" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">$47</p>
                  <p className="text-sm text-gray-600">
                    Avg savings per customer with personalization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
