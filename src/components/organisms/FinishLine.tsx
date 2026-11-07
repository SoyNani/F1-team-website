import { Button } from "@/components/atoms/Button";
import { Eyebrow } from "@/components/atoms/Eyebrow";

export function FinishLine({ onRestart }: { onRestart: () => void }) {
  return (
    <section aria-label="Final" className="absolute inset-0 grid place-items-center px-[6vw] text-center">
      <div>
        <Eyebrow data-outro-line className="layer">
          Bandera a cuadros
        </Eyebrow>
        <h2 data-outro-line className="layer intro-title mt-4">
          Rojo, plata y papaya.
          <br />
          Una sola pista.
        </h2>
        <p data-outro-line className="layer mx-auto mt-6 max-w-lg text-sm leading-relaxed md:text-base">
          Proyecto de aficionado sin relación oficial con la Fórmula 1 ni con los equipos. Los monoplazas y
          cascos son recreaciones artísticas. Fotos de Wikimedia Commons. Datos actualizados a noviembre de
          2026, con el Mundial de constructores aún en juego.
        </p>
        <Button variant="solid" data-restart onClick={onRestart} className="invisible mt-8">
          Volver a la salida
        </Button>
      </div>
    </section>
  );
}
