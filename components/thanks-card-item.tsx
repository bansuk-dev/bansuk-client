"use client";

import type { ThanksCard } from "@/lib/types/thanks-card";
import Link from "next/link";
import Image from "next/image";

interface ThanksCardItemProps {
  card: ThanksCard;
  cardNumber: number;
  isNew?: boolean;
}

export function ThanksCardItem({
  card,
  cardNumber,
  isNew,
}: ThanksCardItemProps) {
  // Format the date and time
  const createdDate = new Date(card.created_at);
  const formattedDate = createdDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = createdDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/thanks-card/${card.id}`}
      className="group w-full h-full flex items-center justify-center"
    >
      <div
        className={`bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-stone-200 w-full flex flex-col ${
          isNew ? "ring-4 ring-amber-400 animate-pulse" : ""
        }`}
      >
        {/* Author Name Section - Emphasized at top */}
        <div className="bg-gradient-to-r from-stone-100 to-amber-100 px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b-2 border-amber-200">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm font-semibold text-amber-700">
              No. {cardNumber}
            </span>
            <span className="text-xs text-stone-600">{formattedTime}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-800 mb-1">
            {card.name}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">{formattedDate}</p>
        </div>

        {/* Photo in Middle - Square aspect ratio */}
        <div className="relative w-full aspect-square bg-stone-100">
          <Image
            src={card.photo_url || "/placeholder.svg?height=400&width=400"}
            alt={card.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Title/Caption at Bottom - Fixed height */}
        <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 bg-stone-50 h-32 sm:h-36 flex items-start overflow-hidden">
          <p className="text-base sm:text-lg text-stone-700 leading-relaxed line-clamp-3">
            {card.title}
          </p>
        </div>
      </div>
    </Link>
  );
}
