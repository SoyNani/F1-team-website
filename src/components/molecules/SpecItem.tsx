import { Eyebrow } from "@/components/atoms/Eyebrow";

export function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div data-spec data-rot={0} className="layer spec">
      <Eyebrow as="dt">{label}</Eyebrow>
      <dd>{value}</dd>
    </div>
  );
}
