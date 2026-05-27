import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useWidth } from "../hooks/useWidth";
import Logo from "../components/ui/Logo";
import { api } from "../lib/api";

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard", path: "/dashboard" },
  { icon: "</>", label: "My Track", path: "/track" },
  { icon: "▦", label: "Lessons", path: "/lessons" },
  { icon: "❐", label: "Projects", path: "/submit" },
  { icon: "⚑", label: "Leaderboard", path: "/leaderboard" },
  { icon: "✦", label: "Certificates", path: "/certificates" },
  { icon: "⚙", label: "Settings", path: "/settings" },
];

const MOCK_ACTIVITY = [];


export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const w = useWidth();
  const mob = w < 768;
  const tablet = w >= 768 && w < 1024;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
  if (user) {
    api.user.leaderboard()
      .then((data) => setLeaderboard(data.leaderboard))
      .catch(console.error);
  }
}, [user]);

  // close sidebar on resize to desktop
  useEffect(() => {
    if (w >= 1024) setSidebarOpen(false);
  }, [w]);


  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6366F1", fontFamily: "'Space Grotesk'", fontSize: 16 }}>Loading...</span>
    </div>
  );

  if (!user) return null;

  const level = Math.floor(user.totalXP / 500) + 1;
  const xpInLevel = user.totalXP % 500;
  const levelLabel = level < 3 ? "BEGINNER" : level < 6 ? "BUILDER" : level < 10 ? "DEVELOPER" : "ENGINEER";
  const sidebarWidth = 220;

  const Sidebar = () => (
    <aside style={{
      width: sidebarWidth, background: "#0F0F1A",
      borderRight: "1px solid rgba(255,255,255,.06)",
      display: "flex", flexDirection: "column",
      padding: "24px 0",
      // on mobile: fixed overlay; on desktop: sticky
      ...(mob || tablet ? {
        position: "fixed", top: 0, left: sidebarOpen ? 0 : -sidebarWidth,
        height: "100vh", zIndex: 200,
        transition: "left .25s ease",
        boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,.5)" : "none",
      } : {
        position: "sticky", top: 0, height: "100vh", flexShrink: 0,
      }),
    }}>
      <div style={{ padding: "0 20px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo />
        {(mob || tablet) && (
          <button onClick={() => setSidebarOpen(false)} style={{
            background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 18,
          }}>✕</button>
        )}
      </div>

      {/* User info */}
      <div style={{ padding: "0 20px", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: "#fff", flexShrink: 0,
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, color: "#F8FAFC" }}>
              {user.name}
            </p>
            <span style={{
              fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 600, letterSpacing: ".08em",
              color: "#a78bfa", background: "rgba(167,139,250,.12)",
              border: "1px solid rgba(167,139,250,.25)", borderRadius: 4, padding: "1px 6px",
            }}>
              {levelLabel}
            </span>
          </div>
        </div>
        <div style={{ marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#475569" }}>LVL {level}</span>
          <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#475569" }}>{user.totalXP} / {level * 500} XP</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,.08)", borderRadius: 2 }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: "linear-gradient(90deg, #6366F1, #a78bfa)",
            width: `${Math.min((xpInLevel / 500) * 100, 100)}%`,
            transition: "width .4s ease",
          }} />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 12px" }}>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            onClick={() => { navigate(item.path); setSidebarOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 8, marginBottom: 2, cursor: "pointer",
              background: item.path === "/dashboard" ? "rgba(99,102,241,.12)" : "transparent",
              borderLeft: item.path === "/dashboard" ? "2px solid #6366F1" : "2px solid transparent",
              transition: "all .15s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,.04)"}
            onMouseOut={(e) => e.currentTarget.style.background = item.path === "/dashboard" ? "rgba(99,102,241,.12)" : "transparent"}
          >
            <span style={{ fontSize: 14, color: item.path === "/dashboard" ? "#6366F1" : "#475569" }}>{item.icon}</span>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 14, fontWeight: 500, color: item.path === "/dashboard" ? "#F8FAFC" : "#94A3B8" }}>
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Streak */}
      <div style={{
        margin: "0 12px 16px",
        background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.2)",
        borderRadius: 10, padding: "12px 14px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 16 }}>🔥</span>
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 13, color: "#FCD34D" }}>
            {user.currentStreak} DAY STREAK
          </span>
        </div>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8" }}>
          Keep it up, {user.name?.split(" ")[0]}!
        </p>
      </div>

      {/* Logout */}
      <div style={{ padding: "0 12px" }}>
        <button
          onClick={() => { logout(); navigate("/login"); }}
          style={{
            width: "100%", padding: "10px", borderRadius: 8,
            background: "transparent", border: "1px solid rgba(255,255,255,.08)",
            color: "#475569", fontFamily: "'DM Sans'", fontSize: 13, cursor: "pointer",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,.3)"; e.currentTarget.style.color = "#EF4444"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "#475569"; }}
        >
          Log Out
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F" }}>

      {/* Sidebar overlay backdrop on mobile */}
      {(mob || tablet) && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
            zIndex: 199, backdropFilter: "blur(2px)",
          }}
        />
      )}

      <Sidebar />

      {/* Main */}
      <main style={{
        flex: 1, overflowY: "auto",
        padding: mob ? "20px 16px" : tablet ? "28px 24px" : "36px 40px",
      }}>

        {/* Mobile top bar */}
        {(mob || tablet) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 8, width: 40, height: 40, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
              }}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ display: "block", width: 18, height: 2, background: "#F8FAFC", borderRadius: 2 }} />
              ))}
            </button>
            <Logo />
            <div style={{ width: 40 }} />
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: "'Space Grotesk'", fontWeight: 700,
            fontSize: mob ? 22 : 28, color: "#F8FAFC", marginBottom: 4,
          }}>
            STUDENT DASHBOARD
          </h1>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>
            Welcome back, {user.name?.split(" ")[0]}. Keep pushing forward.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)",
          gap: mob ? 10 : 16, marginBottom: 20,
        }}>
          {[
            { value: user.totalXP.toLocaleString(), label: "EXPERIENCE POINTS", color: "#F59E0B" },
            { value: "#—", label: "LEADERBOARD RANK", color: "#F8FAFC" },
            { value: user.completedLessons, label: "COMPLETED LESSONS", color: "#F8FAFC" },
            { value: `${user.currentStreak} 🔥`, label: "DAY STREAK", color: "#F59E0B" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 12, padding: mob ? "16px" : "20px 24px",
            }}>
              <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: mob ? 22 : 28, color: stat.color, marginBottom: 4 }}>
                {stat.value}
              </p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", color: "#475569" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Current track */}
        <div style={{
          background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 12, padding: mob ? "18px" : "24px 28px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
            <span style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", color: "#94A3B8" }}>
              CURRENT TRACK
            </span>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: mob ? 18 : 24, color: "#F8FAFC", marginBottom: 12 }}>
            HTML & CSS Foundation
          </h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 4 }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#94A3B8" }}>
              Lesson {user.completedLessons + 1} of 30
            </span>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#6366F1" }}>
              {Math.round((user.completedLessons / 30) * 100)}% Complete
            </span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,.08)", borderRadius: 3, marginBottom: 16 }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: "linear-gradient(90deg, #F59E0B, #F97316)",
              width: `${Math.min((user.completedLessons / 30) * 100, 100)}%`,
            }} />
          </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingRight: 4 }}>
  <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8" }}>
    🏁 {10 - (user.completedLessons % 10)} lessons until Project Checkpoint
  </span>
  <button
   onClick={() => navigate("/lessons?track=html-css")}
    style={{
      background: "#6366F1", color: "#fff", border: "none",
      borderRadius: 8, padding: "11px 24px", cursor: "pointer",
      fontFamily: "'Space Grotesk'", fontWeight: 600,
      fontSize: 13, letterSpacing: ".06em", whiteSpace: "nowrap",
      marginRight: 4,
    }}
  >
    CONTINUE →
  </button>
</div>
        </div>

        {/* Bottom — activity + leaderboard */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: 16,
        }}>

          {/* Recent activity */}
          <div style={{
            background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12, letterSpacing: ".06em", color: "#F8FAFC" }}>
                RECENT ACTIVITY
              </span>
              <a href="#" style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#6366F1", textDecoration: "none" }}>VIEW HISTORY</a>
            </div>
          {MOCK_ACTIVITY.length === 0 ? (
  <div style={{ textAlign: "center", padding: "24px 0" }}>
    <p style={{ fontSize: 28, marginBottom: 8 }}>📭</p>
    <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#475569" }}>
      No activity yet. Complete your first lesson to get started.
    </p>
  </div>
) : MOCK_ACTIVITY.map((a, i) => (
  <div key={i} style={{
    display: "flex", alignItems: "center", gap: 12, padding: "11px 0",
    borderBottom: i < MOCK_ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none",
  }}>
    <div style={{
      width: 34, height: 34, borderRadius: 8, flexShrink: 0,
      background: `${a.color}18`, border: `1px solid ${a.color}33`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, color: a.color,
    }}>
      {a.icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontFamily: "'DM Sans'", fontWeight: 500, fontSize: 13, color: "#F8FAFC", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {a.title}
      </p>
      <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#475569" }}>{a.date}</p>
    </div>
    <div style={{ textAlign: "right", flexShrink: 0 }}>
      <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12, color: "#10B981" }}>{a.xp}</p>
      <p style={{ fontFamily: "'DM Sans'", fontSize: 10, color: "#475569", letterSpacing: ".06em" }}>{a.tag}</p>
    </div>
  </div>
))}
          </div>

          {/* Leaderboard */}
          <div style={{
            background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 12, padding: "20px 22px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12, letterSpacing: ".06em", color: "#F8FAFC" }}>
                TOP DEVELOPERS
              </span>
              <a href="#" style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#6366F1", textDecoration: "none" }}>GLOBAL RANK</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 56px", gap: "0 8px", marginBottom: 8 }}>
              {["RANK", "DEVELOPER", "XP"].map((h) => (
                <span key={h} style={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", color: "#475569" }}>{h}</span>
              ))}
            </div>
            {leaderboard.length === 0 ? (
  <div style={{ textAlign: "center", padding: "20px 0" }}>
    <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#475569" }}>
      No data yet. Complete lessons to appear here.
    </p>
  </div>
) : leaderboard.map((entry, i) => (
  <div key={entry.id} style={{
    display: "grid", gridTemplateColumns: "36px 1fr 56px", gap: "0 8px",
    alignItems: "center", padding: "9px 0",
    borderBottom: i < leaderboard.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none",
    background: entry.isYou ? "rgba(99,102,241,.06)" : "transparent",
    borderRadius: entry.isYou ? 8 : 0,
  }}>
    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: entry.isYou ? "#6366F1" : "#475569", fontWeight: 600 }}>
      {String(entry.rank).padStart(2, "0")}
    </span>
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
        background: entry.isYou ? "linear-gradient(135deg,#6366F1,#a78bfa)" : "rgba(255,255,255,.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 10, color: "#fff",
      }}>
        {entry.name.charAt(0).toUpperCase()}
      </div>
      <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: entry.isYou ? "#F8FAFC" : "#94A3B8", fontWeight: entry.isYou ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {entry.isYou ? `${entry.name.split(" ")[0]} (You)` : entry.name}
      </span>
    </div>
    <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, color: entry.isYou ? "#6366F1" : "#F8FAFC", textAlign: "right" }}>
      {entry.totalXP.toLocaleString()}
    </span>
  </div>
))}
          </div>

        </div>
      </main>
    </div>
  );
}