import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PageLayout, Section, Grid, Hero } from '@/components/layouts';
import CategoryFilter from '@/components/CategoryFilter';
import ProjectCard from '@/components/ProjectCard';
import MarqueeCarousel from '@/components/MarqueeCarousel';
import EmptyProjectsState from '@/components/EmptyProjectsState';
import { getProjects } from '@/data/mockData';

const GENRES = [
  { id: 'action', name: 'Action', icon: '💥' },
  { id: 'drama', name: 'Drama', icon: '🎭' },
  { id: 'comedy', name: 'Comedy', icon: '😄' },
  { id: 'sci-fi', name: 'Sci-Fi', icon: '🚀' },
  { id: 'horror', name: 'Horror', icon: '👻' },
  { id: 'thriller', name: 'Thriller', icon: '🔪' },
];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { data: projects } = await getProjects();
  const t = await getTranslations('HomePage');

  if (!projects || projects.length === 0) {
    return <EmptyProjectsState locale={locale} />;
  }

  return (
    <PageLayout maxWidth="full">
      <Section spacing="xl">
        <div className="container">
          <Hero
            title={
              <>
                Bring creative projects to life with{' '}
                <span className="text-primary">The Collective</span>
              </>
            }
            subtitle="Discover and fund the next generation of independent films."
            action={
              <>
                <Link
                  href="/create-pitch"
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  Start a Project
                </Link>
                <Link
                  href="/search"
                  className="btn btn-outline text-lg px-8 py-4"
                >
                  Explore
                </Link>
              </>
            }
          />
        </div>
      </Section>

      <Section spacing="sm">
        <div className="container">
          <CategoryFilter categories={GENRES} />
        </div>
      </Section>

      <Section spacing="md">
        <div className="container mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bold">Trending Projects</h2>
            <Link
              href="/search"
              className="text-primary hover:text-white transition-colors"
            >
              See All →
            </Link>
          </div>
        </div>
        <MarqueeCarousel projects={projects.slice(0, 10)} />
      </Section>

      <Section spacing="lg">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">All Projects</h2>
          <Grid columns={4} gap="lg">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                id={p.id}
                title={p.title}
                author={p.author}
                imageUrl={p.imageUrl}
                raised={p.raised}
                goal={p.goal}
                genre={p.genre}
                deadline={p.deadline}
              />
            ))}
          </Grid>
        </div>
      </Section>

      <Section spacing="xl" background="surface">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Ready to bring your vision to life?
          </h2>
          <p className="text-xl text-muted mb-8">
            Join creators who funded projects through The Collective.
          </p>
          <Link
            href="/create-pitch"
            className="btn btn-primary text-lg px-8 py-4 inline-block"
          >
            Start Your Project
          </Link>
        </div>
      </Section>
    </PageLayout>
  );
}
