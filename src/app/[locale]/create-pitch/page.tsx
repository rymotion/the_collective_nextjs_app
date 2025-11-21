"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { ProjectsService } from '@/services/projects.service';
import { CrewInvitationsService } from '@/services/crew-invitations.service';

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
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error publishing project:', error);
      alert('Failed to publish project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.title.trim().length > 0;
      case 2: return formData.synopsis.trim().length > 0;
      case 3: return formData.country_of_origin !== '';
      case 4: return formData.goal > 0 && formData.funding_duration_days > 0;
      case 5: return true;
      default: return false;
    }
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
        <div className="mb-12">
          <h1 className="text-h1 mb-4">Create Your Pitch</h1>
          <p className="text-subtitle">
            Share your cinematic vision with the community
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step <= currentStep
                      ? 'bg-primary text-white'
                      : 'bg-surface text-muted border-2 border-white/10'
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-primary' : 'bg-surface'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 mb-8">
          {currentStep === 1 && (
            <div>
              <h2 className="text-h2 mb-6">Step 1: Film Title</h2>
              <div>
                <label className="block text-sm font-bold mb-2">
                  What is the title of your film?
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter your film title"
                  className="w-full px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold mb-2">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary transition-all"
                >
                  <option value="">Select a genre</option>
                  {GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-h2 mb-6">Step 2: Story Summary</h2>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">
                  Film Synopsis
                </label>
                <textarea
                  value={formData.synopsis}
                  onChange={(e) => handleInputChange('synopsis', e.target.value)}
                  placeholder="Provide a compelling summary of your film..."
                  rows={6}
                  className="w-full px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Beginning</label>
                <textarea
                  value={formData.beginning}
                  onChange={(e) => handleInputChange('beginning', e.target.value)}
                  placeholder="What happens at the beginning?"
                  rows={3}
                  className="w-full px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Middle</label>
                <textarea
                  value={formData.middle}
                  onChange={(e) => handleInputChange('middle', e.target.value)}
                  placeholder="What happens in the middle?"
                  rows={3}
                  className="w-full px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">End</label>
                <textarea
                  value={formData.end}
                  onChange={(e) => handleInputChange('end', e.target.value)}
                  placeholder="What happens at the end?"
                  rows={3}
                  className="w-full px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all resize-none"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-h2 mb-6">Step 3: Country of Origin</h2>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Where will this film be made?
                </label>
                <select
                  value={formData.country_of_origin}
                  onChange={(e) => handleInputChange('country_of_origin', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary transition-all"
                >
                  <option value="">Select a country</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-h2 mb-6">Step 4: Funding Goal</h2>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">
                  Funding Goal (USD)
                </label>
                <input
                  type="number"
                  value={formData.goal || ''}
                  onChange={(e) => handleInputChange('goal', parseInt(e.target.value) || 0)}
                  placeholder="Enter your funding goal"
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Funding Duration (Days)
                </label>
                <input
                  type="number"
                  value={formData.funding_duration_days}
                  onChange={(e) => handleInputChange('funding_duration_days', parseInt(e.target.value) || 0)}
                  placeholder="Enter funding duration"
                  min="1"
                  max="365"
                  className="w-full px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all"
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
