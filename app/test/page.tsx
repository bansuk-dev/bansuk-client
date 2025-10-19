"use client";

import { useState } from "react";
import { TestThanksCardWall } from "@/components/test-thanks-card-wall";
import type { ThanksCard } from "@/lib/types/thanks-card";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Star, Gift, Coffee, Sun } from "lucide-react";

// 더미 데이터 템플릿들
const dummyTemplates = [
  {
    name: "김민수",
    title:
      "오늘 도와주셔서 정말 감사합니다! 덕분에 어려운 일을 잘 해결할 수 있었어요.",
    photo_url: "/assets/default-image.jpg",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "이지영",
    title: "맛있는 커피 한 잔의 여유로 하루가 더욱 행복해졌습니다. 감사해요!",
    photo_url: "/assets/default-image.jpg",
    icon: Coffee,
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "박준호",
    title:
      "항상 밝은 미소로 인사해주셔서 감사합니다. 덕분에 하루가 따뜻해져요.",
    photo_url: "/assets/default-image.jpg",
    icon: Sun,
    color: "from-yellow-500 to-amber-500",
  },
  {
    name: "최수진",
    title: "소중한 선물을 받아서 너무 기뻐요. 마음이 전해져서 감동받았습니다!",
    photo_url: "/assets/default-image.jpg",
    icon: Gift,
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "정우성",
    title: "별처럼 빛나는 당신의 친절함에 감사드립니다. 정말 고마워요!",
    photo_url: "/assets/default-image.jpg",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "한예슬",
    title:
      "마법같은 순간을 만들어주셔서 감사합니다. 잊지 못할 추억이 되었어요!",
    photo_url: "/assets/default-image.jpg",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-500",
  },
];

export default function TestPage() {
  const [cards, setCards] = useState<ThanksCard[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [animationQueue, setAnimationQueue] = useState<string[]>([]);

  // 더미 카드 생성 함수
  const createDummyCard = (templateIndex: number) => {
    const template = dummyTemplates[templateIndex];
    const newCard: ThanksCard = {
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: template.name,
      title: template.title,
      photo_url: template.photo_url,
      created_at: new Date().toISOString(),
    };

    setCards((prev) => [newCard, ...prev]);
    setTotalCount((prev) => prev + 1);
    setAnimationQueue((prev) => [...prev, newCard.id]);
  };

  // 연속 카드 생성 (큐 테스트용)
  const createMultipleCards = () => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        createDummyCard(i % dummyTemplates.length);
      }, i * 500); // 0.5초 간격으로 생성
    }
  };

  // 모든 카드 초기화
  const resetCards = () => {
    setCards([]);
    setTotalCount(0);
    setAnimationQueue([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      {/* 테스트 컨트롤 패널 */}
      <div className="fixed top-4 left-4 z-[200] bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/30">
        <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          애니메이션 테스트
        </h2>

        <div className="space-y-3">
          <div className="text-sm text-stone-600 mb-2">단일 카드 생성:</div>
          <div className="grid grid-cols-2 gap-2">
            {dummyTemplates.map((template, index) => {
              const IconComponent = template.icon;
              return (
                <Button
                  key={index}
                  onClick={() => createDummyCard(index)}
                  variant="outline"
                  size="sm"
                  className={`bg-gradient-to-r ${template.color} text-white border-0 hover:scale-105 transition-transform`}
                >
                  <IconComponent className="w-4 h-4 mr-1" />
                  {template.name}
                </Button>
              );
            })}
          </div>

          <div className="border-t border-stone-200 pt-3 mt-4">
            <div className="text-sm text-stone-600 mb-2">특수 테스트:</div>
            <div className="space-y-2">
              <Button
                onClick={createMultipleCards}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                연속 3개 생성 (큐 테스트)
              </Button>

              <Button
                onClick={resetCards}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                모든 카드 초기화
              </Button>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-3 mt-4">
            <div className="text-xs text-stone-500">
              총 카드: {totalCount}개<br />
              대기 중: {animationQueue.length}개
            </div>
          </div>
        </div>
      </div>

      {/* 테스트용 카드 월 컴포넌트 */}
      <TestThanksCardWall
        cards={cards}
        totalCount={totalCount}
        animationQueue={animationQueue}
        onAnimationComplete={(cardId: string) => {
          setAnimationQueue((prev) => prev.filter((id) => id !== cardId));
        }}
      />
    </div>
  );
}
