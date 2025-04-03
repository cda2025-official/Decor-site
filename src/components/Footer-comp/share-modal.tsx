"use client"

import { X } from "lucide-react"

interface ShareModalProps {
  onClose: () => void
}

export default function ShareModal({ onClose }: ShareModalProps) {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#c6a96c]">
          <X className="h-6 w-6" />
        </button>

        <div className="mb-2">
          <p className="text-[#c6a96c] text-sm font-medium">Tap a link to</p>
          <h2 className="text-2xl font-bold text-gray-800">Open</h2>
        </div>

        <div className="border border-gray-200 rounded-md p-3 flex items-center mt-6">
          <div className="flex items-center space-x-3">
            <div className="text-[#2A777C]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-link"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <a href="https://www.instagram.com/chintamani_decor?igsh=czNlODVkMnBkNXRh
" className="text-gray-800">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  )
}

