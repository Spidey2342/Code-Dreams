import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSent(true);
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

        {sent ? (
          <>
            <h1 style={styles.h1}>Check your email</h1>
            <p style={styles.sub}>
              If an account exists for <strong style={{ color: "#f8fafc" }}>{email}</strong>, we've
              sent a link to reset your password. The link expires in 1 hour.
            </p>
            <Link to="/login" style={styles.primaryBtn}>
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <h1 style={styles.h1}>Forgot password?</h1>
            <p style={styles.sub}>
              Enter the email you signed up with and we'll send you a reset link.
            </p>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={styles.input}
            />

            {error && <p style={styles.error}>{error}</p>}

            <button onClick={handleSubmit} disabled={loading} style={styles.primaryBtn}>
              {loading ? "Sending..." : "Send reset link"}
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