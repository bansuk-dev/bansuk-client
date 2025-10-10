"use client"

import type { ThanksCard } from "@/lib/types/thanks-card"
import Link from "next/link"
import Image from "next/image"

interface ThanksCardItemProps {
  card: ThanksCard
  index: number
  isNew?: boolean
}

export function ThanksCardItem({ card, index, isNew }: ThanksCardItemProps) {
  const cardNumber = 3058 + index + 1

  return (
    <Link href={`/thanks-card/${card.id}`} className="group">
      <div
        className={`bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-stone-200 ${
          isNew ? "ring-4 ring-amber-400 animate-pulse" : ""
        }`}
      >
        {/* Author Name Section - Emphasized at top */}
        <div className="bg-gradient-to-r from-stone-100 to-amber-100 px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b-2 border-amber-200">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm font-semibold text-amber-700">No. {cardNumber}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-800">{card.name}</h3>
        </div>

        {/* Square Photo in Middle */}
        <div className="relative aspect-square bg-stone-100">
          <Image
            src={card.photo_url || "/placeholder.svg?height=400&width=400"}
            alt={card.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Title/Caption at Bottom */}
        <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 bg-stone-50">
          <p className="text-base sm:text-lg text-stone-700 leading-relaxed line-clamp-3">{card.title}</p>
        </div>
      </div>
    </Link>
  )
}
