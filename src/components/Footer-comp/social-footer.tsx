"use client"

import { useState } from "react"
import ShareModal from "./share-modal"
import VCardModal from "./vcard-modal"
import EmailModal from "./email-modal"
import WhatsAppModal from "./whatsapp-modal"
import LinkModal from "./link-modal"

export default function SocialFooter() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const closeModal = () => setActiveModal(null)

  return (
    <div className="max-w-[935px] w-full sm:w-screen mx-auto h-[85px] fixed bottom-0 right-0 left-0 pt-3 text-[11px] ">
      <div className="max-w-[935px] w-full sm:w-screen  border-t border-gray-200 bg-white mx-auto">
        <div className="flex justify-between items-center ">
          <div
            className="flex-1 flex flex-col items-center  cursor-pointer w-14 h-14"
            onClick={() => setActiveModal("email")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-gray-600 mb-1"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <span className="text-[11px] text-gray-600">Email</span>
          </div>

          <div
            className="flex-1 flex flex-col items-center  cursor-pointer w-14 h-14"
            onClick={() => setActiveModal("links")}
          >
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
              className="h-6 w-6 text-gray-600 mb-1"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" x2="22" y1="12" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span className="text-[11px] text-gray-600">Links</span>
          </div>

          <div
            className="flex-1 flex flex-col items-center  cursor-pointer relative   "
            onClick={() => setActiveModal("save")}
          >
            <div className="bg-[#2A777C] rounded-full p-3 mb-1 relative bottom-5">
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
                className="h-8 w-8 text-white"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </div>
            
          <span 
  className="text-[12.2px] sm:text-[12px] text-gray-600 relative bottom-6 lg:mb-2 underline-offset-8 decoration-[#C6A96C]"
  style={{
    textDecoration: "underline",
    textDecorationThickness: "3px",
    textDecorationColor:"#C6A96C"

  }}
>
  Save contact 
</span>
            <div className="absolute bottom-0 w-full h-1 bg-[#c6a96c]"></div>
          </div>

          <div
            className="flex-1 flex flex-col items-center  cursor-pointer w-14 h-14"
            onClick={() => setActiveModal("social")}
          >
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
              className="h-6 w-6 text-gray-600 mb-1"
            >
              <path d="M4 9h8"></path>
              <path d="M4 15h16"></path>
              <path d="M12 5v14"></path>
            </svg>
            <span className="text-[11px] text-gray-600">Social</span>
          </div>

          <div
            className="flex-1 flex flex-col items-center  cursor-pointer w-14 h-14"
            onClick={() => setActiveModal("whatsapp")}
          >
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
              className="h-6 w-6 text-gray-600 mb-1"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span className="text-[11px] text-gray-600 ">WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "email" && <EmailModal onClose={closeModal} />}
      {activeModal === "links" && <LinkModal onClose={closeModal} />}
      {activeModal === "save" && <VCardModal onClose={closeModal} />}
      {activeModal === "social" && <ShareModal onClose={closeModal} />}
      {activeModal === "whatsapp" && <WhatsAppModal onClose={closeModal} />}
    </div>
  )
}

