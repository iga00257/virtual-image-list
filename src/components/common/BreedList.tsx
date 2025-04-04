interface Breed {
  name: string
  subBreeds: string[]
}

interface BreedListProps {
  breeds: Breed[]
  onBreedSelect: (breedName: string) => void
}

export default function BreedList({ breeds, onBreedSelect }: BreedListProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {breeds.map((breed) => (
        <button
          key={breed.name}
          onClick={() => onBreedSelect(breed.name)}
          className='p-4 border rounded-lg hover:bg-gray-100 transition-colors text-left'
        >
          <h2 className='text-xl font-semibold capitalize'>{breed.name}</h2>
          {breed.subBreeds.length > 0 && <p className='text-sm text-gray-600'>子品種: {breed.subBreeds.length}</p>}
        </button>
      ))}
    </div>
  )
}
