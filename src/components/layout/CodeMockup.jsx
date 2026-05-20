const LINES = [
  [{ t: "def ",           c: "#FF7B72" }, { t: "calculate_xp",  c: "#D2A8FF" }, { t: "(streak, base_xp):", c: "#F8FAFC" }],
  [{ t: '  """Calculate XP with streak multiplier"""', c: "#8B949E", i: true }],
  [{ t: "  multiplier ",  c: "#F8FAFC" }, { t: "= ", c: "#FF7B72" }, { t: "1.0 ", c: "#79C0FF" }, { t: "+ (streak * ", c: "#F8FAFC" }, { t: "0.1", c: "#79C0FF" }, { t: ")", c: "#F8FAFC" }],
  [{ t: "  current_streak ", c: "#F8FAFC" }, { t: "= ", c: "#FF7B72" }, { t: "12", c: "#79C0FF" }],
  [{ t: "  earned_xp ",   c: "#F8FAFC" }, { t: "= ", c: "#FF7B72" }, { t: "calculate_xp(current_streak, ", c: "#F8FAFC" }, { t: "50", c: "#79C0FF" }, { t: ")", c: "#F8FAFC" }],
  [{ t: '  print(f"🔥 Streak: {current_streak} days")', c: "#A5D6FF" }],
  [{ t: '  print(f"⭐ Earned: {earned_xp} XP")',        c: "#A5D6FF" }],
];

export default function CodeMockup() {
  return (
    <div className="aFloat" style={{ position: "relative", width: "100%" }}>

      {/* Glow */}
      <div style={{
        position: "absolute", inset: -40,
        background: "radial-gradient(ellipse at center, rgba(99,102,241,.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Editor window */}
      <div style={{
        background: "#0D1117", border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 14, overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,.6)", position: "relative",
      }}>
        {/* Chrome bar */}
        <div style={{
          background: "#161B22", padding: "10px 16px",
          display: "flex", alignItems: "center", gap: 8,
          borderBottom: "1px solid rgba(255,255,255,.06)",
        }}>
          {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, display: "inline-block" }} />
          ))}
          <span style={{ flex: 1, textAlign: "center", fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#484F58" }}>
            main.py
          </span>
        </div>

        {/* Code lines */}
        <div style={{ padding: "16px 16px 16px 0", overflowX: "auto" }}>
          {LINES.map((line, i) => (
            <div key={i} style={{ display: "flex", marginBottom: 3, minHeight: 20 }}>
              <span style={{ width: 32, textAlign: "right", paddingRight: 12, fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#484F58", userSelect: "none", flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, lineHeight: "20px", whiteSpace: "nowrap" }}>
                {line.map((tk, j) => (
                  <span key={j} style={{ color: tk.c, fontStyle: tk.i ? "italic" : "normal" }}>{tk.t}</span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak chip */}
      <div className="aChip1" style={{
        position: "absolute", top: 36, right: 0,
        background: "rgba(15,15,26,.96)", border: "1px solid rgba(245,158,11,.4)",
        borderRadius: 20, padding: "7px 13px",
        display: "flex", alignItems: "center", gap: 6,
        backdropFilter: "blur(12px)", boxShadow: "0 4px 20px rgba(0,0,0,.5)", zIndex: 2,
      }}>
        <span style={{ fontSize: 13 }}>🔥</span>
        <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 12, color: "#FCD34D" }}>12 Day Streak!</span>
      </div>

      {/* XP chip */}
      <div className="aChip2" style={{
        position: "absolute", top: 84, right: 0,
        background: "rgba(15,15,26,.96)", border: "1px solid rgba(99,102,241,.4)",
        borderRadius: 20, padding: "7px 13px",
        display: "flex", alignItems: "center", gap: 6,
        backdropFilter: "blur(12px)", boxShadow: "0 4px 20px rgba(0,0,0,.5)", zIndex: 2,
      }}>
        <span style={{ fontSize: 13 }}>⭐</span>
        <span style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 12, color: "#A5B4FC" }}>+50 XP Earned</span>
      </div>

    </div>
  );
}