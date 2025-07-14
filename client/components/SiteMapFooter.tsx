import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, ChevronUp } from "lucide-react";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Expiry Watch", href: "/expiry-watch" },
  { name: "Waste Routing", href: "/waste-routing" },
  { name: "Freshness QR", href: "/freshness-qr" },
  { name: "Shelf-Edge Display", href: "/shelf-display" },
  { name: "Customer Feedback", href: "/customer-feedback" },
  { name: "Best Practices Hub", href: "/best-practices" },
];

export function SiteMapFooter() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Desktop Footer */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center space-x-1">
            {navigationLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <Link
                  to={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 ${
                    location.pathname === link.href
                      ? "text-walmart-blue bg-walmart-blue/10"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
                {index < navigationLinks.length - 1 && (
                  <span className="text-gray-300">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        {/* Collapsed State */}
        {!isExpanded && (
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-gray-600"
                >
                  <Menu className="w-4 h-4 mr-2" />
                  Navigation
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                {navigationLinks.find((link) => link.href === location.pathname)
                  ?.name || "Dashboard"}
              </div>
            </div>
          </div>
        )}

        {/* Expanded State */}
        {isExpanded && (
          <div className="bg-white">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Quick Navigation
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-600"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsExpanded(false)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? "bg-walmart-blue text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spacer to prevent content from being hidden behind footer */}
      <div className="h-16 md:h-14" />
    </>
  );
}
