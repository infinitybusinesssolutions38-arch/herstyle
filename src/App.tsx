import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import ShopPage from "./pages/ShopPage";
import CollectionsPage from "./pages/CollectionsPage";
import AboutPage from "./pages/AboutPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchPage from "./pages/SearchPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StoreProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
