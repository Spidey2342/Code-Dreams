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
  const [allLessons, setAllLessons] = useState([]);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [tab, setTab] = useState("concept"); // concept | quiz
  const [quizStep, setQuizStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(0);
  const [output, setOutput] = useState("");
const [running, setRunning] = useState(false);
const [outputError, setOutputError] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await api.tracks.getLessons(trackSlug);
        setAllLessons(data.lessons);
        let target;
        if (lessonId) {
          target = data.lessons.find((l) => l.id === lessonId);
        } else {
          target = data.lessons.find((l) => !l.completed) || data.lessons[0];
        }
        if (target) {
          setLesson(target);
          setCode(target.content.exercise || "");
          setCompleted(target.completed);
          setAiMessages([{ role: "ai", text: `Hi! I'm your AI tutor for "${target.title}". Ask me anything about this lesson.` }]);
        }
      } catch (err) {
        console.error("Failed to load lesson:", err);
      } finally {
        setLoadingLesson(false);
      }
    };
    fetchLesson();
  }, [lessonId, trackSlug]);

 const isPython = lesson?.content?.language === "python" || lesson?.order > 10;

const runCode = async () => {
  if (isPython) {
    setRunning(true);
    setOutput("");
    setOutputError(false);
    try {
      const result = await api.code.run(code, "python");
      const out = result.output || result.stdout || "";
      const err = result.stderr || "";
      
      if (err && !out) {
        setOutput(err);
        setOutputError(true);
      } else if (out) {
        setOutput(out);
        setOutputError(false);
      } else if (err && out) {
        setOutput(out + "\n" + err);
        setOutputError(false);
      } else {
        setOutput("Program ran with no output.");
        setOutputError(false);
      }
    } catch (err) {
      setOutput("Failed to run code. Check your connection.");
      setOutputError(true);
    } finally {
      setRunning(false);
      setShowPreview(true);
    }
  } else {
    setPreview(code);
    setShowPreview(true);
  }
};

  const currentIndex = allLessons.findIndex((l) => l.id === lesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const goToLesson = (l) => {
    navigate(`/lessons?track=${trackSlug}&id=${l.id}`);
    setLesson(l);
    setCode(l.content.exercise || "");
    setCompleted(l.completed);
    setTab("concept");
    setQuizStep(0);
    setSelected(null);
    setQuizDone(false);
    setScore(0);
    setPreview("");
  };

  const completeLesson = async () => {
    if (completing || completed || !lesson) return;
    setCompleting(true);
    try {
      await api.tracks.completeLesson(trackSlug, lesson.id);
      setCompleted(true);
      setSessionXP((x) => x + lesson.xpValue);
      setTimeout(() => {
        if (nextLesson) goToLesson(nextLesson);
        else navigate("/track");
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  const handleAnswer = (i) => {
    if (selected !== null || !lesson) return;
    setSelected(i);
    const quiz = lesson.content.quiz;
    if (i === quiz[quizStep].answer) {
      setScore((s) => s + 1);
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }
  };

  const nextQuestion = () => {
    if (!lesson) return;
    const quiz = lesson.content.quiz;
    if (quizStep < quiz.length - 1) {
      setQuizStep((s) => s + 1);
      setSelected(null);
    } else {
      setQuizDone(true);
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
  const keyConcepts = lesson.content.keyConcepts || [];
  const exerciseDesc = lesson.content.exerciseDescription || "";
  const diagramLabel = lesson.content.diagramLabel || "";

  return (
    <div style={{ height: "100vh", background: "#0A0A0F", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Top bar ── */}
<div style={{
  height: 48, background: "#0F0F1A",
  borderBottom: "1px solid rgba(255,255,255,.06)",
  display: "flex", alignItems: "center",
  padding: "0 16px", gap: 12, flexShrink: 0,
}}>
  {/* Back button */}
  <button
    onClick={() => navigate("/dashboard")}
    style={{
      background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 8, padding: "5px 10px", cursor: "pointer",
      fontFamily: "'DM Sans'", fontSize: 11, color: "#94A3B8",
      display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
    }}
  >
    ← {!mob && "Dashboard"}
  </button>

  {/* Left — track name */}
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: "#6366F1",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'JetBrains Mono'", fontSize: 10, color: "#fff",
          }}>
            &lt;/&gt;
          </div>
          {!mob && (
            <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569", letterSpacing: ".04em", textTransform: "uppercase" }}>
              HTML & CSS Foundation
            </span>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* Hearts */}
<div style={{
  display: "flex", alignItems: "center", gap: 4,
  background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 20, padding: "4px 10px",
}}>
  {[0, 1, 2].map((i) => (
    <span key={i} style={{ fontSize: 12, opacity: i < hearts ? 1 : 0.2 }}>❤️</span>
  ))}
  {!mob && (
    <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 11, color: "#94A3B8", marginLeft: 4 }}>
      {hearts} LIVES LEFT
    </span>
  )}
</div>

{/* Session XP */}
<div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: mob ? 11 : 12, color: "#10B981" }}>
  <span>⭐</span>
  <span>+{sessionXP}{!mob && " XP"}</span>
</div>

        {/* Avatar */}
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "linear-gradient(135deg, #6366F1, #a78bfa)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 11, color: "#fff",
        }}>
          M
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Left panel ── */}
      {/* ── Left panel ── */}
{(!mob || tab === "concept" || tab === "quiz") && (
  <div style={{
    width: mob ? "100%" : 320,
    minWidth: mob ? "auto" : 320,
    flexShrink: 0,
    background: "#0F0F1A",
    borderRight: mob ? "none" : "1px solid rgba(255,255,255,.06)",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
  }}>
            {/* Tab switcher */}
            <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0 }}>
              {["concept", "quiz"].map((t) => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: "12px 0", background: "transparent", border: "none",
                  borderBottom: tab === t ? "2px solid #6366F1" : "2px solid transparent",
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 11,
                  letterSpacing: ".08em", textTransform: "uppercase",
                  color: tab === t ? "#F8FAFC" : "#475569", cursor: "pointer",
                }}>
                  {t === "concept" ? "📖 Concept" : "❓ Quiz"}
                </button>
              ))}
              {mob && (
                <button onClick={() => setTab("code")} style={{
                  flex: 1, padding: "12px 0", background: "transparent", border: "none",
                  borderBottom: tab === "code" ? "2px solid #6366F1" : "2px solid transparent",
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 11,
                  letterSpacing: ".08em", textTransform: "uppercase",
                  color: tab === "code" ? "#F8FAFC" : "#475569", cursor: "pointer",
                }}>
                  💻 Code
                </button>
              )}
            </div>

            {/* Concept tab */}
            {tab === "concept" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px" }}>
                {/* Module label */}
                <p style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".1em", color: "#475569", textTransform: "uppercase", marginBottom: 6 }}>
                  Current module
                </p>

                {/* Title */}
                <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: "#F8FAFC", marginBottom: 8, lineHeight: 1.3 }}>
                  Lesson {lesson.order} — {lesson.title}
                </h2>

                {/* XP badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.2)",
                  borderRadius: 20, padding: "3px 10px", marginBottom: 14,
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 11, color: "#10B981",
                }}>
                  ⭐ +{lesson.xpValue} XP on completion
                </div>

                {/* Concept text */}
                {lesson.content.concept.split("\n\n").map((p, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    {p.includes("\n- ") || p.startsWith("- ") ? (
                      <ul style={{ paddingLeft: 16, margin: 0 }}>
                        {p.split("\n").filter(l => l.trim()).map((line, j) => (
                          <li key={j} style={{ fontFamily: "'DM Sans'", fontSize: 13, lineHeight: 1.7, color: "#94A3B8", marginBottom: 5 }}>
                            {line.replace(/^- /, "")}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontFamily: "'DM Sans'", fontSize: 13, lineHeight: 1.7, color: "#94A3B8", margin: 0 }}>
                        {p}
                      </p>
                    )}
                  </div>
                ))}

                {/* Key concepts */}
                {keyConcepts.length > 0 && (
                  <div style={{
                    background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
                    borderRadius: 10, padding: "12px 14px", marginBottom: 14,
                  }}>
                    <p style={{ fontFamily: "'DM Sans'", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", color: "#6366F1", textTransform: "uppercase", marginBottom: 10 }}>
                      ℹ Key concepts
                    </p>
                    {keyConcepts.map((kc, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < keyConcepts.length - 1 ? 8 : 0 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                          background: "rgba(99,102,241,.15)", border: "1px solid rgba(99,102,241,.3)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 10, color: "#6366F1",
                          marginTop: 1,
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <code style={{
                            fontFamily: "'JetBrains Mono'", fontSize: 11,
                            background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                            borderRadius: 4, padding: "1px 6px", color: "#a78bfa", marginRight: 4,
                          }}>
                            {kc.code}
                          </code>
                          <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#94A3B8" }}>
                            — {kc.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Exercise description */}
                {exerciseDesc && (
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 13, lineHeight: 1.65, color: "#94A3B8", marginBottom: 14 }}>
                    {exerciseDesc}
                  </p>
                )}

                {/* Diagram */}
                {diagramLabel && (
                  <div style={{
                    border: "1px solid rgba(255,255,255,.07)", borderRadius: 10,
                    overflow: "hidden", marginBottom: 14,
                  }}>
                    <div style={{
                      background: "rgba(99,102,241,.06)", padding: "24px 16px",
                      display: "flex", alignItems: "center", justifyContent: "center", minHeight: 80,
                    }}>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569", fontStyle: "italic" }}>
                        {diagramLabel}
                      </span>
                    </div>
                    <div style={{ padding: "5px 10px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 10, letterSpacing: ".06em", color: "#475569", textTransform: "uppercase" }}>
                        Diagram: {diagramLabel}
                      </span>
                    </div>
                  </div>
                )}

                {/* AI tutor button */}
                <button
                  onClick={() => setAiOpen((o) => !o)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 14px", border: "1px solid rgba(255,255,255,.08)",
                    borderRadius: 10, cursor: "pointer",
                    fontFamily: "'DM Sans'", fontSize: 13, color: "#94A3B8",
                    background: aiOpen ? "rgba(99,102,241,.1)" : "transparent",
                    width: "100%", textAlign: "left", transition: "all .15s",
                  }}
                >
                  <span style={{ fontSize: 16 }}>🤖</span>
                  Ask AI tutor for hint
                </button>
              </div>
            )}

            {/* Quiz tab */}
            {tab === "quiz" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px" }}>
                {quizDone ? (
                  <div style={{ textAlign: "center", paddingTop: 32 }}>
                    <p style={{ fontSize: 48, marginBottom: 12 }}>
                      {score === quiz.length ? "🎉" : score >= quiz.length / 2 ? "👍" : "📚"}
                    </p>
                    <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: "#F8FAFC", marginBottom: 8 }}>
                      {score}/{quiz.length} Correct
                    </h3>
                    <p style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
                      {score === quiz.length ? "Perfect! Mark this lesson complete." : score >= quiz.length / 2 ? "Good job! Ready to continue." : "Review the concept and try again."}
                    </p>
                    {score >= quiz.length / 2 && (
                      <button onClick={completeLesson} disabled={completing || completed} style={{
                        width: "100%", padding: "12px",
                        background: completed ? "#10B981" : "#6366F1",
                        color: "#fff", border: "none", borderRadius: 8,
                        cursor: completing || completed ? "not-allowed" : "pointer",
                        fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
                      }}>
                        {completed ? "✓ Completed!" : completing ? "Saving..." : "Mark Complete →"}
                      </button>
                    )}
                    {score < quiz.length / 2 && (
                      <button onClick={() => { setQuizStep(0); setSelected(null); setQuizDone(false); setScore(0); }} style={{
                        width: "100%", padding: "12px",
                        background: "transparent", color: "#6366F1",
                        border: "1px solid rgba(99,102,241,.3)", borderRadius: 8,
                        cursor: "pointer", fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
                      }}>
                        Try Again
                      </button>
                    )}
                  </div>
                ) : quiz.length === 0 ? (
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#475569" }}>No quiz for this lesson.</p>
                ) : (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569" }}>
                        Question {quizStep + 1} of {quiz.length}
                      </span>
                      <span style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#10B981" }}>
                        {score} correct
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15, color: "#F8FAFC", marginBottom: 16, lineHeight: 1.4 }}>
                      {quiz[quizStep].q}
                    </h3>
                    {quiz[quizStep].options.map((opt, i) => {
                      let bg = "rgba(255,255,255,.04)";
                      let border = "rgba(255,255,255,.1)";
                      let color = "#94A3B8";
                      if (selected !== null) {
                        if (i === quiz[quizStep].answer) { bg = "rgba(16,185,129,.12)"; border = "#10B981"; color = "#10B981"; }
                        else if (i === selected) { bg = "rgba(239,68,68,.12)"; border = "#EF4444"; color = "#EF4444"; }
                      }
                      return (
                        <div key={i} onClick={() => handleAnswer(i)} style={{
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
                      <button onClick={nextQuestion} style={{
                        marginTop: 8, width: "100%", padding: "12px",
                        background: "#6366F1", color: "#fff", border: "none",
                        borderRadius: 8, cursor: "pointer",
                        fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13,
                      }}>
                        {quizStep < quiz.length - 1 ? "Next Question →" : "See Results →"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

  {/* ── Center — code editor ── */}
{(!mob || tab === "code") && (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#0A0A0F" }}>

    {/* Editor toolbar */}
    <div style={{
      height: 40, background: "#161B22",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      display: "flex", alignItems: "center",
      padding: "0 12px", gap: 10, flexShrink: 0,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "#0F0F1A", border: "1px solid rgba(255,255,255,.1)",
        borderRadius: "6px 6px 0 0", padding: "4px 10px",
        fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#94A3B8",
      }}>
       <span style={{ fontSize: 10 }}>📄</span>
{isPython ? "main.py" : lesson.order <= 5 ? "index.html" : "styles.css"}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'DM Sans'", fontSize: 11, color: "#10B981" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
        Autosaved
      </div>
      {!mob && (
        <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#475569", letterSpacing: ".06em" }}>
          PREVIEW
        </span>
      )}
    </div>

    {/* Editor + preview */}
    <div style={{ flex: 1, display: "flex", flexDirection: mob ? "column" : "row", overflow: "hidden" }}>
      <div style={{
        flex: showPreview && !mob ? "0 0 60%" : "1",
        minWidth: 0, overflow: "hidden",
        display: showPreview && mob ? "none" : "flex",
        flexDirection: "column",
      }}>
        <Editor
          height="100%"
          defaultLanguage={isPython ? "python" : lesson.order <= 5 ? "html" : "css"}
          theme="vs-dark"
          value={code}
          onChange={(v) => setCode(v || "")}
          options={{
            fontSize: mob ? 12 : 13,
            minimap: { enabled: false },
            lineNumbers: mob ? "off" : "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 12 },
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
      </div>
{showPreview && (
  <div style={{
    ...(mob ? {
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", flexDirection: "column",
      background: isPython ? "#0D1117" : "#fff",
    } : {
      flex: "0 0 40%",
      borderLeft: "1px solid rgba(255,255,255,.06)",
      background: isPython ? "#0D1117" : "#fff",
      display: "flex", flexDirection: "column",
    }),
  }}>
    {/* Preview header */}
    <div style={{
      padding: "8px 12px",
      borderBottom: `1px solid ${isPython ? "rgba(255,255,255,.08)" : "#eee"}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: isPython ? "#161B22" : "#f8f8f8", flexShrink: 0,
    }}>
      <span style={{ fontSize: 11, color: isPython ? "#475569" : "#999", letterSpacing: ".06em", textTransform: "uppercase", fontFamily: "sans-serif" }}>
        {isPython ? "Terminal Output" : "Live Preview"}
      </span>
      {mob ? (
        <button onClick={() => setShowPreview(false)} style={{
          background: "#ef4444", color: "#fff", border: "none",
          borderRadius: 6, padding: "4px 12px", cursor: "pointer",
          fontFamily: "sans-serif", fontSize: 12, fontWeight: 600,
        }}>
          ✕ Close
        </button>
      ) : (
        <span style={{ fontSize: 11, color: isPython ? "#475569" : "#999", fontFamily: "sans-serif" }}>
          {isPython ? "Python 3.10" : "Click RUN to update"}
        </span>
      )}
    </div>

    {/* Output area */}
    {isPython ? (
      <div style={{ flex: 1, overflowY: "auto", padding: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7 }}>
        {running ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366F1", animation: "bounce 1s ease infinite" }} />
            Running...
          </div>
        ) : output ? (
          <pre style={{
            margin: 0, color: outputError ? "#EF4444" : "#10B981",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {output}
          </pre>
        ) : (
          <span style={{ color: "#475569" }}>Click RUN to execute your Python code</span>
        )}
      </div>
    ) : (
      <iframe
        srcDoc={preview || `<html><body style="font-family:sans-serif;padding:16px;color:#666;display:flex;align-items:center;justify-content:center;height:80vh;margin:0;flex-direction:column;gap:8px"><p style="font-size:13px">Your output will appear here</p></body></html>`}
        title="preview"
        style={{ flex: 1, border: "none" }}
        sandbox="allow-scripts"
      />
    )}
  </div>
)}
    </div>

    {/* Run bar */}
    <div style={{
      height: 44, background: "#161B22",
      borderTop: "1px solid rgba(255,255,255,.06)",
      display: "flex", alignItems: "center",
      padding: "0 12px", gap: 10, flexShrink: 0,
    }}>
      <span style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#475569", fontStyle: "italic", flex: 1 }}>
        {mob ? (lesson.content.hint || "Edit then tap RUN") : (lesson.content.hint || "Edit the code and click Run to see the result")}
      </span>
      {!mob && (
        <button
          onClick={() => setShowPreview((p) => !p)}
          style={{
            background: "rgba(255,255,255,.06)", color: "#94A3B8",
            border: "1px solid rgba(255,255,255,.1)", borderRadius: 6,
            padding: "5px 12px", cursor: "pointer",
            fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 11,
          }}
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      )}
     <button
  onClick={() => { runCode(); }}
  disabled={running}
  style={{
    display: "flex", alignItems: "center", gap: 6,
    background: running ? "#475569" : "#10B981", color: "#fff", border: "none",
    borderRadius: 6, padding: "6px 16px", cursor: running ? "not-allowed" : "pointer",
    fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 11,
  }}
>
  {running ? "⏳ Running..." : "▶ RUN"}
</button>
    </div>

  </div>
)}
        {/* ── AI Tutor panel ── */}
        {aiOpen && !mob && (
          <div style={{
            width: 300, flexShrink: 0, background: "#0F0F1A",
            borderLeft: "1px solid rgba(255,255,255,.06)",
            display: "flex", flexDirection: "column",
          }}>
            <div style={{
              padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,.06)",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>🤖</span>
                <div>
                  <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, color: "#F8FAFC" }}>AI Tutor</p>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#10B981" }}>● Online</p>
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
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
                  border: "1px solid rgba(255,255,255,.1)", borderRadius: 8,
                  padding: "10px 12px", fontFamily: "'DM Sans'", fontSize: 13,
                  color: "#F8FAFC", outline: "none",
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

      {/* ── Bottom bar ── */}
      <div style={{
        height: 48, background: "#0F0F1A",
        borderTop: "1px solid rgba(255,255,255,.06)",
        display: "flex", alignItems: "center",
        padding: "0 16px", gap: 10, flexShrink: 0,
      }}>
        {/* Prev */}
        <button
          onClick={() => prevLesson && goToLesson(prevLesson)}
          disabled={!prevLesson}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.04)",
            color: prevLesson ? "#94A3B8" : "#2d2d3d",
            cursor: prevLesson ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}
        >
          ←
        </button>

        {/* Next */}
        <button
          onClick={() => nextLesson && goToLesson(nextLesson)}
          disabled={!nextLesson}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.04)",
            color: nextLesson ? "#94A3B8" : "#2d2d3d",
            cursor: nextLesson ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}
        >
          →
        </button>

        {/* Lesson counter */}
        <div style={{ flex: 1, textAlign: "center", fontFamily: "'DM Sans'", fontSize: 13, color: "#475569" }}>
          LESSON <span style={{ fontWeight: 600, color: "#F8FAFC" }}>{lesson.order}</span> / {allLessons.length}
        </div>

        {/* Skip */}
        <button
          onClick={() => nextLesson ? goToLesson(nextLesson) : navigate("/track")}
          style={{
            background: "none", border: "none", padding: "4px 8px",
            fontFamily: "'DM Sans'", fontSize: 12, color: "#475569", cursor: "pointer",
          }}
        >
          Skip lesson
        </button>

        {/* Mark complete */}
        <button
          onClick={() => setTab("quiz")}
          disabled={completing || completed}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: completed ? "#10B981" : "#6366F1",
            color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 16px", cursor: completing || completed ? "not-allowed" : "pointer",
            fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12,
            transition: "background .2s",
          }}
        >
          {completed ? "✓ Completed" : "Take Quiz →"}
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}