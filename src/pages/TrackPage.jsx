import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useWidth } from "../hooks/useWidth";
import { api } from "../lib/api";
import Logo from "../components/ui/Logo";



export default function TrackPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const w = useWidth();
  const mob = w < 768;

  const [track, setTrack] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loadingTrack, setLoadingTrack] = useState(true);
  const [searchParams] = useSearchParams();
const trackSlug = searchParams.get("slug") || "html-css";

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetch = async () => {
      try {
       const data = await api.tracks.getLessons(trackSlug);
        setTrack(data.track);
        setLessons(data.lessons);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTrack(false);
      }
    };
    if (user) fetch();
  }, [user]);

  if (loading || loadingTrack) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6366F1", fontFamily: "'Space Grotesk'", fontSize: 16 }}>Loading track...</span>
    </div>
  );

  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);
  const currentLesson = lessons.find((l) => !l.completed) || lessons[lessons.length - 1];

  // Group lessons into rows of 3 for the path layout
  const rows = [];
  for (let i = 0; i < lessons.length; i += 3) {
    rows.push(lessons.slice(i, i + 3));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F" }}>

      {/* ── Top bar ── */}
     <div style={{
  background: "#0F0F1A", borderBottom: "1px solid rgba(255,255,255,.06)",
  padding: mob ? "0 16px" : "0 24px", height: mob ? 52 : 56,
  display: "flex", alignItems: "center", justifyContent: "space-between",
  position: "sticky", top: 0, zIndex: 100, gap: 8,
}}>
  <button
    onClick={() => navigate("/dashboard")}
    style={{
      background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 8, padding: mob ? "5px 10px" : "6px 12px", cursor: "pointer",
      fontFamily: "'DM Sans'", fontSize: mob ? 11 : 12, color: "#94A3B8",
      flexShrink: 0,
    }}
  >
    ← {mob ? "" : "Dashboard"}
  </button>
  {!mob && <Logo />}
  <div style={{ display: "flex", alignItems: "center", gap: mob ? 10 : 16, marginLeft: "auto" }}>
    <span style={{ fontFamily: "'DM Sans'", fontSize: mob ? 11 : 13, color: "#94A3B8" }}>
      {completedCount}/{lessons.length}
    </span>
    <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: mob ? 11 : 13, color: "#F59E0B" }}>
      ⭐ {user?.totalXP || 0} XP
    </span>
  </div>
</div>


      {/* ── Track header ── */}
      <div style={{
        background: "linear-gradient(180deg, rgba(99,102,241,.08) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        padding: mob ? "28px 20px" : "40px 48px",
        textAlign: "center",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{track?.icon || "📚"}</span>
          <span style={{
            fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600,
            letterSpacing: ".1em", color: "#6366F1", textTransform: "uppercase",
          }}>
            Track 1
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Space Grotesk'", fontWeight: 700,
          fontSize: mob ? 26 : 36, color: "#F8FAFC",
          letterSpacing: "-1px", marginBottom: 8,
        }}>
         {track?.name || "Loading..."}
        </h1>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
  {track?.description || ""}
</p>

        {/* Progress bar */}
        <div style={{ maxWidth: 400, margin: "0 auto 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569" }}>Progress</span>
            <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: "#6366F1" }}>{progressPercent}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,.08)", borderRadius: 4 }}>
            <div style={{
              height: "100%", borderRadius: 4,
              background: "linear-gradient(90deg, #6366F1, #a78bfa)",
              width: `${progressPercent}%`,
              transition: "width .4s ease",
            }} />
          </div>
        </div>

        <button
   onClick={() => navigate(`/lessons?track=${trackSlug}${currentLesson ? `&id=${currentLesson.id}` : ""}`)}
          style={{
            background: "#6366F1", color: "#fff", border: "none",
            borderRadius: 8, padding: "12px 28px", cursor: "pointer",
            fontFamily: "'Space Grotesk'", fontWeight: 600,
            fontSize: 13, letterSpacing: ".06em",
          }}
        >
          {completedCount === 0 ? "START TRACK →" : completedCount === lessons.length ? "REVIEW TRACK →" : "CONTINUE →"}
        </button>
      </div>

      {/* ── Journey map ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: mob ? "32px 16px" : "48px 24px" }}>

        {rows.map((row, rowIdx) => {
          const isProjectGate = (rowIdx + 1) * 3 === 10 || (rowIdx + 1) * 3 === lessons.length;
          const reverseRow = rowIdx % 2 === 1;

          return (
            <div key={rowIdx}>
              {/* Lesson row */}
              <div style={{
                display: "flex",
                flexDirection: mob ? "column" : reverseRow ? "row-reverse" : "row",
                justifyContent: "center",
                gap: mob ? 12 : 24,
                marginBottom: mob ? 12 : 16,
              }}>
                {row.map((lesson, idx) => {
                  const isCompleted = lesson.completed;
                  const isCurrent = lesson.id === currentLesson?.id;
                  const lessonNum = rowIdx * 3 + idx + 1;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => navigate(`/lessons?track=${trackSlug}&id=${lesson.id}`)}
                      style={{
                        flex: mob ? "none" : 1,
                        width: mob ? "100%" : "auto",
                        background: isCompleted
                          ? "rgba(16,185,129,.08)"
                          : isCurrent
                          ? "rgba(99,102,241,.12)"
                          : "rgba(255,255,255,.03)",
                        border: `1px solid ${isCompleted ? "#10B981" : isCurrent ? "#6366F1" : "rgba(255,255,255,.08)"}`,
                        borderRadius: 14,
                        padding: "18px 16px",
                        cursor: "pointer",
                        transition: "transform .2s, box-shadow .2s",
                        position: "relative",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.4)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* Status icon */}
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", marginBottom: 10,
                        background: isCompleted ? "#10B981" : isCurrent ? "#6366F1" : "rgba(255,255,255,.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14,
                      }}>
                        {isCompleted ? "✓" : isCurrent ? "▶" : lessonNum}
                      </div>

                      <p style={{
                        fontFamily: "'Space Grotesk'", fontWeight: 600,
                        fontSize: 13, color: isCompleted ? "#10B981" : isCurrent ? "#F8FAFC" : "#94A3B8",
                        marginBottom: 4, lineHeight: 1.3,
                      }}>
                        {lesson.title}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{
                          fontFamily: "'DM Sans'", fontSize: 11,
                          color: isCompleted ? "#10B981" : "#475569",
                        }}>
                          {isCompleted ? "Completed" : isCurrent ? "In Progress" : `Lesson ${lessonNum}`}
                        </span>
                        <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#F59E0B" }}>
                          ⭐ {lesson.xpValue} XP
                        </span>
                      </div>

                      {isCurrent && (
                        <div style={{
                          position: "absolute", top: -8, right: 12,
                          background: "#6366F1", borderRadius: 4,
                          padding: "2px 8px",
                          fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 600,
                          color: "#fff", letterSpacing: ".06em",
                        }}>
                          CURRENT
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Connector line between rows */}
              {rowIdx < rows.length - 1 && (
                <div style={{
                  display: "flex", justifyContent: mob ? "flex-start" : reverseRow ? "flex-end" : "flex-start",
                  paddingLeft: mob ? 24 : reverseRow ? 0 : 60,
                  paddingRight: mob ? 0 : reverseRow ? 60 : 0,
                  marginBottom: mob ? 12 : 16,
                }}>
                  <div style={{
                    width: 2, height: mob ? 24 : 32,
                    background: "linear-gradient(180deg, rgba(99,102,241,.4), rgba(99,102,241,.1))",
                    borderRadius: 1,
                  }} />
                </div>
              )}

              {/* Project gate after every 3 lessons that land on lesson 3, 6, 9 */}
              {(rowIdx + 1) % 3 === 0 && rowIdx < rows.length - 1 && (
                <div style={{
                  background: "rgba(245,158,11,.06)",
                  border: "1px solid rgba(245,158,11,.25)",
                  borderRadius: 12, padding: "16px 20px",
                  marginBottom: mob ? 12 : 16,
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>🏁</span>
                    <div>
                      <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, color: "#FCD34D" }}>
                        Project Checkpoint
                      </p>
                      <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8" }}>
                        Build and submit a project to unlock the next lessons
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/submit")}
                    style={{
                      background: "rgba(245,158,11,.15)",
                      border: "1px solid rgba(245,158,11,.3)",
                      borderRadius: 8, padding: "8px 16px", cursor: "pointer",
                      fontFamily: "'Space Grotesk'", fontWeight: 600,
                      fontSize: 12, color: "#FCD34D",
                    }}
                  >
                    SUBMIT PROJECT →
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Final certificate */}
        <div style={{
          background: "rgba(99,102,241,.06)",
          border: "1px solid rgba(99,102,241,.2)",
          borderRadius: 14, padding: "24px 20px",
          textAlign: "center", marginTop: 8,
        }}>
          <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>🎓</span>
         <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: "#a78bfa", marginBottom: 4 }}>
  {track?.name} Certificate
</p>
<p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#475569" }}>
  Complete all {lessons.length} lessons and submit your project to earn your certificate
</p>
        </div>

      </div>
    </div>
  );
}