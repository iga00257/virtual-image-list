import { useRef } from "react";
import Image from "next/image";

// types

// Libs
import handleImageBlur from "@/methods/handleImageBlur";

interface ICarousel {
  images: string[];
  breedName?: string;
  currentIndex?: number;
  onClose?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

const Carousel = ({
  images = [],
  breedName = "product",
  currentIndex = 0,
  onClose = () => {},
  onPrevious = () => {},
  onNext = () => {},
}: ICarousel) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-xl sm:text-2xl p-2 hover:bg-white/10 rounded-full transition-colors z-50 cursor-pointer"
      >
        ✕
      </button>
      <div className="relative w-4/5 max-w-4xl">
        <button
          onClick={onPrevious}
          className="absolute -left-8 text-white text-2xl sm:text-4xl top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors z-50 cursor-pointer"
        >
          ‹
        </button>
        <div className="overflow-hidden">
          <div
            ref={containerRef}
            className="flex w-full h-[60vh] sm:h-[80vh] transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className=" w-full h-full flex-shrink-0">
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={`${breedName} ${index + 1}`}
                    fill
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL={handleImageBlur()}
                    priority={index === currentIndex}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onNext}
          className="absolute -right-8 top-1/2 -translate-y-1/2 text-white text-2xl sm:text-4xl p-2 hover:bg-white/10 rounded-full transition-colors z-50 cursor-pointer"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Carousel;
