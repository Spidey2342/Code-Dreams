import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<HomePage />} />
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Add new pages here as you build them:             */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;