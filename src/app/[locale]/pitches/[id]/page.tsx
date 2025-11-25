import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { PageLayout, Section } from "@/components/layouts";
import PitchActions from "@/components/pitch/PitchActions";
import WorkRequestButton from "@/components/pitch/WorkRequestButton";
import WorkRequestList from "@/components/pitch/WorkRequestList";
import FundingButton from "@/components/pitch/FundingButton";
import RedditCommentBoard from "@/components/comments/RedditCommentBoard";
import ProjectDetails from "@/components/ProjectDetails";
import { PitchesService } from "@/services/pitches.service";

interface PitchPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function PitchPage({ params }: PitchPageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const currentUser = session?.user;

  let pitch: any = null;
  let error = null;

  try {
    // Load full pitch details including author, cast_crew, project_updates, and comments count
    pitch = await PitchesService.getPitchWithDetails(id);
    if (!pitch) {
      notFound();
    }
  } catch (err) {
    console.error("Error loading pitch:", err);
    error = "Failed to load pitch";
  }

  if (error || !pitch) {
    return (
      <PageLayout maxWidth="normal">
        <Section spacing="lg">
          <div className="glass-panel p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Error Loading Pitch</h2>
            <p className="text-muted">{error || "Pitch not found"}</p>
          </div>
        </Section>
      </PageLayout>
    );
  }

  const isOwner = currentUser?.id === pitch.author_id;

  // Map cast_crew into ProjectDetails props
  const cast = (pitch.cast_crew || [])
    .filter((member: any) => member.type === "cast")
    .map((member: any) => ({
      name: member.name,
      role: member.role,
      imageUrl: member.image_url,
    }));

  const crew = (pitch.cast_crew || [])
    .filter((member: any) => member.type === "crew")
    .map((member: any) => ({
      name: member.name,
      role: member.role,
      imageUrl: member.image_url,
    }));

  return (
    <PageLayout maxWidth="normal">
      <Section spacing="lg">
        <div className="container">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 text-xs font-bold bg-primary/20 text-primary rounded-full uppercase tracking-wider">
                  {pitch.genre}
                </span>
                {pitch.pitch_status === "funded" && (
                  <span className="px-3 py-1 text-xs font-bold bg-green-500/20 text-green-500 rounded-full uppercase tracking-wider">
                    Funded
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-bold mb-4">{pitch.title}</h1>
              <div className="flex items-center gap-4 text-muted">
                <span>by {pitch.author?.display_name || "Anonymous"}</span>
                <span>•</span>
                <span>
                  {new Date(pitch.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <PitchActions pitch={pitch} />
          </div>

          {/* Detailed project information: synopsis, cast, crew, etc. */}
          <div className="glass-panel p-8 mb-8">
            <ProjectDetails
              synopsis={pitch.synopsis}
              cast={cast}
              crew={crew}
              accolades={[]}
              funders={[]}
            />
          </div>
        </div>
      </Section>

      <Section spacing="md">
        <div className="container">
          <div className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-6">Funding</h2>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-muted">
                    Funding Goal
                  </h3>
                  <div className="text-4xl font-bold text-primary mb-2">
                    ${pitch.goal?.toLocaleString() || "Not specified"}
                  </div>
                  {pitch.raised && pitch.raised > 0 && (
                    <>
                      <div className="text-sm text-muted mb-3">
                        ${pitch.raised.toLocaleString()} raised so far (
                        {Math.round((pitch.raised / pitch.goal) * 100)}%)
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${Math.min(
                              (pitch.raised / pitch.goal) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <FundingButton projectId={id} projectTitle={pitch.title} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="md">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Work Requests</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WorkRequestList projectId={id} isOwner={isOwner} />
            </div>
            <div>
              <WorkRequestButton projectId={id} projectTitle={pitch.title} />
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="container">
          <RedditCommentBoard projectId={id} />
        </div>
      </Section>
    </PageLayout>
  );
}
