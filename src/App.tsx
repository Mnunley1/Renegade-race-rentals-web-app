import { useUser } from "@clerk/clerk-react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { AppLoader } from "./components/ui/AppLoader";
import BillingPage from "./pages/BillingPage";
import DashboardPage from "./pages/DashboardPage";
import ExplorePage from "./pages/ExplorePage";
import FavoritesPage from "./pages/FavoritesPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import HomePage from "./pages/HomePage";
import ListVehiclePage from "./pages/ListVehiclePage";
import MatchPage from "./pages/MatchPage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import RentalHistoryPage from "./pages/RentalHistoryPage";
import SettingsPage from "./pages/SettingsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";

function App() {
  const { isLoaded } = useUser();
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/sign-in" || location.pathname === "/sign-up";

  // Show loader until Clerk is fully initialized
  if (!isLoaded) {
    return <AppLoader />;
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/list-vehicle" element={<ListVehiclePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/rental-history" element={<RentalHistoryPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
