import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  currentIndex: number;
  breedName: string;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ImageCarousel({
  images,
  currentIndex,
  breedName,
  onClose,
  onNext,
  onPrevious,
}: ImageCarouselProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-xl sm:text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        ✕
      </button>
      <button
        onClick={onPrevious}
        className="absolute left-2 sm:left-4 text-white text-2xl sm:text-4xl p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        ‹
      </button>
      <div className="relative w-full h-[60vh] sm:h-[80vh] max-w-4xl mx-4">
        <Image
          src={images[currentIndex]}
          alt={`${breedName} dog ${currentIndex + 1}`}
          fill
          className="object-contain"
        />
      </div>
      <button
        onClick={onNext}
        className="absolute right-2 sm:right-4 text-white text-2xl sm:text-4xl p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        ›
      </button>
    </div>
  );
}
