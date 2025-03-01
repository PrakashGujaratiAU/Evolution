import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ChevronFirst, ChevronLast, FastForward, Menu, Pause, Play 
} from "lucide-react";
import Header from "./Header";

const API_BASE_URL = "https://krc-evolution.vercel.app/api";

export default function ProjectView() {
  const [slides, setSlides] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isReverse, setIsReverse] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project by ID");
        }
        const data = await response.json();
        if (data.slides) {
          setSlides(data.slides);
          setProjectTitle(data.projectName);
        }
      } catch (error) {
        console.error("Error fetching project by ID:", error);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    if (!slides.length || isPaused) return;

    const slideDuration = slides[currentIndex]?.duration || 5000;

    const interval = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        isReverse
          ? prevIndex === 0
            ? slides.length - 1
            : prevIndex - 1
          : (prevIndex + 1) % slides.length
      );
    }, slideDuration);

    return () => clearTimeout(interval);
  }, [currentIndex, isReverse, isPaused, slides]);

  // **Speech Synthesis Effect**
  useEffect(() => {
    if (slides.length > 0) {
      const currentSlide = slides[currentIndex];

      if (currentSlide?.title) {
        const speech = new SpeechSynthesisUtterance(currentSlide.title);
        speech.lang = "en-US"; // Set the language
        speech.rate = 1; // Adjust the speed (0.5 - 2)
        speech.pitch = 1; // Adjust pitch (0 - 2)

        // Stop any ongoing speech before starting a new one
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
      }
    }
  }, [currentIndex, slides]);

  const togglePause = () => setIsPaused((prev) => !prev);

  return (
    <div className="relative w-full flex flex-col justify-center items-center min-h-screen gap-2 mx-auto px-4">
      <Header />
      <h1 className="text-gray-700 text-lg md:text-xl lg:text-2xl font-bold underline">
        A TIMELINE OF EVOLUTION OF
        <span style={{ color: "blue" }}> {projectTitle.toUpperCase()}</span>
      </h1>

      <div className="overflow-hidden w-full h-auto">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: slides.length ? `translateX(-${currentIndex * 100}%)` : "translateX(0)",
          }}
        >
          {slides.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 flex flex-col items-center justify-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full">
                {item.type === "image" ? (
                  <img src={item.url} alt="Slide Image" className="w-[30%] max-w-[30%] object-contain" />
                ) : item.type === "video" ? (
                  <video src={item.url} className="w-full max-w-[40%] object-contain" muted playsInline controls />
                ) : null}
                <div className="text-left px-4 w-[30%] max-w-[30%]">
                  {item.title && (
                    <h1 className="text-black text-2xl font-bold mb-4">{item.title}</h1>
                  )}
                  {item.description && (
                    <p className="text-gray-700 text-2xl">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 w-full flex justify-center items-center gap-4">
        <button onClick={() => setCurrentIndex(0)} className="p-2 text-green-500 font-bold rounded-full hover:bg-green-100 transition">
          <ChevronFirst />
        </button>
        <button onClick={() => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : slides.length - 1)} className="p-2 bg-red-200 text-black font-bold rounded-full hover:bg-red-700 transition rotate-180">
          <FastForward />
        </button>
        <button onClick={togglePause} className="p-2 bg-gray-200 text-black font-bold rounded-full hover:bg-gray-500 transition">
          {isPaused ? <Play /> : <Pause />}
        </button>
        <button onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)} className="p-2 bg-green-200 text-black font-bold rounded-full hover:bg-green-700 transition">
          <FastForward />
        </button>
        <button onClick={() => setCurrentIndex(slides.length - 1)} className="p-2 text-red-500 font-bold rounded-full hover:bg-red-100 transition">
          <ChevronLast />
        </button>
      </div>
    </div>
  );
}
