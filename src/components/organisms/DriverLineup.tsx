import { DriverCard } from "@/components/molecules/DriverCard";
import type { Team } from "@/data/teams";

export function DriverLineup({ drivers }: { drivers: Team["drivers"] }) {
  return drivers.map((driver, i) => (
    <DriverCard key={driver.last} driver={driver} className={i === 0 ? "md:left-0" : "md:right-0"} />
  ));
}
