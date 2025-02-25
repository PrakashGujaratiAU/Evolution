import { ChevronFirst, ChevronLast, FastForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { timages } from "./data";

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReverse, setIsReverse] = useState(false);
  const maxVisible = 5;
  const totalDots = timages.length;

  useEffect(() => {
    const slideDuration = timages[currentIndex]?.duration || 5000;

    const interval = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        isReverse
          ? prevIndex === 0
            ? timages.length - 1
            : prevIndex - 1
          : (prevIndex + 1) % timages.length
      );
    }, slideDuration);

    return () => clearTimeout(interval);
  }, [currentIndex, isReverse]);

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const videoRefs = useRef([]);
  if (!videoRefs.current) videoRefs.current = [];

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

  const visibleStartIndex = Math.max(
    0,
    currentIndex - Math.floor(maxVisible / 2)
  );
  const visibleEndIndex = visibleStartIndex + maxVisible;
  const visibleImages = timages.slice(visibleStartIndex, visibleEndIndex);

  const startForward = () => {
    setIsReverse(false);
    setCurrentIndex(0);
  };

  const startBackward = () => {
    setIsReverse(true);
    setCurrentIndex(timages.length - 1);
  };

  return (
    <div className="relative w-full flex flex-col justify-center items-center min-h-screen gap-2 mx-auto px-4">
      <h1 className="absolute top-5 text-gray-700 text-center text-lg md:text-xl lg:text-2xl font-bold underline underline-offset-4 decoration-orange">
        A TIMELINE OF EVOLUTION
      </h1>

      <div className="flex justify-between w-full max-w-6xl px-4">
        <button
          onClick={startForward}
          className="p-2 bg-green-200 text-black font-bold rounded-full hover:bg-green-700 transition"
        >
          <FastForward />
        </button>
        <button
          onClick={startBackward}
          className="p-2 bg-red-200 text-black font-bold rounded-full hover:bg-red-700 transition rotate-180"
        >
          <FastForward />
        </button>
      </div>

      <div className="overflow-hidden w-full h-auto">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {timages.map((item, index) => (
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

      <button
        onClick={() => setCurrentIndex(0)}
        className="absolute bottom-5 left-4 p-2 text-green-500 font-bold rounded-full hover:bg-green-100 transition"
      >
        <ChevronFirst />
      </button>

      <button
        onClick={() => setCurrentIndex(timages.length - 1)}
        className="absolute bottom-5 right-4 p-2 text-red-500 font-bold rounded-full hover:bg-red-100 transition"
      >
        <ChevronLast />
      </button>
    </div>
  );
}
