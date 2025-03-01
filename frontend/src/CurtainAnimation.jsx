import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "./background.jpg";
import frontcurtain from "./frontcurtain.jpg";
import introMusic from "./intro.mp3";
import rope from "./rope.png";

const CurtainAnimation = () => {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const navigate = useNavigate();

  // Function to handle rope click, toggles curtain state and plays audio
  const handleRopeClick = () => {
    setCurtainOpen(!curtainOpen);
    const audio = new Audio(introMusic);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Left Curtain */}
      <motion.div
        className="absolute top-0 left-0 h-full w-1/2 z-20 bg-cover"
        style={{ backgroundImage: `url(${frontcurtain})` }}
        animate={{ width: curtainOpen ? "60px" : "50%" }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Right Curtain */}
      <motion.div
        className="absolute top-0 right-0 h-full w-1/2 z-20 bg-cover"
        style={{ backgroundImage: `url(${frontcurtain})` }}
        animate={{ width: curtainOpen ? "60px" : "50%" }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Rope Button */}
      <motion.button
        className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 z-30 focus:outline-none"
        onClick={handleRopeClick}
        animate={{ top: curtainOpen ? "0px" : "-40px" }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <img src={rope} alt="Rope" className="w-12" />
      </motion.button>

      {/* Enter Button */}
      <button
        className="absolute bottom-25 left-1/2 transform -translate-x-1/2 bg-[#3d3c85] text-white px-6 py-2 rounded-lg shadow-lg hover:bg-[#31305c] transition"
        onClick={() => navigate(`/index`)}
      >
        Click to Start Your Curious Journey
      </button>
    </div>
  );
};

export default CurtainAnimation;
