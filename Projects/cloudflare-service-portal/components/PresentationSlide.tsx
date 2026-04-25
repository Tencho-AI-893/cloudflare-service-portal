// src/components/PresentationSlide.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";

type Slide = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  color: string;
};

const slides: Slide[] = [
  {
    id: "manager",
    emoji: "🌸",
    title: "店長",
    description: "プロジェクト責任者として全体を統括。\nチームの方向性を決める舵取り役。",
    color: "bg-pink-100",
  },
  {
    id: "claude",
    emoji: "🐳",
    title: "Claude Code",
    description: "AIコーディング支援ツール。\nコードの提案やデバッグをサポート。",
    color: "bg-blue-100",
  },
  {
    id: "deepseek",
    emoji: "🌿",
    title: "DeepSeek",
    description: "高性能なローカルLLM。\n手元のマシンで動く強力なAI。",
    color: "bg-green-100",
  },
  {
    id: "ollama",
    emoji: "⚡",
    title: "Ollama / Continue",
    description: "ローカル実行環境。\nVS Codeと連携し即座にコード生成。",
    color: "bg-yellow-100",
  },
  {
    id: "github",
    emoji: "🚀",
    title: "GitHub / Cloudflare",
    description: "コード管理と自動デプロイ。\n世界中に高速配信する基盤。",
    color: "bg-purple-100",
  },
];

export default function PresentationSlide() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      const newIndex = ((index % slides.length) + slides.length) % slides.length;
      if (newIndex === currentIndex) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsAnimating(false);
      }, 300);
    },
    [currentIndex, isAnimating]
  );

  const nextSlide = useCallback(() => goToSlide(currentIndex + 1), [currentIndex, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentIndex - 1), [currentIndex, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slide = slides[currentIndex];

  return (
    <section className="relative py-16 px-4 bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 min-h-[70vh] flex flex-col justify-center items-center select-none">
      <h2 className="text-3xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-sm">
        🌟 組織図プレゼン
      </h2>

      <div className="relative w-full max-w-lg mx-auto">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-2xl text-gray-700 hover:bg-white hover:scale-110 transition-all duration-200 active:scale-95"
          aria-label="前のスライド"
        >
          ←
        </button>

        <div
          className={`${slide.color} border-2 border-gray-200/50 rounded-3xl p-10 shadow-2xl shadow-black/10 backdrop-blur-sm w-full min-h-[320px] flex flex-col items-center justify-center text-center transition-all duration-300 ${
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="text-7xl mb-6 drop-shadow-lg">
            {slide.emoji}
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">{slide.title}</h3>
          <p className="text-lg text-gray-600 whitespace-pre-line leading-relaxed">
            {slide.description}
          </p>
        </div>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-2xl text-gray-700 hover:bg-white hover:scale-110 transition-all duration-200 active:scale-95"
          aria-label="次のスライド"
        >
          →
        </button>
      </div>

      <div className="flex gap-3 mt-10">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-pink-500 scale-125" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`スライド${i + 1}へ移動`}
          />
        ))}
      </div>

      <p className="text-sm text-gray-400 mt-4">← → キーでも操作できます</p>
    </section>
  );
}