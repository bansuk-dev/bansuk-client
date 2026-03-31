"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Shuffle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ThanksCardDisplay } from "@/components/thanks-card-display";
import { createClient } from "@/lib/supabase/client";
import type { ThanksCard } from "@/lib/types/thanks-card";

type DrawPhase = "shuffling" | "ready";

interface RandomThanksCardPickerProps {
  open: boolean;
  onClose: () => void;
}

export function RandomThanksCardPicker({
  open,
  onClose,
}: RandomThanksCardPickerProps) {
  const [card, setCard] = useState<ThanksCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawPhase, setDrawPhase] = useState<DrawPhase>("shuffling");
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearAnimationTimers = useCallback(() => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
  }, []);

  const loadRandomCard = useCallback(async () => {
    clearAnimationTimers();
    setIsLoading(true);
    setError(null);
    setDrawPhase("shuffling");
    setCard(null);

    const startedAt = Date.now();

    try {
      const supabase = createClient();
      const { count, error: countError } = await supabase
        .from("thanks_cards")
        .select("*", { count: "exact", head: true });

      if (countError) {
        throw countError;
      }

      if (!count || count <= 0) {
        setError("아직 뽑을 감사카드가 없어요.");
        setDrawPhase("ready");
        return;
      }

      const randomIndex = Math.floor(Math.random() * count);
      const { data, error: cardError } = await supabase
        .from("thanks_cards")
        .select("*")
        .order("created_at", { ascending: false })
        .range(randomIndex, randomIndex)
        .maybeSingle();

      if (cardError) {
        throw cardError;
      }

      if (!data) {
        setError("랜덤 카드를 찾지 못했어요. 다시 시도해 주세요.");
        setDrawPhase("ready");
        return;
      }

      const elapsed = Date.now() - startedAt;
      const revealDelay = Math.max(2400 - elapsed, 1700);

      revealTimeoutRef.current = setTimeout(() => {
        setCard(data);
        setDrawPhase("ready");
      }, revealDelay);
    } catch (error) {
      console.error("랜덤 카드 뽑기 실패:", error);
      setError("랜덤 카드 뽑기에 실패했어요. 잠시 후 다시 시도해 주세요.");
      setDrawPhase("ready");
    } finally {
      setIsLoading(false);
    }
  }, [clearAnimationTimers]);

  useEffect(() => {
    if (!open) {
      clearAnimationTimers();
      setCard(null);
      setError(null);
      setIsLoading(false);
      setDrawPhase("shuffling");
      return;
    }

    loadRandomCard();

    return () => {
      clearAnimationTimers();
    };
  }, [clearAnimationTimers, loadRandomCard, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[140] flex items-center justify-center overflow-hidden px-4 py-6"
        >
          <motion.div
            className="absolute inset-0 bg-stone-950/72 backdrop-blur-md"
            onClick={drawPhase === "ready" ? onClose : undefined}
          />

          <motion.div
            layout
            transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
            className="relative z-10 flex w-full max-w-md flex-col items-center sm:max-w-lg"
          >
            <motion.div
              layout
              transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              className="relative w-full"
            >
              <motion.div
                className="absolute inset-0 rounded-[32px] bg-amber-300/15 blur-3xl"
                animate={{
                  scale: drawPhase === "shuffling" ? [0.92, 1.08, 0.96] : [1, 1.06, 1],
                  opacity: drawPhase === "shuffling" ? [0.18, 0.32, 0.18] : [0.28, 0.42, 0.24],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative min-h-[540px] w-full sm:min-h-[620px]">
                <AnimatePresence mode="wait">
                  {drawPhase === "shuffling" ? (
                    <motion.div
                      key="random-card-skeleton"
                      initial={{ opacity: 0, scale: 0.96, y: 18 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -12 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="absolute inset-0 z-10"
                    >
                      <div className="overflow-hidden rounded-xl border border-white/15 bg-white/12 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-md sm:rounded-2xl">
                        <div className="border-b border-white/10 bg-gradient-to-r from-white/20 to-amber-100/20 px-4 py-4 sm:px-5 sm:py-5 md:px-6">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="h-4 w-24 rounded-full bg-white/45" />
                            <div className="h-3 w-14 rounded-full bg-white/35" />
                          </div>
                          <div className="h-8 w-32 rounded-full bg-white/55" />
                          <div className="mt-3 h-4 w-28 rounded-full bg-white/35" />
                        </div>

                        <div className="relative aspect-square w-full overflow-hidden bg-stone-200/40">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                            animate={{ x: ["-120%", "120%"] }}
                            transition={{
                              duration: 1.25,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <div className="absolute inset-0 grid grid-cols-4 gap-3 p-5 opacity-35">
                            {Array.from({ length: 12 }).map((_, index) => (
                              <div
                                key={index}
                                className="rounded-2xl bg-white/45"
                              />
                            ))}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Shuffle className="h-16 w-16 text-white/60" />
                            </motion.div>
                          </div>
                        </div>

                        <div className="space-y-3 bg-white/10 px-4 py-4 sm:px-5 sm:py-5 md:px-6">
                          <div className="h-5 w-4/5 rounded-full bg-white/45" />
                          <div className="h-5 w-3/5 rounded-full bg-white/30" />
                        </div>
                      </div>

                      <motion.p
                        className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.35em] text-amber-200"
                        animate={{ opacity: [0.45, 1, 0.45] }}
                        transition={{
                          duration: 1.1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        Shuffling
                      </motion.p>
                    </motion.div>
                  ) : card ? (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.965, y: 22 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.985, y: -10 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-20"
                    >
                      <Link href={`/thanks-card/${card.id}`} className="block">
                        <ThanksCardDisplay
                          card={card}
                          cardNumberLabel="No. RANDOM"
                          showFullTitle
                          priority
                          className="shadow-[0_28px_90px_rgba(0,0,0,0.4)]"
                        />
                      </Link>

                      <motion.div
                        className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-gradient-to-tr from-white/0 via-white/40 to-white/0 sm:rounded-2xl"
                        initial={{ opacity: 0, x: "-90%" }}
                        animate={{
                          opacity: [0, 0.65, 0],
                          x: ["-90%", "85%", "120%"],
                        }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="random-card-error"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 z-20 flex items-center justify-center"
                    >
                      <div className="rounded-[28px] border border-white/15 bg-white/10 px-6 py-10 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-md">
                        <p className="text-lg font-semibold">
                          {error ?? "감사카드를 불러오는 중이에요."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <AnimatePresence>
              {drawPhase === "ready" && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative z-30 mt-5 flex w-full items-center gap-3"
                >
                  <motion.div
                    layout
                    transition={{
                      layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                    }}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      onClick={() => loadRandomCard()}
                      disabled={isLoading}
                      className="h-11 w-full rounded-full bg-stone-900 text-white hover:bg-stone-800"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          다시 뽑는 중...
                        </>
                      ) : (
                        <>
                          <Shuffle className="h-4 w-4" />
                          다시 뽑기
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div
                    layout
                    transition={{
                      layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                    }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="h-11 w-11 rounded-full border-stone-300 bg-white text-stone-800 hover:bg-stone-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
