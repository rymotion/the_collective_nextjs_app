import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'surface' | 'transparent';
}

export function Section({
  children,
  spacing = 'lg',
  background = 'transparent',
}: SectionProps) {
  const spacingClass = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  }[spacing];

  const bgClass = {
    default: 'bg-background',
    surface: 'bg-surface',
    transparent: '',
  }[background];

  return <section className={`${spacingClass} ${bgClass}`}>{children}</section>;
}
