import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Toast notifications

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LiveStats from "./components/LiveStats";
import StakingFeatures from "./components/StakingFeatures";
import SecurityMeasures from "./components/SecurityMeasures";
import UserGuide from "./components/UserGuide";
import SupportSection from "./components/SupportSection";
import Footer from "./components/Footer";
import SolanaWallet from "./components/SolanaWallet";
import Auth from "./components/Auth";
import OtpVerification from "./components/OtpVerification";
import ForgotPassword from "./components/ForgotPassword"; // Import ForgotPassword component
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./page/Sidebar"; // Import Sidebar

import Home from "./page/Home";
import Dashboard from "./page/Dashboard";
import Wallet from "./page/Wallet";
import Deposit from "./page/Deposit";
import Withdraw from "./page/Withdraw";
import Profile from "./page/Profile";
import Referrals from "./page/Referrals";
import InvestmentCalculator from "./page/InvestmentCalculator";
import PaymentDetails from "./page/PaymentDetails";
import Support from "./page/Suppor";

export default function App() {
  return (
    <div className="bg-gradient-to-b from-[#F8FAFC] to-[#E3E8F0] min-h-screen">
      <Router>
        <Toaster /> {/* Global toast notifications */}
        <Routes>
          {/* ✅ OTP Verification Route */}
          <Route path="/verify-otp" element={<OtpVerification />} />

          {/* ✅ Forgot Password Route */}
          <Route
            path="/forgot-password"
            element={
              <>
                <Navbar />
                <ForgotPassword />
                <Footer />
              </>
            }
          />

          {/* ✅ Public Routes (Navbar + Footer) */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <Footer />
              </>
            }
          />
          <Route
            path="/auth"
            element={
              <>
                <Navbar />
                <Auth />
                <Footer />
              </>
            }
          />
          <Route path="/livestats" element={<LiveStats />} />
          <Route path="/staking" element={<StakingFeatures />} />
          <Route path="/security" element={<SecurityMeasures />} />
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/support" element={<SupportSection />} />

          {/* ✅ Protected Routes (Sidebar + Dashboard) */}
          {[
            { path: "/home", component: <Home /> },
            { path: "/dashboard", component: <Dashboard /> },
            { path: "/calculator", component: <InvestmentCalculator /> },
            { path: "/wallet", component: <Wallet /> },
            { path: "/deposit", component: <Deposit /> },
            { path: "/withdraw", component: <Withdraw /> },
            { path: "/payment-details", component: <PaymentDetails /> },
            { path: "/profile", component: <Profile /> },
            { path: "/referrals", component: <Referrals /> },
            { path: "/supportsection", component: <Support /> },
          ].map(({ path, component }, index) => (
            <Route
              key={index}
              path={path}
              element={
                <ProtectedRoute>
                  <div className="flex min-h-screen">
                    <Sidebar />
                    <div className="flex-grow p-6">{component}</div>
                  </div>
                </ProtectedRoute>
              }
            />
          ))}

          {/* ✅ Fixed: Protected Solana Wallet Route */}
          <Route
            path="/wallets"
            element={
              <ProtectedRoute>
                <SolanaWallet />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
