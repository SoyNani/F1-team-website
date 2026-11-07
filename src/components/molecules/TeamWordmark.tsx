import { TitleChar } from "@/components/atoms/TitleChar";

export function TeamWordmark({ name }: { name: string }) {
  return (
    <h2 data-title className="team-title origin-top-left" aria-label={name}>
      {name.split("").map((char, i) => (
        <TitleChar key={i} char={char} />
      ))}
    </h2>
  );
}
