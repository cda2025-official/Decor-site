"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ImageViewer from "./ImageViewser"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "./Firebase"
import { ChevronDown, Share2, Image, Video, Paperclip, Search } from "lucide-react"

const ITEMS_PER_LOAD = 6

interface GallerySectionProps {
  activeTab: string
}

const GallerySection = ({ activeTab }: GallerySectionProps) => {
  const [allItems, setAllItems] = useState<any[]>([])
  const [displayedItems, setDisplayedItems] = useState<any[]>([])
  const [loadedCount, setLoadedCount] = useState(ITEMS_PER_LOAD)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [galleryFilter, setGalleryFilter] = useState<"images" | "videos">("images")
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const observerRef = useRef<HTMLDivElement | null>(null)
  const [isFormVisible, setFormVisible] = useState(false)
  const [selected, setSelected] = useState("btn1")
  const [isLatestProductsModalOpen, setIsLatestProductsModalOpen] = useState(false)
  const [productSearchQuery, setProductSearchQuery] = useState<string>("")

  const toggleButton = (btnId: string) => {
    setSelected(btnId)
  }
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addInfo: "",
  })
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Add your form submission logic here
    // console.log("Form submitted:", formData)
    // Simulate a submission delay
    await new Promise((resolve) => setTimeout(resolve, 4000))
    setFormVisible(false)
    setFormData({ name: "", email: "", phone: "", addInfo: "" })
    setIsSubmitting(false)
  }

  const productCategories = [
    "All",
    "Flute Story",
    "Crysta",
    "Stencils",
    "Miracco",
    "Iris Club",
    "Artique Panel",
    "Emporio",
    "Pluto",
    "Styrio",
  ]

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  useEffect(() => {
    const fetchGalleryData = async () => {
      let items: any[] = []
      try {
        const querySnapshot = await getDocs(collection(db, "data"))
        const fetched = querySnapshot.docs.map((doc) => doc.data())

        // console.log("Fetched data:", fetched) // Add this log

        if (activeTab === "brochures" && fetched.length > 0) {
          // console.log("Brochure data:", fetched[0]) // Add this log

          if (fetched[0].files) {
            items = fetched[0].files.map((file: any) => ({
              fileUrl: file.url,
              thumbnailUrl: file.thumbnailUrl,
              type: "PDF",
              description: file.title,
              position: file.position || 999,
            }))

            items.sort((a, b) => (a.position || 999) - (b.position || 999))
          } else {
            console.error("No files found in brochure data")
          }
        } else if (activeTab === "products" && fetched.length > 1 && fetched[2].products) {
          items = fetched[2].products.map((product: any) => ({
            title: product.heading,
            description: product.description,
            imageUrl: product.imageUrl,
            price: product.price,
            category: product.category,
            position: product.position || 999,
          }))

          items.sort((a, b) => (a.position || 999) - (b.position || 999))
        } else if (activeTab === "gallery" && fetched.length > 1 && fetched[1].galleryImages) {
          items = fetched[1].galleryImages.map((image: any) => ({
            imageUrl: image.url,
            type: "image",
            position: image.position || 999,
          }))

          items.sort((a, b) => (a.position || 999) - (b.position || 999))
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error)
      }

      setAllItems(items)
      setLoadedCount(ITEMS_PER_LOAD)
      setDisplayedItems(items.slice(0, ITEMS_PER_LOAD))
    }
    fetchGalleryData()

    // Fetch YouTube videos
    const fetchYoutubeVideos = async () => {
      try {
        const videosDocRef = doc(db, "data", "galleryVideos")
        const videosDocSnap = await getDoc(videosDocRef)
        if (videosDocSnap.exists() && videosDocSnap.data().videos) {
          setYoutubeVideos(videosDocSnap.data().videos || [])
        }
      } catch (error) {
        console.error("Error fetching YouTube videos:", error)
      }
    }
    fetchYoutubeVideos()
  }, [activeTab])

  useEffect(() => {
    if (activeTab === "brochures") {
      const filteredItems = allItems.filter(
        (item) => item.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false,
      )
      setDisplayedItems(filteredItems.slice(0, loadedCount))
    } else if (activeTab === "products") {
      // Filter by category and search query
      let filteredItems =
        selectedCategory === "All" ? allItems : allItems.filter((item) => item.category === selectedCategory)

      // Apply search filter if there's a search query
      if (productSearchQuery) {
        filteredItems = filteredItems.filter(
          (item) =>
            item.title?.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(productSearchQuery.toLowerCase()),
        )
      }

      setDisplayedItems(filteredItems.slice(0, loadedCount))
    } else if (activeTab === "gallery") {
      if (galleryFilter === "videos") {
        setDisplayedItems(youtubeVideos.slice(0, loadedCount))
      } else {
        setDisplayedItems(allItems.slice(0, loadedCount))
      }
    } else {
      setDisplayedItems(allItems.slice(0, loadedCount))
    }
  }, [
    selectedCategory,
    galleryFilter,
    allItems,
    youtubeVideos,
    loadedCount,
    activeTab,
    searchQuery,
    productSearchQuery,
  ])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadedCount((prev) => {
            const newCount = prev + ITEMS_PER_LOAD
            if (activeTab === "gallery" && galleryFilter === "videos") {
              setDisplayedItems(youtubeVideos.slice(0, newCount))
            } else {
              setDisplayedItems(allItems.slice(0, newCount))
            }
            return newCount
          })
        }
      },
      { threshold: 1 },
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [allItems, youtubeVideos, activeTab, galleryFilter])

  const handleShare = async (url: string, title = "Check out this brochure") => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        })
        console.log("Shared successfully")
      } catch (error) {
        console.log("Error sharing:", error)
        copyToClipboard(url)
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Link copied to clipboard!")
      })
      .catch((err) => {
        console.error("Could not copy text: ", err)
      })
  }

  const handleGalleryFilterChange = (filter: "images" | "videos") => {
    setGalleryFilter(filter)
    setSelectedVideo(null) // Reset selected video when changing filter
  }

  const renderBrochureCard = (item: any, index: number) => (
    <Card
      className="group overflow-hidden hover:shadow-md transition-all duration-300 border-[#2A777C]/20 "
      data-aos="flip-up"
    >
      <div className="relative">
        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={item.thumbnailUrl || "/placeholder.svg"}
            className="w-full  object-contain "
            alt="Brochure thumbnail"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleShare(item.fileUrl, `Brochure ${index + 1}`)
            }}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#008080]/50 z-0"
            aria-label="Share brochure"
          >
            <Share2 size={18} className="text-[#2A777C]" />
          </button>
        </a>
      </div>
      <CardFooter className="flex justify-between items-center p-4 bg-white">
        <span className="text-sm font-medium">{item.description}</span>
      </CardFooter>
    </Card>
  )

  const renderProductCard = (item: any) => (
    <Card className="group hover:shadow-md transition-all duration-300 border-[#008080]/20 h-full flex flex-col overflow-hidden">
      <div className="relative">
        <div className="flex justify-end absolute top-4 right-4 z-10">
          <button
            className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation()
              handleShare(item.imageUrl, item.title)
            }}
          >
            <Share2 className="w-4 h-4 text-[#008080]" />
          </button>
        </div>
        <img
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-[380px] object-cover transition-transform duration-300 group-hover:scale-105 z-0"
        />
      </div>
      <div className="p-5 flex-grow">
        <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
        {item.description && <p className="text-sm text-gray-600 mt-2">Size - {item.description}</p>}
      </div>
    </Card>
  )

  const renderGalleryCard = (item: any) => (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 border-[#008080]/20">
      <CardContent className="p-0">
        <div className="overflow-hidden aspect-square relative">
          <img
            src={item.imageUrl || "/placeholder.svg"}
            alt="Gallery image"
            className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
            style={{ minHeight: "200px" }} // Increased minimum height for mobile
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
      </CardContent>
    </Card>
  )

  const renderVideoCard = (video: any, index: number) => (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 border-[#008080]/20">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={video.thumbnailUrl || `/placeholder.svg?height=350&width=600`}
            alt={`YouTube video thumbnail ${index + 1}`}
            className="w-full h-[220px] md:h-[350px] object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedVideo(video.id)}
          >
            {/* <div className="w-16 h-16 rounded-full bg-[#2A777C] flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
              <Play className="h-8 w-8 text-white fill-white" />
            </div> */}
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="flex justify-between items-center p-4 bg-white">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2A777C] hover:text-[#D4AF37] flex items-center gap-1 text-sm font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          YouTube <ExternalLink size={14} />
        </a>
      </CardFooter> */}
    </Card>
  )

  // Video Modal Component
  const VideoModal = ({ videoId, onClose }: { videoId: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  )

  const EnquiryForm = () => (
    <div className="mt-16 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-[#2A777C]/10">
      <h2 className="text-xl font-medium mb-6 text-[#2A777C]">Please share following information.</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-4 border border-[#2A777C]/30 rounded-md focus:ring-2 focus:ring-[#2A777C]/50 focus:border-[#2A777C] transition-all duration-300"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-4 border border-[#2A777C]/30 rounded-md focus:ring-2 focus:ring-[#2A777C]/50 focus:border-[#2A777C] transition-all duration-300"
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-4 border border-[#2A777C]/30 rounded-md focus:ring-2 focus:ring-[#2A777C]/50 focus:border-[#2A777C] transition-all duration-300"
          />
        </div>
        <div>
          <textarea
            placeholder="Additional Info"
            value={formData.addInfo}
            onChange={(e) => setFormData({ ...formData, addInfo: e.target.value })}
            className="w-full p-4 border border-[#2A777C]/30 rounded-md focus:ring-2 focus:ring-[#2A777C]/50 focus:border-[#2A777C] h-32 transition-all duration-300"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-white border border-[#2A777C] text-[#2A777C] py-4 rounded-md hover:bg-[#2A777C]/5 transition-all duration-300 font-medium"
          >
            <span className="transform rotate-45">
              <Paperclip className="w-5 h-5" />
            </span>
            ATTACH FILE
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#2A777C] text-white py-4 rounded-md hover:bg-[#D4AF37] transition-all duration-300 font-medium ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div className="py-8 sm:py-4 px-4 max-w-[935px] w-full mx-auto bg-white">
      <div className="container3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabContentVariants}
            className="w-full"
          >
            {activeTab === "brochures" && (
              <div className="mb-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative flex-grow w-full">
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full px-5 py-3 bg-white border border-[#2A777C]/30 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A777C]/50 focus:border-[#2A777C]/50 text-base transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <div className="mb-10">
                <div className="mx-auto space-y-4">
                  {/* Search Bar for Products */}
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-[#008080]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-white border border-[#008080]/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/50 focus:border-[#008080]/50 text-base transition-all duration-300"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="relative group">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="block w-full px-6 py-3 bg-white border-2 border-[#2A777C]/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A777C]/50 focus:border-[#2A777C]/50 appearance-none text-lg font-medium transition-all duration-300 hover:border-[#2A777C]/50"
                    >
                      {productCategories.map((category, index) => (
                        <option key={index} value={category} className="py-2">
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <div className="bg-[#2A777C]/10 rounded-full p-1.5 group-hover:bg-[#2A777C]/20 transition-colors duration-300">
                        <ChevronDown className="h-5 w-5 text-[#2A777C]" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-[#008080]/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="flex justify-center mt-4 gap-1.5">
                    {productCategories.slice(0, 5).map((category) => (
                      <div
                        key={category}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          selectedCategory === category ? "bg-[#2A777C] scale-125" : "bg-gray-300 hover:bg-[#2A777C]/50"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="mb-10">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-[#008080]" />
                    </div>
                  </div>
                </div>
                <div className="flex border border-[#20b2AA] rounded-md overflow-hidden shadow-sm">
                  <button
                    className={`flex-1 py-3 flex items-center justify-center gap-2 ${galleryFilter === "images" ? "bg-[#2A777C] text-white" : "bg-white text-[#2A777C]"} transition-all duration-300 font-medium`}
                    onClick={() => handleGalleryFilterChange("images")}
                  >
                    <Image className="w-5 h-5" />
                    <span className="hidden sm:inline">Images</span>
                  </button>
                  <button
                    className={`flex-1 py-3 flex items-center justify-center gap-2 ${galleryFilter === "videos" ? "bg-[#2A777C] text-white" : "bg-white text-[#2A777C]"} transition-all duration-300 font-medium`}
                    onClick={() => handleGalleryFilterChange("videos")}
                  >
                    <Video className="w-5 h-5" />
                    <span className="hidden sm:inline">Videos</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "products" && <div className="text-center mt-8 mb-10"></div>}

            <motion.div
              className={`grid ${
                activeTab === "gallery"
                  ? galleryFilter === "images"
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3" // 2 columns on mobile for images
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" // 1 column on mobile for videos
                  : activeTab === "brochures"
                    ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3" // 2 columns on mobile for brochures
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              } ${
                activeTab === "gallery" && galleryFilter === "images"
                  ? "gap-1 rounded-none"
                  : "gap-1 md:gap-6 rounded-none"
              }`}
              variants={tabContentVariants}
            >
              {displayedItems.length > 0
                ? displayedItems.map((item, index) => (
                    <motion.div
                      key={index}
                      onClick={() =>
                        item.imageUrl && !("fileUrl" in item) && !("id" in item) && setSelectedImageIndex(index)
                      }
                      variants={itemVariants}
                      className="relative"
                    >
                      {"fileUrl" in item
                        ? renderBrochureCard(item, index)
                        : "id" in item
                          ? renderVideoCard(item, index)
                          : activeTab === "products"
                            ? renderProductCard(item)
                            : renderGalleryCard(item)}
                    </motion.div>
                  ))
                : activeTab === "gallery" &&
                  galleryFilter === "videos" &&
                  youtubeVideos.length === 0 && (
                    <motion.div variants={itemVariants} className="col-span-full text-center py-12">
                      <Video size={48} className="mx-auto text-[#2A777C]/50 mb-4" />
                      <h3 className="text-xl font-medium text-[#2A777C]">No videos available</h3>
                      <p className="text-gray-500 mt-2">No videos have been added to the gallery yet.</p>
                    </motion.div>
                  )}
            </motion.div>

            {selectedImageIndex !== null && activeTab !== "brochures" && (
              <ImageViewer
                images={displayedItems.map((item) => item.imageUrl).filter(Boolean) || ["/placeholder.svg"]}
                initialIndex={selectedImageIndex}
                isOpen={selectedImageIndex !== null}
                onClose={() => setSelectedImageIndex(null)}
              />
            )}

            {selectedVideo && <VideoModal videoId={selectedVideo} onClose={() => setSelectedVideo(null)} />}

            <div ref={observerRef} className="h-10 w-full"></div>
            {activeTab === "enquiry" && <EnquiryForm />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Latest Products Button */}
    </div>
  )
}

export default GallerySection

