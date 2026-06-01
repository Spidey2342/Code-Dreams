import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/layout/Hero";
import HowItWorks from "../components/layout/HowItWorks";
import LearningTracks from "../components/layout/LearningTracks";
import Testimonial from "../components/layout/Testimonial";
import StatsBar from "../components/layout/StatsBar";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F" }}>
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <LearningTracks />
      <Testimonial />
      <Footer />
    </div>
  );
}