
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AddStudent from "./pages/AddStudent";
import MasterData from "./pages/MasterData";
import FinancialReports from "./pages/FinancialReports";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Check for authentication on app load
  useEffect(() => {
    const isLoginPage = window.location.pathname === "/login";
    const isAuthenticated = localStorage.getItem("authenticated") === "true";

    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && !isLoginPage) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1 bg-gray-50">
                      <Index />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-student"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1 bg-gray-50">
                      <AddStudent />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/master-data"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1 bg-gray-50">
                      <MasterData />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/financial-reports"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-1 bg-gray-50">
                      <FinancialReports />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
