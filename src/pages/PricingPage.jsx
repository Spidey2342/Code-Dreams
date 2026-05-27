import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useWidth } from "../hooks/useWidth";

export default function PricingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const w = useWidth();
  const mob = w < 768;
  const [plan, setPlan] = useState("monthly");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!user) { navigate("/signup"); return; }
    setPaying(true);
    setError("");
    try {
      const token = localStorage.getItem("codepath_token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/payments/initialize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ plan }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err.message);
      setPaying(false);
    }
  };

  const FEATURES_FREE = [
    "First 3 lessons of HTML & CSS",
    "1 mini project",
    "Community access",
  ];

  const FEATURES_PRO = [
    "All 4 tracks (HTML, CSS, JS, Python)",
    "Unlimited AI tutor",
    "AI code reviewer",
    "All project submissions",
    "Certificates for every track",
    "Offline lesson access",
    "Priority support",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F" }}>

      {/* Top bar */}
      <div style={{
        background: "#0F0F1A", borderBottom: "1px solid rgba(255,255,255,.06)",
        padding: `0 ${mob ? 16 : 24}px`, height: 56,
        display: "flex", alignItems: "center", gap: 16,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => navigate(user ? "/dashboard" : "/")}
          style={{
            background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8",
          }}
        >
          ← Back
        </button>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 14, color: "#F8FAFC" }}>
          Pricing
        </span>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: mob ? "32px 16px" : "56px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{
            fontFamily: "'Space Grotesk'", fontWeight: 700,
            fontSize: mob ? 28 : 40, color: "#F8FAFC",
            letterSpacing: "-1.5px", marginBottom: 12,
          }}>
            Simple, Honest Pricing
          </h1>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#94A3B8" }}>
            Built for Ghanaian learners. Pay with mobile money or card.
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <div style={{
            background: "#0F0F1A", border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 10, padding: 4, display: "flex", gap: 4,
          }}>
            {["monthly", "yearly"].map((p) => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                style={{
                  padding: "8px 20px", borderRadius: 8, border: "none",
                  background: plan === p ? "#6366F1" : "transparent",
                  color: plan === p ? "#fff" : "#94A3B8",
                  fontFamily: "'Space Grotesk'", fontWeight: 600,
                  fontSize: 13, cursor: "pointer", transition: "all .15s",
                }}
              >
                {p === "monthly" ? "Monthly" : "Yearly"}
                {p === "yearly" && (
                  <span style={{
                    marginLeft: 6, fontSize: 10,
                    background: "rgba(16,185,129,.2)", color: "#10B981",
                    borderRadius: 4, padding: "1px 5px",
                  }}>
                    SAVE 38%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: 20, marginBottom: 40,
        }}>

          {/* Free */}
          <div style={{
            background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 16, padding: "28px 24px",
          }}>
            <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, letterSpacing: ".06em", color: "#94A3B8", marginBottom: 16 }}>
              FREE
            </p>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 40, color: "#F8FAFC" }}>
                GHS 0
              </span>
              <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#475569" }}> / forever</span>
            </div>
            <button
              onClick={() => navigate("/signup")}
              style={{
                width: "100%", padding: "12px",
                background: "transparent", color: "#F8FAFC",
                border: "1px solid rgba(255,255,255,.15)",
                borderRadius: 8, cursor: "pointer",
                fontFamily: "'Space Grotesk'", fontWeight: 600,
                fontSize: 13, marginBottom: 24,
              }}
            >
              Get Started Free
            </button>
            {FEATURES_FREE.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{ color: "#10B981", flexShrink: 0 }}>✓</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Pro */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99,102,241,.08), rgba(167,139,250,.05))",
            border: "1px solid rgba(99,102,241,.3)",
            borderRadius: 16, padding: "28px 24px",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
              background: "#6366F1", borderRadius: 20, padding: "3px 14px",
              fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 11,
              color: "#fff", letterSpacing: ".06em", whiteSpace: "nowrap",
            }}>
              MOST POPULAR
            </div>

            <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, letterSpacing: ".06em", color: "#a78bfa", marginBottom: 16 }}>
              PRO
            </p>

            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 40, color: "#F8FAFC" }}>
                GHS {plan === "monthly" ? "80" : "600"}
              </span>
              <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#475569" }}>
                {plan === "monthly" ? " / month" : " / year"}
              </span>
            </div>

            {plan === "yearly" && (
              <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#10B981", marginBottom: 16 }}>
                Save GHS 360 vs monthly
              </p>
            )}

            {error && (
              <div style={{
                background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)",
                borderRadius: 8, padding: "8px 12px", marginBottom: 12,
                fontFamily: "'DM Sans'", fontSize: 12, color: "#EF4444",
              }}>
                {error}
              </div>
            )}

            {user?.isPro ? (
              <div style={{
                width: "100%", padding: "12px", textAlign: "center",
                background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.2)",
                borderRadius: 8, marginBottom: 24,
                fontFamily: "'Space Grotesk'", fontWeight: 600,
                fontSize: 13, color: "#10B981",
              }}>
                ✓ You are on Pro
              </div>
            ) : (
              <button
                onClick={handlePayment}
                disabled={paying}
                style={{
                  width: "100%", padding: "12px",
                  background: paying ? "#4B4E99" : "#6366F1",
                  color: "#fff", border: "none",
                  borderRadius: 8, cursor: paying ? "not-allowed" : "pointer",
                  fontFamily: "'Space Grotesk'", fontWeight: 600,
                  fontSize: 13, marginBottom: 24,
                  transition: "background .2s",
                }}
              >
                {paying ? "Redirecting..." : `Upgrade to Pro →`}
              </button>
            )}

            {FEATURES_PRO.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{ color: "#6366F1", flexShrink: 0 }}>✓</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#475569", marginBottom: 12 }}>
            Accepted payment methods
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {["MTN Mobile Money", "Vodafone Cash", "AirtelTigo Money", "Visa / Mastercard"].map((method) => (
              <span key={method} style={{
                fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8",
                background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 6, padding: "5px 12px",
              }}>
                {method}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}