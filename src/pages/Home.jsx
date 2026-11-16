import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import ToolsGrid from "../components/ToolsGrid.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ToolsGrid />
      </main>
      <Footer />
    </div>
  );
}
