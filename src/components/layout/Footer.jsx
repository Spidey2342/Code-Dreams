import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer style={{ background: "#0A0A0F", borderTop: "1px solid rgba(255,255,255,.06)" }}>
      <div className="pFooter" style={{ maxWidth: 1280, margin: "0 auto" }}>

        <div className="footerGrid">
          {/* Brand */}
          <div className="footerBrand">
            <Logo />
            <p style={{ fontFamily: "'DM Sans'", fontSize: 14, lineHeight: 1.7, color: "#94A3B8", marginTop: 14, maxWidth: 280 }}>
              Empowering the next generation of software engineers through interactive, AI-driven learning experiences.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              {["𝕏", "GH", "DC"].map((icon) => (
                <button key={icon} className="socBtn">{icon}</button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F8FAFC", marginBottom: 18 }}>
              PLATFORM
            </p>
            {["All Tracks", "Projects", "Leaderboard", "Pricing"].map((l) => (
              <a key={l} href="#" className="fLink">{l}</a>
            ))}
          </div>

          {/* Company */}
          <div>
            <p style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F8FAFC", marginBottom: 18 }}>
              COMPANY
            </p>
            {["About Us", "Careers", "Blog", "Contact", "Pricing"].map((l) => (
              <a key={l} href={l === "Pricing" ? "/pricing" : "#"} className="navLink">{l}</a>  
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 22 }}>
          <div className="footerBottom">
            <p style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              © 2026 CODEPATH. ALL RIGHTS RESERVED.
            </p>
            <div style={{ display: "flex", gap: 24 }}>
              {["TERMS", "PRIVACY"].map((l) => (
                <a
                  key={l} href="#"
                  style={{ fontFamily: "'DM Sans'", fontSize: 12, color: "#475569", textDecoration: "none", letterSpacing: "0.06em", transition: "color .2s" }}
                  onMouseOver={(e) => (e.target.style.color = "#94A3B8")}
                  onMouseOut={(e) => (e.target.style.color = "#475569")}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}