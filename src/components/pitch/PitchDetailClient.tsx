'use client';

import { useState } from 'react';
import { Section } from '@/components/layouts';
import PitchActions from './PitchActions';
import PitchEditForm from './PitchEditForm';
import WorkRequestButton from './WorkRequestButton';
import WorkRequestList from './WorkRequestList';
import FundingButton from './FundingButton';
import RedditCommentBoard from '@/components/comments/RedditCommentBoard';

interface PitchDetailClientProps {
  pitch: any;
  isOwner: boolean;
}

export default function PitchDetailClient({
  pitch: initialPitch,
  isOwner,
}: PitchDetailClientProps) {
  const [pitch, setPitch] = useState(initialPitch);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = (updatedPitch: any) => {
    setPitch(updatedPitch);
    setIsEditMode(false);
    window.location.reload();
  };

  if (isEditMode) {
    return (
      <>
        <Section spacing="lg">
          <div className="container">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">Edit Pitch</h1>
                <p className="text-muted">
                  Make changes to your pitch details below
                </p>
              </div>
              <PitchActions
                pitch={pitch}
                isEditMode={isEditMode}
                onToggleEdit={handleToggleEdit}
              />
            </div>

            <PitchEditForm
              pitch={pitch}
              onCancel={() => setIsEditMode(false)}
              onSave={handleSave}
            />
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Section spacing="lg">
        <div className="container">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 text-xs font-bold bg-primary/20 text-primary rounded-full uppercase tracking-wider">
                  {pitch.genre}
                </span>
                {pitch.pitch_status === 'funded' && (
                  <span className="px-3 py-1 text-xs font-bold bg-green-500/20 text-green-500 rounded-full uppercase tracking-wider">
                    Funded
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-bold mb-4">{pitch.title}</h1>
              <div className="flex items-center gap-4 text-muted">
                <span>by {pitch.author?.display_name || 'Anonymous'}</span>
                <span>•</span>
                <span>
                  {new Date(pitch.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {pitch.country_of_origin && (
                  <>
                    <span>•</span>
                    <span>{pitch.country_of_origin}</span>
                  </>
                )}
              </div>
            </div>

            <PitchActions
              pitch={pitch}
              isEditMode={isEditMode}
              onToggleEdit={isOwner ? handleToggleEdit : undefined}
            />
          </div>

          <div className="glass-panel p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-lg leading-relaxed text-muted whitespace-pre-wrap">
              {pitch.synopsis}
            </p>
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
                    ${pitch.goal?.toLocaleString() || 'Not specified'}
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
                <FundingButton projectId={pitch.id} projectTitle={pitch.title} />
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
              <WorkRequestList projectId={pitch.id} isOwner={isOwner} />
            </div>
            <div>
              <WorkRequestButton projectId={pitch.id} projectTitle={pitch.title} />
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="container">
          <RedditCommentBoard projectId={pitch.id} />
        </div>
      </Section>
    </>
  );
}
