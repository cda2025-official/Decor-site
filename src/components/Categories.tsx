"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { getDocs, collection } from "firebase/firestore"
import { db } from "./Firebase"
import { useState, useEffect, useRef } from "react"
import ImageViewer from "./ImageViewser" // Fixed typo in import
import CompanyProfile from "./Profile"
import { FloatingLatestProductsButton,LatestProductsModal } from "./latest-products-modal"
// Define brand names to match exactly with Firestore data
const BRAND_NAMES = ["Laminates", "Wall panelling", "Rafter", "CD Exclusive", "Exterior"]

const Categories = () => {
  const [brandImages, setBrandImages] = useState<string[]>([])
  const [brandImagesWithName, setBrandImagesWithName] = useState<{ [key: string]: string[] }>({})
  const [loading, setLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLatestProductsModalOpen, setIsLatestProductsModalOpen] = useState(false)
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, "data"))

        if (!querySnapshot.empty) {
          const fetchedData = querySnapshot.docs.map((doc) => doc.data())
          // console.log("Fetched data:", fetchedData)

          // Set brandImages (for logos)
          if (fetchedData[1]?.brandImages && Array.isArray(fetchedData[1].brandImages)) {
            setBrandImages(fetchedData[1].brandImages)
          } else {
            console.warn("brandImages not found or not an array in fetched data")
          }

          // Transform brandImagesWithName array into an object
          if (fetchedData[1]?.brandImagesWithName && Array.isArray(fetchedData[1].brandImagesWithName)) {
            const transformedData = fetchedData[1].brandImagesWithName.reduce(
              (acc, item) => {
                if (item.brandName) {
                  if (!acc[item.brandName]) {
                    acc[item.brandName] = []
                  }
                  if (item.url) {
                    acc[item.brandName].push(item.url)
                  }
                }
                return acc
              },
              {} as { [key: string]: string[] },
            )

            setBrandImagesWithName(transformedData)
            // console.log("Transformed brand images:", transformedData)
          } else {
            console.warn("brandImagesWithName not found or not an array in fetched data")
          }
        } else {
          setError("No data found in Firestore collection")
          console.warn("No data found in Firestore collection")
        }
      } catch (error) {
        console.error("Error fetching brand images:", error)
        setError("Failed to fetch data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryData()
  }, [])

  const placeholderImage =
    "https://img.freepik.com/premium-vector/test-time-concept-clipboard-with-dough-form-pencil-stopwatch-vector-filling-writing-tests_153097-6256.jpg"

  // Create categories based on BRAND_NAMES
  const categories = BRAND_NAMES.map((brandName, index) => ({
    name: brandName,
    logo: brandImages[index] || placeholderImage, // Use brandImages for logos
  }))

  // Filter images based on the selected brand name
  const filteredImages = selectedBrand ? brandImagesWithName[selectedBrand] || [] : []

  const handleBrandClick = (brandName: string) => {
    if (!isDragging) {
      setSelectedBrand(brandName)
      // console.log(brandName)
    }
  }

  // Mouse drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    const carousel = carouselRef.current
    if (!carousel) return

    setIsDragging(false)
    const startX = e.pageX - carousel.offsetLeft
    const scrollLeft = carousel.scrollLeft

    const handleMouseMove = (e: MouseEvent) => {
      setIsDragging(true)
      const x = e.pageX - carousel.offsetLeft
      const walk = (x - startX) * 2 // Scroll-fast
      carousel.scrollLeft = scrollLeft - walk
    }

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      // Reset dragging state after a short delay to allow click events
      setTimeout(() => {
        setIsDragging(false)
      }, 100)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  // Touch events for mobile scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    const carousel = carouselRef.current
    if (!carousel) return

    setIsDragging(false)
    const touchX = e.touches[0].clientX
    const scrollLeft = carousel.scrollLeft

    const handleTouchMove = (e: TouchEvent) => {
      setIsDragging(true)
      const x = e.touches[0].clientX
      const walk = (touchX - x) * 1.5 // Adjust sensitivity for touch
      carousel.scrollLeft = scrollLeft + walk
      // Prevent page scrolling while swiping the carousel
      e.preventDefault()
    }

    const handleTouchEnd = () => {
      carousel.removeEventListener("touchmove", handleTouchMove as unknown as EventListener)
      carousel.removeEventListener("touchend", handleTouchEnd)
      // Reset dragging state after a short delay to allow tap events
      setTimeout(() => {
        setIsDragging(false)
      }, 100)
    }

    carousel.addEventListener("touchmove", handleTouchMove as unknown as EventListener, { passive: false })
    carousel.addEventListener("touchend", handleTouchEnd)
  }

  return (
    <>
      <div className="bg-white max-w-[935px] w-full mx-auto rounded-t-[20px]" style={{ border: "none" }}>
      <FloatingLatestProductsButton onClick={() => setIsLatestProductsModalOpen(true)} />
    
    <LatestProductsModal isOpen={isLatestProductsModalOpen} onClose={() => setIsLatestProductsModalOpen(false)} />
        <CompanyProfile />
        <div className="container2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <div
              className="overflow-x-auto no-scrollbar mx-auto touch-pan-x"
              style={{
                boxShadow: "none",
                WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
                scrollbarWidth: "none", // Hide scrollbar in Firefox
                msOverflowStyle: "none", // Hide scrollbar in IE/Edge
              }}
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <div className="flex md:py-3 py-5 gap-2 sm:gap-32 px-2 min-w-max md:ml-9 sm:px-0">
                {categories.map((category, index) => (
                  <motion.div
                    key={`${category.name}-${index}`}
                    className="flex flex-col items-center cursor-pointer mx-2 sm:mx-6"
                    onClick={() => handleBrandClick(category.name)}
                  >
                    <div
                      className="category-card w-20 h-20 flex items-center justify-center bg-[#2A777C] rounded-full overflow-hidden"
                      style={{ minWidth: "80px", minHeight: "80px" }}
                    >
                      <div className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <img
                          src={category.logo || placeholderImage}
                          alt={category.name}
                          className="w-full h-full object-contain p-1"
                          draggable="false"
                          onError={(e) => {
                            e.currentTarget.src = placeholderImage
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Image Viewer */}
          <ImageViewer
            images={filteredImages}
            initialIndex={0}
            onClose={() => setSelectedBrand(null)}
            isOpen={!!selectedBrand}
          />
        </div>
      </div>
    </>
  )
}

export default Categories

