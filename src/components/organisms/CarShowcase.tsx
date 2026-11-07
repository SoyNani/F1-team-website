import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SpecItem } from "@/components/molecules/SpecItem";
import type { Team } from "@/data/teams";

export function CarShowcase({ car }: { car: Team["car"] }) {
  return (
    <>
      <div data-car-name className="layer absolute left-[6vw] top-[15svh]">
        <Eyebrow>{car.line}</Eyebrow>
        <h3 className="car-name">{car.name}</h3>
      </div>
      <dl className="absolute inset-x-[6vw] bottom-[6svh] grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {car.specs.map((s) => (
          <SpecItem key={s.label} label={s.label} value={s.value} />
        ))}
      </dl>
    </>
  );
}
