import {
  ChevronFirst,
  ChevronLast,
  FastForward,
  Menu,
  Pause,
  Play,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
const API_BASE_URL = "https://krc-evolution.vercel.app/api";
// const API_BASE_URL = "http://127.0.0.1:3001/api";

export default function ProjectView() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const { id } = useParams();

  const [slides, setSlides] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projects, setProjects] = useState([]);
  const [categories] = useState([
    "Science",
    "Technology",
    "Engineering",
    "Mathematics",
    "Business",
    "Economics",
    "Medicine & Healthcare",
    "Social Sciences",
    "Humanities",
    "Education",
    "History",
    "Political Science",
    "Law & Governance",
    "Environmental Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Genetics & Biotechnology",
    "Artificial Intelligence & Machine Learning",
    "Cybersecurity & Data Science",
    "Software Development",
    "Robotics & Automation",
    "Space & Astronomy",
    "Aerospace & Aviation",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical & Electronics Engineering",
    "Energy & Sustainability",
    "Arts & Media",
    "Communication & Journalism",
    "Philosophy & Ethics",
    "Cultural Studies",
    "Linguistics & Language",
    "Psychology & Human Behavior",
    "Neuroscience",
    "Sports Science",
    "Agriculture & Food Science",
    "Fashion & Design",
    "Material Science & Nanotechnology",
    "Blockchain & Cryptocurrency",
    "Internet of Things (IoT)",
    "Renewable Energy",
    "E-Commerce & Digital Marketing",
    "Transportation & Smart Cities",
    "Cloud Computing & Big Data",
    "Virtual Reality (VR) & Augmented Reality (AR)",
    "Supply Chain & Logistics",
    "Metaverse & Digital",
    "Other",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const navigate = useNavigate();

  // Call your API to fetch the project (and its slides)
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
        } else {
          console.warn("Project found, but no slides array");
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
    const fetchProjects = async () => {
      try {
        const url = `${API_BASE_URL}/projects?projectCategory=${encodeURIComponent(
          selectedCategory
        )}`;

        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        console.log(url);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [selectedCategory]);

  // The rest of your existing carousel states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReverse, setIsReverse] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const maxVisible = 5;

  // Handle the timing/duration logic
  useEffect(() => {
    if (!slides.length || isPaused) return;

    const slideDuration = slides[currentIndex]?.duration || 5000;

    const interval = setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        return isReverse
          ? prevIndex === 0
            ? slides.length - 1
            : prevIndex - 1
          : (prevIndex + 1) % slides.length;
      });
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

  // Jump to a specific slide
  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Video refs
  const videoRefs = useRef([]);
  if (!videoRefs.current) videoRefs.current = [];

  // Handle playing/pausing videos on slide change
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video && video.src && video.readyState >= 2) {
        if (index === currentIndex) {
          video
            .play()
            .catch((error) => console.warn("Autoplay failed:", error));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  // Calculate visible slides for the timeline dots
  const visibleStartIndex = Math.max(
    0,
    currentIndex - Math.floor(maxVisible / 2)
  );
  const visibleEndIndex = visibleStartIndex + maxVisible;
  const visibleImages = slides.slice(visibleStartIndex, visibleEndIndex);

  // Buttons to jump to the start/end depending on direction
  const startForward = () => {
    setIsReverse(false);
    setCurrentIndex(0);
  };

  const startBackward = () => {
    setIsReverse(true);
    // If slides is empty, default to 0, otherwise slides.length - 1
    setCurrentIndex(slides.length ? slides.length - 1 : 0);
  };

  // Toggle pause state
  const togglePause = () => setIsPaused((prev) => !prev);

  return (
    <div className="relative w-full flex flex-col justify-center items-center min-h-screen gap-2 mx-auto px-4">
      <Header />
      <h1 className="absolute top-25 text-gray-700 text-center text-lg md:text-xl lg:text-2xl font-bold underline underline-offset-4 decoration-orange">
        A TIMELINE OF EVOLUTION OF
        <span style={{ color: "blue" }}> {projectTitle.toUpperCase()}</span>
      </h1>

      <div className="overflow-hidden w-full h-auto">
        {/* absolute top-50 */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: slides.length
              ? `translateX(-${currentIndex * 100}%)`
              : "translateX(0)",
          }}
        >
          {slides.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex flex-col items-center justify-center"
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt="Slide Image"
                    className="w-[30%] max-w-[30%] object-contain"
                  />
                ) : item.type === "video" ? (
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={item.url}
                    className="w-full max-w-[40%] object-contain"
                    muted
                    playsInline
                    controls
                  />
                ) : null}
                <div className="text-left px-4 w-[30%] max-w-[30%]">
                  {item.title && (
                    <h1
                      className="text-black  text-2xl font-bold mb-4"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                  )}
                  {item.description && (
                    <p
                      className="text-gray-700 text-2xl"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 0 && (
        <div className="absolute bottom-30 z-10 items-center flex flex-col items-center justify-center mt-5 w-full">
          {/* Timeline Dots */}
          <div className="grid grid-cols-5 gap-6 md:gap-4 space-x-[100px]">
            {visibleImages.map((image, index) => {
              const imageIndex = visibleStartIndex + index;
              const isCenterDot = currentIndex === imageIndex;
              return (
                <div key={imageIndex} className="text-center">
                  <p
                    className={`text-sm md:text-lg font-semibold mb-5 ${
                      isCenterDot ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {image.year}
                  </p>
                  <span
                    onClick={() => goToImage(imageIndex)}
                    className={`cursor-pointer block w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full mx-auto transition-all duration-300 ${
                      isCenterDot
                        ? "bg-orange-600 scale-[2] border-2 border-[#C9A65C]"
                        : "bg-orange-600 opacity-75"
                    }`}
                  ></span>
                </div>
              );
            })}
          </div>

          {/* Gradient Line Below Dots */}
          <div
            className="w-full h-1 mt-[-15px]"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(139, 116, 57, 0.7), transparent)",
            }}
          ></div>
        </div>
      )}

      <div className="absolute bottom-5 w-full flex justify-center mr-25 items-center gap-4">
        {/* Go to first slide */}
        <button
          onClick={() => setCurrentIndex(0)}
          className="p-2 text-green-500 font-bold rounded-full hover:bg-green-100 transition"
        >
          <ChevronFirst />
        </button>

        {/* Backward */}
        <button
          onClick={startBackward}
          className="p-2 bg-red-200 text-black font-bold rounded-full hover:bg-red-700 transition rotate-180"
        >
          <FastForward />
        </button>

        <button
          onClick={togglePause}
          className="p-2 bg-gray-200 text-black font-bold rounded-full hover:bg-gray-500 transition"
        >
          {isPaused ? <Play /> : <Pause />}
        </button>

        {/* Forward */}
        <button
          onClick={startForward}
          className="p-2 bg-green-200 text-black font-bold rounded-full hover:bg-green-700 transition"
        >
          <FastForward />
        </button>

        {/* Go to last slide */}
        <button
          onClick={() => setCurrentIndex(slides.length - 1)}
          className="p-2 text-red-500 font-bold rounded-full hover:bg-red-100 transition"
        >
          <ChevronLast />
        </button>
      </div>

      {/* Category Dropdown - LEFT BOTTOM (Scrollable) */}
      <div className="fixed bottom-4 left-4 z-20">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="bg-white p-3 rounded-lg shadow-md border flex items-center justify-center"
        >
          <Menu size={20} />
          <span className="ml-2">Category</span>
        </button>

        {isCategoryOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-52 max-h-60 bg-white shadow-lg rounded-lg border overflow-y-auto">
            <ul className="p-2">
              {categories.map((category, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsCategoryOpen(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Projects Dropdown - RIGHT BOTTOM */}
      <div className="fixed bottom-4 right-4 z-20">
        <button
          onClick={() => setIsProjectOpen(!isProjectOpen)}
          className="bg-white p-3 rounded-lg shadow-md border flex items-center justify-center"
        >
          <span className="mr-2">Topics</span> <Menu size={20} />
        </button>

        {isProjectOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-52 bg-white shadow-lg rounded-lg border">
            <ul className="p-2">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <li
                    key={project._id}
                    onClick={() => {
                      navigate(`/projects/${project._id}/view`);
                      setIsProjectOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {project.projectName}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No projects found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
