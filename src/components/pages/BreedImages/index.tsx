import { useEffect, useState } from 'react'
import VirtualImageGrid from '@/components/common/VirtualImageGrid'
import ImageCarousel from '@/components/common/ImageCarousel'
import { useRouter } from 'next/router'

interface BreedImagesProps {
  imagesFromServer: string[]
}

export default function Home({ imagesFromServer }: BreedImagesProps) {
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [showCarousel, setShowCarousel] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()
  const { id: breedOnQuery } = router.query

  // 獲取選定品種的圖片
  useEffect(() => {
    const fetchImages = async () => {
      if (!selectedBreed) return

      try {
        const response = await fetch(`https://dog.ceo/api/breed/${selectedBreed}/images/random/50`)
        const data = await response.json()
        setImages(data.message)
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }

    fetchImages()
  }, [selectedBreed])

  useEffect(() => {
    console.log('breedOnQuery', breedOnQuery)
    console.log('router', router)
    setSelectedBreed(breedOnQuery as string)
  }, [breedOnQuery])

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
    setShowCarousel(true)
  }

  const handleCloseCarousel = () => {
    setShowCarousel(false)
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleBackToBreedList = () => {
    router.push('/')
  }

  return (
    <main className='min-h-screen bg-gray-50'>
      {selectedBreed && (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='mb-6'>
            <button onClick={handleBackToBreedList} className='inline-flex items-center text-gray-600 hover:text-gray-900'>
              <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
              <span className='hidden sm:inline'>返回品種列表</span>
            </button>
          </div>
          <VirtualImageGrid images={images} breedName={selectedBreed} onImageClick={handleImageClick} />
        </div>
      )}

      {showCarousel && (
        <ImageCarousel
          images={images}
          currentIndex={currentImageIndex}
          breedName={selectedBreed || ''}
          onClose={handleCloseCarousel}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
        />
      )}
    </main>
  )
}
