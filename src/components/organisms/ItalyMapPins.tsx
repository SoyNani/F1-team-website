import { MapPin } from "@/components/molecules/MapPin";
import { ITALY_PINS } from "@/data/teams";

export function ItalyMapPins() {
  return ITALY_PINS.map((pin) => (
    <MapPin key={pin.id} id={pin.id} name={pin.name} note={pin.note} side={pin.side} dy={pin.dy} />
  ));
}
