import { useState } from "react";
import SearchBar from "@/components/common/SearchBar";
import BreedList from "@/components/common/BreedList";
import { useRouter } from "next/router";

interface Breed {
  name: string;
  subBreeds: string[];
}

interface HomeProps {
  breeds: Breed[];
}

export default function Home({ breeds }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleBreedSelect = (breed: string) => {
    setShowDropdown(false);
    router.push(`${breed}/images`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setShowDropdown(false);
  };

  const filteredBreeds = breeds
    .filter((breed) =>
      breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-gray-50">
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
    </main>
  );
}
