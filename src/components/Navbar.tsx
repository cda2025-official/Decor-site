"use client"

import { useState } from "react"
import { Share, MapPin, Phone, X, Send } from "lucide-react"

export default function Navbar() {
  const [activeCard, setActiveCard] = useState<"qr" | "phone" | "map" | null>(null)
  const [activeTab, setActiveTab] = useState('send');
  const toggleCard = (card: "qr" | "phone" | "map") => {
    setActiveCard(activeCard === card ? null : card)
  }

  const closeCard = () => {
    setActiveCard(null)
  }

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 backdrop-blur-md bg-white/50 dark:bg-gray-900/50 dark:border-gray-700 max-w-[935px] w-full sm:w-screen mx-auto h-[40px] z-0">
        <div className="max-w-[935px] w-full mx-auto p-2 flex justify-between items-center">
          <a  className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold text-gray-700">
              <Share className="cursor-pointer" onClick={() => toggleCard("qr")} />
            </span>
          </a>

          <div className="flex space-x-4 text-gray-700">
            <a className="cursor-pointer" onClick={() => toggleCard("phone")}>
              <Phone />
            </a>
            <a className="cursor-pointer text-gray-700" onClick={() => toggleCard("map")}>
              <MapPin />
            </a>
          </div>
        </div>
      </nav>

      {/* QR Code Card */}
    {/* QR Code Card */}
    {activeCard === "qr" && (
  <div className="max-w-[935px] mx-auto mt-10 bg-white rounded-lg shadow-lg p-6 fixed bottom-0 left-0 right-0">
    <div className="flex justify-between items-center">
      {/* <h1 className="text-lg font-bold text-[#2A777C]">Send directly or Scan</h1> */}
      <button onClick={closeCard} className="text-[#2A777C] text-2xl">
         <X />
      </button>
    </div>
    <h2 className="text-3xl font-bold mt-2">Number / QR Code</h2>
    <div className="mt-6">
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "send" ? "text-white bg-[#2A777C]" : "text-[#2A777C] bg-white"
          } rounded-t-lg`}
          onClick={() => setActiveTab("send")}
        >
          <i className="fas fa-paper-plane"></i> Send
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "profile" ? "text-white bg-[#2A777C]" : "text-[#2A777C] bg-white"
          } border-l border-r border-gray-200`}
          onClick={() => setActiveTab("profile")}
        >
          <i className="fas fa-user"></i> Profile
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "vcard" ? "text-white bg-[#2A777C]" : "text-[#2A777C] bg-white"
          } rounded-t-lg`}
          onClick={() => setActiveTab("vcard")}
        >
          <i className="fas fa-qrcode"></i> vCard
        </button>
      </div>
      {activeTab === "send" && (
        <div className="mt-4">
          <div>
            <label className="block text-gray-700">WhatsApp Number (with country code)</label>
            <div className="flex items-center border border-gray-300 rounded-lg mt-2">
              <i className="fab fa-whatsapp text-green-500 p-2"></i>
              <input
                className="flex-1 p-2 outline-none"
                placeholder="Enter the number you want to send to"
                type="text"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Some Details</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg mt-2"
              placeholder="Helps to shorten the initial discussion."
            ></textarea>
          </div>
          <div className="mt-6">
            <button className="w-full py-3 text-white bg-green-500 rounded-lg">Send via my WhatsApp</button>
          </div>
          <div className="mt-4">
            <button className="w-full py-3 text-white bg-[#2A777C] rounded-lg">Send using other App</button>
          </div>
        </div>
      )}
      {activeTab === "profile" && (
        <div className="mt-4">
          <img
            alt="Profile tab content image"
            className="w-[300px] rounded-lg mx-auto"
            height="200"
            src="https://placehold.co/600x400"
            width="200"
          />
        </div>
      )}
      {activeTab === "vcard" && (
        <div className="mt-4">
          <img
            alt="vCard tab content image"
              className="w-[300px] rounded-lg mx-auto"
            height="200"
            src="https://i.postimg.cc/QNSGzFF5/frame.png"
            width="200"
          />
        </div>
      )}
    </div>
  </div>
)}
 


      {/* Phone Card */}
      {activeCard === "phone" && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-amber-600 text-sm font-medium">Just tap to</p>
                <h2 className="text-2xl font-bold text-gray-800">Call Now</h2>
              </div>
              <button onClick={closeCard} className="text-amber-600 rounded-full bg-amber-100 p-1.5 hover:bg-amber-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <a
                href="tel:+918928271185"
                className="block w-full p-4 bg-gray-600 text-white rounded-md flex justify-between"
              >
                <span className="font-medium">Office Enquiry</span>
                <span>+91 9970756249</span>
              </a>

            
            </div>
          </div>
        </div>
      )}

      {/* Map Card */}
      {activeCard === "map" && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg">
            <div className="p-4 flex justify-between items-center">
              <div>
                <p className="text-amber-600 text-sm font-medium">Just tap to</p>
                <h2 className="text-2xl font-bold text-gray-800">Open on Map</h2>
              </div>
              <button onClick={closeCard} className="text-amber-600 rounded-full bg-amber-100 p-1.5 hover:bg-amber-200">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-gray-800">Operating Office</h3>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Shop+No+107+Chintamani+Decor+New+Timber+Market+Bhavani+Peth+Pune+Maharashtra+411042"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 leading-relaxed hover:text-amber-600 hover:underline cursor-pointer block"
              >
                Shop No 107, Chintamani Decor, New Timber Market, Bhavani Peth, Pune Maharashtra, 411042
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

