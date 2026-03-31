"use client";

import type { ThanksCard } from "@/lib/types/thanks-card";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ThanksCardDisplay } from "@/components/thanks-card-display";

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
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // 이미지 로드 완료 후 애니메이션 시작
  useEffect(() => {
    if (isNew) {
      setShouldAnimate(true);
      onImageLoaded?.();
    } else if (!isNew) {
      setShouldAnimate(true);
    }
  }, [isNew, onImageLoaded]);

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
          className={`relative ${
            isNew ? "shadow-2xl z-20" : ""
          }`}
        >
          <ThanksCardDisplay
            card={card}
            cardNumberLabel={`No. ${cardNumber}`}
            priority={isNew}
          />
        </motion.div>
      </div>
    </Link>
  );
}
