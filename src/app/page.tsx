import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center gap-8 px-6 pt-16">
        <h1 className="text-4xl font-black text-duo-green">StockLingo</h1>
        <p className="text-center text-duo-gray-400">
          用游戏化方式学炒股
          <br />
          像学语言一样学投资
        </p>

        <div className="w-full space-y-4 pt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-duo-gray-300">
            选择市场
          </h2>
          <Link
            href="/learn"
            className="card flex items-center gap-4 border-duo-green hover:bg-green-50 transition-colors"
          >
            <span className="text-4xl">🇨🇳</span>
            <div>
              <h3 className="text-lg font-bold">A股市场</h3>
              <p className="text-sm text-duo-gray-300">
                从零开始学A股，3章 · 15关
              </p>
            </div>
          </Link>

          <div className="card flex items-center gap-4 opacity-40">
            <span className="text-4xl">🇺🇸</span>
            <div>
              <h3 className="text-lg font-bold">美股市场</h3>
              <p className="text-sm text-duo-gray-300">即将推出</p>
            </div>
          </div>

          <div className="card flex items-center gap-4 opacity-40">
            <span className="text-4xl">🇭🇰</span>
            <div>
              <h3 className="text-lg font-bold">港股市场</h3>
              <p className="text-sm text-duo-gray-300">即将推出</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
