"use client"
import { useState } from "react"
import { CheckCircle } from "lucide-react"
import { FloatingLatestProductsButton,LatestProductsModal } from "./latest-products-modal"
import  "@/App.css"

export default function Profile() {
  const [isLatestProductsModalOpen, setIsLatestProductsModalOpen] = useState(false)
  return (
    <div className="max-w-[935px] mx-auto p-4 md:p-6" style={{fontSize:"14px"}}>
             
      {/* Header Section */}
      <div className="flex flex-row items-center gap-4 mb-4">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/e-commerce-749a1.appspot.com/o/images%2FScreenshot_2025-03-26_173126-removebg-preview.png?alt=media&token=3356fb04-dc29-4f9d-9bef-7eedd9f8deb5"
          alt="Gloirio logo"
          className="w-37 h-25 md:w-34 md:h-34 rounded-full object-cover"
          width={130}
          height={140}
        />
        <div>
        <div className="flex items-center gap-2 animated-gradient-text">
            <h1 className="font-bold text-[18px] md:text-[20px] lg:text-[24px]"> {/* Added lg:text-[24px] */}
              Chintamani Decor
            </h1>

            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gradient-id" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C6A96C" />
                  <stop offset="100%" stopColor="#2A777C" />
                </linearGradient>
              </defs>
              <path
                d="M9 12l2 2 4-4"
                stroke="url(#gradient-id)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="10" stroke="url(#gradient-id)" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <p className="text-gray-600 md:text-base leading-snug mt-1 text-sm" style={{textAlign:"left"}}>
            India's leading brand for Decorative Laminates and Panels with PAN India Distribution.
          </p>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-3">
        <p className="text-[#727272] text-base leading-relaxed" style={{textAlign:"left",fontSize:"14px"}}>
       Chintamani Decor, Exclusive Gallery for a wide range of laminates and Decorative panels. Chintamani Decor is the leading provider of branded designer surface solutions for both commercial and residential spaces. Chintamani Decor believes in helping you style your interior, and for that purpose, we have brought new concepts to makeover your homes and spaces. Our product range includes Decorative charcoal panels, exclusive and branded paper laminates, Acrylic Laminate, PVC Laminates, Rustic and velvet panels, stone panels, European corners, and PVC mouldings, and Smart Fix Bond for all the decorative range of products. By giving you a wide range of products to choose from with style and versatility, the surfaces you create with them are just elegant and more aesthetic....!!!
        </p>
      </div>
    </div>
  )
}

