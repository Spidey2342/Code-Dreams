const DIFF_COLORS = {
  Beginner:     "#10B981",
  Intermediate: "#F59E0B",
  Advanced:     "#EF4444",
};

export default function TrackCard({ track, delay }) {
  const dc = DIFF_COLORS[track.difficulty] || "#94A3B8";

  return (
    <div
      className="trackCard aSlideUp"
      style={{ animationDelay: delay, background: "#0F0F1A", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, overflow: "hidden" }}
    >
      {/* Colour bar */}
      <div style={{ height: 5, background: track.color }} />

      <div style={{ padding: "22px 22px 26px" }}>
        {/* Icon + difficulty badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
            background: `${track.color}22`, border: `1px solid ${track.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>
            {track.icon}
          </div>
          <span style={{
            fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: dc, background: `${dc}18`, border: `1px solid ${dc}33`,
            borderRadius: 4, padding: "3px 8px",
          }}>
            {track.difficulty}
          </span>
        </div>

        <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 19, color: "#F8FAFC", marginBottom: 8 }}>
          {track.name}
        </h3>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 13, lineHeight: 1.6, color: "#94A3B8", marginBottom: 18 }}>
          {track.desc}
        </p>

        {/* Meta */}
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#94A3B8", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#6366F1" }}>⏱</span> {track.weeks}
          </span>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#94A3B8", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#F59E0B" }}>★</span> {track.xp} XP
          </span>
        </div>
      </div>
    </div>
  );
}