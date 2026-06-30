import type { ComponentType } from "react";
import { DowntimeCostCalculator } from "./DowntimeCostCalculator";

const TOOL_CALCULATORS: Record<string, ComponentType> = {
  "downtime-cost-calculator": DowntimeCostCalculator,
};

interface ToolCalculatorProps {
  slug: string;
}

export function ToolCalculator({ slug }: ToolCalculatorProps) {
  const Calculator = TOOL_CALCULATORS[slug];
  if (!Calculator) return null;
  return <Calculator />;
}

export function hasToolCalculator(slug: string): boolean {
  return slug in TOOL_CALCULATORS;
}
