import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add new pages here as you build them:      */}
        {/* <Route path="/login"     element={<LoginPage />} />    */}
        {/* <Route path="/signup"    element={<SignupPage />} />   */}
        {/* <Route path="/dashboard" element={<Dashboard />} />   */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;