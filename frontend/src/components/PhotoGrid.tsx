import { useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from './Lightbox'
import type { Photo } from '@/types'

interface PhotoGridProps {
  photos: Photo[]
  layout?: 'grid' | 'masonry' | 'bento'
}

const PhotoGrid = ({ photos, layout = 'grid' }: PhotoGridProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  if (layout === 'bento') {
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {photos.slice(0, 6).map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl cursor-pointer group img-hover ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              } ${index === 3 ? 'row-span-2' : ''}`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-semibold">{photo.title}</h3>
                  <p className="text-sm text-white/80">{photo.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <Lightbox
          photos={photos}
          currentIndex={currentIndex}
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-xl cursor-pointer aspect-[4/3] img-hover"
            onClick={() => openLightbox(index)}
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-1">{photo.title}</h3>
                <p className="text-sm text-white/80">{photo.category}</p>
                {photo.description && (
                  <p className="text-sm text-white/70 mt-2 line-clamp-2">
                    {photo.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <Lightbox
        photos={photos}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onPrev={goToPrev}
        onNext={goToNext}
      />
    </>
  )
}

export default PhotoGrid
