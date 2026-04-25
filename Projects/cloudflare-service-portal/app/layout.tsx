import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TENCHO AI Service Portal",
  description: "AI service portal built with Next.js",
  keywords: ["AI", "TENCHO", "Service Portal"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header className="border-b border-slate-800 bg-slate-950 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a href="/" className="text-lg font-bold">
              TENCHO AI Service Portal
            </a>

            <nav className="flex gap-6 text-sm">
              <a href="#services" className="text-slate-300 hover:text-blue-400">
                サービス
              </a>
              <a href="#flow" className="text-slate-300 hover:text-blue-400">
                導入フロー
              </a>
              <a href="#contact" className="text-slate-300 hover:text-blue-400">
                お問い合わせ
              </a>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
