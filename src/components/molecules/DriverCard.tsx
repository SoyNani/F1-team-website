import { DriverNumber } from "@/components/atoms/DriverNumber";
import { DriverPhoto } from "@/components/atoms/DriverPhoto";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { HonorBadge } from "@/components/atoms/HonorBadge";
import type { Driver } from "@/data/teams";

export function DriverCard({ driver, className }: { driver: Driver; className: string }) {
  return (
    <article
      data-driver
      data-rot={0}
      className={`layer driver absolute inset-x-0 bottom-[7svh] px-[6vw] md:inset-x-auto md:w-1/2 ${className}`}
    >
      <DriverPhoto photo={driver.photo} alt={`${driver.first} ${driver.last}`} />
      {driver.honor && <HonorBadge>{driver.honor}</HonorBadge>}
      <DriverNumber value={driver.number} />
      <h3 className="driver-name">
        <span>{driver.first}</span> <strong>{driver.last}</strong>
      </h3>
      <Eyebrow className="mt-2">
        {driver.country} · {driver.since}
      </Eyebrow>
      <p className="mt-3 max-w-md text-base leading-snug md:text-lg">{driver.bio}</p>
    </article>
  );
}
