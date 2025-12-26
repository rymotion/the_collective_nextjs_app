import { ReactNode } from "react";

interface HeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
}

export function Hero({ title, subtitle, action, align = "center" }: HeroProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const maxWidth = align === "center" ? "64rem" : "48rem";
  const actionAlignClass =
    align === "center" ? "justify-center" : "justify-start";

  return (
    <div className={alignClass} style={{ maxWidth }}>
      <h1 className="text-display mb-6">{title}</h1>
      {subtitle && <p className="text-subtitle mb-8">{subtitle}</p>}
      {action && (
        <div className={`flex flex-wrap gap-4 ${actionAlignClass}`}>
          {action}
        </div>
      )}
    </div>
  );
}
