"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import BreedList from "@/components/BreedList";
import VirtualImageGrid from "@/components/VirtualImageGrid";
import ImageCarousel from "@/components/ImageCarousel";

interface Breed {
  name: string;
  subBreeds: string[];
}

export default function Home() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  // 獲取所有品種列表
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();
        const breedsList = Object.entries(data.message).map(
          ([name, subBreeds]) => ({
            name,
            subBreeds: subBreeds as string[],
          })
        );
        setBreeds(breedsList);
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };

    fetchBreeds();
  }, []);

  // 獲取選定品種的圖片
  useEffect(() => {
    const fetchImages = async () => {
      if (!selectedBreed) return;

      try {
        const response = await fetch(
          `https://dog.ceo/api/breed/${selectedBreed}/images/random/50`
        );
        const data = await response.json();
        setImages(data.message);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [selectedBreed]);

  const handleBreedSelect = (breed: string) => {
    setSelectedBreed(breed);
    setShowDropdown(false);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowCarousel(true);
  };

  const handleCloseCarousel = () => {
    setShowCarousel(false);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setShowDropdown(false);
  };

  const filteredBreeds = breeds.filter((breed) =>
    breed.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {!selectedBreed ? (
        <>
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h1 className="sm:block text-xl font-semibold text-gray-900">
                    可愛狗狗圖庫
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onSearchClear={handleSearchClear}
              showDropdown={showDropdown}
              filteredBreeds={filteredBreeds}
              onBreedSelect={handleBreedSelect}
            />
            <BreedList
              breeds={filteredBreeds}
              onBreedSelect={handleBreedSelect}
            />
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <button
              onClick={() => setSelectedBreed(null)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">返回品種列表</span>
            </button>
          </div>
          <VirtualImageGrid
            images={images}
            breedName={selectedBreed}
            onImageClick={handleImageClick}
          />
        </div>
      )}

      {showCarousel && (
        <ImageCarousel
          images={images}
          currentIndex={currentImageIndex}
          breedName={selectedBreed || ""}
          onClose={handleCloseCarousel}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
        />
      )}
    </main>
  );
}
