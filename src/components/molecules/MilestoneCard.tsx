import type { Milestone } from "@/data/teams";

interface MilestoneCardProps {
  milestone: Milestone;
  rotation: number;
  className: string;
}

export function MilestoneCard({ milestone, rotation, className }: MilestoneCardProps) {
  return (
    <article data-card data-rot={rotation} className={`layer card absolute w-[min(86vw,27rem)] ${className}`}>
      <p className="card-year">{milestone.year}</p>
      <h3 className="card-title">{milestone.title}</h3>
      <p className="card-text">{milestone.text}</p>
    </article>
  );
}
