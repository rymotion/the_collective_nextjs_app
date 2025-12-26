"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { ProjectsService } from "@/services/projects.service";
import { CrewInvitationsService } from "@/services/crew-invitations.service";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import Select from "@/components/Select";

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
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "New Zealand",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Mexico",
  "Brazil",
  "Argentina",
  "India",
  "Japan",
  "South Korea",
  "China",
  "Other",
];

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "Documentary",
  "Fantasy",
  "Mystery",
  "Western",
];

export default function CreatePitchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useSupabaseAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PitchFormData>({
    title: "",
    synopsis: "",
    beginning: "",
    middle: "",
    end: "",
    country_of_origin: "",
    goal: 0,
    funding_duration_days: 30,
    genre: "",
  });

  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const pathWithoutLocale =
        pathname.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
      router.push(
        `/auth/signin?redirect=${encodeURIComponent(pathWithoutLocale)}`
      );
    }
  }, [isAuthenticated, loading, pathname, router]);

  const handleInputChange = (
    field: keyof PitchFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCrewMember = () => {
    setCrewMembers((prev) => [...prev, { full_name: "", email: "" }]);
  };

  const handleRemoveCrewMember = (index: number) => {
    setCrewMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCrewMemberChange = (
    index: number,
    field: keyof CrewMember,
    value: string
  ) => {
    setCrewMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
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
        pitch_status: "draft",
      };

      if (draftId) {
        await ProjectsService.updateProject(draftId, projectData);
      } else {
        const newProject = await ProjectsService.createProject(projectData);
        setDraftId(newProject.id);
      }

      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
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
        pitch_status: "published",
        status: "active" as const,
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
          (member) => member.full_name && member.email
        );

        if (validCrewMembers.length > 0) {
          await CrewInvitationsService.bulkCreateInvitations(
            projectId,
            user.id,
            validCrewMembers
          );
        }
      }

      alert("Project published successfully!");
      router.push(`/pitches/${projectId}`);
    } catch (error) {
      console.error("Error publishing project:", error);
      alert("Failed to publish project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
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
      case 1:
        return formData.title.trim().length > 0 && formData.genre !== "";
      case 2:
        return formData.synopsis.trim().length > 0;
      case 3:
        return formData.country_of_origin !== "";
      case 4:
        return formData.goal > 0 && formData.funding_duration_days > 0;
      case 5:
        return true;
      default:
        return false;
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

        <div
          className="glass-panel p-6 mb-8"
          style={{ border: "2px solid rgba(229, 9, 20, 0.3)" }}
        >
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
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "#22c55e" }}
              >
                <span aria-hidden="true">✓</span>
                Draft saved - Your progress is secure
              </div>
            </div>
          )}
        </div>

        <div className="mb-12">
          <div
            className="flex items-center justify-between mb-4"
            style={{ gap: "var(--spacing-2)", overflowX: "auto" }}
          >
            {[1, 2, 3, 4, 5].map((step) => {
              const isCompleted = completedSteps.has(step);
              const isCurrent = step === currentStep;
              const isClickable =
                step <= currentStep || completedSteps.has(step - 1);

              return (
                <div
                  key={step}
                  className="flex items-center"
                  style={{ minWidth: 72 }}
                >
                  <button
                    onClick={() => goToStep(step)}
                    disabled={!isClickable}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all relative ${
                      isCompleted
                        ? "bg-green-600 text-white"
                        : isCurrent
                        ? "bg-primary text-white ring-4 ring-primary/30"
                        : isClickable
                        ? "bg-surface text-muted border-2 border-white/10 hover:border-primary cursor-pointer"
                        : "bg-surface text-muted border-2 border-white/10 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {isCompleted ? <span aria-hidden="true">✓</span> : step}
                  </button>
                </div>
              );
            })}
          </div>

          <div
            className="text-xs text-muted px-1"
            style={{
              display: "flex",
              gap: "var(--spacing-3)",
              overflowX: "auto",
            }}
          >
            <span className={currentStep === 1 ? "text-primary font-bold" : ""}>
              Title{" "}
              {isStepRequired(1) && <span className="text-red-500">*</span>}
            </span>
            <span className={currentStep === 2 ? "text-primary font-bold" : ""}>
              Synopsis{" "}
              {isStepRequired(2) && <span className="text-red-500">*</span>}
            </span>
            <span className={currentStep === 3 ? "text-primary font-bold" : ""}>
              Country{" "}
              {isStepRequired(3) && <span className="text-red-500">*</span>}
            </span>
            <span className={currentStep === 4 ? "text-primary font-bold" : ""}>
              Funding{" "}
              {isStepRequired(4) && <span className="text-red-500">*</span>}
            </span>
            <span className={currentStep === 5 ? "text-primary font-bold" : ""}>
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
                onChange={(value) => handleInputChange("title", value)}
                placeholder="Enter your film title"
                required
              />

              <Select
                label="Genre"
                value={formData.genre}
                onChange={(value) => handleInputChange("genre", value)}
                options={GENRES.map((genre) => ({
                  value: genre,
                  label: genre,
                }))}
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
                onChange={(value) => handleInputChange("synopsis", value)}
                placeholder="Provide a compelling summary of your film..."
                rows={6}
                autoResize
                required
                className="mb-6"
              />

              <TextArea
                label="Beginning"
                value={formData.beginning}
                onChange={(value) => handleInputChange("beginning", value)}
                placeholder="What happens at the beginning?"
                rows={3}
                autoResize
                className="mb-4"
              />

              <TextArea
                label="Middle"
                value={formData.middle}
                onChange={(value) => handleInputChange("middle", value)}
                placeholder="What happens in the middle?"
                rows={3}
                autoResize
                className="mb-4"
              />

              <TextArea
                label="End"
                value={formData.end}
                onChange={(value) => handleInputChange("end", value)}
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
                onChange={(value) =>
                  handleInputChange("country_of_origin", value)
                }
                options={COUNTRIES.map((country) => ({
                  value: country,
                  label: country,
                }))}
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
                value={formData.goal?.toString() || ""}
                onChange={(value) =>
                  handleInputChange("goal", parseInt(value) || 0)
                }
                placeholder="Enter your funding goal"
                required
                className="mb-6"
                icon={<span aria-hidden="true">$</span>}
              />

              <div>
                <Input
                  label="Funding Duration (Days)"
                  type="number"
                  value={formData.funding_duration_days.toString()}
                  onChange={(value) =>
                    handleInputChange(
                      "funding_duration_days",
                      parseInt(value) || 0
                    )
                  }
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
                    onChange={(e) =>
                      handleCrewMemberChange(index, "full_name", e.target.value)
                    }
                    placeholder="Full Name"
                    className="flex-1 px-4 py-3 bg-surface border-2 border-white/10 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all"
                  />
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) =>
                      handleCrewMemberChange(index, "email", e.target.value)
                    }
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
              {submitting ? "Saving..." : "Save as Draft"}
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
                {submitting ? "Publishing..." : "Publish Project"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
