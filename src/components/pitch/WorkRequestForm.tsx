'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { WorkRequestsService } from '@/services/workRequests.service';

interface WorkRequestFormProps {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const ROLES = [
  { value: 'actor', label: 'Actor' },
  { value: 'director', label: 'Director' },
  { value: 'producer', label: 'Producer' },
  { value: 'cinematographer', label: 'Cinematographer' },
  { value: 'editor', label: 'Editor' },
  { value: 'writer', label: 'Writer' },
  { value: 'sound_designer', label: 'Sound Designer' },
  { value: 'production_designer', label: 'Production Designer' },
  { value: 'costume_designer', label: 'Costume Designer' },
  { value: 'makeup_artist', label: 'Makeup Artist' },
  { value: 'other', label: 'Other' },
];

const AVAILABILITY = [
  { value: 'immediate', label: 'Immediate' },
  { value: '1_month', label: 'Within 1 month' },
  { value: '3_months', label: 'Within 3 months' },
  { value: '6_months', label: 'Within 6 months' },
  { value: 'flexible', label: 'Flexible' },
];

export default function WorkRequestForm({
  projectId,
  projectTitle,
  onClose,
  onSuccess,
}: WorkRequestFormProps) {
  const { user } = useSupabaseAuth();
  const [formData, setFormData] = useState({
    role_type: '',
    role_description: '',
    experience_years: '',
    portfolio_url: '',
    availability: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role_type || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await WorkRequestsService.createWorkRequest({
        project_id: projectId,
        user_id: user!.id,
        role_type: formData.role_type,
        role_description: formData.role_description || undefined,
        experience_years: formData.experience_years
          ? parseInt(formData.experience_years)
          : undefined,
        portfolio_url: formData.portfolio_url || undefined,
        availability: formData.availability || undefined,
        message: formData.message,
      });

      onSuccess?.();
    } catch (err: any) {
      console.error('Error submitting work request:', err);
      setError(err.message || 'Failed to submit work request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold">
            Request to Work on &quot;{projectTitle}&quot;
          </h2>
          <p className="text-muted mt-2">
            Tell the project creator about your skills and why you'd be a great
            fit for their team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Role Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.role_type}
              onChange={(e) => handleChange('role_type', e.target.value)}
              className="w-full p-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none"
              required
            >
              <option value="">Select a role...</option>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Role Description (Optional)
            </label>
            <input
              type="text"
              value={formData.role_description}
              onChange={(e) =>
                handleChange('role_description', e.target.value)
              }
              placeholder="e.g., Lead Actor, Cinematographer, Script Supervisor"
              className="w-full p-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={formData.experience_years}
                onChange={(e) =>
                  handleChange('experience_years', e.target.value)
                }
                placeholder="e.g., 5"
                min="0"
                className="w-full p-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={(e) => handleChange('availability', e.target.value)}
                className="w-full p-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none"
              >
                <option value="">Select availability...</option>
                {AVAILABILITY.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Portfolio URL (Optional)
            </label>
            <input
              type="url"
              value={formData.portfolio_url}
              onChange={(e) => handleChange('portfolio_url', e.target.value)}
              placeholder="https://yourportfolio.com"
              className="w-full p-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Introduce yourself and explain why you're interested in this project..."
              rows={5}
              className="w-full p-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none resize-none"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={
                !formData.role_type || !formData.message || submitting
              }
              className="btn btn-primary disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
