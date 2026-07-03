import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockLingo — 炒股版多邻国",
  description: "用游戏化方式学炒股",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-duo-gray-100">
        <main className="mx-auto max-w-lg pb-20">{children}</main>
      </body>
    </html>
  );
}
