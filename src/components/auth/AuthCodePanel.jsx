import Logo from "../ui/Logo";

const LOGIN_LINES = [
  [{ t: "async ", c: "#FF7B72" }, { t: "def ", c: "#FF7B72" }, { t: "login_user", c: "#D2A8FF" }, { t: "(credentials):", c: "#F8FAFC" }],
  [{ t: "  # Verifying identity...", c: "#8B949E", i: true }],
  [{ t: "  user ", c: "#F8FAFC" }, { t: "= ", c: "#FF7B72" }, { t: "await ", c: "#FF7B72" }, { t: "db.find(credentials.email)", c: "#A5D6FF" }],
  [{ t: "  ", c: "#F8FAFC" }, { t: "if ", c: "#FF7B72" }, { t: "user.is_valid():", c: "#F8FAFC" }],
  [{ t: "    ", c: "#F8FAFC" }, { t: "return ", c: "#FF7B72" }, { t: "AccessToken(user.id)", c: "#A5D6FF" }],
  [{ t: "  ", c: "#F8FAFC" }, { t: "return ", c: "#FF7B72" }, { t: "PermissionError(", c: "#F8FAFC" }, { t: '"Invalid login"', c: "#A5D6FF" }, { t: ")", c: "#F8FAFC" }],
];

const SIGNUP_LINES = [
  [{ t: "async ", c: "#FF7B72" }, { t: "def ", c: "#FF7B72" }, { t: "register_user", c: "#D2A8FF" }, { t: "(data):", c: "#F8FAFC" }],
  [{ t: "  # Creating new account...", c: "#8B949E", i: true }],
  [{ t: "  user ", c: "#F8FAFC" }, { t: "= ", c: "#FF7B72" }, { t: "User(name", c: "#A5D6FF" }, { t: "=data.name)", c: "#F8FAFC" }],
  [{ t: "  ", c: "#F8FAFC" }, { t: "await ", c: "#FF7B72" }, { t: "db.save(user)", c: "#A5D6FF" }],
  [{ t: "  ", c: "#F8FAFC" }, { t: "await ", c: "#FF7B72" }, { t: "send_welcome_email(user)", c: "#A5D6FF" }],
  [{ t: "  ", c: "#F8FAFC" }, { t: "return ", c: "#FF7B72" }, { t: "AccessToken(user.id)", c: "#A5D6FF" }],
];

export default function AuthCodePanel({ variant = "login" }) {
  const lines = variant === "login" ? LOGIN_LINES : SIGNUP_LINES;
  const filename = variant === "login" ? "AUTH_SERVICE.PY" : "REGISTER.PY";

  return (
    <div
      style={{
        width: "50%",
        minHeight: "100vh",
        background: "#0A0A0F",
        padding: "40px 48px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 64 }}>
        <Logo />
      </div>

      {/* Code block */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          background: "#0D1117",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        }}>
          {/* Chrome bar */}
          <div style={{
            background: "#161B22",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
              <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, display: "inline-block" }} />
            ))}
            <span style={{ flex: 1, textAlign: "center", fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#484F58", letterSpacing: "0.06em" }}>
              {filename}
            </span>
          </div>

          {/* Code lines */}
          <div style={{ padding: "16px 16px 16px 0" }}>
            {lines.map((line, i) => (
              <div key={i} style={{ display: "flex", marginBottom: 4, minHeight: 22 }}>
                <span style={{
                  width: 32, textAlign: "right", paddingRight: 12,
                  fontFamily: "'JetBrains Mono'", fontSize: 13,
                  color: "#484F58", userSelect: "none", flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, lineHeight: "22px", whiteSpace: "nowrap" }}>
                  {line.map((tk, j) => (
                    <span key={j} style={{ color: tk.c, fontStyle: tk.i ? "italic" : "normal" }}>{tk.t}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer spotlight quote */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ marginBottom: 20 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: 4, padding: "4px 10px",
            fontFamily: "'JetBrains Mono'", fontSize: 11,
            color: "#FCD34D", letterSpacing: "0.08em",
          }}>
            " " DEVELOPER SPOTLIGHT
          </span>
        </div>

        <blockquote style={{
          fontFamily: "'Space Grotesk'", fontWeight: 700,
          fontSize: 26, lineHeight: 1.3,
          color: "#F8FAFC", marginBottom: 20,
        }}>
          "The journey of a thousand{" "}
          <span style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #6366F1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            lines of code
          </span>{" "}
          begins with a single login."
        </blockquote>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Space Grotesk'", fontWeight: 700,
            fontSize: 16, color: "#fff", flexShrink: 0,
          }}>
            S
          </div>
          <div>
            <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 14, color: "#F8FAFC" }}>
              Sarah Chen
            </p>
            <p style={{ fontFamily: "'DM Sans'", fontSize: 13, color: "#94A3B8" }}>
              Senior Frontend Engineer @ TechFlow
            </p>
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div style={{
        position: "absolute", bottom: 28, left: 48, right: 48,
        display: "flex", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#475569", letterSpacing: "0.08em" }}>
          SYSTEM STATUS: ONLINE
        </span>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#475569", letterSpacing: "0.08em" }}>
          V2.4.0 BUILD STABLE
        </span>
      </div>
    </div>
  );
}