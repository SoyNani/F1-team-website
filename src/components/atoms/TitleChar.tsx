export function TitleChar({ char }: { char: string }) {
  return (
    <span data-char aria-hidden className="layer inline-block">
      {char}
    </span>
  );
}
