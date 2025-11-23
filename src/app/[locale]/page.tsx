import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageLayout, Section, Grid, Hero } from "@/components/layouts";
import CategoryFilter from "@/components/CategoryFilter";
import ProjectCard from "@/components/ProjectCard";
import MarqueeCarousel from "@/components/MarqueeCarousel";
import EmptyProjectsState from "@/components/EmptyProjectsState";
import { PitchesService } from "@/services/pitches.service";

const GENRES = [
  { id: "action", name: "Action", icon: "💥" },
  { id: "drama", name: "Drama", icon: "🎭" },
  { id: "comedy", name: "Comedy", icon: "😄" },
  { id: "sci-fi", name: "Sci-Fi", icon: "🚀" },
  { id: "horror", name: "Horror", icon: "👻" },
  { id: "thriller", name: "Thriller", icon: "🔪" },
];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("HomePage");

  // Load data from Supabase
  let projects = [];
  let featuredProjects = [];
  let error = null;

  try {
    // Load all published pitches
    projects = await PitchesService.getAllPitches(20);

    // Load featured pitches for carousel/hero section
    featuredProjects = await PitchesService.getFeaturedPitches(10);
  } catch (err) {
    console.error("Error loading projects:", err);
    error = err;
  }

  // Handle error state
  if (error) {
    return (
      <PageLayout maxWidth="full">
        <Section spacing="xl">
          <div className="container text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Unable to Load Projects</h2>
            <p className="text-muted mb-6">
              We're having trouble loading projects right now. Please try again
              later.
            </p>
            <Link href="/" className="btn btn-primary">
              Try Again
            </Link>
          </div>
        </Section>
      </PageLayout>
    );
  }

  // Handle empty state
  if (!projects || projects.length === 0) {
    return <EmptyProjectsState locale={locale} />;
  }

  return (
    <PageLayout maxWidth="full">
      {/* Hero Section */}
      <Section spacing="xl">
        <div className="container">
          <Hero
            title={
              <>
                Bring creative projects to life with{" "}
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
                  Create Your Pitch
                </Link>
                <Link
                  href="/pitches"
                  className="btn btn-outline text-lg px-8 py-4 ml-4"
                >
                  Browse Projects
                </Link>
              </>
            }
          />
        </div>
      </Section>

      {/* Category Filter */}
      <Section spacing="sm">
        <div className="container">
          <CategoryFilter categories={GENRES} />
        </div>
      </Section>

      {/* Featured Projects Carousel */}
      {featuredProjects.length > 0 && (
        <Section spacing="md">
          <div className="container mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold">Featured Projects</h2>
              <Link
                href="/pitches"
                className="text-primary hover:text-white transition-colors"
              >
                See All →
              </Link>
            </div>
          </div>
          <MarqueeCarousel projects={featuredProjects} />
        </Section>
      )}

      {/* All Projects Grid */}
      <Section spacing="lg">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">All Projects</h2>
            <p className="text-muted">
              {projects.length} {projects.length === 1 ? "project" : "projects"}{" "}
              available
            </p>
          </div>

          <Grid columns={4} gap="lg">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                author={project.author?.display_name || "Anonymous"}
                imageUrl={project.image_url || ""}
                raised={
                  typeof project.raised === "string"
                    ? parseFloat(project.raised)
                    : project.raised
                }
                goal={
                  typeof project.goal === "string"
                    ? parseFloat(project.goal)
                    : project.goal
                }
                genre={project.genre}
                deadline={project.deadline}
                synopsis={project.synopsis}
                workRequestsCount={project.work_requests_count}
                commentsCount={project.comments_count}
                pitchStatus={project.pitch_status}
              />
            ))}
          </Grid>

          {/* Load More Button */}
          {projects.length >= 20 && (
            <div className="text-center mt-12">
              <button className="btn btn-outline">Load More Projects</button>
            </div>
          )}
        </div>
      </Section>

      {/* Call to Action Section */}
      <Section spacing="xl" background="surface">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Share Your Vision?
          </h2>
          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
            Join thousands of filmmakers bringing their stories to life. Create
            your pitch today and connect with a community ready to support your
            creative journey.
          </p>
          <Link
            href="/create-pitch"
            className="btn btn-primary text-lg px-8 py-4 inline-block"
          >
            Create Your Pitch
          </Link>
        </div>
      </Section>
    </PageLayout>
  );
}
