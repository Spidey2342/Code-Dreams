import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import TrackPage from "./pages/TrackPage";
import LessonPage from "./pages/LessonPage";
import SubmitPage from "./pages/SubmitPage";
import CertificatePage from "./pages/CertificatePage";
import TracksPage from "./pages/TracksPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SettingsPage from "./pages/SettingsPage";
import VerifyPage from "./pages/VerifyPage";
import TermsPage from "./pages/TermsPage";
import AuthCallback from "./pages/AuthCallback";
import PrivacyPage from "./pages/PrivacyPage";
import PricingPage from "./pages/PricingPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ReferralPage from "./pages/ReferralPage";
import { ProtectedRoute, PublicRoute } from "./components/ui/ProtectedRoute";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("reference") ||
                new URLSearchParams(window.location.search).get("trxref");
    if (ref) {
      const token = localStorage.getItem("codepath_token");
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/payments/verify/${ref}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).finally(() => setVerifying(false));
    } else {
      setVerifying(false);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 56, marginBottom: 16 }}>{verifying ? "⏳" : "🎉"}</p>
        <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, color: "#F8FAFC", marginBottom: 8 }}>
          {verifying ? "Verifying payment..." : "You're now Pro!"}
        </h2>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
          {verifying ? "Please wait" : "Welcome to CodePath Pro. All tracks unlocked."}
        </p>
        {!verifying && (
          <button onClick={() => navigate("/dashboard")} style={{
            background: "#6366F1", color: "#fff", border: "none",
            borderRadius: 8, padding: "12px 24px", cursor: "pointer",
            fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
          }}>
            Go to Dashboard →
          </button>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/verify/:code" element={<VerifyPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/terms" element={<TermsPage />} />
<Route path="/privacy" element={<PrivacyPage />} />
<Route path="/auth/callback" element={<AuthCallback />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Auth pages — redirect to dashboard if logged in */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

        {/* Protected pages — redirect to login if not logged in */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/track" element={<ProtectedRoute><TrackPage /></ProtectedRoute>} />
        <Route path="/lessons" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
        <Route path="/submit/:trackSlug/:order" element={<ProtectedRoute><SubmitPage /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
        <Route path="/tracks" element={<ProtectedRoute><TracksPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/referral" element={<ProtectedRoute><ReferralPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;