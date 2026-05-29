import TrackCard from "./TrackCard";

const TRACKS = [
  { name: "HTML & CSS Foundation", icon: "🌐", color: "#E34F26", difficulty: "Beginner", weeks: "4 Weeks", xp: "2500", desc: "Master the building blocks of the web. Learn semantic markup and modern styling techniques.", slug: "html-css" },
  { name: "Python Fundamentals", icon: "🐍", color: "#3776AB", difficulty: "Beginner", weeks: "6 Weeks", xp: "4000", desc: "Learn Python from scratch. Build real projects with Ghanaian context — calculators, grade trackers, automation scripts.", slug: "python-fundamentals" },
  { name: "JavaScript Mastery", icon: "⚡", color: "#F7DF1E", difficulty: "Intermediate", weeks: "8 Weeks", xp: "5000", desc: "Deep dive into vanilla JS, DOM manipulation, asynchronous programming, and modern ES6+ syntax.", slug: "javascript" },
  { name: "Full Stack Engineering", icon: "🗂️", color: "#10B981", difficulty: "Advanced", weeks: "12 Weeks", xp: "8500", desc: "Build complete web applications combining React frontend with Python Flask backend and databases.", slug: "fullstack" },
];

export default function LearningTracks() {
  return (
    <section style={{ background: "#0A0A0F" }}>
      <div className="pSec" style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366F1", marginBottom: 10 }}>
              // PATHWAYS
            </p>
            <h2 className="h2Size" style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, letterSpacing: "-1px", color: "#F8FAFC" }}>
              LEARNING TRACKS
            </h2>
          </div>
          <a href="#" style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, color: "#6366F1", textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            VIEW ALL TRACKS →
          </a>
        </div>

        {/* Grid */}
        <div className="tracksGrid">
          {TRACKS.map((t, i) => (
            <TrackCard key={t.name} track={t} delay={`${0.08 * i}s`} />
          ))}
        </div>

      </div>
    </section>
  );
}