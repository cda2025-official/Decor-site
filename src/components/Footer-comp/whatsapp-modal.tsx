"use client"

import { X } from "lucide-react"

interface WhatsAppModalProps {
  onClose: () => void
}

export default function WhatsAppModal({ onClose }: WhatsAppModalProps) {
  const phoneNumber = "+91 9970756249"

  const handleWhatsAppClick = () => {
    // Format phone number for WhatsApp link (remove spaces and special characters)
    const formattedNumber = phoneNumber.replace(/\s+/g, "").replace(/[^0-9+]/g, "")
    window.open(`https://wa.me/${formattedNumber}`, "_blank")
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#c6a96c]">
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <p className="text-[#c6a96c] text-sm font-medium">Just tap to</p>
          <h2 className="text-2xl font-bold text-gray-800">WhatsApp</h2>
        </div>

        <div
          className="bg-green-500 text-white rounded-md p-4 flex justify-between items-center cursor-pointer"
          onClick={handleWhatsAppClick}
        >
          <span>Office Enquiry:</span>
          <span>{phoneNumber}</span>
        </div>
      </div>
    </div>
  )
}

