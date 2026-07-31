import { getAllScenarios } from "@/lib/scenarios";
import ScenarioPlayClient from "./ScenarioPlayClient";

export function generateStaticParams() {
  return getAllScenarios().map((s) => ({ id: s.id }));
}

export default function ScenarioPlayPage({
  params,
}: {
  params: { id: string };
}) {
  return <ScenarioPlayClient scenarioId={params.id} />;
}
