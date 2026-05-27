import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useWidth } from "../hooks/useWidth";

export default function CertificatePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const w = useWidth();
  const mob = w < 768;
  const certRef = useRef(null);

  const [certificates, setCertificates] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const token = localStorage.getItem("codepath_token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/certificates/my`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setCertificates(data.certificates || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCerts(false);
      }
    };
    if (user) fetchCerts();
  }, [user]);

  const generateCertificate = async (trackId) => {
    setGenerating(true);
    setError("");
    try {
      const token = localStorage.getItem("codepath_token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/certificates/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ trackId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCertificates((c) => [...c, data.certificate]);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const printCertificate = () => {
    window.print();
  };

  if (loading || loadingCerts) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6366F1", fontFamily: "'Space Grotesk'", fontSize: 16 }}>Loading...</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F" }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate-print, #certificate-print * { visibility: visible; }
          #certificate-print { position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>

      {/* Top bar */}
      <div style={{
        background: "#0F0F1A", borderBottom: "1px solid rgba(255,255,255,.06)",
        padding: `0 ${mob ? 16 : 24}px`, height: 56,
        display: "flex", alignItems: "center", gap: 16,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8",
          }}
        >
          ← Dashboard
        </button>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 14, color: "#F8FAFC" }}>
          My Certificates
        </span>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: mob ? "28px 16px" : "48px 24px" }}>

        {certificates.length === 0 ? (
          /* No certificates yet */
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <span style={{ fontSize: 56, display: "block", marginBottom: 16 }}>🎓</span>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: mob ? 22 : 28, color: "#F8FAFC", marginBottom: 8 }}>
              No Certificates Yet
            </h2>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
              Complete all lessons in a track and pass the project checkpoint to earn your certificate.
            </p>

            {error && (
              <div style={{
                background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)",
                borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                fontFamily: "'DM Sans'", fontSize: 13, color: "#EF4444",
                maxWidth: 400, margin: "0 auto 16px",
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/track")}
                style={{
                  background: "#6366F1", color: "#fff", border: "none",
                  borderRadius: 8, padding: "12px 24px", cursor: "pointer",
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
                }}
              >
                Continue Learning →
              </button>
              <button
                onClick={() => generateCertificate("html-css")}
                disabled={generating}
                style={{
                  background: "transparent", color: "#94A3B8",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 8, padding: "12px 24px", cursor: "pointer",
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
                }}
              >
                {generating ? "Checking..." : "Check Eligibility"}
              </button>
            </div>
          </div>
        ) : (
          /* Certificates list */
          <div>
            <h1 style={{
              fontFamily: "'Space Grotesk'", fontWeight: 700,
              fontSize: mob ? 24 : 30, color: "#F8FAFC",
              marginBottom: 8, letterSpacing: "-1px",
            }}>
              My Certificates
            </h1>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", marginBottom: 32 }}>
              {certificates.length} certificate{certificates.length > 1 ? "s" : ""} earned
            </p>

            {certificates.map((cert) => (
              <div key={cert.id}>
                {/* Certificate card */}
              <div
  id="certificate-print"
  ref={certRef}
  style={{
    background: "linear-gradient(135deg, #0D0D1F 0%, #1a1a35 50%, #0D0D1F 100%)",
    border: "2px solid rgba(99,102,241,.4)",
    borderRadius: 16, padding: mob ? "36px 24px" : "56px 64px",
    marginBottom: 16, textAlign: "center",
    position: "relative", overflow: "hidden",
    boxShadow: "0 0 60px rgba(99,102,241,.15), inset 0 0 60px rgba(0,0,0,.3)",
  }}
>
  {/* Corner decorations */}
  {[
    { top: 16, left: 16 },
    { top: 16, right: 16 },
    { bottom: 16, left: 16 },
    { bottom: 16, right: 16 },
  ].map((pos, i) => (
    <div key={i} style={{
      position: "absolute", width: 32, height: 32, ...pos,
      border: "2px solid rgba(99,102,241,.4)",
      borderRadius: 2,
    }} />
  ))}

  {/* Top glow */}
  <div style={{
    position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
    width: 300, height: 120,
    background: "radial-gradient(ellipse, rgba(99,102,241,.2) 0%, transparent 70%)",
    pointerEvents: "none",
  }} />

  {/* Decorative lines */}
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, height: 3,
    background: "linear-gradient(90deg, transparent, #6366F1, #a78bfa, #6366F1, transparent)",
  }} />
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
    background: "linear-gradient(90deg, transparent, #6366F1, #a78bfa, #6366F1, transparent)",
  }} />

  <div style={{ position: "relative" }}>
    {/* Logo */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: "#6366F1",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#fff", fontWeight: 600,
      }}>
        &lt;/&gt;
      </div>
      <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, letterSpacing: ".1em", color: "#F8FAFC" }}>
        CODEPATH
      </span>
    </div>

    {/* Divider */}
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,.4))" }} />
      <span style={{ fontSize: 24 }}>🎓</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(99,102,241,.4), transparent)" }} />
    </div>

    <p style={{
      fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600,
      letterSpacing: ".25em", textTransform: "uppercase",
      color: "#6366F1", marginBottom: 16,
    }}>
      Certificate of Completion
    </p>

    <p style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#94A3B8", marginBottom: 12 }}>
      This certifies that
    </p>

    <h2 style={{
      fontFamily: "'Space Grotesk'", fontWeight: 700,
      fontSize: mob ? 32 : 48, color: "#F8FAFC",
      letterSpacing: "-2px", marginBottom: 4,
      textShadow: "0 0 40px rgba(99,102,241,.4)",
    }}>
      {user?.name}
    </h2>

    {/* Name underline */}
    <div style={{
      width: 120, height: 2, margin: "0 auto 20px",
      background: "linear-gradient(90deg, transparent, #a78bfa, transparent)",
    }} />

    <p style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#94A3B8", marginBottom: 12 }}>
      has successfully completed the
    </p>

    <h3 style={{
      fontFamily: "'Space Grotesk'", fontWeight: 700,
      fontSize: mob ? 20 : 28, color: "#a78bfa",
      marginBottom: 8, letterSpacing: "-0.5px",
    }}>
      HTML & CSS Foundation
    </h3>

    <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#475569", marginBottom: 32 }}>
      Track 1 of 4 — CodePath Learning Path
    </p>

    {/* Stats row */}
    <div style={{
      display: "flex", justifyContent: "center", gap: mob ? 24 : 48,
      marginBottom: 32,
      padding: "16px 0",
      borderTop: "1px solid rgba(255,255,255,.06)",
      borderBottom: "1px solid rgba(255,255,255,.06)",
    }}>
      {[
        { value: "10", label: "Lessons" },
        { value: "1", label: "Project" },
        { value: "550", label: "XP Earned" },
      ].map((stat) => (
        <div key={stat.label} style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: mob ? 20 : 26, color: "#F8FAFC", marginBottom: 2 }}>
            {stat.value}
          </p>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#475569", letterSpacing: ".06em", textTransform: "uppercase" }}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>

    {/* Certificate ID */}
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)",
      borderRadius: 8, padding: "8px 20px", marginBottom: 16,
    }}>
      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#475569" }}>ID</span>
      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#6366F1" }}>{cert.uniqueCode}</span>
    </div>

    <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569" }}>
      Issued on {new Date(cert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · Verify at codepath.com/verify/{cert.uniqueCode}
    </p>
  </div>
</div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
                  <button
                    onClick={printCertificate}
                    style={{
                      flex: 1, padding: "12px",
                      background: "#6366F1", color: "#fff", border: "none",
                      borderRadius: 8, cursor: "pointer",
                      fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
                    }}
                  >
                    📥 Download / Print
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/verify/${cert.uniqueCode}`);
                      alert("Verify link copied!");
                    }}
                    style={{
                      flex: 1, padding: "12px",
                      background: "transparent", color: "#94A3B8",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 8, cursor: "pointer",
                      fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
                    }}
                  >
                    🔗 Copy Verify Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}