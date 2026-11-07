import type { CSSProperties, ReactNode, Ref } from "react";

interface ExperienceTemplateProps {
  ref: Ref<HTMLDivElement>;
  trackHeight: string;
  theme: { accent: string; ink: string };
  scene: ReactNode;
  hud: ReactNode;
  children: ReactNode;
}

export function ExperienceTemplate({ ref, trackHeight, theme, scene, hud, children }: ExperienceTemplateProps) {
  return (
    <div ref={ref} style={{ "--accent": theme.accent, "--ink": theme.ink } as CSSProperties}>
      <div id="track" style={{ height: trackHeight }} aria-hidden />
      {scene}
      <main className="stage fixed inset-0 overflow-hidden">{children}</main>
      {hud}
    </div>
  );
}
