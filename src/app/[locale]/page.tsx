import { getTranslations } from 'next-intl/server';
import MarqueeCarousel from "@/components/MarqueeCarousel";
import ProjectCarousel from "@/components/ProjectCarousel";
import { getProjects } from "@/data/mockData";

export default async function Home() {
  const { data: projects } = await getProjects();
  const t = await getTranslations('HomePage');

  return (
    <div className="w-full">
      {/* Hero Section - Centered and Spacious */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-display mb-6 tracking-tighter leading-tight">
              {t.rich('title', {
                span: (chunks) => <span className="text-primary">{chunks}</span>
              })}
            </h1>
            <p className="text-h3 text-muted font-normal leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Carousel Section - Full Width with Better Spacing */}
      <section className="w-full py-8 mb-12">
        <div className="container mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-h2">{t('trending')}</h2>
            <button className="text-sm font-bold text-primary hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-primary/10">
              {t('seeAll')} &rarr;
            </button>
          </div>
        </div>
        <MarqueeCarousel projects={projects} />
      </section>

      {/* Browse All Projects - Horizontal Carousel with Full Width */}
      <section className="w-full pb-16">
        <ProjectCarousel projects={projects} title="All Projects" />
      </section>
    </div>
  );
}
