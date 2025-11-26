'use client';

import { useState } from 'react';
import { PitchesService } from '@/services/pitches.service';
import { sanitizeString, sanitizeTextarea, sanitizeNumber } from '@/utils/sanitize';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import Select from '@/components/Select';

interface PitchEditFormProps {
  pitch: any;
  onCancel: () => void;
  onSave: (updatedPitch: any) => void;
}

const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Thriller',
  'Romance',
  'Documentary',
  'Fantasy',
  'Mystery',
  'Western',
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'New Zealand',
  'France',
  'Germany',
  'Spain',
  'Italy',
  'Mexico',
  'Brazil',
  'Argentina',
  'India',
  'Japan',
  'South Korea',
  'China',
  'Other',
];

export default function PitchEditForm({
  pitch,
  onCancel,
  onSave,
}: PitchEditFormProps) {
  const [formData, setFormData] = useState({
    title: pitch.title || '',
    synopsis: pitch.synopsis || '',
    genre: pitch.genre || '',
    goal: pitch.goal || 0,
    country_of_origin: pitch.country_of_origin || '',
    funding_duration_days: pitch.funding_duration_days || 30,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }

    if (formData.title.length > 200) {
      setError('Title must be less than 200 characters');
      return false;
    }

    if (!formData.synopsis.trim()) {
      setError('Synopsis is required');
      return false;
    }

    if (formData.synopsis.length > 5000) {
      setError('Synopsis must be less than 5000 characters');
      return false;
    }

    if (!formData.genre) {
      setError('Genre is required');
      return false;
    }

    if (formData.goal <= 0) {
      setError('Goal must be greater than 0');
      return false;
    }

    if (formData.goal > 100000000) {
      setError('Goal must be less than $100,000,000');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      const sanitizedData = {
        title: sanitizeString(formData.title),
        synopsis: sanitizeTextarea(formData.synopsis, 5000),
        genre: sanitizeString(formData.genre),
        goal: sanitizeNumber(formData.goal),
        country_of_origin: formData.country_of_origin
          ? sanitizeString(formData.country_of_origin)
          : null,
        funding_duration_days: sanitizeNumber(formData.funding_duration_days),
      };

      const updatedPitch = await PitchesService.updatePitch(
        pitch.id,
        sanitizedData
      );

      onSave(updatedPitch);
    } catch (err: any) {
      console.error('Error saving pitch:', err);
      setError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="glass-panel p-8 space-y-6">
        <h2 className="text-2xl font-bold">Edit Pitch Details</h2>

        <div>
          <Input
            label="Title"
            type="text"
            value={formData.title}
            onChange={(value) => handleChange('title', value)}
            placeholder="Enter pitch title"
            required
            maxLength={200}
          />
          <p className="text-xs text-muted mt-1">
            {formData.title.length}/200 characters
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Select
            label="Genre"
            value={formData.genre}
            onChange={(value) => handleChange('genre', value)}
            options={GENRES.map((g) => ({ value: g, label: g }))}
            placeholder="Select genre"
            required
          />

          <Select
            label="Country of Origin"
            value={formData.country_of_origin}
            onChange={(value) => handleChange('country_of_origin', value)}
            options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            placeholder="Select country"
          />
        </div>

        <div>
          <TextArea
            label="Synopsis"
            value={formData.synopsis}
            onChange={(value) => handleChange('synopsis', value)}
            placeholder="Enter pitch synopsis"
            rows={10}
            required
            maxLength={5000}
          />
          <p className="text-xs text-muted mt-1">
            {formData.synopsis.length}/5000 characters
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Funding Goal ($)"
              type="number"
              value={formData.goal.toString()}
              onChange={(value) => handleChange('goal', parseFloat(value) || 0)}
              placeholder="10000"
              required
            />
            <p className="text-xs text-muted mt-1">
              ${sanitizeNumber(formData.goal).toLocaleString()}
            </p>
          </div>

          <div>
            <Input
              label="Funding Duration (Days)"
              type="number"
              value={formData.funding_duration_days.toString()}
              onChange={(value) =>
                handleChange('funding_duration_days', parseInt(value) || 30)
              }
              placeholder="30"
              required
            />
            <p className="text-xs text-muted mt-1">
              {formData.funding_duration_days} days
            </p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-white/10 p-6 flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary disabled:opacity-50"
        >
          {saving ? 'Saving Changes...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="btn btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
