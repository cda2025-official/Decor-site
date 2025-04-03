"use client"

import { X } from "lucide-react"

interface EmailModalProps {
  onClose: () => void
}

export default function EmailModal({ onClose }: EmailModalProps) {
  const email = "chintamanidecorshowroom@gmail.com"

  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#c6a96c]">
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <p className="text-[#c6a96c] text-sm font-medium">Just tap to</p>
          <h2 className="text-2xl font-bold text-gray-800">Email Now</h2>
        </div>

        <div
          className="bg-[#2A777C] text-white rounded-md p-4 flex justify-between items-center cursor-pointer"
          onClick={handleEmailClick}
        >
          <span>Direct</span>
          <span>{email}</span>
        </div>
      </div>
    </div>
  )
}

