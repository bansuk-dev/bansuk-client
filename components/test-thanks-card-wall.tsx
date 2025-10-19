"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { ThanksCard } from "@/lib/types/thanks-card";
import { ThanksCardItem } from "@/components/thanks-card-item";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import QRCode from "@/assets/QRcode/QR-thanks-card-new.png";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface TestThanksCardWallProps {
  cards: ThanksCard[];
  totalCount: number;
  animationQueue: string[];
  onAnimationComplete: (cardId: string) => void;
}

const ANIMATION_DURATION = 3000; // 각 카드 애니메이션 지속 시간 (3초)

export function TestThanksCardWall({
  cards,
  totalCount,
  animationQueue,
  onAnimationComplete,
}: TestThanksCardWallProps) {
  const [newCardId, setNewCardId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 추가
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 큐에서 다음 애니메이션 실행
  useEffect(() => {
    if (animationQueue.length > 0 && !isAnimating) {
      setIsAnimating(true);
      const nextCardId = animationQueue[0];
      setNewCardId(nextCardId);
      setAnimationKey((prev) => prev + 1); // 새로운 애니메이션마다 키 증가

      // 애니메이션 완료 후 큐에서 제거하고 다음 애니메이션 준비
      animationTimeoutRef.current = setTimeout(() => {
        const completedCardId = nextCardId;
        setNewCardId(null);
        setIsAnimating(false);
        onAnimationComplete(completedCardId);
      }, ANIMATION_DURATION);
    }
  }, [animationQueue, isAnimating, onAnimationComplete]);

  // 컴포넌트 언마운트 시에만 타이머 정리
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* 딤 처리 오버레이 + 중앙 카드 강조 */}
      <AnimatePresence mode="wait">
        {newCardId && (
          <motion.div
            key="card-spotlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ pointerEvents: "none" }}
          >
            {/* 딤 배경 */}
            <div className="absolute inset-0 bg-black/60" />

            {/* 중앙에 강조된 카드 */}
            <div
              className="relative z-10 w-full max-w-md lg:max-w-lg px-4"
              style={{ pointerEvents: "auto" }}
            >
              {cards.find((card) => card.id === newCardId) && (
                <ThanksCardItem
                  key={`new-card-${newCardId}-${animationKey}`} // 애니메이션 키로 강제 리마운트
                  card={cards.find((card) => card.id === newCardId)!}
                  cardNumber={
                    totalCount -
                    cards.findIndex((card) => card.id === newCardId)
                  }
                  isNew={true}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 큐 대기 카드 개수 표시 */}
      <AnimatePresence>
        {animationQueue.length > 1 && (
          <motion.div
            key="queue-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[110] bg-amber-500 text-white px-6 py-3 rounded-full shadow-lg"
          >
            <p className="text-sm font-semibold">
              새로운 카드 {animationQueue.length - 1}개가 더 있어요! 🎉
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: `url('/images/bg-image.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Cards Section */}
        <div className="flex-1 flex flex-col lg:mr-80 xl:mr-96">
          {/* Title - Centered in remaining width */}
          <div className="text-center py-8 sm:py-10 lg:py-12 px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 mb-4 sm:mb-6 leading-relaxed">
              오늘까지 총{" "}
              <span className="text-amber-700">
                {totalCount.toLocaleString()}
              </span>
              개의
              <br />
              감사카드가 만들어졌어요
            </h1>
            <div className="w-20 sm:w-24 h-1 bg-amber-600 mx-auto rounded-full" />
          </div>

          {/* Mobile: Vertical Short-form Scroll (Full Screen Snap) */}
          <div className="lg:hidden h-[calc(100vh-200px)] overflow-y-auto snap-y snap-mandatory">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="min-h-[calc(100vh-200px)] snap-start snap-always flex items-center justify-center px-4 py-4"
              >
                <div className="w-full max-w-md">
                  <ThanksCardItem
                    card={card}
                    cardNumber={totalCount - index}
                    isNew={false}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Horizontal Scroll */}
          <div className="hidden lg:block flex-1 overflow-x-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8">
            <div className="flex gap-4 sm:gap-6 md:gap-7 lg:gap-8">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className="flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-96"
                >
                  <ThanksCardItem
                    card={card}
                    cardNumber={totalCount - index}
                    isNew={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: QR Code Section - Fixed on the right */}
        <div className="hidden lg:block fixed right-0 top-0 w-80 xl:w-96 h-screen bg-gradient-to-br from-stone-100 to-amber-100 border-l-4 border-amber-300">
          <div className="h-full flex flex-col items-center justify-center p-8 lg:p-10">
            <div className="text-center space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-800 leading-relaxed">
                  감사 카드
                  <br />
                  작성하기
                </h2>
                <div className="w-14 sm:w-16 h-1 bg-amber-600 mx-auto rounded-full" />
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border-4 border-amber-200">
                <Link href="/thanks-card/new">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 bg-stone-100 rounded-xl flex items-center justify-center">
                    <Image
                      src={QRCode}
                      alt="QR Code"
                      width={192}
                      height={192}
                    />
                  </div>
                </Link>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <p className="text-lg sm:text-xl font-semibold text-stone-700">
                  QR 코드를 스캔하세요
                </p>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  스마트폰 카메라로
                  <br />
                  QR 코드를 비추면
                  <br />
                  감사 카드를 작성할 수 있습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Floating Action Button */}
      <Link
        href="/thanks-card/new"
        className="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50"
      >
        <Plus className="w-8 h-8 text-white" strokeWidth={3} />
      </Link>
    </>
  );
}
