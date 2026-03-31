"use client";

import { useState } from "react";
import Image from "next/image";

import type { ThanksCard } from "@/lib/types/thanks-card";

interface ThanksCardDisplayProps {
  card: ThanksCard;
  cardNumberLabel: string;
  showFullTitle?: boolean;
  priority?: boolean;
  className?: string;
  compactMobile?: boolean;
}

export function ThanksCardDisplay({
  card,
  cardNumberLabel,
  showFullTitle = false,
  priority = false,
  className = "",
  compactMobile = false,
}: ThanksCardDisplayProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-white/30 bg-white/20 shadow-lg backdrop-blur-md sm:rounded-2xl ${className}`}
    >
      <div
        className={`border-b border-white/20 bg-gradient-to-r from-white/45 to-sky-100/45 backdrop-blur-sm md:px-6 ${
          compactMobile
            ? "px-4 py-3 sm:px-5 sm:py-5"
            : "px-4 py-4 sm:px-5 sm:py-5"
        }`}
      >
        <div className="mb-1 flex items-center justify-between sm:mb-2">
          <span className="text-xs font-semibold text-sky-700 sm:text-sm">
            {cardNumberLabel}
          </span>
          <span className="text-xs text-stone-600">{formattedTime}</span>
        </div>
        <h3
          className={`mb-1 font-bold text-stone-900 drop-shadow-sm ${
            compactMobile ? "text-lg sm:text-2xl" : "text-xl sm:text-2xl"
          }`}
        >
          {card.name}
        </h3>
        <p className="text-xs text-stone-700 drop-shadow-sm sm:text-sm">
          {formattedDate}
        </p>
      </div>

      <div className="relative aspect-square w-full bg-stone-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          </div>
        )}

        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
            <div className="text-center text-stone-600">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-lg bg-stone-400">
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm">이미지를 불러올 수 없습니다</p>
            </div>
          </div>
        )}

        {!imageError && (
          <Image
            src={card.photo_url || "/assets/bible.jpg"}
            alt={card.title}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={priority}
          />
        )}
      </div>

      <div
        className={`bg-white/30 backdrop-blur-sm md:px-6 ${
          showFullTitle
            ? ""
            : compactMobile
              ? "flex h-24 items-start overflow-hidden px-4 py-3 sm:h-36 sm:px-5 sm:py-5"
              : "flex h-32 items-start overflow-hidden px-4 py-4 sm:h-36 sm:px-5 sm:py-5"
        }`}
      >
        <p
          className={`font-medium leading-relaxed text-stone-900 drop-shadow-sm ${
            showFullTitle
              ? "whitespace-pre-wrap break-words"
              : "line-clamp-3"
          } ${compactMobile ? "text-sm sm:text-lg" : "text-base sm:text-lg"}`}
        >
          {card.title}
        </p>
      </div>
    </div>
  );
}
