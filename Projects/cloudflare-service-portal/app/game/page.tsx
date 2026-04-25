import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TENCHO AI Service Portal",
  description: "AI導入・業務自動化サービス",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}