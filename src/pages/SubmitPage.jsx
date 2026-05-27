import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useWidth } from "../hooks/useWidth";
import Logo from "../components/ui/Logo";

export default function SubmitPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const w = useWidth();
  const mob = w < 768;

  const [githubUrl, setGithubUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!githubUrl.trim()) {
      setError("Please enter your GitHub repository URL");
      return;
    }
    if (!githubUrl.includes("github.com")) {
      setError("Please enter a valid GitHub URL");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("codepath_token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/projects/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            githubUrl,
            trackId: "html-css",
            projectTitle: "Developer Profile Page",
            requirements: "A complete HTML & CSS developer profile page with: heading, bio paragraph, skills list, links, contact form, and consistent styling.",
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setReview(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
            onClick={() => navigate("/track")}
            style={{
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 8, padding: "6px 12px", cursor: "pointer",
              fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8",
            }}
          >
            ← Back
          </button>
          {!mob && <Logo />}
        </div>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, color: "#F59E0B" }}>
          ⭐ {user?.totalXP || 0} XP
        </span>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: mob ? "28px 16px" : "48px 24px" }}>

        {!submitted ? (
          <>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>🏁</span>
                <span style={{
                  fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600,
                  letterSpacing: ".1em", color: "#F59E0B", textTransform: "uppercase",
                }}>
                  Project Checkpoint
                </span>
              </div>
              <h1 style={{
                fontFamily: "'Space Grotesk'", fontWeight: 700,
                fontSize: mob ? 24 : 32, color: "#F8FAFC",
                letterSpacing: "-1px", marginBottom: 8,
              }}>
                Developer Profile Page
              </h1>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", lineHeight: 1.7 }}>
                Build a complete developer profile page using everything you've learned in the HTML & CSS track. Submit your GitHub repository link for AI review.
              </p>
            </div>

            {/* Requirements */}
            <div style={{
              background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 12, padding: "20px 24px", marginBottom: 24,
            }}>
              <p style={{
                fontFamily: "'Space Grotesk'", fontWeight: 600,
                fontSize: 12, letterSpacing: ".08em", color: "#F8FAFC",
                textTransform: "uppercase", marginBottom: 16,
              }}>
                Requirements
              </p>
              {[
                { icon: "📝", text: "Your name and job title as the main heading" },
                { icon: "👤", text: "A short bio paragraph about yourself" },
                { icon: "💡", text: "A skills section using an unordered list" },
                { icon: "🔗", text: "Links to your GitHub and LinkedIn profiles" },
                { icon: "📬", text: "A working contact form with name, email, and message fields" },
                { icon: "🎨", text: "Consistent CSS styling throughout the page" },
                { icon: "📱", text: "Clean layout using Flexbox" },
              ].map((req, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "10px 0",
                  borderBottom: i < 6 ? "1px solid rgba(255,255,255,.04)" : "none",
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{req.icon}</span>
                  <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", lineHeight: 1.5 }}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div style={{
              background: "rgba(99,102,241,.06)",
              border: "1px solid rgba(99,102,241,.2)",
              borderRadius: 12, padding: "16px 20px", marginBottom: 24,
            }}>
              <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12, color: "#a78bfa", marginBottom: 8, letterSpacing: ".06em" }}>
                💡 TIPS
              </p>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {[
                  "Push your project to a public GitHub repository",
                  "Make sure your HTML file is named index.html",
                  "Test your page in the browser before submitting",
                  "Your AI reviewer will check for all requirements above",
                ].map((tip, i) => (
                  <li key={i} style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#94A3B8", marginBottom: 6, lineHeight: 1.5 }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Submission form */}
            <div style={{
              background: "#0F0F1A", border: "1px solid rgba(255,255,255,.07)",
              borderRadius: 12, padding: "24px",
            }}>
              <p style={{
                fontFamily: "'Space Grotesk'", fontWeight: 600,
                fontSize: 12, letterSpacing: ".08em", color: "#F8FAFC",
                textTransform: "uppercase", marginBottom: 16,
              }}>
                Submit Your Project
              </p>

              <label style={{
                fontFamily: "'Space Grotesk'", fontWeight: 600,
                fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase",
                color: "#94A3B8", display: "block", marginBottom: 8,
              }}>
                GitHub Repository URL
              </label>
              <input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourusername/your-project"
                style={{
                  width: "100%", background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 8, padding: "12px 14px",
                  fontFamily: "'DM Sans'", fontSize: 14, color: "#F8FAFC",
                  outline: "none", marginBottom: 8,
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#6366F1"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,.1)"}
              />
              <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569", marginBottom: 20 }}>
                Make sure your repository is public so the AI reviewer can access it.
              </p>

              {error && (
                <div style={{
                  background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                  fontFamily: "'DM Sans'", fontSize: 13, color: "#EF4444",
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  width: "100%", padding: "14px",
                  background: submitting ? "#4B4E99" : "#6366F1",
                  color: "#fff", border: "none", borderRadius: 8,
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "'Space Grotesk'", fontWeight: 600,
                  fontSize: 14, letterSpacing: ".08em",
                }}
              >
                {submitting ? "🤖 AI is reviewing your project..." : "SUBMIT FOR REVIEW →"}
              </button>
            </div>
          </>
        ) : (
          /* Review results */
          <div>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p style={{ fontSize: 56, marginBottom: 12 }}>
                {review?.passed ? "🎉" : "📝"}
              </p>
              <h1 style={{
                fontFamily: "'Space Grotesk'", fontWeight: 700,
                fontSize: mob ? 24 : 30, color: "#F8FAFC",
                marginBottom: 8, letterSpacing: "-1px",
              }}>
                {review?.passed ? "Project Passed!" : "Almost There!"}
              </h1>
              <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>
                {review?.summary}
              </p>
            </div>

            {/* Strengths */}
            {review?.strengths?.length > 0 && (
              <div style={{
                background: "rgba(16,185,129,.06)",
                border: "1px solid rgba(16,185,129,.2)",
                borderRadius: 12, padding: "20px 24px", marginBottom: 16,
              }}>
                <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12, color: "#10B981", letterSpacing: ".08em", marginBottom: 12 }}>
                  ✓ WHAT WORKS
                </p>
                {review.strengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: "#10B981", flexShrink: 0 }}>✓</span>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Improvements */}
            {review?.improvements?.length > 0 && (
              <div style={{
                background: "rgba(245,158,11,.06)",
                border: "1px solid rgba(245,158,11,.2)",
                borderRadius: 12, padding: "20px 24px", marginBottom: 16,
              }}>
                <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12, color: "#F59E0B", letterSpacing: ".08em", marginBottom: 12 }}>
                  ⚡ IMPROVEMENTS NEEDED
                </p>
                {review.improvements.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: "#F59E0B", flexShrink: 0 }}>→</span>
                    <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Encouragement */}
            {review?.encouragement && (
              <div style={{
                background: "rgba(99,102,241,.06)",
                border: "1px solid rgba(99,102,241,.2)",
                borderRadius: 12, padding: "16px 20px", marginBottom: 24,
                fontFamily: "'DM Sans'", fontSize: 14, color: "#a78bfa", lineHeight: 1.6,
              }}>
                💬 {review.encouragement}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {review?.passed ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  style={{
                    flex: 1, padding: "13px",
                    background: "#6366F1", color: "#fff", border: "none",
                    borderRadius: 8, cursor: "pointer",
                    fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
                  }}
                >
                  Back to Dashboard →
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setSubmitted(false); setReview(null); setGithubUrl(""); }}
                    style={{
                      flex: 1, padding: "13px",
                      background: "#6366F1", color: "#fff", border: "none",
                      borderRadius: 8, cursor: "pointer",
                      fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
                    }}
                  >
                    Revise & Resubmit →
                  </button>
                  <button
                    onClick={() => navigate("/track")}
                    style={{
                      flex: 1, padding: "13px",
                      background: "transparent", color: "#94A3B8",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: 8, cursor: "pointer",
                      fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
                    }}
                  >
                    Back to Track
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}