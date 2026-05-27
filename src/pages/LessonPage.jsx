import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWidth } from "../hooks/useWidth";
import Editor from "@monaco-editor/react";
import { api } from "../lib/api";

export default function LessonPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("id");
  const trackSlug = searchParams.get("track") || "html-css";

  const w = useWidth();
  const mob = w < 768;

  const [lesson, setLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [tab, setTab] = useState("concept");
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        if (!lessonId) {
          const data = await api.tracks.getLessons(trackSlug);
          const firstIncomplete = data.lessons.find((l) => !l.completed);
          const target = firstIncomplete || data.lessons[0];
          setLesson(target);
          setCode(target.content.exercise || "");
          setAiMessages([{ role: "ai", text: `Hi! I'm your AI tutor for "${target.title}". Ask me anything about this lesson.` }]);
        } else {
          const data = await api.tracks.getLesson(trackSlug, lessonId);
          setLesson(data);
          setCode(data.content.exercise || "");
          setAiMessages([{ role: "ai", text: `Hi! I'm your AI tutor for "${data.title}". Ask me anything about this lesson.` }]);
        }
      } catch (err) {
        console.error("Failed to load lesson:", err);
      } finally {
        setLoadingLesson(false);
      }
    };
    fetchLesson();
  }, [lessonId, trackSlug]);

  const runCode = () => { setPreview(code); setShowPreview(true); };

  const handleAnswer = (i) => {
    if (selected !== null || !lesson) return;
    setSelected(i);
    const quiz = lesson.content.quiz;
    if (i === quiz[quizStep].answer) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (!lesson) return;
    const quiz = lesson.content.quiz;
    if (quizStep < quiz.length - 1) {
      setQuizStep((s) => s + 1);
      setSelected(null);
    } else {
      setQuizDone(true);
      completeLesson();
    }
  };

  const completeLesson = async () => {
    if (completing || !lesson) return;
    setCompleting(true);
    try {
      await api.tracks.completeLesson(trackSlug, lesson.id);
    } catch (err) {
      console.error("Failed to complete lesson:", err);
    } finally {
      setCompleting(false);
    }
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim() || aiLoading || !lesson) return;
    const msg = aiInput.trim();
    setAiInput("");
    setAiMessages((m) => [...m, { role: "user", text: msg }]);
    setAiLoading(true);
    try {
      const token = localStorage.getItem("codepath_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/ai/tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: msg, lessonTitle: lesson.title, lessonContent: lesson.content.concept }),
      });
      const data = await res.json();
      setAiMessages((m) => [...m, { role: "ai", text: data.answer || "Sorry, I couldn't process that." }]);
    } catch {
      setAiMessages((m) => [...m, { role: "ai", text: "Sorry, I'm having trouble connecting. Try again." }]);
    } finally {
      setAiLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  if (loadingLesson) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#6366F1", fontFamily: "'Space Grotesk'", fontSize: 16 }}>Loading lesson...</span>
    </div>
  );

  if (!lesson) return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#EF4444", fontFamily: "'Space Grotesk'", fontSize: 16 }}>Lesson not found.</span>
    </div>
  );

  const quiz = lesson.content.quiz || [];
  const TABS = ["concept", "code", "quiz"];

  const ConceptContent = ({ isMob }) => (
    <div style={{ padding: isMob ? "20px 16px" : "20px" }}>
      <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: "#F8FAFC", marginBottom: isMob ? 14 : 16 }}>
        {lesson.title}
      </h2>
      {lesson.content.concept.split("\n\n").map((p, i) => (
        <div key={i} style={{ marginBottom: isMob ? 14 : 16 }}>
          {p.includes("\n- ") || p.startsWith("- ") ? (
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {p.split("\n").filter(l => l.trim()).map((line, j) => (
                <li key={j} style={{ fontFamily: "'DM Sans'", fontSize: 14, lineHeight: 1.75, color: "#94A3B8", marginBottom: 6 }}>
                  {line.replace(/^- /, "")}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, lineHeight: 1.75, color: "#94A3B8", margin: 0 }}>
              {p}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", display: "flex", flexDirection: "column" }}>

      {/* ── Top bar ── */}
      <div style={{
        height: 56, background: "#0F0F1A",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        display: "flex", alignItems: "center",
        padding: "0 20px", gap: 16, flexShrink: 0,
      }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 8, padding: "6px 12px", cursor: "pointer",
            fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ← Back
        </button>
       <div style={{ flex: 1, minWidth: 0 }}>
  {!mob && (
    <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#475569", marginBottom: 1 }}>
      HTML & CSS Foundation
    </p>
  )}
  <p style={{
    fontFamily: "'Space Grotesk'", fontWeight: 600,
    fontSize: mob ? 12 : 14, color: "#F8FAFC",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  }}>
    {mob ? lesson.title : `Lesson ${lesson.order}: ${lesson.title}`}
  </p>
</div>
        <div style={{ display: "flex", alignItems: "center", gap: mob ? 6 : 8, flexShrink: 0 }}>
  {!mob && (
    <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#F59E0B" }}>⭐ {lesson.xpValue} XP</span>
  )}
  <button
    onClick={() => setAiOpen((o) => !o)}
    style={{
      background: aiOpen ? "#6366F1" : "rgba(99,102,241,.15)",
      border: "1px solid rgba(99,102,241,.3)",
      borderRadius: 8, padding: mob ? "6px 10px" : "6px 14px", cursor: "pointer",
      fontFamily: "'Space Grotesk'", fontWeight: 600,
      fontSize: mob ? 11 : 12, color: aiOpen ? "#fff" : "#a78bfa",
      display: "flex", alignItems: "center", gap: 6,
    }}
  >
    🤖 {mob ? "AI" : "AI Tutor"}
  </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* ── Left panel ── */}
        <div style={{
          width: mob ? "100%" : aiOpen ? "calc(100% - 340px)" : "100%",
          display: "flex", flexDirection: mob ? "column" : "row",
          transition: "width .25s ease", overflow: "hidden",
        }}>

          {/* Tab nav + content panel */}
          <div style={{
            width: mob ? "100%" : 320, flexShrink: 0,
            background: "#0F0F1A",
            borderRight: mob ? "none" : "1px solid rgba(255,255,255,.06)",
            borderBottom: mob ? "1px solid rgba(255,255,255,.06)" : "none",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0 }}>
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, padding: "14px 0",
                    background: "transparent", border: "none",
                    borderBottom: tab === t ? "2px solid #6366F1" : "2px solid transparent",
                    fontFamily: "'Space Grotesk'", fontWeight: 600,
                    fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase",
                    color: tab === t ? "#F8FAFC" : "#475569", cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {t === "concept" ? "📖 Concept" : t === "code" ? "💻 Code" : "❓ Quiz"}
                </button>
              ))}
            </div>

            {/* Tab content — desktop */}
            {!mob && (
              <div style={{ flex: 1, overflowY: "auto" }}>
                {tab === "concept" && <ConceptContent isMob={false} />}
                {tab === "quiz" && (
                  <div style={{ padding: "20px" }}>
                    <QuizPanel quiz={quiz} quizStep={quizStep} selected={selected} quizDone={quizDone} score={score} onAnswer={handleAnswer} onNext={nextQuestion} navigate={navigate} />
                  </div>
                )}
                {tab === "code" && (
                  <div style={{ padding: "20px" }}>
                    <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>
                      Write your HTML in the editor. Click <strong style={{ color: "#F8FAFC" }}>RUN</strong> to see the output.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab content — mobile */}
            {mob && tab === "concept" && <ConceptContent isMob={true} />}
            {mob && tab === "quiz" && (
              <div style={{ padding: "20px 16px" }}>
                <QuizPanel quiz={quiz} quizStep={quizStep} selected={selected} quizDone={quizDone} score={score} onAnswer={handleAnswer} onNext={nextQuestion} navigate={navigate} />
              </div>
            )}
          </div>

          {/* Code editor + preview */}
          {(!mob || tab === "code") && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{
                height: 44, background: "#161B22",
                borderBottom: "1px solid rgba(255,255,255,.06)",
                display: "flex", alignItems: "center",
                padding: "0 16px", gap: 12, flexShrink: 0,
              }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                    <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#484F58", flex: 1 }}>
                  index.html
                </span>
                <button onClick={runCode} style={{
                  background: "#10B981", color: "#fff", border: "none",
                  borderRadius: 6, padding: "5px 14px", cursor: "pointer",
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 11,
                }}>
                  ▶ RUN
                </button>
                <button onClick={() => setShowPreview((p) => !p)} style={{
                  background: "rgba(255,255,255,.06)", color: "#94A3B8",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 6, padding: "5px 12px", cursor: "pointer",
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 11,
                }}>
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>

              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <div style={{ flex: showPreview ? "0 0 50%" : "1", minWidth: 0, overflow: "hidden" }}>
                  <Editor
                    height="100%"
                    defaultLanguage="html"
                    theme="vs-dark"
                    value={code}
                    onChange={(v) => setCode(v || "")}
                    options={{
                      fontSize: 13, minimap: { enabled: false },
                      lineNumbers: "on", scrollBeyondLastLine: false,
                      wordWrap: "on", padding: { top: 12 },
                    }}
                  />
                </div>
                {showPreview && (
                  <div style={{ flex: "0 0 50%", borderLeft: "1px solid rgba(255,255,255,.06)", background: "#fff" }}>
                    <iframe srcDoc={preview} title="preview" style={{ width: "100%", height: "100%", border: "none" }} sandbox="allow-scripts" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── AI Tutor panel ── */}
        {aiOpen && (
          <div style={{
            width: mob ? "100%" : 340, flexShrink: 0,
            background: "#0F0F1A",
            borderLeft: "1px solid rgba(255,255,255,.06)",
            display: "flex", flexDirection: "column",
            position: mob ? "fixed" : "relative",
            inset: mob ? 0 : "auto",
            zIndex: mob ? 300 : "auto",
          }}>
            <div style={{
              padding: "14px 16px",
              borderBottom: "1px solid rgba(255,255,255,.06)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <div>
                  <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, color: "#F8FAFC" }}>AI Tutor</p>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#10B981" }}>● Online</p>
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
              {aiMessages.map((m, i) => (
                <div key={i} style={{ marginBottom: 12, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "85%", padding: "10px 14px",
                    borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                    background: m.role === "user" ? "#6366F1" : "rgba(255,255,255,.06)",
                    border: m.role === "ai" ? "1px solid rgba(255,255,255,.08)" : "none",
                    fontFamily: "'DM Sans'", fontSize: 13, lineHeight: 1.6, color: "#F8FAFC",
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display: "flex", gap: 4, padding: "8px 0" }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", animation: `bounce 1s ease ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", gap: 8, flexShrink: 0 }}>
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAiMessage()}
                placeholder="Ask anything about this lesson..."
                style={{
                  flex: 1, background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 8, padding: "10px 12px",
                  fontFamily: "'DM Sans'", fontSize: 13, color: "#F8FAFC", outline: "none",
                }}
              />
              <button onClick={sendAiMessage} disabled={aiLoading} style={{
                background: "#6366F1", border: "none", borderRadius: 8,
                width: 40, cursor: "pointer", color: "#fff", fontSize: 16, flexShrink: 0,
              }}>↑</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

function QuizPanel({ quiz, quizStep, selected, quizDone, score, onAnswer, onNext, navigate }) {
  if (quizDone) return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <p style={{ fontSize: 48, marginBottom: 12 }}>{score === quiz.length ? "🎉" : score >= quiz.length / 2 ? "👍" : "📚"}</p>
      <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: "#F8FAFC", marginBottom: 8 }}>
        {score}/{quiz.length} Correct
      </h3>
      <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
        {score === quiz.length ? "Perfect score! You nailed it." : score >= quiz.length / 2 ? "Good job! Keep going." : "Review the concept and try again."}
      </p>
      <button onClick={() => navigate("/dashboard")} style={{
        background: "#6366F1", color: "#fff", border: "none",
        borderRadius: 8, padding: "12px 24px", cursor: "pointer",
        fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
      }}>
        Back to Dashboard →
      </button>
    </div>
  );

  if (!quiz.length) return (
    <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#475569" }}>No quiz for this lesson.</p>
  );

  const q = quiz[quizStep];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569" }}>Question {quizStep + 1} of {quiz.length}</span>
        <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#6366F1" }}>{score} correct</span>
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15, color: "#F8FAFC", marginBottom: 16, lineHeight: 1.4 }}>
        {q.q}
      </h3>
      {q.options.map((opt, i) => {
        let bg = "rgba(255,255,255,.04)";
        let border = "rgba(255,255,255,.1)";
        let color = "#94A3B8";
        if (selected !== null) {
          if (i === q.answer) { bg = "rgba(16,185,129,.12)"; border = "#10B981"; color = "#10B981"; }
          else if (i === selected) { bg = "rgba(239,68,68,.12)"; border = "#EF4444"; color = "#EF4444"; }
        }
        return (
          <div key={i} onClick={() => onAnswer(i)} style={{
            padding: "12px 14px", borderRadius: 8, marginBottom: 8,
            background: bg, border: `1px solid ${border}`,
            cursor: selected === null ? "pointer" : "default",
            fontFamily: "'DM Sans'", fontSize: 13, color, transition: "all .15s",
          }}>
            {opt}
          </div>
        );
      })}
      {selected !== null && (
        <button onClick={onNext} style={{
          marginTop: 8, width: "100%", padding: "12px",
          background: "#6366F1", color: "#fff", border: "none",
          borderRadius: 8, cursor: "pointer",
          fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
        }}>
          {quizStep < quiz.length - 1 ? "Next Question →" : "See Results →"}
        </button>
      )}
    </div>
  );
}