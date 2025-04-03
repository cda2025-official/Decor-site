"use client"

import type React from "react"
import { Img } from "react-image"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface ImageViewerProps {
  images: string[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

const ImageViewer = ({ images, initialIndex = 0, isOpen, onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isLoading, setIsLoading] = useState(true)

  // Reset current index when images change
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [images, initialIndex])

  // Reset loading state when current image changes
  useEffect(() => {
    setIsLoading(true)
  }, [currentIndex])

  if (!isOpen || images.length === 0) return null

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious()
    if (e.key === "ArrowRight") handleNext()
    if (e.key === "Escape") onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            onClick={onClose}
          >
            <X className="w-6 h-6 relative top-7" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main image */}
          <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <Img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                onClick={handleNext}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ImageViewer

