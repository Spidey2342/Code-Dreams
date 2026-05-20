export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 34, height: 34, borderRadius: 8,
          background: "#6366F1", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{ color: "#fff", fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 500 }}>
          &lt;/&gt;
        </span>
      </div>
      <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, letterSpacing: "0.08em", color: "#F8FAFC" }}>
        CODEPATH
      </span>
    </div>
  );
}