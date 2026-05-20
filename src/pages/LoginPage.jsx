import AuthCodePanel from "../components/auth/AuthCodePanel";
import AuthFormPanel from "../components/auth/AuthFormPanel";

export default function LoginPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0F" }}>
      <AuthCodePanel variant="login" />
      <AuthFormPanel variant="login" />
    </div>
  );
}