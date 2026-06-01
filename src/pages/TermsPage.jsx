import { useNavigate } from "react-router-dom";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#F8FAFC", fontFamily: "'DM Sans'" }}>
      <div style={{ height: 56, background: "#0F0F1A", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 24px", gap: 16 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: 13 }}>← Back</button>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16 }}>Terms of Service</span>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 800, fontSize: 32, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ color: "#475569", fontSize: 14, marginBottom: 40 }}>Last updated: June 2024</p>

        {[
          {
            title: "1. Acceptance of Terms",
            body: "By accessing or using CodePath Ghana ('the Platform'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. CodePath Ghana is operated by a Ghanaian business and is subject to Ghanaian law."
          },
          {
            title: "2. Use of the Platform",
            body: "CodePath Ghana provides interactive coding education through lessons, quizzes, and projects. You may use the Platform for personal, non-commercial educational purposes. You may not copy, redistribute, or resell any content from the Platform without written permission."
          },
          {
            title: "3. Account Registration",
            body: "You must provide accurate information when creating an account. You are responsible for keeping your password secure. You must be at least 13 years old to use the Platform. We reserve the right to suspend accounts that violate these terms."
          },
          {
            title: "4. Pro Subscription",
            body: "The Pro subscription costs GHS 80 per month and is billed monthly through Paystack. Your subscription renews automatically each month. You may cancel at any time from your Settings page. Cancellation takes effect at the end of the current billing period. Refunds are not provided for partial months."
          },
          {
            title: "5. Payments",
            body: "All payments are processed securely by Paystack. We accept mobile money (MTN, Vodafone, AirtelTigo) and debit/credit cards. Prices are in Ghana Cedis (GHS). We reserve the right to change pricing with 30 days notice."
          },
          {
            title: "6. Intellectual Property",
            body: "All lesson content, code examples, projects, and materials on the Platform are the intellectual property of CodePath Ghana. Your submitted projects remain your property. By submitting projects for AI review, you grant us a licence to use them for improving the Platform."
          },
          {
            title: "7. Certificates",
            body: "Certificates are awarded upon completion of a full track. Certificates are verifiable via the unique URL on each certificate. We reserve the right to revoke certificates if we discover academic dishonesty."
          },
          {
            title: "8. Limitation of Liability",
            body: "CodePath Ghana is provided 'as is' without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid us in the previous 3 months."
          },
          {
            title: "9. Changes to Terms",
            body: "We may update these terms from time to time. We will notify you of significant changes via email. Continued use of the Platform after changes constitutes acceptance of the new terms."
          },
          {
            title: "10. Contact",
            body: "For questions about these terms, contact us at legal@codepath.com.gh or write to us at CodePath Ghana, Accra, Ghana."
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