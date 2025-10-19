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
        {/* 빛나는 글로우 효과 */}
        {isNew && (
          <>
            {/* 외부 글로우 */}
            <motion.div
              className="absolute -inset-6 rounded-xl sm:rounded-2xl z-10"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0.4, 0.8, 0],
              }}
              transition={{
                duration: 3,
                times: [0, 0.2, 0.5, 0.8, 1],
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.6) 0%, rgba(251, 191, 36, 0.3) 40%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />
            {/* 중간 글로우 */}
            <motion.div
              className="absolute -inset-3 rounded-xl sm:rounded-2xl z-10"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.6, 0.3, 0.6, 0],
              }}
              transition={{
                duration: 3,
                times: [0, 0.2, 0.5, 0.8, 1],
                ease: "easeInOut",
                delay: 0.1,
              }}
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.2) 50%, transparent 80%)",
                filter: "blur(4px)",
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
          className={`relative bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-white/30 w-full flex flex-col ${
            isNew ? "shadow-2xl z-20" : ""
          }`}
        >
          {/* 빛나는 효과 오버레이 */}
          {isNew && (
            <>
              {/* 메인 빛나는 효과 */}
              <motion.div
                className="absolute inset-0 pointer-events-none z-30"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.6, 0.3, 0.6, 0],
                }}
                transition={{
                  duration: 3,
                  times: [0, 0.15, 0.5, 0.85, 1],
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 70%)",
                }}
              />
              {/* 반짝이는 효과 */}
              <motion.div
                className="absolute inset-0 pointer-events-none z-30"
                initial={{ x: "-100%" }}
                animate={{
                  x: ["100%", "200%"],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.6) 50%, transparent 70%)",
                  width: "200%",
                }}
              />
            </>
          )}
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
            <Image
              src={card.photo_url || "/placeholder.svg?height=400&width=400"}
              alt={card.title}
              fill
              className="object-cover"
            />
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
