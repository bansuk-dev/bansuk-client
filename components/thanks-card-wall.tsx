"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ThanksCard } from "@/lib/types/thanks-card";
import { ThanksCardItem } from "@/components/thanks-card-item";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import QRCode from "@/assets/QRcode/QR-thanks-card-new.png";
import Link from "next/link";

interface ThanksCardWallProps {
  initialCards: ThanksCard[];
  initialCount: number;
}

const CARDS_PER_PAGE = 12;

export function ThanksCardWall({
  initialCards,
  initialCount,
}: ThanksCardWallProps) {
  const [cards, setCards] = useState<ThanksCard[]>(initialCards);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [newCardId, setNewCardId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCards.length >= CARDS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMoreCards = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const supabase = createClient();
    const from = page * CARDS_PER_PAGE;
    const to = from + CARDS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from("thanks_cards")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error && data) {
      setCards((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
      setHasMore(data.length >= CARDS_PER_PAGE);
    }

    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreCards();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreCards, hasMore, loading]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("thanks_cards_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "thanks_cards" },
        (payload) => {
          const newCard = payload.new as ThanksCard;
          setCards((prev) => [newCard, ...prev]);
          setTotalCount((prev) => prev + 1);
          setNewCardId(newCard.id);

          setTimeout(() => setNewCardId(null), 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col">
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
                    isNew={card.id === newCardId}
                  />
                </div>
              </div>
            ))}
            {hasMore && (
              <div
                ref={observerTarget}
                className="h-32 snap-start flex items-center justify-center"
              >
                {loading && (
                  <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                )}
              </div>
            )}
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
                    isNew={card.id === newCardId}
                  />
                </div>
              ))}
              {hasMore && (
                <div
                  ref={observerTarget}
                  className="flex-shrink-0 w-24 flex items-center justify-center"
                >
                  {loading && (
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 animate-spin" />
                  )}
                </div>
              )}
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
