import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VerifyPage() {
  const { code } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/certificates/verify/${code}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCert(data);
      } catch (err) {
        setError("Certificate not found or invalid.");
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [code]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6366F1", fontFamily: "'Space Grotesk'", fontSize: 16 }}>Verifying...</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        {error ? (
          <>
            <span style={{ fontSize: 48, display: "block", marginBottom: 16 }}>❌</span>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, color: "#EF4444", marginBottom: 8 }}>
              Invalid Certificate
            </h2>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>
              This certificate could not be verified.
            </p>
          </>
        ) : (
          <>
            <span style={{ fontSize: 56, display: "block", marginBottom: 16 }}>✅</span>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, letterSpacing: ".15em", color: "#10B981", marginBottom: 12, textTransform: "uppercase" }}>
              Verified Certificate
            </p>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 28, color: "#F8FAFC", marginBottom: 4 }}>
              {cert.name}
            </h2>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
              Successfully completed HTML & CSS Foundation
            </p>
            <div style={{
              background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 12, padding: "16px 20px", marginBottom: 24,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569" }}>Certificate ID</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#6366F1" }}>{cert.uniqueCode}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569" }}>Issued</span>
                <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#F8FAFC" }}>
                  {new Date(cert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 6, background: "#6366F1",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'JetBrains Mono'", fontSize: 9, color: "#fff",
              }}>
                &lt;/&gt;
              </div>
              <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 13, color: "#F8FAFC" }}>CODEPATH</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}