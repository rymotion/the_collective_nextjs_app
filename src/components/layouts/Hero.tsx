import { ReactNode } from 'react';

interface HeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  align?: 'left' | 'center';
}

export function Hero({ title, subtitle, action, align = 'center' }: HeroProps) {
  const alignClass =
    align === 'center'
      ? 'text-center mx-auto max-w-4xl'
      : 'text-left max-w-3xl';

  return (
    <div className={alignClass}>
      <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter leading-tight mb-6">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl sm:text-2xl text-muted mb-8">{subtitle}</p>
      )}
      {action && (
        <div className="flex gap-4 justify-center sm:justify-start">
          {action}
        </div>
      )}
    </div>
  );
}
