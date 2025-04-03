"use client"

import { X } from "lucide-react"
import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/components/Firebase" // Adjust the import path as necessary

interface VCardModalProps {
  onClose: () => void
  companyInfo: {
    name: string
    phone: string
    email?: string
    address?: string
    website?: string
    logo?: string
    position?: string
  }
}

export default function VCardModal({
  onClose,
  companyInfo = {
    name: "Chintamani Decor",
    phone: "+91 9970756249",
    email: "chintamanidecorshowroom@gmail.com",
    address: "Shop No 107, Chintamani Decor, New Timber Market, Bhavani Peth, Pune Maharashtra, 411042",
  },
}: VCardModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generateVCard = () => {
    // Create vCard format
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${companyInfo.name}
TEL;TYPE=WORK,VOICE:${companyInfo.phone}
${companyInfo.email ? `EMAIL;TYPE=WORK:${companyInfo.email}` : ""}
${companyInfo.address ? `ADR;TYPE=WORK:;;${companyInfo.address}` : ""}
REV:${new Date().toISOString()}
END:VCARD`

    return vcard
  }

  const downloadVCard = () => {
    const vCardContent = generateVCard()
    const blob = new Blob([vCardContent], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${companyInfo.name.replace(/\s+/g, "_")}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownload = async () => {
    if (!name || !phone) return

    setIsSubmitting(true)

    try {
      // Add the form data to Firestore
      const visitorData = {
        name,
        phone,
        createdAt: new Date().toISOString(),
      }

      await addDoc(collection(db, "visitors"), visitorData)

      // Mark as completed in localStorage
      localStorage.setItem("welcomeFormFilled", "true")
      localStorage.setItem("visitorName", name)
      localStorage.setItem("visitorPhone", phone)

      // Generate and download the vCard
      downloadVCard()

      // Log and close the modal
      console.log("Downloaded vCard for", companyInfo.name)
      onClose()
    } catch (error) {
      console.error("Error saving visitor data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-xl w-full max-w-md p-6 relative mx-4 z-30">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#c6a96c]">
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <p className="text-[#c6a96c] text-sm font-medium">Download vCard</p>
          <h2 className="text-2xl font-bold text-gray-800">Share your details</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center bg-white rounded-md p-3 border border-gray-200">
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
              className="h-5 w-5 text-gray-400 mr-3"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input
              type="text"
              placeholder="Your Name"
              className="flex-1 outline-none text-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="text-gray-300 text-sm">(required)</span>
          </div>

          <div className="flex items-center bg-white rounded-md p-3 border border-gray-200">
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
              className="h-5 w-5 text-gray-400 mr-3"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <input
              type="text"
              placeholder="Mobile number with country code"
              className="flex-1 outline-none text-gray-800"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <span className="text-gray-300 text-sm">(required)</span>
          </div>

          <div className="flex space-x-4 mt-6">
            <button onClick={onClose} className="flex-1 bg-gray-400 text-white py-3 rounded-md font-medium">
              Skip
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 bg-[#2A777C] text-white py-3 rounded-md font-medium"
              disabled={!name || !phone || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Download vCard"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

