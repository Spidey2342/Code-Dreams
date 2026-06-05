import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../lib/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>&lt;/&gt;</div>

        {!token ? (
          <>
            <h1 style={styles.h1}>Invalid link</h1>
            <p style={styles.sub}>
              This reset link is missing its token. Request a new one from the forgot-password page.
            </p>
            <Link to="/forgot-password" style={styles.primaryBtn}>
              Request a new link
            </Link>
          </>
        ) : done ? (
          <>
            <h1 style={styles.h1}>Password reset ✅</h1>
            <p style={styles.sub}>
              Your password has been updated. Redirecting you to login...
            </p>
            <Link to="/login" style={styles.primaryBtn}>
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <h1 style={styles.h1}>Choose a new password</h1>
            <p style={styles.sub}>Enter a new password for your account.</p>

            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={styles.input}
            />

            {error && <p style={styles.error}>{error}</p>}

            <button onClick={handleSubmit} disabled={loading} style={styles.primaryBtn}>
              {loading ? "Resetting..." : "Reset password"}
            </button>

            <Link to="/login" style={styles.backLink}>
              ← Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0f",
    padding: 20,
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#0f0f1a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "40px 32px",
  },
  logo: {
    background: "#6366f1",
    width: 44,
    height: 44,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 16,
    marginBottom: 24,
  },
  h1: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#f8fafc",
    margin: "0 0 10px",
  },
  sub: {
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 1.6,
    margin: "0 0 24px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#0a0a0f",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    padding: "14px 16px",
    color: "#f8fafc",
    fontSize: 15,
    marginBottom: 16,
    outline: "none",
  },
  primaryBtn: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    textDecoration: "none",
    textAlign: "center",
    padding: 14,
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
  },
  backLink: {
    display: "block",
    textAlign: "center",
    color: "#6366f1",
    fontSize: 14,
    textDecoration: "none",
    marginTop: 20,
  },
  error: {
    color: "#f87171",
    fontSize: 14,
    margin: "0 0 16px",
  },
};