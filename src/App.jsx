import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { LazyMotion } from "motion/react";
import { useLayoutEffect } from "react";
import FloatingShapes from "./components/FloatingShapes";
import MagneticButtons from "./components/MagneticButtons";
import About from "./components/About";
import Experience from "./components/Experience";
import DemosSection from "./components/DemosSection";
import Projects from "./components/Projects";
import TechStack from "./components/TechStack";
import Contact from "./components/Contact";
import MouseGlow from "./components/MouseGlow";
import Footer from "./components/Footer";
import ScrollEffects from "./components/ScrollEffects";
import "./mobile-compact.css";
import "./mobile-performance.css";
const loadMotionFeatures = () =>
  import("./utils/motionFeatures.js").then((module) => module.default);
export default function App() {
  // Reveal the committed UI immediately; decorative icons never block it.
  useLayoutEffect(() => {
    document.getElementById("site-loader")?.remove();
    document.getElementById("site-loader-styles")?.remove();
  }, []);
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MouseGlow />
      <FloatingShapes />
      <MagneticButtons />
      <ScrollEffects />
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Experience />
        <Projects />
        <DemosSection />
        <About />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </LazyMotion>
  );
}
