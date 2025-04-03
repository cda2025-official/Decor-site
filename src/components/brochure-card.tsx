"use client"

import { Card, CardFooter } from "@/components/ui/card"
import { FileText, Share2 } from "lucide-react"

interface BrochureCardProps {
  item: {
    fileUrl: string
    thumbnailUrl: string
    description: string
  }
  index: number
  onShare: (url: string, title: string) => void
}

export default function BrochureCard({ item, index, onShare }: BrochureCardProps) {
  return (
    <Card
      className="group overflow-hidden hover:shadow-md transition-all duration-300 border-[#2A777C]/20 h-full flex flex-col"
      data-aos="flip-up"
    >
      <div className="relative flex-grow flex items-center justify-center bg-gray-50 aspect-[3/4]">
        <img
          src={item.thumbnailUrl || "/placeholder.svg"}
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          alt={`Brochure thumbnail for ${item.description}`}
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            onShare(item.fileUrl, `Brochure ${index + 1}`)
          }}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#008080]/50 z-0"
          aria-label="Share brochure"
        >
          <Share2 size={18} className="text-[#2A777C]" />
        </button>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <a
            href={item.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#2A777C] font-medium py-2 px-4 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            <FileText size={18} />
            View Brochure
          </a>
        </div>
      </div>
      <CardFooter className="flex justify-between items-center p-4 bg-white">
        <span className="text-sm font-medium truncate">{item.description}</span>
      </CardFooter>
    </Card>
  )
}

