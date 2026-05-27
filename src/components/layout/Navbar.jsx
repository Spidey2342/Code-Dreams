import { useState } from "react";
import { useWidth } from "../../hooks/useWidth";
import Logo from "../ui/Logo";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
const navigate = useNavigate()

  const [open, setOpen] = useState(false);
  const w = useWidth();
  const mob = w < 768;

  return (
    <nav
      className="navBlur"
      style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,15,0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="pNav" style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Main bar */}
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />

          {/* Desktop links */}
          <div className="deskLinks" style={{ gap: 36 }}>
            {["Tracks", "Features", "Pricing"].map((l) => (
              <a key={l} href={l === "Pricing" ? "/pricing" : "#"} className="navLink">{l}</a>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="deskAuth" style={{ alignItems: "center", gap: 12 }}>
            <p onClick={()=> navigate("/login")} className="navLink">Log In</p>
            <button
              className="btnP"
              onClick={()=> navigate("/signup")}
              style={{
                background: "#6366F1", color: "#fff", border: "none", borderRadius: 8,
                padding: "10px 22px", cursor: "pointer",
                fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em",
              }}
            >
              Get Started
            </button>
          </div>

          {/* Hamburger */}
          <button
            className="burger"
            onClick={() => setOpen((o) => !o)}
            style={{
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 8, width: 40, height: 40, cursor: "pointer",
              flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block", width: 18, height: 2,
                  background: "#F8FAFC", borderRadius: 2, transition: "all .2s",
                  transform: open
                    ? i === 0 ? "rotate(45deg) translate(5px,5px)"
                    : i === 2 ? "rotate(-45deg) translate(5px,-5px)"
                    : "scaleX(0)"
                    : "none",
                  opacity: open && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {open && mob && (
          <div
            className="aMenu"
            style={{
              borderTop: "1px solid rgba(255,255,255,.06)",
              padding: "20px 0 24px",
              display: "flex", flexDirection: "column", gap: 4,
            }}
          >
          {["Tracks", "Features", "Pricing"].map((l) => (
              <a key={l} href={l === "Pricing" ? "/pricing" : "#"} className="navLink"
                style={{ padding: "12px 0", fontSize: 15, borderBottom: "1px solid rgba(255,255,255,.04)" }}
              >
                {l}
              </a>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <a
                href="/login"
                style={{
                  flex: 1, textAlign: "center", padding: "12px",
                  border: "1px solid rgba(255,255,255,.15)", borderRadius: 8,
                  color: "#F8FAFC", textDecoration: "none",
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em",
                }}
              >
                LOG IN
              </a>
              <button
                className="btnP"
                style={{
                  flex: 1, background: "#6366F1", color: "#fff",
                  border: "none", borderRadius: 8, padding: "12px", cursor: "pointer",
                  fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em",
                }}
              >
                GET STARTED
              </button>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}