"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ThanksCard } from "@/lib/types/thanks-card";
import { ThanksCardItem } from "@/components/thanks-card-item";
import { RandomThanksCardPicker } from "@/components/random-thanks-card-picker";
import { ChevronDown, Loader2, Plus, Shuffle } from "lucide-react";
import Image from "next/image";
import QRCode from "@/assets/QRcode/QR-thanks-card-new.png";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { Button } from "@/components/ui/button";

interface ThanksCardWallProps {
  initialCards: ThanksCard[];
  initialCount: number;
}

const CARDS_PER_PAGE = 12;
const ANIMATION_DURATION = 3000; // 각 카드 애니메이션 지속 시간 (3초)
const AUTO_SCROLL_INTERVAL = 5000; // 자동 스크롤 간격 (5초)
const CARDS_PER_SCROLL = 3; // 한 번에 넘어갈 카드 수

export function ThanksCardWall({
  initialCards,
  initialCount,
}: ThanksCardWallProps) {
  const [cards, setCards] = useState<ThanksCard[]>(initialCards);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isRandomPickerOpen, setIsRandomPickerOpen] = useState(false);

  // 안전한 카드 번호 계산 함수
  const getCardNumber = useCallback(
    (cardIndex: number, currentTotalCount: number) => {
      // 카드 번호는 최소 1부터 시작하며, 음수가 되지 않도록 보장
      const calculatedNumber = currentTotalCount - cardIndex;
      return Math.max(1, calculatedNumber);
    },
    []
  );
  const [countUpKey, setCountUpKey] = useState(0);
  const [newCardId, setNewCardId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCards.length >= CARDS_PER_PAGE);
  const mobileObserverTargetRef = useRef<HTMLDivElement>(null);
  const mobileViewportRef = useRef<HTMLDivElement>(null);
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);
  const [mobileViewportSize, setMobileViewportSize] = useState({
    width: 0,
    height: 0,
  });

  // 데스크탑 자동 스크롤 관련 state
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const desktopObserverTargetRef = useRef<HTMLDivElement>(null);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoScrollingRef = useRef(false);

  // 카드 생성 큐 관리
  const [animationQueue, setAnimationQueue] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 추가
  const [imageLoaded, setImageLoaded] = useState(false); // 이미지 로딩 상태
  const [showOverlay, setShowOverlay] = useState(false); // 오버레이 표시 상태
  const [animationStarted, setAnimationStarted] = useState(false); // 애니메이션 시작 상태
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 총 카드 수 업데이트를 위한 interval ref
  const totalCountIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // QR 섹션 리사이저 관련 state
  const [qrSectionWidth, setQrSectionWidth] = useState(35); // 초기값: 35vw
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(35);

  // 데스크탑 환경 감지
  const checkIsDesktop = useCallback(() => {
    if (typeof window === "undefined") return false;
    const isDesktopSize = window.innerWidth >= 1024;
    setIsDesktop(isDesktopSize);
    return isDesktopSize;
  }, []);

  const getMobileCardWidth = useCallback((viewportWidth: number, viewportHeight: number) => {
    const responsiveMaxWidth =
      viewportWidth >= 420 ? 352 : viewportWidth >= 380 ? 328 : 304;

    if (!viewportHeight) {
      return responsiveMaxWidth;
    }

    return Math.min(responsiveMaxWidth, Math.max(220, viewportHeight - 220));
  }, []);

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

  // 총 카드 수를 가져오는 함수 (실시간 업데이트와 충돌 방지)
  const fetchTotalCount = useCallback(async () => {
    try {
      const supabase = createClient();
      const { count, error } = await supabase
        .from("thanks_cards")
        .select("*", { count: "exact", head: true });

      if (!error && count !== null) {
        // 현재 로컬 카드 수와 서버 카드 수를 비교하여 더 큰 값 사용
        // 실시간 업데이트로 인해 로컬이 더 최신일 수 있음
        setTotalCount((prevCount) => Math.max(prevCount, count));
        setCountUpKey((prev) => prev + 1); // 애니메이션 실행
      }
    } catch (error) {
      console.error("총 카드 수 가져오기 실패:", error);
    }
  }, []);

  // 화면 크기 변경 감지
  useEffect(() => {
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, [checkIsDesktop]);

  useEffect(() => {
    const element = mobileViewportRef.current;
    if (!element) return;

    const updateSize = () => {
      setMobileViewportSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(element);
    window.addEventListener("resize", updateSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const mobileCardWidth = getMobileCardWidth(
    mobileViewportSize.width,
    mobileViewportSize.height
  );
  const mobileEstimatedCardHeight = mobileCardWidth + 220;
  const mobileBottomGap =
    mobileViewportSize.height > 0
      ? mobileViewportSize.height - mobileEstimatedCardHeight - 24
      : 0;
  const showMobileSwipeHint = !isDesktop && cards.length > 1 && mobileBottomGap > 72;

  // QR 섹션 리사이저 핸들러들
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      resizeStartX.current = e.clientX;
      resizeStartWidth.current = qrSectionWidth;

      // 자동 스크롤 일시 정지
      setAutoScrollEnabled(false);
    },
    [qrSectionWidth]
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = resizeStartX.current - e.clientX; // 왼쪽으로 드래그하면 양수
      const deltaVw = (deltaX / window.innerWidth) * 100; // 픽셀을 vw로 변환
      const newWidth = Math.max(
        20,
        Math.min(50, resizeStartWidth.current + deltaVw)
      ); // 20vw ~ 50vw 제한

      setQrSectionWidth(newWidth);
    },
    [isResizing]
  );

  const handleResizeEnd = useCallback(() => {
    if (!isResizing) return;

    setIsResizing(false);

    // 3초 후 자동 스크롤 재개
    setTimeout(() => {
      setAutoScrollEnabled(true);
    }, 3000);
  }, [isResizing]);

  // 리사이즈 이벤트 리스너 등록
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // 데스크탑 자동 스크롤 기능 (3개씩 고정)
  useEffect(() => {
    if (!isDesktop || !autoScrollEnabled || cards.length === 0) {
      return;
    }

    const startAutoScroll = () => {
      autoScrollTimeoutRef.current = setTimeout(() => {
        setCurrentScrollIndex((prevIndex) => {
          const nextIndex = prevIndex + CARDS_PER_SCROLL;

          // 마지막에 도달하면 처음으로 돌아가거나 더 많은 카드 로드
          if (nextIndex >= cards.length) {
            if (hasMore && !loading) {
              // 더 많은 카드가 있으면 로드
              loadMoreCards();
              return prevIndex; // 로딩 중에는 인덱스 유지
            } else {
              // 처음으로 돌아가기
              return 0;
            }
          }

          return nextIndex;
        });

        startAutoScroll(); // 다음 스크롤 예약
      }, AUTO_SCROLL_INTERVAL);
    };

    startAutoScroll();

    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
        autoScrollTimeoutRef.current = null;
      }
    };
  }, [
    isDesktop,
    autoScrollEnabled,
    cards.length,
    hasMore,
    loading,
    loadMoreCards,
  ]);

  // 스크롤 애니메이션 (3개 단위)
  useEffect(() => {
    if (!isDesktop || !scrollContainerRef.current) return;

    const cardWidth = 384; // 카드 너비 (w-96 = 384px)
    const gapWidth = 32; // gap 크기
    const targetScrollLeft = currentScrollIndex * (cardWidth + gapWidth);

    // 자동 스크롤 중임을 표시
    isAutoScrollingRef.current = true;

    scrollContainerRef.current.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });

    // 스크롤 애니메이션이 완료된 후 자동 스크롤 플래그 해제
    setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 500); // 스크롤 애니메이션 시간보다 약간 길게
  }, [currentScrollIndex, isDesktop]);

  // 사용자 스크롤 감지 및 자동 스크롤 일시 정지
  const handleUserScroll = useCallback(() => {
    if (!isDesktop || !scrollContainerRef.current) return;

    // 자동 스크롤 중이면 무시
    if (isAutoScrollingRef.current) return;

    // 디바운스: 스크롤 이벤트가 끝난 후 처리
    if (scrollDebounceRef.current) {
      clearTimeout(scrollDebounceRef.current);
    }

    scrollDebounceRef.current = setTimeout(() => {
      if (!scrollContainerRef.current) return;

      // 현재 스크롤 위치를 기반으로 카드 인덱스 계산
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 384; // 카드 너비 (w-96 = 384px)
      const gapWidth = 32; // gap 크기
      const currentIndex = Math.round(scrollLeft / (cardWidth + gapWidth));

      // 현재 스크롤 위치에 맞게 인덱스 업데이트
      setCurrentScrollIndex(currentIndex);

      setAutoScrollEnabled(false);

      // 기존 타이머 정리
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }

      // 10초 후 자동 스크롤 재개
      userScrollTimeoutRef.current = setTimeout(() => {
        setAutoScrollEnabled(true);
      }, 10000);
    }, 150); // 150ms 디바운스
  }, [isDesktop]);

  useEffect(() => {
    const root = isDesktop
      ? scrollContainerRef.current
      : mobileScrollContainerRef.current;
    const target = isDesktop
      ? desktopObserverTargetRef.current
      : mobileObserverTargetRef.current;

    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreCards();
        }
      },
      {
        root,
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [isDesktop, loadMoreCards, hasMore, loading]);

  // 이미지 로딩 완료 콜백
  const handleImageLoaded = () => {
    setImageLoaded(true);
    setAnimationStarted(true);

    // 이미지 로딩 타임아웃 클리어
    if (imageLoadTimeoutRef.current) {
      clearTimeout(imageLoadTimeoutRef.current);
      imageLoadTimeoutRef.current = null;
    }

    // 오버레이를 즉시 표시
    setShowOverlay(true);

    // 실제 애니메이션 시작 - 3초 후 완료
    animationTimeoutRef.current = setTimeout(() => {
      setNewCardId(null);
      setIsAnimating(false);
      setAnimationQueue((prev) => prev.slice(1));
      setImageLoaded(false);
      setShowOverlay(false);
      setAnimationStarted(false);

      // 새 카드 애니메이션 완료 후 스크롤을 맨 앞으로 리셋 (최신 카드가 보이도록)
      if (isDesktop) {
        setCurrentScrollIndex(0);
      }
    }, ANIMATION_DURATION);
  };

  // 큐에서 다음 애니메이션 실행
  useEffect(() => {
    if (animationQueue.length > 0 && !isAnimating) {
      setIsAnimating(true);
      const nextCardId = animationQueue[0];
      setNewCardId(nextCardId);
      setAnimationKey((prev) => prev + 1); // 새로운 애니메이션마다 키 증가
      setImageLoaded(false); // 이미지 로딩 상태 초기화
      setShowOverlay(false); // 오버레이 상태 초기화
      setAnimationStarted(false); // 애니메이션 시작 상태 초기화

      // 이미지 로딩 최대 대기 시간 설정 (10초)
      imageLoadTimeoutRef.current = setTimeout(() => {
        if (!imageLoaded && !animationStarted) {
          console.warn("이미지 로딩 시간 초과, 기본 이미지로 애니메이션 시작");
          handleImageLoaded(); // 강제로 애니메이션 시작
        }
      }, 10000);
    }
  }, [animationQueue, isAnimating, imageLoaded, animationStarted]);

  // 5초마다 총 카드 수 업데이트
  useEffect(() => {
    // 초기 로드 시 한 번 실행
    fetchTotalCount();

    // 10초마다 총 카드 수 업데이트
    totalCountIntervalRef.current = setInterval(() => {
      fetchTotalCount();
    }, 10000);

    return () => {
      if (totalCountIntervalRef.current) {
        clearInterval(totalCountIntervalRef.current);
        totalCountIntervalRef.current = null;
      }
    };
  }, [fetchTotalCount]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      if (imageLoadTimeoutRef.current) {
        clearTimeout(imageLoadTimeoutRef.current);
        imageLoadTimeoutRef.current = null;
      }
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
        autoScrollTimeoutRef.current = null;
      }
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
        userScrollTimeoutRef.current = null;
      }
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current);
        scrollDebounceRef.current = null;
      }
      if (totalCountIntervalRef.current) {
        clearInterval(totalCountIntervalRef.current);
        totalCountIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("thanks_cards_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "thanks_cards" },
        (payload) => {
          const newCard = payload.new as ThanksCard;

          // 중복 카드 방지: 이미 존재하는 카드인지 확인
          setCards((prev) => {
            const existingCard = prev.find((card) => card.id === newCard.id);
            if (existingCard) {
              return prev; // 이미 존재하면 추가하지 않음
            }

            // 새 카드 추가와 동시에 상태들을 동기화하여 업데이트
            const newCards = [newCard, ...prev];
            const newTotalCount = prev.length + 1;

            // 상태 업데이트를 동기화
            setTotalCount(newTotalCount);
            setAnimationQueue((prevQueue) => [...prevQueue, newCard.id]);

            return newCards;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <RandomThanksCardPicker
        open={isRandomPickerOpen}
        onClose={() => setIsRandomPickerOpen(false)}
      />

      {/* 딤 처리 오버레이 + 중앙 카드 강조 */}
      <AnimatePresence mode="wait">
        {newCardId && showOverlay && (
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
                  cardNumber={getCardNumber(
                    cards.findIndex((card) => card.id === newCardId),
                    cards.length
                  )}
                  isNew={true}
                  onImageLoaded={handleImageLoaded}
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
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[110] rounded-full bg-sky-500 px-6 py-3 text-white shadow-lg"
          >
            <p className="text-sm font-semibold">
              새로운 카드 {animationQueue.length - 1}개가 더 있어요! 🎉
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="flex h-[100dvh] min-h-[100dvh] flex-col overflow-hidden lg:h-screen lg:min-h-screen"
        style={{
          backgroundImage: `url('/images/bg-flower.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Cards Section */}
        <div
          className="flex flex-1 flex-col min-h-0 lg:transition-all lg:duration-200"
          style={{
            marginRight: isDesktop ? `${qrSectionWidth}vw` : "0",
          }}
        >
          {/* Title - Centered in remaining width */}
          <div className="shrink-0 px-4 py-4 text-center sm:px-6 sm:py-8 lg:py-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-stone-800 mb-4 sm:mb-6 leading-relaxed">
              빛을 들고 세상으로
              <br />
              총{" "}
              <span className="inline-block min-w-[80px] text-sky-700">
                <CountUp
                  key={countUpKey}
                  start={0}
                  end={totalCount}
                  duration={3}
                  separator=","
                />
              </span>
              개의 사진이 공유되었어요
            </h1>
            <div className="mx-auto h-1 w-20 rounded-full bg-sky-600 sm:w-24" />
            <div className="mt-4 flex justify-center sm:mt-6">
              <Button
                type="button"
                onClick={() => setIsRandomPickerOpen(true)}
                className="h-11 rounded-full bg-stone-900 px-6 text-sm font-semibold text-white hover:bg-stone-800 sm:h-12 sm:px-8 sm:text-base"
              >
                <>
                  <Shuffle className="h-4 w-4" />
                  감사카드 랜덤뽑기
                </>
              </Button>
            </div>
          </div>

          {/* Mobile: Vertical Short-form Scroll (Full Screen Snap) */}
          <div ref={mobileViewportRef} className="lg:hidden relative flex-1 min-h-0">
            <div
              ref={mobileScrollContainerRef}
              className="h-full overflow-y-auto overscroll-y-contain snap-y snap-mandatory scrollbar-hide"
            >
              {cards.map((card, index) => {
                return (
                  <div
                    key={`mobile-${card.id}-${index}`}
                    className="flex shrink-0 snap-start snap-always items-start justify-center overflow-hidden px-4 pt-4 pb-4"
                    style={{
                      height: mobileViewportSize.height || undefined,
                    }}
                  >
                    <div
                      className="w-full"
                      style={{
                        maxWidth: `${mobileCardWidth}px`,
                      }}
                    >
                      <ThanksCardItem
                        card={card}
                        cardNumber={getCardNumber(index, totalCount)}
                        isNew={false}
                        compactMobile={true}
                        fillHeight={false}
                      />
                    </div>
                  </div>
                );
              })}
              {hasMore && (
                <div
                  ref={mobileObserverTargetRef}
                  className="flex h-32 snap-start items-center justify-center"
                >
                  {loading && (
                    <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                  )}
                </div>
              )}
            </div>

            <AnimatePresence>
              {showMobileSwipeHint && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2"
                >
                  <motion.div
                    animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 1.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop: Horizontal Scroll */}
          <div
            ref={scrollContainerRef}
            className="hidden lg:block flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-6 pt-4 scrollbar-hide"
            onScroll={handleUserScroll}
          >
            <div className="flex gap-4 sm:gap-6 md:gap-7 lg:gap-8 scrollbar-hide">
              {cards.map((card, index) => (
                <div
                  key={`desktop-${card.id}-${index}`}
                  className="flex-shrink-0 w-72 sm:w-80 md:w-96 lg:w-96"
                >
                  <ThanksCardItem
                    card={card}
                    cardNumber={getCardNumber(index, totalCount)}
                    isNew={false}
                  />
                </div>
              ))}
              {hasMore && (
                <div
                  ref={desktopObserverTargetRef}
                  className="flex-shrink-0 w-24 flex items-center justify-center"
                >
                  {loading && (
                    <Loader2 className="h-8 w-8 animate-spin text-sky-600 sm:h-10 sm:w-10" />
                  )}
                </div>
              )}
            </div>
          </div>
          {/* 데스크탑 자동 스크롤 컨트롤 */}
          {isDesktop && (
            <div className="flex items-center gap-4 px-4 pb-4 ml-8 flex-shrink-0">
              {/* 진행 상황 표시 */}
              {cards.length > 0 && (
                <div className="bg-black/70 text-white px-6 py-3 rounded-full text-sm font-medium">
                  {Math.floor(currentScrollIndex / CARDS_PER_SCROLL) + 1} /{" "}
                  {Math.ceil(cards.length / CARDS_PER_SCROLL)}
                </div>
              )}

              {/* 자동 스크롤 토글 버튼 */}
              <button
                onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                className="bg-stone-200 hover:bg-stone-300 text-stone-600 hover:text-stone-700 p-2 rounded-lg shadow-sm transition-all duration-200 hover:scale-105"
                title={
                  autoScrollEnabled ? "자동 스크롤 정지" : "자동 스크롤 시작"
                }
              >
                {autoScrollEnabled ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Desktop: QR Code Section - Fixed on the right */}
        <div
          className="fixed right-0 top-0 hidden h-screen border-l-4 border-sky-300 bg-gradient-to-br from-slate-50 to-sky-100 transition-all duration-200 lg:block"
          style={{
            width: `${qrSectionWidth}vw`,
          }}
        >
          {/* 리사이저 핸들 */}
          <div
            className="absolute left-0 top-0 flex h-full w-2 cursor-col-resize items-center justify-center bg-transparent transition-colors duration-200 group hover:bg-sky-400/30"
            onMouseDown={handleResizeStart}
          >
            <div className="h-16 w-1 rounded-full bg-sky-600/40 transition-colors duration-200 group-hover:bg-sky-600/70" />
          </div>

          <div className="h-full flex flex-col items-center justify-center p-8 lg:p-10">
            <div className="w-3/5 text-center space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-800 leading-relaxed">
                  감사 카드
                  <br />
                  작성하기
                </h2>
                <div className="mx-auto h-1 w-14 rounded-full bg-sky-600 sm:w-16" />
              </div>

              <div className="aspect-square rounded-2xl border-4 border-sky-200 bg-white p-6 shadow-xl sm:p-8">
                <Link
                  href="/thanks-card/new"
                  className="w-full h-full inline-block"
                >
                  <div className="w-full h-full bg-stone-100 rounded-xl flex items-center justify-center">
                    <Image
                      src={QRCode}
                      alt="QR Code"
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <p className="text-2xl font-semibold text-stone-900">
                  QR 코드를 스캔하세요
                </p>
                <p className="text-lg text-stone-600 leading-relaxed">
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
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-600 shadow-2xl transition-all duration-300 hover:scale-110 hover:from-sky-600 hover:to-sky-700 active:scale-95 lg:hidden"
      >
        <Plus className="w-8 h-8 text-white" strokeWidth={3} />
      </Link>
    </>
  );
}
