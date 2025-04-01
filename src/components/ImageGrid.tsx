import Image from "next/image";

interface ImageGridProps {
  images: string[];
  breedName: string;
  onImageClick: (index: number) => void;
}

export default function ImageGrid({
  images,
  breedName,
  onImageClick,
}: ImageGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4">
      {images.map((image, index) => (
        <div
          key={image}
          className="relative aspect-square cursor-pointer"
          onClick={() => onImageClick(index)}
        >
          <Image
            src={image}
            alt={`${breedName} dog ${index + 1}`}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
}
