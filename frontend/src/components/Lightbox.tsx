import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Photo } from '@/types'

interface LightboxProps {
  photos: Photo[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const Lightbox = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [isOpen, onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const currentPhoto = photos[currentIndex]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="关闭"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* 上一张按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="上一张"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      {/* 下一张按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="下一张"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* 图片容器 */}
      <div
        className="max-w-6xl max-h-[85vh] px-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentPhoto.imageUrl}
          alt={currentPhoto.title}
          className="max-w-full max-h-[75vh] object-contain rounded-lg"
        />
        {/* 图片信息 */}
        <div className="mt-4 text-center text-white">
          <h3 className="text-xl font-semibold mb-1">{currentPhoto.title}</h3>
          {currentPhoto.description && (
            <p className="text-white/70">{currentPhoto.description}</p>
          )}
          <p className="text-sm text-white/50 mt-2">
            {currentIndex + 1} / {photos.length}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Lightbox
