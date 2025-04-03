"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "./Firebase"
import { X } from "lucide-react"

interface FormData {
  name: string
  phone: string
  createdAt: Date
}

export default function WelcomeForm() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    createdAt: new Date(),
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if the user has already filled the form
    const hasFilledForm = localStorage.getItem("welcomeFormFilled")

    if (!hasFilledForm) {
      // Show the form after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.phone.trim()) return

    setIsSubmitting(true)

    try {
      // Add the form data to Firestore
      const visitorData = {
        ...formData,
        createdAt: new Date().toISOString(),
      }

      await addDoc(collection(db, "visitors"), visitorData)

      // Mark as completed in localStorage
      localStorage.setItem("welcomeFormFilled", "true")
      localStorage.setItem("visitorName", formData.name)
      localStorage.setItem("visitorPhone", formData.phone)

      // Close the form
      setIsVisible(false)
    } catch (error) {
      console.error("Error saving visitor data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full relative animate-fadeIn p-8">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-[#B08B57] hover:text-[#8B6D3F] transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-[#B08B57]">Want a call back?</h3>
            <h2 className="text-2xl font-semibold text-gray-900 mt-1">Share your details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B08B57] focus:border-transparent placeholder-gray-400"
                placeholder="Your Name"
                required
              />
              <span className="text-xs text-gray-400 ml-2">(required)</span>
            </div>

            <div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B08B57] focus:border-transparent placeholder-gray-400"
                placeholder="Mobile number with country code"
                required
              />
              <span className="text-xs text-gray-400 ml-2">(required)</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#B08B57] text-white rounded-lg hover:bg-[#8B6D3F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B08B57] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Call back
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

