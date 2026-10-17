import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
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
export default function App() {
  return (
    <>
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
    </>
  );
}
