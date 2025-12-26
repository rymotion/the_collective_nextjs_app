import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  spacing?: "sm" | "md" | "lg" | "xl";
  background?: "default" | "surface" | "transparent";
}

export function Section({
  children,
  spacing = "lg",
  background = "transparent",
}: SectionProps) {
  const padding = {
    sm: "var(--spacing-6)",
    md: "var(--spacing-8)",
    lg: "var(--spacing-10)",
    xl: "var(--spacing-12)",
  }[spacing];

  const backgroundColor =
    background === "default"
      ? "var(--background)"
      : background === "surface"
      ? "var(--surface)"
      : "transparent";

  return (
    <section
      style={{
        paddingTop: padding,
        paddingBottom: padding,
        background: backgroundColor,
      }}
    >
      {children}
    </section>
  );
}
