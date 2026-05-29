import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useWidth } from "../hooks/useWidth";
import Logo from "../components/ui/Logo";

const ALL_TRACKS = [
  {
    name: "HTML & CSS Foundation",
    slug: "html-css",
    icon: "🌐",
    color: "#E34F26",
    difficulty: "Beginner",
    lessons: 10,
    desc: "Master the building blocks of the web. Learn semantic markup and modern styling.",
  },
  {
    name: "Python Fundamentals",
    slug: "python-fundamentals",
    icon: "🐍",
    color: "#3776AB",
    difficulty: "Beginner",
    lessons: 10,
    desc: "Learn Python from scratch. Variables, loops, functions, and real Ghanaian projects.",
  },
  {
    name: "JavaScript Mastery",
    slug: "javascript",
    icon: "⚡",
    color: "#F7DF1E",
    difficulty: "Intermediate",
    lessons: 40,
    desc: "DOM manipulation, async programming, and modern ES6+ syntax.",
    comingSoon: true,
  },
  {
    name: "Full Stack Engineering",
    slug: "fullstack",
    icon: "🗂️",
    color: "#10B981",
    difficulty: "Advanced",
    lessons: 40,
    desc: "Build complete web applications with React and Python Flask.",
    comingSoon: true,
  },
];

const DIFF_COLORS = {
  Beginner: "#10B981",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

export default function TracksPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const w = useWidth();
  const mob = w < 768;

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6366F1", fontFamily: "'Space Grotesk'", fontSize: 16 }}>Loading...</span>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F" }}>

      {/* Top bar */}
      <div style={{
        background: "#0F0F1A", borderBottom: "1px solid rgba(255,255,255,.06)",
        padding: `0 ${mob ? 16 : 24}px`, height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 8, padding: "6px 12px", cursor: "pointer",
              fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8",
            }}
          >
            ← Dashboard
          </button>
          {!mob && <Logo />}
        </div>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, color: "#F59E0B" }}>
          ⭐ {user?.totalXP || 0} XP
        </span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: mob ? "28px 16px" : "48px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", color: "#6366F1", textTransform: "uppercase", marginBottom: 8 }}>
            // PATHWAYS
          </p>
          <h1 style={{
            fontFamily: "'Space Grotesk'", fontWeight: 700,
            fontSize: mob ? 24 : 32, color: "#F8FAFC",
            letterSpacing: "-1px", marginBottom: 8,
          }}>
            Choose Your Track
          </h1>
          <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>
            All tracks are available simultaneously. Study what you need, when you need it.
          </p>
        </div>

        {/* Tracks grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: 16,
        }}>
          {ALL_TRACKS.map((track) => (
            <div
              key={track.slug}
              onClick={() => !track.comingSoon && navigate(`/track?slug=${track.slug}`)}
              style={{
                background: "#0F0F1A",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 14, overflow: "hidden",
                cursor: track.comingSoon ? "default" : "pointer",
                opacity: track.comingSoon ? 0.6 : 1,
                transition: "transform .2s, box-shadow .2s",
                position: "relative",
              }}
              onMouseOver={(e) => {
                if (!track.comingSoon) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,.5)";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Colour bar */}
              <div style={{ height: 4, background: track.color }} />

              <div style={{ padding: "20px 20px 24px" }}>
                {/* Coming soon badge */}
                {track.comingSoon && (
                  <div style={{
                    position: "absolute", top: 16, right: 16,
                    background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 4, padding: "2px 8px",
                    fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 600,
                    color: "#475569", letterSpacing: ".06em",
                  }}>
                    COMING SOON
                  </div>
                )}

                {/* Icon + difficulty */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${track.color}22`, border: `1px solid ${track.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24,
                  }}>
                    {track.icon}
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600,
                    letterSpacing: ".08em", textTransform: "uppercase",
                    color: DIFF_COLORS[track.difficulty],
                    background: `${DIFF_COLORS[track.difficulty]}18`,
                    border: `1px solid ${DIFF_COLORS[track.difficulty]}33`,
                    borderRadius: 4, padding: "3px 8px",
                  }}>
                    {track.difficulty}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Space Grotesk'", fontWeight: 700,
                  fontSize: 18, color: "#F8FAFC", marginBottom: 8,
                }}>
                  {track.name}
                </h3>

                <p style={{
                  fontFamily: "'DM Sans'", fontSize: 13,
                  lineHeight: 1.6, color: "#94A3B8", marginBottom: 18,
                }}>
                  {track.desc}
                </p>

                {/* Meta */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#94A3B8", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ color: "#6366F1" }}>📚</span> {track.lessons} lessons
                    </span>
                  </div>
                  {!track.comingSoon && (
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/track?slug=${track.slug}`); }}
                      style={{
                        background: "#6366F1", color: "#fff", border: "none",
                        borderRadius: 8, padding: "8px 16px", cursor: "pointer",
                        fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12,
                      }}
                    >
                      Start Track →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}