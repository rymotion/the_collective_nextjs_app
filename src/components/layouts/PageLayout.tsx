import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: 'narrow' | 'normal' | 'full';
}

export function PageLayout({ children, maxWidth = 'normal' }: PageLayoutProps) {
  const containerClass =
    maxWidth === 'narrow'
      ? 'container-narrow'
      : maxWidth === 'full'
      ? 'container-full'
      : 'container';

  return <div className={`w-full ${containerClass}`}>{children}</div>;
}
