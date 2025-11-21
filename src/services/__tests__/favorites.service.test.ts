import { FavoritesService } from '../favorites.service';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('FavoritesService', () => {
  const mockFavorite = {
    id: 'favorite-123',
    user_id: 'user-123',
    project_id: 'project-123',
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addFavorite', () => {
    it('should add a project to favorites', async () => {
      const favoriteData = {
        user_id: 'user-123',
        project_id: 'project-123',
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockFavorite,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await FavoritesService.addFavorite(
        'user-123',
        'project-123'
      );

      expect(result).toEqual(mockFavorite);
      expect(mockSupabase.insert).toHaveBeenCalledWith(favoriteData);
    });

    it('should handle duplicate favorite error', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Duplicate key value' },
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await expect(
        FavoritesService.addFavorite('user-123', 'project-123')
      ).rejects.toThrow();
    });
  });

  describe('removeFavorite', () => {
    it('should remove a project from favorites', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        match: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await FavoritesService.removeFavorite('user-123', 'project-123');

      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.match).toHaveBeenCalledWith({
        user_id: 'user-123',
        project_id: 'project-123',
      });
    });

    it('should handle removal errors', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        match: jest.fn().mockResolvedValue({
          error: { message: 'Not found' },
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await expect(
        FavoritesService.removeFavorite('user-123', 'project-123')
      ).rejects.toThrow();
    });
  });

  describe('getUserFavorites', () => {
    it('should fetch all favorites for a user', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [mockFavorite],
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await FavoritesService.getUserFavorites('user-123');

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(mockFavorite);
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
    });

    it('should return empty array when no favorites exist', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await FavoritesService.getUserFavorites('user-123');

      expect(results).toEqual([]);
    });
  });

  describe('isFavorited', () => {
    it('should return true if project is favorited', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        match: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: mockFavorite,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await FavoritesService.isFavorited('user-123', 'project-123');

      expect(result).toBe(true);
    });

    it('should return false if project is not favorited', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        match: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await FavoritesService.isFavorited('user-123', 'project-123');

      expect(result).toBe(false);
    });
  });

  describe('getFavoriteCount', () => {
    it('should return count of users who favorited a project', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [mockFavorite, { ...mockFavorite, id: 'favorite-456' }],
          count: 2,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const count = await FavoritesService.getFavoriteCount('project-123');

      expect(count).toBe(2);
      expect(mockSupabase.eq).toHaveBeenCalledWith('project_id', 'project-123');
    });

    it('should return 0 when no favorites exist', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [],
          count: 0,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const count = await FavoritesService.getFavoriteCount('project-123');

      expect(count).toBe(0);
    });
  });

  describe('toggleFavorite', () => {
    it('should add favorite if not favorited', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        match: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValueOnce({
          data: null,
          error: null,
        }),
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockFavorite,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await FavoritesService.toggleFavorite('user-123', 'project-123');

      expect(result.favorited).toBe(true);
    });

    it('should remove favorite if already favorited', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        match: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValueOnce({
          data: mockFavorite,
          error: null,
        }),
        delete: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await FavoritesService.toggleFavorite('user-123', 'project-123');

      expect(result.favorited).toBe(false);
    });
  });
});
