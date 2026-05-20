import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import LearningTracks from "../components/home/LearningTracks";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F" }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <LearningTracks />
      <Footer />
    </div>
  );
}