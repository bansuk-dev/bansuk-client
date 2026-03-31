import { ThanksCardForm } from "@/components/thanks-card-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewThanksCardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        <Link href="/thanks-card" className="inline-block mb-4 md:mb-6">
          <Button
            variant="ghost"
            className="text-base font-medium text-stone-700 hover:bg-sky-100/60 sm:text-lg"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            감사카드 목록으로 돌아가기
          </Button>
        </Link>

        <div className="rounded-2xl border-2 border-sky-100 bg-white shadow-xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-stone-800 mb-3 sm:mb-4">
            감사 카드 만들기
          </h1>
          <p className="text-center text-stone-600 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
            소중한 감사의 마음을 나눠주세요
          </p>
          <ThanksCardForm />
        </div>
      </div>
    </div>
  );
}
