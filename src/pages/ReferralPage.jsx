import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

function remaining(expiresAt) {
  const ms = new Date(expiresAt) - Date.now();
  if (ms <= 0) return null;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function ReferralPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loadingRef, setLoadingRef] = useState(true);
  const [editing, setEditing] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [, setTick] = useState(0); // forces countdown re-render

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const load = () => {
    api.user.referral()
      .then((d) => { setData(d); if (!d.code) setEditing(true); })
      .catch(console.error)
      .finally(() => setLoadingRef(false));
  };
  useEffect(() => { if (user) load(); }, [user]);

  // tick the countdown every minute
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const saveCode = async () => {
    const clean = codeInput.trim().toUpperCase();
    if (!/^[A-Z0-9]{4,20}$/.test(clean)) {
      setError("4–20 letters or numbers, no spaces.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.setReferralCode(clean);
      setEditing(false);
      setCodeInput("");
      load();
    } catch (err) {
      setError(err.message || "Could not save that code.");
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    if (!data?.link) return;
    try {
      await navigator.clipboard.writeText(data.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked */ }
  };

  const shareWhatsApp = () => {
    if (!data?.link) return;
    const msg = `I'm learning to code on CodePath Ghana 🇬🇭 — free lessons built for Ghanaian students. Join with my link and we both level up: ${data.link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (loading || loadingRef) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6366F1", fontFamily: "'Space Grotesk'", fontSize: 16 }}>Loading...</span>
    </div>
  );

  const cap = data?.cap ?? 3;
  const bonus = data?.bonusUnlocked ?? 0;
  const qualified = data?.qualified ?? 0;
  const invited = data?.invited ?? 0;
  const timeLeft = data?.expiresAt ? remaining(data.expiresAt) : null;
  const hasActive = !!(data?.code && timeLeft);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F8FAFC", fontFamily: "'DM Sans'" }}>

      {/* Top bar */}
      <div style={{
        height: 56, background: "#0F0F1A",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        display: "flex", alignItems: "center", gap: 16,
        padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <button onClick={() => navigate("/dashboard")} style={{
          background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 8, padding: "6px 12px", cursor: "pointer",
          fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8",
        }}>
          ← Dashboard
        </button>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16 }}>
          🎁 Invite Friends
        </span>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🚀</div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>
            Invite friends, unlock Pro lessons
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 15, lineHeight: 1.6 }}>
            Pick your own code. For every friend who joins with it and completes their first lesson,
            you unlock a bonus Pro lesson — up to {cap}.
          </p>
        </div>

        {/* Progress */}
        <div style={{
          background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 14, padding: "24px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: "#94A3B8" }}>Bonus lessons unlocked</span>
            <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 13, color: "#a78bfa" }}>
              {Math.min(bonus, cap)} / {cap}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {Array.from({ length: cap }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 8, borderRadius: 4,
                background: i < bonus ? "linear-gradient(90deg,#6366F1,#a78bfa)" : "rgba(255,255,255,.08)",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <div>
              <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: "#F8FAFC" }}>{invited}</p>
              <p style={{ fontSize: 11, color: "#475569", letterSpacing: ".06em" }}>INVITED</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: "#10B981" }}>{qualified}</p>
              <p style={{ fontSize: 11, color: "#475569", letterSpacing: ".06em" }}>STARTED LEARNING</p>
            </div>
          </div>
        </div>

        {/* Code / link section */}
        <div style={{
          background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 14, padding: "24px", marginBottom: 20,
        }}>
          {hasActive && !editing ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12,
                  letterSpacing: ".08em", color: "#94A3B8", textTransform: "uppercase",
                }}>
                  Your invite link
                </p>
                <span style={{
                  fontFamily: "'DM Sans'", fontSize: 11, color: "#F59E0B",
                  background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.25)",
                  borderRadius: 20, padding: "2px 10px",
                }}>
                  ⏳ Expires in {timeLeft}
                </span>
              </div>

              <div style={{
                display: "flex", gap: 8, alignItems: "center",
                background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 8, padding: "10px 12px", marginBottom: 14,
              }}>
                <span style={{
                  flex: 1, fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#94A3B8",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {data.link}
                </span>
                <button onClick={copyLink} style={{
                  background: copied ? "#10B981" : "#6366F1", color: "#fff", border: "none",
                  borderRadius: 6, padding: "7px 14px", cursor: "pointer",
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12, flexShrink: 0,
                }}>
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>

              <button onClick={shareWhatsApp} style={{
                width: "100%", background: "#25D366", color: "#0A0A0F", border: "none",
                borderRadius: 8, padding: "13px", cursor: "pointer",
                fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12,
              }}>
                <span style={{ fontSize: 16 }}>💬</span> Share on WhatsApp
              </button>

              <button onClick={() => { setEditing(true); setCodeInput(data.code); }} style={{
                width: "100%", background: "transparent", color: "#94A3B8",
                border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "10px",
                cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 13,
              }}>
                Change code / refresh link
              </button>
            </>
          ) : (
            <>
              <p style={{
                fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12,
                letterSpacing: ".08em", color: "#94A3B8", textTransform: "uppercase", marginBottom: 8,
              }}>
                {data?.code ? "Refresh your code" : "Choose your referral code"}
              </p>
              <p style={{ fontSize: 13, color: "#475569", marginBottom: 14, lineHeight: 1.5 }}>
                4–20 letters or numbers. Your link stays active for 48 hours, then refresh it here.
              </p>
              <input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && saveCode()}
                placeholder="e.g. MORRIS25"
                maxLength={20}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 8, padding: "12px 14px", marginBottom: 12,
                  fontFamily: "'JetBrains Mono'", fontSize: 14, color: "#F8FAFC",
                  outline: "none", letterSpacing: ".05em",
                }}
              />
              {error && <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <button onClick={saveCode} disabled={saving} style={{
                width: "100%", background: "#6366F1", color: "#fff", border: "none",
                borderRadius: 8, padding: "13px", cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 14,
              }}>
                {saving ? "Saving..." : data?.code ? "Refresh my link" : "Create my link"}
              </button>
              {data?.code && (
                <button onClick={() => { setEditing(false); setError(""); }} style={{
                  width: "100%", background: "transparent", color: "#475569",
                  border: "none", padding: "10px", marginTop: 4,
                  cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 13,
                }}>
                  Cancel
                </button>
              )}
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
          Your friend gets 18 free lessons to start. You get bonus Pro lessons once they begin learning.
        </p>
      </div>
    </div>
  );
}