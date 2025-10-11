"use client";

import type { ThanksCard } from "@/lib/types/thanks-card";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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
      <div className="relative w-full">
        {/* 링 펄스 효과 */}
        {isNew && (
          <>
            <motion.div
              className="absolute -inset-4 rounded-xl sm:rounded-2xl border-4 border-amber-400 z-10"
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: [0.8, 0],
                scale: [1, 1.1],
              }}
              transition={{
                duration: 1.5,
                repeat: 2,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute -inset-2 rounded-xl sm:rounded-2xl border-4 border-amber-300 z-10"
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: [0.6, 0],
                scale: [1, 1.15],
              }}
              transition={{
                duration: 1.5,
                repeat: 2,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
          </>
        )}

        <motion.div
          initial={isNew ? { scale: 0.8, opacity: 0 } : false}
          animate={
            isNew
              ? {
                  scale: [0.8, 1.05, 1, 1, 1],
                  opacity: [0, 1, 1, 1, 1],
                  y: [20, -10, -10, -10, 0],
                  rotateZ: [0, -1, 1, -1, 0],
                }
              : { scale: 1, y: 0, rotateZ: 0, opacity: 1 }
          }
          transition={
            isNew
              ? {
                  duration: 3,
                  times: [0, 0.15, 0.25, 0.85, 1],
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
          whileHover={!isNew ? { scale: 1.02, y: -5 } : undefined}
          className={`relative bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden border-2 border-stone-200 w-full flex flex-col ${
            isNew ? "ring-8 ring-amber-400 shadow-2xl z-20" : ""
          }`}
        >
          {/* 빛나는 효과 오버레이 */}
          {isNew && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-30"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0.4, 0.4, 0],
              }}
              transition={{
                duration: 3,
                times: [0, 0.15, 0.5, 0.85, 1],
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle at center, rgba(251, 191, 36, 0.5) 0%, transparent 70%)",
              }}
            />
          )}
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
        </motion.div>
      </div>
    </Link>
  );
}
