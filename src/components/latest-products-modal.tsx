"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { doc, getDoc } from "firebase/firestore"
import { db } from "./Firebase"

interface LatestProduct {
  url: string
  caption: string
  uploadedAt: string
}

export function LatestProductsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [latestProducts, setLatestProducts] = useState<LatestProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<LatestProduct | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, "data", "adminImages")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists() && docSnap.data().latestImages) {
          setLatestProducts(docSnap.data().latestImages || [])
        }
      } catch (error) {
        console.error("Error fetching latest products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchLatestProducts()
    }
  }, [isOpen])

  const handleImageClick = (product: LatestProduct, index: number) => {
    setSelectedImage(product)
    setSelectedImageIndex(index)
  }

  const navigateImages = (direction: "prev" | "next") => {
    if (!selectedImage || latestProducts.length === 0) return

    let newIndex
    if (direction === "prev") {
      newIndex = (selectedImageIndex - 1 + latestProducts.length) % latestProducts.length
    } else {
      newIndex = (selectedImageIndex + 1) % latestProducts.length
    }

    setSelectedImage(latestProducts[newIndex])
    setSelectedImageIndex(newIndex)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (selectedImage) {
              setSelectedImage(null)
            } else {
              onClose()
            }
          }}
        >
          <motion.div
            className="relative w-full max-w-5xl bg-white rounded-xl overflow-hidden max-h-[90vh]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Only show the main close button when no image is selected */}
            {!selectedImage && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="p-6 bg-[#2A777C] text-white">
              <h2 className="text-2xl font-bold text-center">Latest Products</h2>
              <p className="text-white/80 text-center">Discover our newest additions</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
              </div>
            ) : latestProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center p-6">
                <p className="text-xl font-medium text-gray-700">No latest products available</p>
                <p className="text-gray-500 mt-2">Check back soon for new additions</p>
              </div>
            ) : (
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestProducts.map((product, index) => (
                    <motion.div
                      key={index}
                      className="group relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleImageClick(product, index)}
                    >
                      <div className="aspect-[4/3]">
                        <img
                          src={product.url || "/placeholder.svg?height=300&width=400"}
                          alt={product.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white text-sm font-medium line-clamp-2">{product.caption}</p>
                        <p className="text-white/70 text-xs mt-1">
                          {product.uploadedAt ? new Date(product.uploadedAt).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {selectedImage && (
              <motion.div
                className="fixed inset-0 z-60 flex items-center justify-center bg-black/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(null)
                }}
              >
                <motion.div
                  className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImage(null)
                    }}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateImages("prev")
                    }}
                    className="absolute left-4 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>

                  <img
                    src={selectedImage.url || "/placeholder.svg"}
                    alt={selectedImage.caption}
                    className="max-w-full max-h-full object-contain"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateImages("next")
                    }}
                    className="absolute right-4 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-200"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white text-lg font-medium">{selectedImage.caption}</p>
                    <p className="text-white/70 text-sm mt-1">
                      {selectedImage.uploadedAt ? new Date(selectedImage.uploadedAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function FloatingLatestProductsButton({
  onClick,
}: {
  onClick: () => void
}) {
  return (
    <motion.button
      id="btn-click"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#C6A96C] text-white p-3 rounded-l-xl hover:bg-[#B8860B] transition-colors duration-300 shadow-md"
      // whileHover={{ x: -3 }}
      // whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <span className="text-xs font-medium mb-1 whitespace-nowrap">Latest</span>
        <span className="text-xs font-medium whitespace-nowrap">Products</span>
      </div>
    </motion.button>
  )
}


