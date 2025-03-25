import { Routes, Route } from "react-router-dom";
import { ParallaxBanner, ParallaxProvider } from "react-scroll-parallax";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";
import Main from "./pages/Main";

const App: React.FC = () => {
  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-black">
        <Navbar />
        {/* Page Content */}
        <div className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/main" element={<Main />} />
          </Routes>
        </div>
      </div>
      <footer className="h-[50px] bg-purple-500 text-white text-center py-4">
        <p className="text-sm">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </ParallaxProvider>
  );
};

export default App;
