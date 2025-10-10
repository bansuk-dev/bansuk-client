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

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
          {/* Author Name at Top */}
          <div className="bg-gradient-to-r from-emerald-50 to-amber-50 px-5 sm:px-6 py-5 sm:py-6 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold text-emerald-700">
                  {card.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
                  {card.name}
                  <span className="text-lg sm:text-xl font-normal text-stone-600 ml-2">
                    님
                  </span>
                </h2>
                <p className="text-sm text-stone-500 mt-1">{formattedDate}</p>
              </div>
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
          <div className="px-5 sm:px-6 py-5 sm:py-6 bg-gradient-to-br from-white to-stone-50">
            <p className="text-base sm:text-lg md:text-xl text-stone-700 leading-relaxed text-pretty font-medium">
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
