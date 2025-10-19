"use client";

import type { ThanksCard } from "@/lib/types/thanks-card";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThanksCardDetailProps {
  card: ThanksCard;
}

export function ThanksCardDetail({ card }: ThanksCardDetailProps) {
  const formattedDate = new Date(card.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <Link href="/thanks-card" className="inline-block mb-4 md:mb-6">
          <Button
            variant="ghost"
            className="text-stone-700 hover:bg-stone-200/50 text-base sm:text-lg font-medium"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            감사카드 목록으로 돌아가기
          </Button>
        </Link>

        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/30">
          {/* Author Name at Top */}
          <div className="bg-gradient-to-r from-emerald-100/40 to-amber-100/40 backdrop-blur-sm px-5 sm:px-6 py-5 sm:py-6 border-b border-white/20">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 drop-shadow-sm">
                {card.name}
              </h2>
              <p className="text-sm text-stone-700 mt-1 drop-shadow-sm">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Square Photo in Middle */}
          <div className="relative w-full aspect-square bg-stone-100">
            <Image
              src={card.photo_url || "/placeholder.svg"}
              alt={card.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Title/Description at Bottom */}
          <div className="px-5 sm:px-6 py-5 sm:py-6 bg-gradient-to-br from-white/40 to-stone-100/40 backdrop-blur-sm">
            <p className="text-base sm:text-lg md:text-xl text-stone-900 leading-relaxed text-pretty font-medium drop-shadow-sm">
              {card.title}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Link href="/thanks-card/new" className="block">
            <Button className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
              나도 감사 카드 만들기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
