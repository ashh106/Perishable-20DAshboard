import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ExpiryWatch from "./pages/ExpiryWatch";

import WasteRouting from "./pages/WasteRouting";
import FreshnessQR from "./pages/FreshnessQR";
import BestPracticesHub from "./pages/BestPracticesHub";
import ShelfEdgeDisplay from "./pages/ShelfEdgeDisplay";
import CustomerFeedback from "./pages/CustomerFeedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            }
          />
          <Route
            path="/expiry-watch"
            element={
              <DashboardLayout>
                <ExpiryWatch />
              </DashboardLayout>
            }
          />
          <Route
            path="/markdown"
            element={
              <DashboardLayout>
                <MarkdownRecommendations />
              </DashboardLayout>
            }
          />
          <Route
            path="/waste-routing"
            element={
              <DashboardLayout>
                <WasteRouting />
              </DashboardLayout>
            }
          />
          <Route
            path="/freshness-qr"
            element={
              <DashboardLayout>
                <FreshnessQR />
              </DashboardLayout>
            }
          />
          <Route
            path="/best-practices"
            element={
              <DashboardLayout>
                <BestPracticesHub />
              </DashboardLayout>
            }
          />
          <Route
            path="/shelf-display"
            element={
              <DashboardLayout>
                <ShelfEdgeDisplay />
              </DashboardLayout>
            }
          />
          <Route
            path="/customer-feedback"
            element={
              <DashboardLayout>
                <CustomerFeedback />
              </DashboardLayout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
