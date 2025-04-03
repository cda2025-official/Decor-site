"use client"

import { useEffect, useState } from "react"

interface ImageOptimizerProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  onClick?: () => void
}

const ImageOptimizer = ({ src, alt, width = 400, height = 400, className = "", onClick }: ImageOptimizerProps) => {
  const [imageSrc, setImageSrc] = useState<string>("/placeholder.svg")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (!src) {
      setImageSrc("/placeholder.svg")
      setIsLoading(false)
      return
    }

    // Create a new image
    const img = new Image()

    // Add width parameter to optimize image loading
    let optimizedSrc = src

    // For Firebase Storage URLs, we can add resize parameters
    if (src.includes("firebasestorage.googleapis.com")) {
      // Extract the token part from the URL if it exists
      const tokenMatch = src.match(/token=([^&]+)/)
      const token = tokenMatch ? tokenMatch[1] : ""

      // Add width parameter to the URL
      optimizedSrc = `${src}${src.includes("?") ? "&" : "?"}width=${width}&token=${token}`
    }

    img.src = optimizedSrc

    setIsLoading(true)

    img.onload = () => {
      setImageSrc(optimizedSrc)
      setIsLoading(false)
      setError(false)
    }

    img.onerror = () => {
      // If optimized version fails, try original
      if (optimizedSrc !== src) {
        const originalImg = new Image()
        originalImg.src = src

        originalImg.onload = () => {
          setImageSrc(src)
          setIsLoading(false)
          setError(false)
        }

        originalImg.onerror = () => {
          setImageSrc("/placeholder.svg")
          setIsLoading(false)
          setError(true)
        }
      } else {
        setImageSrc("/placeholder.svg")
        setIsLoading(false)
        setError(true)
      }
    }
  }, [src, width])

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        loading="lazy"
      />
    </div>
  )
}

export default ImageOptimizer

