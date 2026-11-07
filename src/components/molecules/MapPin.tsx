import { PinDot } from "@/components/atoms/PinDot";

interface MapPinProps {
  id: string;
  name: string;
  note: string;
  side: "left" | "right";
  dy: number;
}

export function MapPin({ id, name, note, side, dy }: MapPinProps) {
  return (
    <div data-pin={id} className="layer pin">
      <PinDot />
      <span
        className={`pin-label ${side === "left" ? "pin-left" : "pin-right"}`}
        style={{ marginTop: `${dy}rem` }}
      >
        <strong>{name}</strong>
        <em>{note}</em>
      </span>
    </div>
  );
}
