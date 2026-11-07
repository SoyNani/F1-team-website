import type { ComponentProps } from "react";

const VARIANTS = {
  mark: "hud-mark",
  link: "hud-link",
  solid: "restart",
};

type ButtonProps = ComponentProps<"button"> & { variant: keyof typeof VARIANTS };

export function Button({ variant, className = "", ...props }: ButtonProps) {
  return <button type="button" className={`${VARIANTS[variant]} ${className}`} {...props} />;
}
