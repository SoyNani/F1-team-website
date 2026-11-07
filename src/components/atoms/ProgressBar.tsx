import type { Ref } from "react";

export function ProgressBar({ ref }: { ref: Ref<HTMLDivElement> }) {
  return (
    <div className="fixed inset-x-0 top-0 z-30 h-[3px]" aria-hidden>
      <div ref={ref} className="h-full origin-left scale-x-0 bg-[var(--accent)]" />
    </div>
  );
}
