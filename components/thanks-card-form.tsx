"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, Camera } from "lucide-react";
import Image from "next/image";

export function ThanksCardForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.length > 50) {
      setError("감사 제목은 50자 이내로 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      let photoUrl = "/assets/default-image.jpg"; // 기본 이미지 경로

      // 사진이 있는 경우에만 업로드
      if (photoFile) {
        // Upload photo to Supabase Storage
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = `thanks-cards/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(filePath, photoFile);

        if (uploadError) {
          throw new Error("사진 업로드에 실패했습니다");
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("photos").getPublicUrl(filePath);

        photoUrl = publicUrl;
      }

      // Insert thanks card record
      const { error: insertError } = await supabase
        .from("thanks_cards")
        .insert({
          name,
          title,
          photo_url: photoUrl,
        });

      if (insertError) {
        throw new Error("감사 카드 생성에 실패했습니다");
      }

      setIsSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push("/thanks-card");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 sm:py-10 md:py-12">
        <CheckCircle2 className="w-20 h-20 sm:w-24 sm:h-24 text-emerald-600 mx-auto mb-4 sm:mb-6" />
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-800 mb-2 sm:mb-3">
          감사 카드가 생성되었습니다!
        </h2>
        <p className="text-base sm:text-lg text-stone-600">
          스크린에서 만들어진 카드를 확인해 주세요!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="text-stone-700 font-bold text-base sm:text-lg"
        >
          이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="홍길동"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          className="text-base sm:text-lg h-11 sm:h-12 border-2 border-stone-300 focus:border-amber-500 text-stone-700"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="title"
          className="text-stone-700 font-bold text-base sm:text-lg"
        >
          감사 제목 <span className="text-red-500">*</span>{" "}
          <span className="text-sm sm:text-base text-stone-500 font-normal">
            (최대 50자)
          </span>
        </Label>
        <Textarea
          id="title"
          placeholder="오늘 하루도 건강하게 보낼 수 있어서 감사합니다"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
          rows={4}
          className="text-base sm:text-lg resize-none border-2 border-stone-300 focus:border-amber-500 leading-relaxed"
          disabled={isSubmitting}
        />
        <p className="text-sm sm:text-base text-stone-700 text-right font-medium">
          {title.length}/50
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="photo"
          className="text-stone-700 font-bold text-base sm:text-lg"
        >
          사진{" "}
          <span className="text-sm sm:text-base text-stone-500 font-normal">
            (선택사항)
          </span>
        </Label>
        <div className="relative">
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            disabled={isSubmitting}
          />
          <label
            htmlFor="photo"
            className={`flex flex-col items-center justify-center w-full h-48 sm:h-56 rounded-xl sm:rounded-2xl cursor-pointer transition-all ${
              photoPreview
                ? "border-0"
                : "border-3 border-dashed border-stone-300 hover:border-amber-500 hover:bg-amber-50/50 bg-stone-50"
            }`}
          >
            {photoPreview ? (
              <div className="relative w-full h-full">
                <Image
                  src={photoPreview || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-cover rounded-xl sm:rounded-2xl"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600" />
                <p className="text-stone-700 font-bold text-base sm:text-lg">
                  사진을 선택해주세요
                </p>
                <p className="text-sm sm:text-base text-stone-500">
                  클릭하여 업로드
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border-2 border-rose-300 text-rose-700 px-4 py-3 rounded-xl text-sm sm:text-base font-medium">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 sm:h-14 text-lg sm:text-xl font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isSubmitting || !name.trim() || !title.trim()}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
            생성 중...
          </>
        ) : (
          "감사 카드 만들기"
        )}
      </Button>
    </form>
  );
}
