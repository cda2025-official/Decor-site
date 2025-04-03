"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingScreenProps {
  duration?: number
  children: React.ReactNode
}

export default function LoadingScreen({ duration = 2000, children }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  return (
    <div className="relative w-full h-full">
      {/* Always render children so the website runs in the background */}
      <div className={isLoading ? "blur-sm" : ""}>
        {children}
      </div>
      
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-50"
          >
            {/* New loading spinner */}
            <div className="loadingspinner">
              <div id="square1" className="square"></div>
              <div id="square2" className="square"></div>
              <div id="square3" className="square"></div>
              <div id="square4" className="square"></div>
              <div id="square5" className="square"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
