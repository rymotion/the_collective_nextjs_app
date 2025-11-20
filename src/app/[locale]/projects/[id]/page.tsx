import { getProject } from "@/data/mockData";
import ProjectDetails from "@/components/ProjectDetails";
import { notFound } from "next/navigation";
import BidButton from "@/components/BidButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const progress = Math.min((project.raised / project.goal) * 100, 100);

  return (
    <div className="container py-12">
      {/* Desktop Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        
        {/* Left Column: Poster (Sticky on Desktop) */}
        <div className="lg:col-span-4">
          <div className="sticky top-[calc(var(--nav-height)+24px)]">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10 mb-6">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Quick Stats for Mobile/Tablet (Hidden on Desktop if desired, but good to keep handy) */}
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
        
        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Header Info */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-bold bg-primary/20 text-primary rounded-full border border-primary/20 uppercase tracking-wider">
                {project.genre}
              </span>
              <span className="text-sm text-muted">Created {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            
            <h1 className="text-display mb-2 leading-tight">{project.title}</h1>
            <p className="text-h3 text-muted font-normal mb-6">by {project.author}</p>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-body text-lg leading-relaxed text-muted/90">
                {project.synopsis}
              </p>
            </div>
          </section>

          {/* Cast & Crew (Who is attached) */}
          <section>
            <h3 className="text-h2 mb-6">Attached Talent</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-h3 mb-4 text-primary">Cast</h4>
                <ul className="space-y-4">
                  {project.cast.map((member, idx) => (
                    <li key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-surface overflow-hidden shrink-0">
                        {member.imageUrl ? (
                          <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
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
                  {project.cast.length === 0 && <li className="text-muted italic">No cast attached yet.</li>}
                </ul>
              </div>
              <div>
                <h4 className="text-h3 mb-4 text-primary">Crew</h4>
                <ul className="space-y-4">
                  {project.crew.map((member, idx) => (
                    <li key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-surface overflow-hidden shrink-0">
                        {member.imageUrl ? (
                          <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
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
            </div>
          </section>

import BidButton from "@/components/BidButton";

          {/* Bid to Work Section */}
          <section className="glass-panel p-8 border-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-9xl">🎬</span>
            </div>
            <h3 className="text-h2 mb-2">Join the Production</h3>
            <p className="text-body text-muted mb-6 max-w-xl">
              Are you a professional looking to work on this project? Sync your IMDb profile to place a bid.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <BidButton />
              <div className="flex items-center gap-2 text-xs text-muted justify-center sm:justify-start h-[52px]">
                 <span>🔒 Verified Pro Access Only</span>
              </div>
            </div>
          </section>

          {/* Funding Metrics & Funders */}
          <section>
            <h3 className="text-h2 mb-6">Funding Status</h3>
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
              
              <button className="btn btn-primary w-full text-xl py-4 shadow-lg shadow-primary/20">
                Fund This Project
              </button>
            </div>

            <h4 className="text-h3 mb-4">Recent Backers</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {project.funders.map((funder) => (
                <div key={funder.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface/50 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-surface overflow-hidden shrink-0">
                     {funder.imageUrl ? (
                        <img src={funder.imageUrl} alt={funder.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted font-bold">
                          {funder.name[0]}
                        </div>
                      )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{funder.name}</div>
                    <div className="text-xs text-primary font-mono">${funder.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
              {project.funders.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted">
                  Be the first to fund this project!
                </div>
              )}
            </div>
          </section>

          {/* Accolades */}
          {project.accolades.length > 0 && (
            <section>
              <h3 className="text-h2 mb-6">Accolades</h3>
              <div className="flex flex-wrap gap-4">
                {project.accolades.map((accolade, idx) => (
                  <div key={idx} className="glass-panel px-6 py-4 flex flex-col items-center text-center min-w-[140px]">
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
