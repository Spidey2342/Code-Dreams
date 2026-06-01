import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    api.user.me().then(data => {
      setUser(data);
      setName(data.name || "");
      setEmail(data.email || "");
      setLoading(false);
    }).catch(() => navigate("/login"));
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const saveProfile = async () => {
    if (!name.trim()) return showMessage("Name cannot be empty", "error");
    setSaving(true);
    try {
      const token = localStorage.getItem("codepath_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/user/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(prev => ({ ...prev, name }));
        showMessage("Profile updated successfully");
      } else {
        showMessage(data.error || "Failed to update profile", "error");
      }
    } catch {
      showMessage("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword) return showMessage("Enter your current password", "error");
    if (newPassword.length < 8) return showMessage("New password must be at least 8 characters", "error");
    if (newPassword !== confirmPassword) return showMessage("Passwords do not match", "error");
    setSaving(true);
    try {
      const token = localStorage.getItem("codepath_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/user/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showMessage("Password changed successfully");
      } else {
        showMessage(data.error || "Failed to change password", "error");
      }
    } catch {
      showMessage("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const cancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your Pro subscription?")) return;
    try {
      const token = localStorage.getItem("codepath_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/payments/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(prev => ({ ...prev, isPro: false }));
        showMessage("Subscription cancelled");
      } else {
        showMessage(data.error || "Failed to cancel", "error");
      }
    } catch {
      showMessage("Something went wrong", "error");
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6366F1", fontFamily: "'Space Grotesk'", fontSize: 16 }}>Loading...</span>
    </div>
  );

  const s = {
    page: { minHeight: "100vh", background: "#0A0A0F", fontFamily: "'DM Sans'", color: "#F8FAFC" },
    nav: { height: 56, background: "#0F0F1A", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 24px", gap: 12 },
    container: { maxWidth: 640, margin: "0 auto", padding: "40px 24px" },
    card: { background: "#0F0F1A", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: 24, marginBottom: 20 },
    cardTitle: { fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: "#F8FAFC", marginBottom: 20 },
    label: { display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" },
    input: { width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "11px 14px", color: "#F8FAFC", fontSize: 14, fontFamily: "'DM Sans'", outline: "none", marginBottom: 16, boxSizing: "border-box" },
    btn: { background: "#6366F1", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13 },
    btnDanger: { background: "rgba(239,68,68,.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13 },
    btnSecondary: { background: "transparent", color: "#94A3B8", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13 },
  };

  return (
    <div style={s.page}>
      {/* Nav */}
      <div style={s.nav}>
        <button onClick={() => navigate("/dashboard")} style={{ ...s.btnSecondary, padding: "5px 12px", fontSize: 12 }}>
          ← Dashboard
        </button>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: "#F8FAFC" }}>
          Settings
        </span>
      </div>

      <div style={s.container}>

        {/* Toast message */}
        {message && (
          <div style={{
            padding: "12px 16px", borderRadius: 10, marginBottom: 20,
            background: message.type === "error" ? "rgba(239,68,68,.1)" : "rgba(16,185,129,.1)",
            border: `1px solid ${message.type === "error" ? "rgba(239,68,68,.3)" : "rgba(16,185,129,.3)"}`,
            color: message.type === "error" ? "#EF4444" : "#10B981",
            fontSize: 14,
          }}>
            {message.type === "error" ? "⚠ " : "✓ "}{message.text}
          </div>
        )}

        {/* Profile */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Profile</h2>
          <label style={s.label}>Full Name</label>
          <input
            style={s.input}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
          />
          <label style={s.label}>Email Address</label>
          <input
            style={{ ...s.input, opacity: 0.5, cursor: "not-allowed" }}
            value={email}
            disabled
          />
          <p style={{ fontSize: 12, color: "#475569", marginTop: -12, marginBottom: 16 }}>
            Email cannot be changed. Contact support if needed.
          </p>
          <button onClick={saveProfile} disabled={saving} style={s.btn}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Password */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Change Password</h2>
          <label style={s.label}>Current Password</label>
          <input
            style={s.input}
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
          <label style={s.label}>New Password</label>
          <input
            style={s.input}
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
          />
          <label style={s.label}>Confirm New Password</label>
          <input
            style={s.input}
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
          />
          <button onClick={changePassword} disabled={saving} style={s.btn}>
            {saving ? "Saving..." : "Change Password"}
          </button>
        </div>

        {/* Subscription */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Subscription</h2>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: user.isPro ? "rgba(99,102,241,.08)" : "rgba(255,255,255,.03)",
            border: `1px solid ${user.isPro ? "rgba(99,102,241,.2)" : "rgba(255,255,255,.07)"}`,
            borderRadius: 10, padding: "16px 20px", marginBottom: 20,
          }}>
            <div>
              <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: "#F8FAFC", marginBottom: 4 }}>
                {user.isPro ? "Pro Plan" : "Free Plan"}
              </p>
              <p style={{ fontSize: 13, color: "#94A3B8" }}>
                {user.isPro ? "GHS 80/month · All lessons unlocked" : "Lessons 1–18 · Upgrade to unlock all"}
              </p>
            </div>
            <div style={{
              background: user.isPro ? "rgba(99,102,241,.2)" : "rgba(255,255,255,.06)",
              color: user.isPro ? "#a78bfa" : "#475569",
              borderRadius: 20, padding: "4px 12px",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
            }}>
              {user.isPro ? "PRO" : "FREE"}
            </div>
          </div>

          {user.isPro ? (
            <button onClick={cancelSubscription} style={s.btnDanger}>
              Cancel Subscription
            </button>
          ) : (
            <button
             onClick={() => {
  const token = localStorage.getItem("codepath_token");
  fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/payments/initialize`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ plan: "monthly" }),
  })
    .then(r => r.json())
    .then(data => {
      const url = data.authorization_url || data.authorizationUrl;
      if (url) window.location.href = url;
      else console.error("No URL returned:", data);
    })
    .catch(err => console.error("Payment error:", err));
}}
              style={s.btn}
            >
              Upgrade to Pro — GHS 80/month →
            </button>
          )}
        </div>

        {/* Danger zone */}
        <div style={{ ...s.card, border: "1px solid rgba(239,68,68,.2)" }}>
          <h2 style={{ ...s.cardTitle, color: "#EF4444" }}>Danger Zone</h2>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>
            Permanently delete your account and all your progress. This cannot be undone.
          </p>
          <button
            onClick={() => {
              if (confirm("Delete your account permanently? This cannot be undone.")) {
                const token = localStorage.getItem("codepath_token");
                fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/user/delete`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }).then(() => {
                  localStorage.removeItem("codepath_token");
                  navigate("/");
                });
              }
            }}
            style={s.btnDanger}
          >
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}