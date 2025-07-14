import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Home,
  AlertTriangle,
  Tag,
  Truck,
  QrCode,
  Lightbulb,
  User,
  Menu,
  Monitor,
  Heart,
} from "lucide-react";
import { AIChatbot } from "./AIChatbot";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Dashboard Home", href: "/", icon: Home },
  { name: "Expiry Watch", href: "/expiry-watch", icon: AlertTriangle },

  { name: "Waste Routing", href: "/waste-routing", icon: Truck },
  { name: "Freshness QR", href: "/freshness-qr", icon: QrCode },
  {
    name: "Shelf-Edge Display",
    href: "/shelf-display",
    icon: Monitor,
    isNew: true,
  },
  {
    name: "Customer Feedback",
    href: "/customer-feedback",
    icon: Heart,
    isNew: true,
  },
  { name: "Best Practices Hub", href: "/best-practices", icon: Lightbulb },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();

  const WalmartLogo = () => (
    <svg viewBox="0 0 100 100" className="w-8 h-8" fill="currentColor">
      <path d="M50 10 L60 40 L90 40 L70 55 L80 85 L50 70 L20 85 L30 55 L10 40 L40 40 Z" />
    </svg>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border/50">
            <div className="flex items-center gap-3 px-2 py-3">
              <WalmartLogo />
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-white">Walmart</h2>
                <p className="text-sm text-sidebar-foreground/80">
                  Smart Perishables
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-2 py-4">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
                    className="w-full relative"
                  >
                    <Link to={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                      {item.isNew && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-walmart-teal rounded-full" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">
                  Smart Perishables Dashboard
                </h1>

                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-white border-gray-200 hover:bg-gray-50"
                      >
                        <span className="text-sm font-medium">
                          Supercenter #1234 – Dallas
                        </span>
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem>
                        Supercenter #1234 – Dallas
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Supercenter #5678 – Austin
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Supercenter #9012 – Houston
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Supercenter #3456 – San Antonio
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>

        {/* AI Chatbot - Available on all pages */}
        <AIChatbot
          currentPage={
            location.pathname === "/"
              ? "Dashboard Home"
              : location.pathname === "/expiry-watch"
                ? "Expiry Watch"
                : location.pathname === "/shelf-display"
                  ? "Shelf-Edge Display"
                  : location.pathname === "/customer-feedback"
                    ? "Customer Feedback"
                    : location.pathname === "/best-practices"
                      ? "Best Practices Hub"
                      : location.pathname === "/waste-routing"
                        ? "Waste Routing"
                        : location.pathname === "/freshness-qr"
                          ? "Freshness QR"
                          : "Dashboard"
          }
        />
      </div>
    </SidebarProvider>
  );
}
