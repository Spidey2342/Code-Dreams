import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.user.leaderboard()
      .then(data => setLeaderboard(data.leaderboard))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F8FAFC", fontFamily: "'DM Sans'" }}>

      {/* Nav */}
      <div style={{
        height: 56, background: "#0F0F1A",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        display: "flex", alignItems: "center",
        padding: "0 24px", gap: 16,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <button onClick={() => navigate("/dashboard")} style={{
          background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
          borderRadius: 8, padding: "6px 12px", cursor: "pointer",
          fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8",
        }}>
          ← Dashboard
        </button>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16 }}>
          🏆 Leaderboard
        </span>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 800, fontSize: 32, marginBottom: 8 }}>
            Top Developers
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 15 }}>
            CodePath Ghana — ranked by XP earned
          </p>
        </div>

        {/* Top 3 podium */}
        {!loading && leaderboard.length >= 3 && (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12, marginBottom: 32,
          }}>
            {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => {
              const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
              const heights = [100, 120, 90];
              const colors = ["#94A3B8", "#F59E0B", "#CD7F32"];
              return (
                <div key={entry.id} style={{
                  background: entry.isYou ? "rgba(99,102,241,.12)" : "#0F0F1A",
                  border: `1px solid ${entry.isYou ? "rgba(99,102,241,.3)" : "rgba(255,255,255,.07)"}`,
                  borderRadius: 14, padding: "20px 16px",
                  textAlign: "center",
                  marginTop: i === 1 ? 0 : i === 0 ? 20 : 28,
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{medals[actualRank - 1]}</div>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: entry.isYou ? "linear-gradient(135deg,#6366F1,#a78bfa)" : `rgba(255,255,255,.08)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16,
                    color: "#fff", margin: "0 auto 8px",
                  }}>
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, color: "#F8FAFC", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.name.split(" ")[0]}
                    {entry.isYou && " 👋"}
                  </p>
                  <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: colors[actualRank - 1] }}>
                    {entry.totalXP.toLocaleString()} XP
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        <div style={{
          background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 14, overflow: "hidden",
        }}>
          {/* Header row */}
          <div style={{
            display: "grid", gridTemplateColumns: "48px 1fr 80px",
            padding: "12px 20px",
            borderBottom: "1px solid rgba(255,255,255,.06)",
          }}>
            {["RANK", "DEVELOPER", "XP"].map(h => (
              <span key={h} style={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", color: "#475569" }}>
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
              Loading...
            </div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>🏁</p>
              <p style={{ color: "#475569", fontSize: 14 }}>No rankings yet. Complete lessons to appear here.</p>
            </div>
          ) : leaderboard.map((entry, i) => (
            <div key={entry.id} style={{
              display: "grid", gridTemplateColumns: "48px 1fr 80px",
              alignItems: "center", padding: "14px 20px",
              borderBottom: i < leaderboard.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none",
              background: entry.isYou ? "rgba(99,102,241,.06)" : "transparent",
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono'", fontSize: 13, fontWeight: 700,
                color: entry.rank === 1 ? "#F59E0B" : entry.rank === 2 ? "#94A3B8" : entry.rank === 3 ? "#CD7F32" : entry.isYou ? "#6366F1" : "#475569",
              }}>
                {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: entry.isYou ? "linear-gradient(135deg,#6366F1,#a78bfa)" : "rgba(255,255,255,.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 12, color: "#fff",
                }}>
                  {entry.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontFamily: "'DM Sans'", fontSize: 14, fontWeight: entry.isYou ? 600 : 400,
                    color: entry.isYou ? "#F8FAFC" : "#94A3B8",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {entry.name}{entry.isYou ? " (You)" : ""}
                  </p>
                </div>
              </div>

              <span style={{
                fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 14,
                color: entry.isYou ? "#6366F1" : "#F8FAFC", textAlign: "right",
              }}>
                {entry.totalXP.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Your rank if not in top 10 */}
        {!loading && leaderboard.length > 0 && !leaderboard.find(e => e.isYou) && (
          <div style={{
            marginTop: 16, background: "rgba(99,102,241,.08)",
            border: "1px solid rgba(99,102,241,.2)", borderRadius: 10,
            padding: "14px 20px", textAlign: "center",
          }}>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>
              You're not in the top 10 yet. Keep completing lessons to climb the ranks! 🚀
            </p>
          </div>
        )}

      </div>
    </div>
  );
}