import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Deals from "./pages/Deals";
import CategoryPage from "./pages/Categories";
import ProductsPage from "./pages/ProductsPage";
import ChatbotPage from "./pages/ChatbotPage";
import SearchResultsPage from "./pages/SearchResultsPage"; // ✅ Make sure this file exists
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProfilePage from "./pages/ProfilePage"; // ✅ Import
import CartPage from "./pages/CartPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/search" element={<SearchResultsPage />} /> {/* ✅ Add this route */}
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* ✅ Add this */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFound />} /> {/* ✅ 404 fallback */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
