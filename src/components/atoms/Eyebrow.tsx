import type { ComponentProps } from "react";

type EyebrowProps = ComponentProps<"p"> & { as?: "p" | "dt" };

export function Eyebrow({ as: Tag = "p", className = "", ...props }: EyebrowProps) {
  return <Tag className={`eyebrow ${className}`} {...props} />;
}
