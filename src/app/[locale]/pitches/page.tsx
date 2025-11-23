import { PageLayout, Section, Grid, Hero } from '@/components/layouts';
import { Link } from '@/i18n/routing';
import PitchCard from '@/components/pitch/PitchCard';
import { PitchesService } from '@/services/pitches.service';

export default async function PitchesPage() {
  let pitches: any[] = [];
  let error = null;

  try {
    const result = await PitchesService.getAllPitches(20);
    pitches = result.data || [];
  } catch (err) {
    console.error('Error fetching pitches:', err);
    error = 'Failed to load pitches';
  }

  return (
    <PageLayout maxWidth="full">
      <Section spacing="xl">
        <div className="container">
          <Hero
            title={
              <>
                Film <span className="text-primary">Pitches</span>
              </>
            }
            subtitle="Discover and support creative film projects from talented creators around the world."
            action={
              <Link href="/create-pitch" className="btn btn-primary text-lg px-8 py-4">
                Submit Your Pitch
              </Link>
            }
          />
        </div>
      </Section>

      <Section spacing="lg">
        <div className="container">
          {error ? (
            <div className="glass-panel p-8 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary mt-4"
              >
                Try Again
              </button>
            </div>
          ) : pitches.length > 0 ? (
            <Grid columns={3} gap="lg">
              {pitches.map((pitch) => (
                <PitchCard key={pitch.id} pitch={pitch} />
              ))}
            </Grid>
          ) : (
            <div className="glass-panel p-12 text-center">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold mb-2">No Pitches Yet</h3>
              <p className="text-muted text-lg mb-6">
                Be the first to share your creative vision!
              </p>
              <Link href="/create-pitch" className="btn btn-primary">
                Submit Your Pitch
              </Link>
            </div>
          )}
        </div>
      </Section>
    </PageLayout>
  );
}
