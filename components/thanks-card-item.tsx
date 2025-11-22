"use client";

import type { ThanksCard } from "@/lib/types/thanks-card";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ThanksCardItemProps {
  card: ThanksCard;
  cardNumber: number;
  isNew?: boolean;
  onImageLoaded?: () => void;
}

export function ThanksCardItem({
  card,
  cardNumber,
  isNew,
  onImageLoaded,
}: ThanksCardItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  // 이미지 로드 완료 후 애니메이션 시작
  useEffect(() => {
    if (isNew && (imageLoaded || imageError)) {
      // 애니메이션을 즉시 시작
      setShouldAnimate(true);
      // 이미지 로드 완료를 부모에게 알림
      onImageLoaded?.();
    } else if (!isNew) {
      setShouldAnimate(true);
    }
  }, [isNew, imageLoaded, imageError, onImageLoaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
    console.warn("이미지 로딩 실패, 기본 이미지 사용:", card.photo_url);
  };

  return (
    <Link
      href={`/thanks-card/${card.id}`}
      className="group w-full h-full flex items-center justify-center"
    >
      <div className="relative w-full">
        <motion.div
          initial={isNew ? { scale: 0.8, opacity: 0 } : false}
          animate={
            isNew && shouldAnimate
              ? {
                  scale: [0.8, 1.05, 1, 1, 1],
                  opacity: [0, 1, 1, 1, 1],
                  y: [20, -10, -10, -10, 0],
                }
              : shouldAnimate
              ? { scale: 1, y: 0, opacity: 1 }
              : { scale: 0.8, opacity: 0 }
          }
          transition={
            isNew && shouldAnimate
              ? {
                  duration: 3,
                  times: [0, 0.15, 0.25, 0.85, 1],
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
          whileHover={!isNew ? { scale: 1.02, y: -5 } : undefined}
          className={`relative bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-white/30 w-full flex flex-col ${
            isNew ? "shadow-2xl z-20" : ""
          }`}
        >
          {/* Author Name Section - Emphasized at top */}
          <div className="bg-gradient-to-r from-white/40 to-amber-100/40 backdrop-blur-sm px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-white/20">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <span className="text-xs sm:text-sm font-semibold text-amber-700">
                No. {cardNumber}
              </span>
              <span className="text-xs text-stone-600">{formattedTime}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-1 drop-shadow-sm">
              {card.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 drop-shadow-sm">
              {formattedDate}
            </p>
          </div>

          {/* Photo in Middle - Square aspect ratio */}
          <div className="relative w-full aspect-square bg-stone-100">
            {/* 이미지 로딩 중 플레이스홀더 */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* 이미지 로딩 에러 시 기본 이미지 표시 */}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
                <div className="text-center text-stone-600">
                  <div className="w-16 h-16 mx-auto mb-2 bg-stone-400 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8"
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

            {/* 실제 이미지 */}
            {!imageError && (
              <Image
                src={card.photo_url || "/assets/default-image.jpg"}
                alt={card.title}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority={isNew}
              />
            )}
          </div>

          {/* Title/Caption at Bottom - Fixed height */}
          <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 bg-white/30 backdrop-blur-sm h-32 sm:h-36 flex items-start overflow-hidden">
            <p className="text-base sm:text-lg text-stone-900 leading-relaxed line-clamp-3 drop-shadow-sm font-medium">
              {card.title}
            </p>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}
