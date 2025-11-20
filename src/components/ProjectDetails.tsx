interface CastMember {
  name: string;
  role: string;
  imageUrl?: string;
}

interface Accolade {
  title: string;
  year: string;
}

interface Funder {
  id: string;
  name: string;
  amount: number;
  imageUrl?: string;
}

interface ProjectDetailsProps {
  synopsis: string;
  cast: CastMember[];
  crew: CastMember[];
  accolades: Accolade[];
  funders: Funder[];
}

export default function ProjectDetails({
  synopsis,
  cast,
  crew,
  accolades,
  funders,
}: ProjectDetailsProps) {
  return (
    <div className="space-y-12">
      {/* Synopsis */}
      <section>
        <h3 className="text-2xl font-bold mb-4">Synopsis</h3>
        <p className="text-lg leading-relaxed text-muted">{synopsis}</p>
      </section>

      {/* Cast & Crew */}
      <section>
        <h3 className="text-2xl font-bold mb-6">Cast & Crew</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Cast</h4>
            <ul className="space-y-4">
              {cast.map((member, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface overflow-hidden">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted font-bold">
                        {member.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted">{member.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary">Crew</h4>
            <ul className="space-y-4">
              {crew.map((member, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface overflow-hidden">
                     {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted font-bold">
                        {member.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted">{member.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Accolades */}
      {accolades.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-6">Accolades</h3>
          <div className="flex flex-wrap gap-4">
            {accolades.map((accolade, idx) => (
              <div key={idx} className="glass-panel px-6 py-4 flex flex-col items-center text-center">
                <span className="text-2xl mb-2">🏆</span>
                <span className="font-bold">{accolade.title}</span>
                <span className="text-sm text-muted">{accolade.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Funders */}
      <section>
        <h3 className="text-2xl font-bold mb-6">Funders</h3>
        <div className="glass-panel p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {funders.map((funder) => (
              <div key={funder.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface overflow-hidden">
                   {funder.imageUrl ? (
                      <img src={funder.imageUrl} alt={funder.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted font-bold">
                        {funder.name[0]}
                      </div>
                    )}
                </div>
                <div>
                  <div className="text-sm font-medium">{funder.name}</div>
                  <div className="text-xs text-primary">${funder.amount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
