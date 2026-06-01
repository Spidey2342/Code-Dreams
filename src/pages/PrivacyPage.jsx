import { useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F8FAFC", fontFamily: "'DM Sans'" }}>
      <div style={{ height: 56, background: "#0F0F1A", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 24px", gap: 16 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 13 }}>← Back</button>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16 }}>Privacy Policy</span>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 800, fontSize: 32, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: "#475569", fontSize: 14, marginBottom: 40 }}>Last updated: June 2024</p>

        {[
          {
            title: "1. Information We Collect",
            body: "We collect information you provide directly: your name, email address, and password when you register. We collect usage data: lessons completed, quiz scores, XP earned, and login timestamps. We collect payment information through Paystack — we do not store card numbers or mobile money PINs directly."
          },
          {
            title: "2. How We Use Your Information",
            body: "We use your information to provide and improve the Platform, to process payments and manage your subscription, to send you progress updates and important account notifications, to generate your certificates and leaderboard position, and to improve our lesson content and AI tutor responses."
          },
          {
            title: "3. Information Sharing",
            body: "We do not sell your personal information to third parties. We share information with Paystack to process payments. We share anonymised, aggregated data for research and improvement purposes. We may disclose information if required by Ghanaian law or a court order."
          },
          {
            title: "4. Data Storage and Security",
            body: "Your data is stored on secure servers provided by Neon (PostgreSQL database) and Render (application hosting). We use industry-standard encryption for data in transit (HTTPS) and at rest. Passwords are hashed using bcrypt and are never stored in plain text."
          },
          {
            title: "5. Cookies",
            body: "We use essential cookies to keep you logged in. We do not use advertising or tracking cookies. We do not use Google Analytics or similar third-party tracking services."
          },
          {
            title: "6. Your Rights",
            body: "You have the right to access your personal data at any time from your Settings page. You have the right to correct inaccurate data. You have the right to delete your account and all associated data from your Settings page. You have the right to export your progress data by contacting us."
          },
          {
            title: "7. Children's Privacy",
            body: "CodePath Ghana is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it."
          },
          {
            title: "8. Leaderboard",
            body: "Your name and XP total are visible to other users on the public leaderboard. You may contact us to have your name replaced with an anonymous identifier if you prefer privacy."
          },
          {
            title: "9. Changes to This Policy",
            body: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email. The date at the top of this page shows when the policy was last updated."
          },
          {
            title: "10. Contact",
            body: "For privacy questions or data requests, contact us at privacy@codepath.com.gh or write to CodePath Ghana, Accra, Ghana. We will respond within 5 business days."
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, marginBottom: 10, color: "#F8FAFC" }}>
              {section.title}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "#94A3B8" }}>
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}