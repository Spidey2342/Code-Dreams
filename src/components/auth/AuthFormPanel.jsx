import { useState } from "react";

function InputField({ label, type = "text", placeholder, icon, rightEl }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block",
        fontFamily: "'Space Grotesk'", fontWeight: 600,
        fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#94A3B8", marginBottom: 8,
      }}>
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "#6366F1" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 8,
        boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        padding: "0 14px",
        gap: 10,
      }}>
        {icon && (
          <span style={{ color: "#475569", fontSize: 15, flexShrink: 0 }}>{icon}</span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontFamily: "'DM Sans'", fontSize: 14, color: "#F8FAFC",
            padding: "13px 0",
          }}
        />
        {rightEl && <span style={{ color: "#475569", fontSize: 15, flexShrink: 0, cursor: "pointer" }}>{rightEl}</span>}
      </div>
    </div>
  );
}

function OAuthButton({ icon, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 8, padding: "13px 20px", cursor: "pointer",
        fontFamily: "'Space Grotesk'", fontWeight: 600,
        fontSize: 13, letterSpacing: "0.08em", color: "#F8FAFC",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </button>
  );
}

export default function AuthFormPanel({ variant = "login" }) {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [agree, setAgree] = useState(false);

  const isLogin = variant === "login";

  return (
    <div style={{
      width: "50%",
      minHeight: "100vh",
      background: "#0F0F1A",
      padding: "40px 64px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
    }}>

      {/* Top right icons */}
      <div style={{ position: "absolute", top: 24, right: 24, display: "flex", gap: 8 }}>
        {["🌙", "⚙️"].map((ic) => (
          <button key={ic} style={{
            width: 36, height: 36, borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
          }}>
            {ic}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 440, width: "100%" }}>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Space Grotesk'", fontWeight: 700,
          fontSize: 40, color: "#F8FAFC",
          marginBottom: 8, letterSpacing: "-1px",
        }}>
          {isLogin ? "Welcome Back" : "Start Your Path"}
        </h1>
        <p style={{
          fontFamily: "'DM Sans'", fontSize: 15,
          color: "#94A3B8", marginBottom: 36,
        }}>
          {isLogin
            ? "Enter your credentials to access your terminal."
            : "Create your account and begin your journey today."}
        </p>

        {/* OAuth buttons */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          <OAuthButton icon="🐙" label="GITHUB" />
          <OAuthButton icon="G" label="GOOGLE" />
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{
            fontFamily: "'JetBrains Mono'", fontSize: 11,
            color: "#475569", letterSpacing: "0.1em",
          }}>
            OR CONTINUE WITH
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Form fields */}
        {!isLogin && (
          <InputField label="FULL NAME" placeholder="John Doe" icon="👤" />
        )}

        <InputField label="EMAIL ADDRESS" placeholder="dev@codepath.com" icon="✉️" />

        {/* Password field with forgot link */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{
              fontFamily: "'Space Grotesk'", fontWeight: 600,
              fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#94A3B8",
            }}>
              PASSWORD
            </label>
            {isLogin && (
              <a href="#" style={{
                fontFamily: "'Space Grotesk'", fontWeight: 600,
                fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#6366F1", textDecoration: "none",
                transition: "color 0.2s",
              }}>
                FORGOT PASSWORD?
              </a>
            )}
          </div>
          <InputField
            label=""
            type={showPass ? "text" : "password"}
            placeholder="••••••••••••"
            icon="🔒"
            rightEl={
              <span onClick={() => setShowPass((p) => !p)} style={{ cursor: "pointer" }}>
                {showPass ? "🙈" : "👁️"}
              </span>
            }
          />
        </div>

        {!isLogin && (
          <InputField
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="••••••••••••"
            icon="🔒"
          />
        )}

        {/* Checkbox */}
        {isLogin ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div
              onClick={() => setRemember((r) => !r)}
              style={{
                width: 16, height: 16,
                border: `1px solid ${remember ? "#6366F1" : "rgba(255,255,255,0.2)"}`,
                borderRadius: 3, cursor: "pointer",
                background: remember ? "#6366F1" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
              }}
            >
              {remember && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
            </div>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>
              Remember this device for 30 days
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 28 }}>
            <div
              onClick={() => setAgree((a) => !a)}
              style={{
                width: 16, height: 16, marginTop: 2,
                border: `1px solid ${agree ? "#6366F1" : "rgba(255,255,255,0.2)"}`,
                borderRadius: 3, cursor: "pointer",
                background: agree ? "#6366F1" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s",
              }}
            >
              {agree && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
            </div>
            <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", lineHeight: 1.5 }}>
              I agree to the{" "}
              <a href="#" style={{ color: "#6366F1", textDecoration: "none" }}>Terms of Service</a>
              {" "}and{" "}
              <a href="#" style={{ color: "#6366F1", textDecoration: "none" }}>Privacy Policy</a>
            </span>
          </div>
        )}

        {/* Submit button */}
        <button
          className="btnP"
          style={{
            width: "100%", padding: "15px",
            background: "#6366F1", color: "#fff",
            border: "none", borderRadius: 8, cursor: "pointer",
            fontFamily: "'Space Grotesk'", fontWeight: 600,
            fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          {isLogin ? "INITIALIZE SESSION ›" : "BEGIN YOUR PATH ›"}
        </button>

        {/* Switch link */}
        <p style={{ textAlign: "center", fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>
          {isLogin ? "New to the path? " : "Already on the path? "}
          <a
            href={isLogin ? "/signup" : "/login"}
            style={{ color: "#6366F1", fontWeight: 600, textDecoration: "none" }}
          >
            {isLogin ? "Create an account" : "Log in"}
          </a>
        </p>

        {/* Footer links */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 32 }}>
          {["SUPPORT", "PRIVACY", "TERMS"].map((l) => (
            <a key={l} href="#" style={{
              fontFamily: "'DM Sans'", fontSize: 12,
              color: "#475569", textDecoration: "none",
              letterSpacing: "0.06em", transition: "color 0.2s",
            }}
              onMouseOver={(e) => (e.target.style.color = "#94A3B8")}
              onMouseOut={(e) => (e.target.style.color = "#475569")}
            >
              {l}
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}