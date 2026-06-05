import { useState } from "react";
import { Moon, Settings, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useWidth } from "../../hooks/useWidth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import googleImg from "../../assets/search.png";
import githubImg from "../../assets/github.png";


function InputField({ label, type = "text", placeholder, icon, rightEl, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label style={{
          display: "block", fontFamily: "'Space Grotesk'", fontWeight: 600,
          fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
          color: "#94A3B8", marginBottom: 7,
        }}>
          {label}
        </label>
      )}
      <div style={{
        display: "flex", alignItems: "center",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "#6366F1" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 8,
        boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        padding: "0 14px", gap: 10,
      }}>
        {icon && <span style={{ color: "#475569", display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontFamily: "'DM Sans'", fontSize: 14, color: "#F8FAFC", padding: "12px 0",
          }}
        />
        {rightEl && (
          <span style={{ color: "#475569", display: "flex", alignItems: "center", flexShrink: 0, cursor: "pointer" }}>
            {rightEl}
          </span>
        )}
      </div>
    </div>
  );
}

function OAuthButton({ imgSrc, label, href }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 8, padding: "12px 16px", cursor: "pointer",
        fontFamily: "'Space Grotesk'", fontWeight: 600,
        fontSize: 13, letterSpacing: "0.08em", color: "#F8FAFC",
        textDecoration: "none",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <img src={imgSrc} alt={label} style={{ width: 18, height: 18, objectFit: "contain" }} />
      {label}
    </a>
  );
}
function Checkbox({ checked, onChange, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div
        onClick={onChange}
        style={{
          width: 16, height: 16, marginTop: 2, flexShrink: 0,
          border: `1px solid ${checked ? "#6366F1" : "rgba(255,255,255,0.2)"}`,
          borderRadius: 3, cursor: "pointer",
          background: checked ? "#6366F1" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
      >
        {checked && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
      </div>
      <span style={{ fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8", lineHeight: 1.5 }}>
        {children}
      </span>
    </div>
  );
}

export default function AuthFormPanel({ variant = "login" }) {
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [agree, setAgree] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const w = useWidth();
  const mob = w < 768;
  const isLogin = variant === "login";

 const handleSubmit = async () => {
  setError("");

  if (!isLogin && password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setLoading(true);
  try {
    if (isLogin) {
      await login(email, password);
    } else {
      if (!agree) {
        setError("Please agree to the terms first");
        setLoading(false);
        return;
      }
      await register(name, email, password);
    }
    navigate("/dashboard");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      width: mob ? "100%" : w >= 1024 ? "50%" : "55%",
      minHeight: "100vh", background: "#0F0F1A",
      padding: mob ? "32px 24px" : w >= 1024 ? "40px 64px" : "40px 40px",
      display: "flex", flexDirection: "column", justifyContent: "center",
      position: "relative",
    }}>

      {mob && (
        <div style={{ marginBottom: 36 }}>
          <Logo />
        </div>
      )}

      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8 }}>
        {[<Moon size={15} />, <Settings size={15} />].map((ic, i) => (
          <button key={i} style={{
            width: 34, height: 34, borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", color: "#94A3B8",
          }}>
            {ic}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 440, width: "100%", margin: mob ? "0 auto" : "0" }}>

        <h1 style={{
          fontFamily: "'Space Grotesk'", fontWeight: 700,
          fontSize: mob ? 30 : 38, color: "#F8FAFC",
          marginBottom: 8, letterSpacing: "-1px",
        }}>
          {isLogin ? "Welcome Back" : "Start Your Path"}
        </h1>
        <p style={{ fontFamily: "'DM Sans'", fontSize: 15, color: "#94A3B8", marginBottom: 28 }}>
          {isLogin
            ? "Enter your credentials to access your terminal."
            : "Create your account and begin your journey today."}
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
  <OAuthButton
    imgSrc={githubImg}
    label="GITHUB"
    href={`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/auth/github`}
  />
  <OAuthButton
    imgSrc={googleImg}
    label="GOOGLE"
    href={`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/auth/google`}
  />
</div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#475569", letterSpacing: "0.1em" }}>
            OR CONTINUE WITH
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {!isLogin && (
          <InputField
            label="FULL NAME"
            placeholder="John Doe"
            icon={<User size={15} />}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <InputField
          label="EMAIL ADDRESS"
          placeholder="dev@codepath.com"
          icon={<Mail size={15} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
            <label style={{
              fontFamily: "'Space Grotesk'", fontWeight: 600,
              fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8",
            }}>
              PASSWORD
            </label>
            {isLogin && (
              <Link to="/forgot-password" style={{
                fontFamily: "'Space Grotesk'", fontWeight: 600,
                fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#6366F1", textDecoration: "none",
              }}>
                FORGOT PASSWORD?
              </Link>
            )}
          </div>
          <InputField
            label=""
            type={showPass ? "text" : "password"}
            placeholder="••••••••••••"
            icon={<Lock size={15} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightEl={
              <span onClick={() => setShowPass((p) => !p)}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </span>
            }
          />
        </div>

       {!isLogin && (
  <InputField
    label="CONFIRM PASSWORD"
    type="password"
    placeholder="••••••••••••"
    icon={<Lock size={15} />}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />
)}

        <div style={{ marginBottom: 24 }}>
          {isLogin ? (
            <Checkbox checked={remember} onChange={() => setRemember((r) => !r)}>
              Remember this device for 30 days
            </Checkbox>
          ) : (
            <Checkbox checked={agree} onChange={() => setAgree((a) => !a)}>
              I agree to the{" "}
              <a href="#" style={{ color: "#6366F1", textDecoration: "none" }}>Terms of Service</a>
              {" "}and{" "}
              <a href="#" style={{ color: "#6366F1", textDecoration: "none" }}>Privacy Policy</a>
            </Checkbox>
          )}
        </div>

        {error && (
          <p style={{
            fontFamily: "'DM Sans'", fontSize: 13, color: "#EF4444",
            marginBottom: 12, padding: "10px 14px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8,
          }}>
            {error}
          </p>
        )}

        <button
          className="btnP"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "14px",
            background: loading ? "#4B4E99" : "#6366F1",
            color: "#fff", border: "none", borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Space Grotesk'", fontWeight: 600,
            fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          {loading ? "LOADING..." : isLogin ? "INITIALIZE SESSION ›" : "BEGIN YOUR PATH ›"}
        </button>

        <p style={{ textAlign: "center", fontFamily: "'DM Sans'", fontSize: 14, color: "#94A3B8" }}>
        {isLogin ? "New to the path? " : "Already on the path? "}
          
          <a  href={isLogin ? "/signup" : "/login"}
            style={{ color: "#6366F1", fontWeight: 600, textDecoration: "none" }}
          >
            {isLogin ? "Create an account" : "Log in"}
          </a>
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 28 }}>
          {["SUPPORT", "PRIVACY", "TERMS"].map((l) => (
            <a key={l} href="#" style={{
              fontFamily: "'DM Sans'", fontSize: 12, color: "#475569",
              textDecoration: "none", letterSpacing: "0.06em",
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

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8, background: "#6366F1",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#fff", fontFamily: "'JetBrains Mono'", fontSize: 12, fontWeight: 500 }}>&lt;/&gt;</span>
      </div>
      <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, letterSpacing: "0.08em", color: "#F8FAFC" }}>
        CODEPATH
      </span>
    </div>
  );
}