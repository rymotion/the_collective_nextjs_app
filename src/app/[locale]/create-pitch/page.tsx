"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { ProjectsService } from '@/services/projects.service';
import { CrewInvitationsService } from '@/services/crew-invitations.service';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Select from '@/components/Select';

interface PitchFormData {
  title: string;
  synopsis: string;
  beginning: string;
  middle: string;
  end: string;
  country_of_origin: string;
  goal: number;
  funding_duration_days: number;
  genre: string;
}

interface CrewMember {
  full_name: string;
  email: string;
}

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand',
  'France', 'Germany', 'Spain', 'Italy', 'Mexico', 'Brazil', 'Argentina',
  'India', 'Japan', 'South Korea', 'China', 'Other'
];

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
  'Thriller', 'Romance', 'Documentary', 'Fantasy', 'Mystery', 'Western'
];

export default function CreatePitchPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSupabaseAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PitchFormData>({
    title: '',
    synopsis: '',
    beginning: '',
    middle: '',
    end: '',
    country_of_origin: '',
    goal: 0,
    funding_duration_days: 30,
    genre: '',
  });

  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/signin?redirect=/create-pitch');
    }
  }, [isAuthenticated, loading, router]);

  const handleInputChange = (field: keyof PitchFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCrewMember = () => {
    setCrewMembers(prev => [...prev, { full_name: '', email: '' }]);
  };

  const handleRemoveCrewMember = (index: number) => {
    setCrewMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleCrewMemberChange = (index: number, field: keyof CrewMember, value: string) => {
    setCrewMembers(prev => prev.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    ));
  };

  const saveDraft = async () => {
    if (!user) return;

    try {
      setSubmitting(true);

      const fullSynopsis = `${formData.synopsis}\n\nBeginning: ${formData.beginning}\n\nMiddle: ${formData.middle}\n\nEnd: ${formData.end}`;

      const projectData = {
        title: formData.title,
        author_id: user.id,
        synopsis: fullSynopsis,
        genre: formData.genre,
        goal: formData.goal,
        country_of_origin: formData.country_of_origin,
        funding_duration_days: formData.funding_duration_days,
        is_published: false,
        is_pitch: true,
        pitch_status: 'draft',
      };

      if (draftId) {
        await ProjectsService.updateProject(draftId, projectData);
      } else {
        const newProject = await ProjectsService.createProject(projectData);
        setDraftId(newProject.id);
      }

      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const publishProject = async () => {
    if (!user) return;

    try {
      setSubmitting(true);

      const fullSynopsis = `${formData.synopsis}\n\nBeginning: ${formData.beginning}\n\nMiddle: ${formData.middle}\n\nEnd: ${formData.end}`;

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + formData.funding_duration_days);

      const projectData = {
        title: formData.title,
        author_id: user.id,
        synopsis: fullSynopsis,
        genre: formData.genre,
        goal: formData.goal,
        country_of_origin: formData.country_of_origin,
        funding_duration_days: formData.funding_duration_days,
        is_published: true,
        is_pitch: true,
        pitch_status: 'published',
        status: 'active' as const,
        deadline: deadline.toISOString(),
      };

      let projectId = draftId;

      if (draftId) {
        await ProjectsService.updateProject(draftId, projectData);
      } else {
        const newProject = await ProjectsService.createProject(projectData);
        projectId = newProject.id;
      }

      if (projectId && crewMembers.length > 0) {
        const validCrewMembers = crewMembers.filter(
          member => member.full_name && member.email
        );

        if (validCrewMembers.length > 0) {
          await CrewInvitationsService.bulkCreateInvitations(
            projectId,
            user.id,
            validCrewMembers
          );
        }
      }

      alert('Project published successfully!');
      router.push(`/pitches/${projectId}`);
    } catch (error) {
      console.error('Error publishing project:', error);
      alert('Failed to publish project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToStep = (step: number) => {
    if (step <= currentStep || completedSteps.has(step - 1)) {
      setCurrentStep(step);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.title.trim().length > 0 && formData.genre !== '';
      case 2: return formData.synopsis.trim().length > 0;
      case 3: return formData.country_of_origin !== '';
      case 4: return formData.goal > 0 && formData.funding_duration_days > 0;
      case 5: return true;
      default: return false;
    }
  };

  const isStepRequired = (step: number) => {
    return step !== 5;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full page-content">
      <div className="container-narrow">
        <div className="mb-8">
          <h1 className="text-h1 mb-4">Create Your Pitch</h1>
          <p className="text-subtitle">
            Share your cinematic vision with the community
          </p>
        </div>

        <div className="glass-panel p-6 mb-8 border-2 border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Workflow Progress</h3>
              <p className="text-sm text-muted">
                Complete all required steps to publish your project
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {completedSteps.size}/5
              </div>
              <div className="text-xs text-muted">Steps Completed</div>
            </div>
          </div>
          {draftId && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Draft saved - Your progress is secure
              </div>
            </div>
          )}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => {
              const isCompleted = completedSteps.has(step);
              const isCurrent = step === currentStep;
              const isClickable = step <= currentStep || completedSteps.has(step - 1);

              return (
                <div key={step} className="flex items-center flex-1">
                  <button
                    onClick={() => goToStep(step)}
                    disabled={!isClickable}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all relative ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : isCurrent
                        ? 'bg-primary text-white ring-4 ring-primary/30'
                        : isClickable
                        ? 'bg-surface text-muted border-2 border-white/10 hover:border-primary cursor-pointer'
                        : 'bg-surface text-muted border-2 border-white/10 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      step
                    )}
                  </button>
                  {step < 5 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${
                        completedSteps.has(step) ? 'bg-green-600' : 'bg-surface'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-muted px-1">
            <span className={currentStep === 1 ? 'text-primary font-bold' : ''}>
              Title {isStepRequired(1) && <span className="text-red-500">*</span>}
            </span>
            <span className={currentStep === 2 ? 'text-primary font-bold' : ''}>
              Synopsis {isStepRequired(2) && <span className="text-red-500">*</span>}
            </span>
            <span className={currentStep === 3 ? 'text-primary font-bold' : ''}>
              Country {isStepRequired(3) && <span className="text-red-500">*</span>}
            </span>
            <span className={currentStep === 4 ? 'text-primary font-bold' : ''}>
              Funding {isStepRequired(4) && <span className="text-red-500">*</span>}
            </span>
            <span className={currentStep === 5 ? 'text-primary font-bold' : ''}>
              Crew (Optional)
            </span>
          </div>
        </div>

        <div className="glass-panel p-8 mb-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-h2 mb-6">Step 1: Film Title</h2>
              <Input
                label="What is the title of your film?"
                type="text"
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                placeholder="Enter your film title"
                required
              />

              <Select
                label="Genre"
                value={formData.genre}
                onChange={(value) => handleInputChange('genre', value)}
                options={GENRES.map(genre => ({ value: genre, label: genre }))}
                placeholder="Select a genre"
                required
                className="mt-6"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-h2 mb-6">Step 2: Story Summary</h2>

              <TextArea
                label="Film Synopsis"
                value={formData.synopsis}
                onChange={(value) => handleInputChange('synopsis', value)}
                placeholder="Provide a compelling summary of your film..."
                rows={6}
                autoResize
                required
                className="mb-6"
              />

              <TextArea
                label="Beginning"
                value={formData.beginning}
                onChange={(value) => handleInputChange('beginning', value)}
                placeholder="What happens at the beginning?"
                rows={3}
                autoResize
                className="mb-4"
              />

              <TextArea
                label="Middle"
                value={formData.middle}
                onChange={(value) => handleInputChange('middle', value)}
                placeholder="What happens in the middle?"
                rows={3}
                autoResize
                className="mb-4"
              />

              <TextArea
                label="End"
                value={formData.end}
                onChange={(value) => handleInputChange('end', value)}
                placeholder="What happens at the end?"
                rows={3}
                autoResize
              />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-h2 mb-6">Step 3: Country of Origin</h2>
              <Select
                label="Where will this film be made?"
                value={formData.country_of_origin}
                onChange={(value) => handleInputChange('country_of_origin', value)}
                options={COUNTRIES.map(country => ({ value: country, label: country }))}
                placeholder="Select a country"
                required
              />
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-h2 mb-6">Step 4: Funding Goal</h2>

              <Input
                label="Funding Goal (USD)"
                type="number"
                value={formData.goal?.toString() || ''}
                onChange={(value) => handleInputChange('goal', parseInt(value) || 0)}
                placeholder="Enter your funding goal"
                required
                className="mb-6"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 111.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clipRule="evenodd" />
                  </svg>
                }
              />

              <div>
                <Input
                  label="Funding Duration (Days)"
                  type="number"
                  value={formData.funding_duration_days.toString()}
                  onChange={(value) => handleInputChange('funding_duration_days', parseInt(value) || 0)}
                  placeholder="Enter funding duration"
                  required
                />
                <p className="text-caption mt-2">
                  How many days should the funding campaign last?
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-h2 mb-6">Step 5: Invite Crew Members</h2>
              <p className="text-body mb-6">
                Invite crew members to collaborate on your project (optional)
              </p>

              {crewMembers.map((member, index) => (
                <div key={index} className="flex gap-4 mb-4">
                  <input
                    type="text"
                    value={member.full_name}
                    onChange={(e) => handleCrewMemberChange(index, 'full_name', e.target.value)}
                    placeholder="Full Name"
                    className="flex-1 px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all"
                  />
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleCrewMemberChange(index, 'email', e.target.value)}
                    placeholder="Email Address"
                    className="flex-1 px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all"
                  />
                  <button
                    onClick={() => handleRemoveCrewMember(index)}
                    className="px-4 py-3 bg-surface border-2 border-white/10 rounded-lg hover:border-primary transition-all"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={handleAddCrewMember}
                className="btn btn-outline mb-6"
              >
                Add Crew Member
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-4">
            <button
              onClick={saveDraft}
              disabled={submitting}
              className="btn btn-outline"
            >
              {submitting ? 'Saving...' : 'Save as Draft'}
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={publishProject}
                disabled={submitting || !canProceed()}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Publishing...' : 'Publish Project'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
