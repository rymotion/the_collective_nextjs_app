import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <footer className="mt-auto py-12 border-t border-[var(--glass-border)]">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm text-muted">
          {t('rights')}
        </div>
        <div className="flex gap-6 text-sm text-muted">
          <a href="#" className="hover:text-primary">Terms</a>
          <a href="#" className="hover:text-primary">Privacy</a>
          <a href="#" className="hover:text-primary">Contact</a>
        </div>
      </div>
    </footer>
  );
}
