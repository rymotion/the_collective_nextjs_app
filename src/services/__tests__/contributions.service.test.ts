import { ContributionsService } from '../contributions.service';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('ContributionsService', () => {
  const mockContribution = {
    id: 'contribution-123',
    project_id: 'project-123',
    user_id: 'user-123',
    amount: 100,
    message: 'Supporting great filmmaking!',
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createContribution', () => {
    it('should create a new contribution', async () => {
      const contributionData = {
        project_id: 'project-123',
        user_id: 'user-123',
        amount: 100,
        message: 'Supporting great filmmaking!',
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockContribution,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ContributionsService.createContribution(contributionData);

      expect(result).toEqual(mockContribution);
      expect(mockSupabase.insert).toHaveBeenCalledWith(contributionData);
    });

    it('should handle creation errors', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Creation failed' },
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await expect(
        ContributionsService.createContribution({
          project_id: 'project-123',
          user_id: 'user-123',
          amount: 100,
        })
      ).rejects.toThrow();
    });
  });

  describe('getProjectContributions', () => {
    it('should fetch all contributions for a project', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [mockContribution],
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await ContributionsService.getProjectContributions('project-123');

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(mockContribution);
      expect(mockSupabase.eq).toHaveBeenCalledWith('project_id', 'project-123');
    });

    it('should return empty array when no contributions exist', async () => {
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

      const results = await ContributionsService.getProjectContributions('project-123');

      expect(results).toEqual([]);
    });
  });

  describe('getUserContributions', () => {
    it('should fetch all contributions by a user', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [mockContribution],
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await ContributionsService.getUserContributions('user-123');

      expect(results).toHaveLength(1);
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
    });
  });

  describe('getTotalContributed', () => {
    it('should calculate total amount contributed to a project', async () => {
      const contributions = [
        { ...mockContribution, amount: 100 },
        { ...mockContribution, id: 'contribution-456', amount: 200 },
        { ...mockContribution, id: 'contribution-789', amount: 50 },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: contributions,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const total = await ContributionsService.getTotalContributed('project-123');

      expect(total).toBe(350);
    });

    it('should return 0 when no contributions exist', async () => {
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

      const total = await ContributionsService.getTotalContributed('project-123');

      expect(total).toBe(0);
    });
  });

  describe('getContributionById', () => {
    it('should fetch a single contribution by id', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: mockContribution,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ContributionsService.getContributionById('contribution-123');

      expect(result).toEqual(mockContribution);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'contribution-123');
    });

    it('should return null when contribution not found', async () => {
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

      const result = await ContributionsService.getContributionById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
