import { getTranslations } from 'next-intl/server';
import MarqueeCarousel from "@/components/MarqueeCarousel";
import { getProjects } from "@/data/mockData";

export default async function Home() {
  const { data: projects } = await getProjects();
  const t = await getTranslations('HomePage');

  return (
    <>
      {/* Hero Section - Contained */}
      <section className="container py-12 mb-8">
        <div className="text-center">
          <h1 className="text-display mb-4 tracking-tighter">
            {t.rich('title', {
              span: (chunks) => <span className="text-primary">{chunks}</span>
            })}
          </h1>
          <p className="text-h3 text-muted max-w-2xl mx-auto font-normal">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Carousel Section - Full Width */}
      <section className="w-full mb-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-h2">{t('trending')}</h2>
            <button className="text-sm font-bold text-primary hover:text-white transition-colors">
              {t('seeAll')} &rarr;
            </button>
          </div>
        </div>
        <MarqueeCarousel projects={projects} />
      </section>
    </>
  );
}
