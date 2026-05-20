const STEPS = [
  { num: "01", title: "CHOOSE TRACK",     desc: "Select a learning path tailored to your goals, from frontend basics to advanced data science." },
  { num: "02", title: "COMPLETE LESSONS", desc: "Engage with bite-sized, interactive coding challenges that build real muscle memory." },
  { num: "03", title: "BUILD PROJECTS",   desc: "Apply your skills by building portfolio-ready projects with AI-assisted code reviews." },
];

export default function HowItWorks() {
  return (
    <section style={{ background: "#0F0F1A" }}>
      <div className="pSec" style={{ maxWidth: 1280, margin: "0 auto" }}>

        <p style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366F1", marginBottom: 12 }}>
          // THE PROCESS
        </p>
        <h2 className="h2Size" style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, letterSpacing: "-1px", color: "#F8FAFC", marginBottom: 48 }}>
          HOW IT WORKS
        </h2>

        <div className="stepsGrid">
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className="stepCard aSlideUp"
              style={{
                animationDelay: `${0.1 * i}s`,
                background: "#0A0A0F",
                border: "1px solid rgba(255,255,255,.07)",
                borderLeft: "2px solid #6366F1",
                borderRadius: 14, padding: "28px 24px 32px",
              }}
            >
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 44, fontWeight: 700, color: "rgba(255,255,255,.05)", lineHeight: 1, marginBottom: 14 }}>
                {s.num}
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, letterSpacing: "0.04em", color: "#F8FAFC", marginBottom: 10 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 14, lineHeight: 1.65, color: "#94A3B8" }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}