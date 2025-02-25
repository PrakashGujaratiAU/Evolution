import { ChevronFirst, ChevronLast, FastForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
const API_BASE_URL = "http://localhost:3001/api";

export default function ProjectView() {
  // Get `id` if you need it from the route params
  const { id } = useParams();

  // State for fetched slides
  const [slides, setSlides] = useState([]);
  const [project, setProject] = useState("");

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
          setProject(data.projectName);
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

  // The rest of your existing carousel states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReverse, setIsReverse] = useState(false);
  const maxVisible = 5;

  // Handle the timing/duration logic
  useEffect(() => {
    // If slides are empty, don't try to access slides[currentIndex]
    if (!slides.length) return;

    const slideDuration = slides[currentIndex]?.duration || 5000;

    const interval = setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (isReverse) {
          return prevIndex === 0 ? slides.length - 1 : prevIndex - 1;
        }
        return (prevIndex + 1) % slides.length;
      });
    }, slideDuration);

    return () => clearTimeout(interval);
  }, [currentIndex, isReverse, slides]);

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

  return (
    <div className="relative w-full flex flex-col justify-center items-center min-h-screen gap-2 mx-auto px-4">
      <h1 className="absolute top-5 text-gray-700 text-center text-lg md:text-xl lg:text-2xl font-bold underline underline-offset-4 decoration-orange">
        A TIMELINE OF EVOLUTION OF{" "}
        <span style={{ color: "blue" }}>{project.toUpperCase()}</span>
      </h1>

      <div className="overflow-hidden w-full h-auto">
        {/* Ensure we only render the slides if slides.length > 0 */}
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
                    className="w-[400px] max-w-[400px]  md:max-w-[600px] lg:max-w-[800px] object-contain"
                  />
                ) : item.type === "video" ? (
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={item.url}
                    className="w-full max-w-[90%] md:max-w-[600px] lg:max-w-[800px] object-contain"
                    muted
                    playsInline
                    controls
                  />
                ) : null}

                {item.description && (
                  <div className="max-w-xs text-left px-4">
                    <p
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 0 && (
        <div className="flex flex-col items-center justify-center mt-5 w-full">
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

      <div className="absolute bottom-5 w-full flex justify-center items-center gap-4">
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
    </div>
  );
}
