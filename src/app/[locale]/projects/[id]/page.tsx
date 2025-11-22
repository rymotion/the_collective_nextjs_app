import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { ProjectsService } from '@/services/projects.service';
import OwnerControls from '@/components/OwnerControls';
import ImdbPrompt from '@/components/ImdbPrompt';
import BidButton from '@/components/BidButton';
import FundButton from '@/components/FundButton';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
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

  const { data: { session } } = await supabase.auth.getSession();
  const currentUser = session?.user;

  if (!currentUser) {
    redirect(`/auth/signin?redirect=/projects/${id}`);
  }

  const project = await ProjectsService.getProject(id);

  if (!project) {
    notFound();
  }

  const isOwner = project.author_id === currentUser.id;

  let hasImdbAccount = false;
  if (!isOwner) {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('imdb_profile_url, imdb_synced')
      .eq('id', currentUser.id)
      .maybeSingle();

    hasImdbAccount = !!(
      userProfile?.imdb_profile_url &&
      userProfile?.imdb_synced === true
    );
  }

  const progress = Math.min((project.raised / project.goal) * 100, 100);

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

        <div className="lg:col-span-4">
          <div className="sticky top-[calc(var(--nav-height)+24px)]">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-6">
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <span className="text-6xl opacity-20">🎬</span>
                </div>
              )}
            </div>

            <div className="glass-panel p-6 lg:hidden">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-2xl font-bold text-primary">${project.raised.toLocaleString()}</span>
                  <span className="text-xs text-muted ml-2">pledged</span>
                </div>
                <span className="text-lg font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12">

          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-bold bg-primary/20 text-primary rounded-full border border-primary/20 uppercase tracking-wider">
                {project.genre}
              </span>
              <span className="text-sm text-muted">Created {new Date(project.created_at).toLocaleDateString()}</span>
              {project.status && (
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                  project.status === 'active' ? 'bg-green-500/20 text-green-500' :
                  project.status === 'funded' ? 'bg-blue-500/20 text-blue-500' :
                  project.status === 'completed' ? 'bg-purple-500/20 text-purple-500' :
                  'bg-white/10 text-muted'
                }`}>
                  {project.status}
                </span>
              )}
            </div>

            <h1 className="text-display mb-2 leading-tight">{project.title}</h1>
            <p className="text-h3 text-muted font-normal mb-6">
              by {project.author?.display_name || 'Anonymous'}
            </p>

            {project.country_of_origin && (
              <div className="flex items-center gap-2 mb-6 text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{project.country_of_origin}</span>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <p className="text-body text-lg leading-relaxed text-muted/90 whitespace-pre-wrap">
                {project.synopsis}
              </p>
            </div>
          </section>

          {project.cast && project.cast.length > 0 && (
            <section>
              <h3 className="text-h2 mb-6">Attached Talent</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-h3 mb-4 text-primary">Cast</h4>
                  <ul className="space-y-4">
                    {project.cast.map((member) => (
                      <li key={member.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-surface overflow-hidden shrink-0">
                          {member.image_url ? (
                            <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted font-bold">
                              {member.name[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-lg">{member.name}</div>
                          <div className="text-sm text-muted">{member.role}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                {project.crew && project.crew.length > 0 && (
                  <div>
                    <h4 className="text-h3 mb-4 text-primary">Crew</h4>
                    <ul className="space-y-4">
                      {project.crew.map((member) => (
                        <li key={member.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-surface overflow-hidden shrink-0">
                            {member.image_url ? (
                              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted font-bold">
                                {member.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-lg">{member.name}</div>
                            <div className="text-sm text-muted">{member.role}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {isOwner && <OwnerControls project={project} />}

          {!isOwner && hasImdbAccount && (
            <section className="glass-panel p-8 border-2 border-green-500/30">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  IMDb Verified Professional
                </span>
              </div>
              <h3 className="text-h2 mb-4">Join the Production</h3>
              <p className="text-muted mb-6">
                Place a bid to work on this project as a verified industry professional.
              </p>
              <BidButton />
            </section>
          )}

          {!isOwner && !hasImdbAccount && <ImdbPrompt />}

          {!isOwner && (
            <section>
              <h3 className="text-h2 mb-6">Support this Project</h3>
              <div className="glass-panel p-8 mb-8">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-4xl font-bold text-white">${project.raised.toLocaleString()}</span>
                    <span className="text-sm text-muted ml-2">pledged of ${project.goal.toLocaleString()} goal</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="h-4 w-full bg-surface rounded-full overflow-hidden mb-8 border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-red-600 shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {project.deadline && (
                  <div className="mb-6 flex items-center gap-2 text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Funding deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                )}

                <FundButton projectId={id} />
              </div>
            </section>
          )}

          {project.accolades && project.accolades.length > 0 && (
            <section>
              <h3 className="text-h2 mb-6">Accolades</h3>
              <div className="flex flex-wrap gap-4">
                {project.accolades.map((accolade) => (
                  <div key={accolade.id} className="glass-panel px-6 py-4 flex flex-col items-center text-center min-w-[140px]">
                    <span className="text-3xl mb-2">🏆</span>
                    <span className="font-bold text-sm">{accolade.title}</span>
                    <span className="text-xs text-muted mt-1">{accolade.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
