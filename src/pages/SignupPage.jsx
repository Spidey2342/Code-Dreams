import AuthCodePanel from "../components/auth/AuthCodePanel";
import AuthFormPanel from "../components/auth/AuthFormPanel";

export default function SignupPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F" }}>
      <AuthCodePanel variant="signup" />
      <AuthFormPanel variant="signup" />
    </div>
  );
}