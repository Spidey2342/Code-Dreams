import CodeMockup from "./CodeMockup";

export default function Hero() {
  return (
    <div style={{ position: "relative", background: "#0A0A0F", overflow: "hidden" }}>

      {/* Background glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "min(900px,100%)", height: 500,
        background: "radial-gradient(ellipse at top, rgba(99,102,241,.12) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div className="pHero" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="heroGrid">

          {/* Left — text */}
          <div>
            {/* Badge */}
            <div className="aFadeUp heroBadge" style={{ animationDelay: ".05s", marginBottom: 24 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(245,158,11,.12)", border: "1px solid rgba(245,158,11,.3)",
                borderRadius: 20, padding: "5px 14px",
                fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 11,
                color: "#FCD34D", letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                ⚡ NEW: AI POWERED LEARNING PATHS
              </span>
            </div>

            {/* Headline */}
            <h1 className="aFadeUp h1Size" style={{
              animationDelay: ".15s",
              fontFamily: "'Space Grotesk'", fontWeight: 700,
              lineHeight: 1.06, letterSpacing: "clamp(-1px, -0.05em, -2px)", marginBottom: 20,
            }}>
              <span style={{ color: "#F8FAFC" }}>Your journey to</span><br />
              <span className="gradText">becoming</span><br />
              <span className="gradText">a</span>
              <span style={{ color: "#F8FAFC" }}>developer</span>
              <span style={{ color: "#F59E0B" }}>.</span>
            </h1>

            {/* Body */}
            <p className="aFadeUp heroBody" style={{
              animationDelay: ".25s",
              fontFamily: "'DM Sans'", fontSize: 16, lineHeight: 1.75,
              color: "#94A3B8", marginBottom: 32, maxWidth: 460,
            }}>
              Master coding through gamified tracks, real-world projects, and AI-driven feedback.
              Join thousands of developers building the future.
            </p>

            {/* CTA buttons */}
           
<div className="aFadeUp heroCta" style={{ animationDelay: ".35s", display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
  <button className="btnP"
    onClick={() => window.location.href = "/signup"}
    style={{
      background: "#6366F1", color: "#fff", border: "none", borderRadius: 8,
      padding: "13px 24px", cursor: "pointer",
      fontFamily: "'Space Grotesk'", fontWeight: 600,
      fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
    START LEARNING FREE →
  </button>
  <button className="btnG"
    onClick={() => window.location.href = "/tracks"}
    style={{
      background: "transparent", color: "#F8FAFC",
      border: "1px solid rgba(255,255,255,.15)", borderRadius: 8,
      padding: "13px 20px", cursor: "pointer",
      fontFamily: "'Space Grotesk'", fontWeight: 600,
      fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
    EXPLORE TRACKS ⠿
  </button>
</div>

<div className="aFadeUp heroSocial" style={{ animationDelay: ".45s", display: "flex", alignItems: "center", gap: 12 }}>
  <div style={{ display: "flex" }}>
    {["#6366F1", "#F59E0B", "#10B981", "#3B82F6"].map((c, i) => (
      <div key={i} style={{
        width: 30, height: 30, borderRadius: "50%",
        background: c, border: "2px solid #0A0A0F",
        marginLeft: i === 0 ? 0 : -9,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
      }}>
        {["K", "A", "T", "M"][i]}
      </div>
    ))}
  </div>
  <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>
    <strong style={{ color: "#F8FAFC" }}>Growing</strong> community of Ghanaian developers
  </span>
</div>
          </div>

          {/* Right — code mockup */}
          <div className="heroCodeCol">
            <div style={{ width: "100%", maxWidth: 460 }}>
              <CodeMockup />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}