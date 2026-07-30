import type { Metadata, Viewport } from "next";
import "./globals.css";
import InstallPrompt from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: "StockLingo — 炒股版多邻国",
  description: "用游戏化方式学炒股",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StockLingo",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#58CC02",
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
        <InstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </body>
    </html>
  );
}
