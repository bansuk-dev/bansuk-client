"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ThanksCard } from "@/lib/types/thanks-card";
import { ThanksCardItem } from "@/components/thanks-card-item";
import { QrCodeIcon, Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Cards Section - Takes full width on mobile, left side on desktop */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 lg:mb-14">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 mb-4 sm:mb-6 leading-relaxed">
              오늘까지 총{" "}
              <span className="text-amber-700">
                {totalCount.toLocaleString()}
              </span>
              개의
              <br className="hidden sm:block" />
              감사카드가 만들어졌어요
            </h1>
            <div className="w-20 sm:w-24 h-1 bg-amber-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 md:gap-8 lg:gap-9">
            {cards.map((card, index) => (
              <ThanksCardItem
                key={card.id}
                card={card}
                index={index}
                isNew={card.id === newCardId}
              />
            ))}
          </div>

          {hasMore && (
            <div
              ref={observerTarget}
              className="flex justify-center py-8 sm:py-10 lg:py-12"
            >
              {loading && (
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 animate-spin" />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:w-80 xl:w-96 lg:sticky lg:top-0 lg:h-screen bg-gradient-to-br from-stone-100 to-amber-100 border-t-4 lg:border-t-0 lg:border-l-4 border-amber-300 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10">
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
            <div className="w-40 h-40 sm:w-48 sm:h-48 bg-stone-100 rounded-xl flex items-center justify-center">
              <QrCodeIcon className="w-28 h-28 sm:w-32 sm:h-32 text-stone-600" />
            </div>
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
  );
}
