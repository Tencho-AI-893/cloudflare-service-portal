// components/OrgChart.tsx
import React from "react";

type OrgNode = {
  id: string;
  label: string;
  description: string;
};

const nodes: OrgNode[] = [
  {
    id: "manager",
    label: "店長",
    description: "プロジェクト責任者",
  },
  {
    id: "claude",
    label: "Claude Code",
    description: "AIコーディング支援",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    description: "ローカルLLM",
  },
  {
    id: "ollama",
    label: "Ollama / Continue",
    description: "ローカル実行環境",
  },
  {
    id: "github",
    label: "GitHub / Cloudflare",
    description: "コード管理＆デプロイ",
  },
];

// 各ノードに異なるポップな色とアイコンを設定
const popStyles = [
  {
    bg: "bg-pink-100",
    border: "border-pink-300",
    shadow: "shadow-pink-200/60",
    dot: "🌸",
    text: "text-pink-800",
    subText: "text-pink-600",
  },
  {
    bg: "bg-blue-100",
    border: "border-blue-300",
    shadow: "shadow-blue-200/60",
    dot: "🐳",
    text: "text-blue-800",
    subText: "text-blue-600",
  },
  {
    bg: "bg-green-100",
    border: "border-green-300",
    shadow: "shadow-green-200/60",
    dot: "🌿",
    text: "text-green-800",
    subText: "text-green-600",
  },
  {
    bg: "bg-yellow-100",
    border: "border-yellow-300",
    shadow: "shadow-yellow-200/60",
    dot: "⚡",
    text: "text-yellow-800",
    subText: "text-yellow-600",
  },
  {
    bg: "bg-purple-100",
    border: "border-purple-300",
    shadow: "shadow-purple-200/60",
    dot: "🚀",
    text: "text-purple-800",
    subText: "text-purple-600",
  },
];

export default function OrgChart() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          🌟 組織図
        </h2>

        <div className="relative pl-14 md:pl-20">
          {/* 縦の点線（カラフルにしたいのでグラデーション線の代わりにピンクの点線） */}
          <div className="absolute left-7 md:left-10 top-0 bottom-0 border-l-2 border-dashed border-pink-300" />

          <div className="space-y-12">
            {nodes.map((node, index) => {
              const style = popStyles[index];
              return (
                <div key={node.id} className="relative flex items-start">
                  {/* ポップなアイコン（ドットの代わり） */}
                  <div className="absolute left-0 md:-left-0 text-2xl -translate-x-1/2 mt-1 z-10 drop-shadow-lg">
                    {style.dot}
                  </div>

                  {/* カラフルカード */}
                  <div
                    className={`ml-10 md:ml-12 ${style.bg} ${style.border} border-2 rounded-2xl p-5 ${style.shadow} shadow-lg w-full max-w-md transform transition-transform hover:scale-105 hover:-rotate-1 duration-200`}
                  >
                    <h3 className={`text-lg font-bold ${style.text}`}>
                      {node.label}
                    </h3>
                    <p className={`text-sm mt-1 ${style.subText}`}>
                      {node.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}