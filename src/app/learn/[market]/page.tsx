import { getMarkets } from "@/lib/content";
import MarketLearnClient from "./MarketLearnClient";

export function generateStaticParams() {
  return getMarkets().map((m) => ({ market: m.market }));
}

export default function MarketLearnPage({
  params,
}: {
  params: { market: string };
}) {
  return <MarketLearnClient market={params.market} />;
}
