import { Eyebrow } from "@/components/atoms/Eyebrow";
import { StartLight } from "@/components/atoms/StartLight";

export function StartGrid() {
  return (
    <section aria-label="Salida" className="absolute inset-0 grid place-items-center px-[6vw]">
      <div className="flex flex-col items-center text-center">
        <div data-intro-gantry className="gantry" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <StartLight key={i} />
          ))}
        </div>
        <div data-intro-copy>
          <Eyebrow className="mt-10">Temporada 2026 · Ferrari · Mercedes · McLaren</Eyebrow>
          <h1 className="intro-title mt-4">
            Tres colores.
            <br />
            Una parrilla.
          </h1>
          <Eyebrow className="mt-8 animate-pulse">Desliza para encender las luces</Eyebrow>
        </div>
      </div>
    </section>
  );
}
