interface FeatureChipProps {
  term: string;
  meaning: string;
  rotation: number;
  className?: string;
}

export function FeatureChip({ term, meaning, rotation, className = "" }: FeatureChipProps) {
  return (
    <li data-chip data-rot={rotation} className={`layer chip ${className}`}>
      <strong>{term}</strong>
      <span>{meaning}</span>
    </li>
  );
}
