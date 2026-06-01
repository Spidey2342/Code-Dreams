export default function Testimonial() {
  return (
    <section style={{ background: "#0F0F1A", padding: "80px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366F1", marginBottom: 40 }}>
          // WHAT STUDENTS SAY
        </p>
        <div style={{
          background: "#0A0A0F", border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 20, padding: "48px 40px", position: "relative",
        }}>
          <div style={{
            position: "absolute", top: -20, left: 40,
            fontSize: 80, color: "#6366F1", fontFamily: "Georgia",
            lineHeight: 1, opacity: 0.5,
          }}>
            "
          </div>
          <p style={{
            fontFamily: "'Space Grotesk'", fontSize: 22, fontWeight: 500,
            color: "#F8FAFC", lineHeight: 1.6, marginBottom: 32, fontStyle: "italic",
          }}>
            CodePath transformed how I think about web development. The lessons are practical,
            the projects are real, and the certificate helped me land my first freelance client in Accra.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366F1, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: "#fff",
            }}>
              T
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>
                Tsetse Benedicta Norvienyo
              </p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#94A3B8" }}>
                Frontend Developer · Accra, Ghana · 550 XP
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}