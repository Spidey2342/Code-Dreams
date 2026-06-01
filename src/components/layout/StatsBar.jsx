const STATS = [
  { value: "60+", label: "Free Lessons" },
  { value: "2", label: "Active Tracks" },
  { value: "GHS 80", label: "Pro Per Month" },
  { value: "100%", label: "Browser-based" },
];

export default function StatsBar() {
  return (
    <section style={{ background: "#0A0A0F", borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 800, fontSize: 32, color: "#F8FAFC", marginBottom: 4 }}>
                {s.value}
              </p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}