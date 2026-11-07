import { Eyebrow } from "@/components/atoms/Eyebrow";

export function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dd className="stat-value">{value}</dd>
      <Eyebrow as="dt" className="mt-1 max-w-36 opacity-80">
        {label}
      </Eyebrow>
    </div>
  );
}
