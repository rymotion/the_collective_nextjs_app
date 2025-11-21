import { ProfilesService } from '../profiles.service';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('ProfilesService', () => {
  const mockProfile = {
    id: 'user-123',
    email: 'test@example.com',
    display_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'Filmmaker and storyteller',
    imdb_profile_url: 'https://imdb.com/name/nm123',
    imdb_synced: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfileById', () => {
    it('should fetch a profile by id', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: mockProfile,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ProfilesService.getProfileById('user-123');

      expect(result).toEqual(mockProfile);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'user-123');
    });

    it('should return null when profile not found', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ProfilesService.getProfileById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createProfile', () => {
    it('should create a new profile', async () => {
      const profileData = {
        id: 'user-123',
        email: 'test@example.com',
        display_name: 'Test User',
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...mockProfile, ...profileData },
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ProfilesService.createProfile(profileData);

      expect(result.email).toBe('test@example.com');
      expect(mockSupabase.insert).toHaveBeenCalledWith(profileData);
    });
  });

  describe('updateProfile', () => {
    it('should update profile information', async () => {
      const updates = {
        display_name: 'Updated Name',
        bio: 'Updated bio',
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...mockProfile, ...updates },
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ProfilesService.updateProfile('user-123', updates);

      expect(result.display_name).toBe('Updated Name');
      expect(result.bio).toBe('Updated bio');
      expect(mockSupabase.update).toHaveBeenCalledWith(updates);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'user-123');
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await ProfilesService.deleteProfile('user-123');

      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'user-123');
    });
  });

  describe('syncIMDbProfile', () => {
    it('should sync IMDb profile data', async () => {
      const imdbUrl = 'https://imdb.com/name/nm123';

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...mockProfile, imdb_profile_url: imdbUrl, imdb_synced: true },
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ProfilesService.syncIMDbProfile('user-123', imdbUrl);

      expect(result.imdb_profile_url).toBe(imdbUrl);
      expect(result.imdb_synced).toBe(true);
      expect(mockSupabase.update).toHaveBeenCalledWith({
        imdb_profile_url: imdbUrl,
        imdb_synced: true,
      });
    });
  });
});
