import { CrewInvitationsService } from '../crew-invitations.service';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('CrewInvitationsService', () => {
  const mockInvitation = {
    id: 'invitation-123',
    project_id: 'project-123',
    full_name: 'John Doe',
    email: 'john@example.com',
    invited_by: 'user-123',
    status: 'pending' as const,
    created_at: new Date().toISOString(),
    modified_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvitation', () => {
    it('should create a new crew invitation', async () => {
      const invitationData = {
        project_id: 'project-123',
        full_name: 'John Doe',
        email: 'john@example.com',
        invited_by: 'user-123',
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockInvitation,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await CrewInvitationsService.createInvitation(invitationData);

      expect(result).toEqual(mockInvitation);
      expect(mockSupabase.from).toHaveBeenCalledWith('crew_invitations');
      expect(mockSupabase.insert).toHaveBeenCalledWith(invitationData);
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
        CrewInvitationsService.createInvitation({
          project_id: 'project-123',
          full_name: 'John Doe',
          email: 'john@example.com',
          invited_by: 'user-123',
        })
      ).rejects.toThrow();
    });
  });

  describe('getProjectInvitations', () => {
    it('should fetch all invitations for a project', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [mockInvitation],
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await CrewInvitationsService.getProjectInvitations('project-123');

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(mockInvitation);
      expect(mockSupabase.eq).toHaveBeenCalledWith('project_id', 'project-123');
    });

    it('should return empty array when no invitations exist', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await CrewInvitationsService.getProjectInvitations('project-123');

      expect(results).toEqual([]);
    });

    it('should handle errors when fetching invitations', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await expect(
        CrewInvitationsService.getProjectInvitations('project-123')
      ).rejects.toThrow();
    });
  });

  describe('updateInvitationStatus', () => {
    it('should update invitation status to accepted', async () => {
      const updatedInvitation = { ...mockInvitation, status: 'accepted' as const };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: updatedInvitation,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await CrewInvitationsService.updateInvitationStatus(
        'invitation-123',
        'accepted'
      );

      expect(result.status).toBe('accepted');
      expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'accepted' });
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'invitation-123');
    });

    it('should update invitation status to declined', async () => {
      const updatedInvitation = { ...mockInvitation, status: 'declined' as const };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: updatedInvitation,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await CrewInvitationsService.updateInvitationStatus(
        'invitation-123',
        'declined'
      );

      expect(result.status).toBe('declined');
    });
  });

  describe('deleteInvitation', () => {
    it('should delete an invitation', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await CrewInvitationsService.deleteInvitation('invitation-123');

      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'invitation-123');
    });

    it('should handle deletion errors', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: { message: 'Deletion failed' },
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await expect(
        CrewInvitationsService.deleteInvitation('invitation-123')
      ).rejects.toThrow();
    });
  });

  describe('bulkCreateInvitations', () => {
    it('should create multiple invitations at once', async () => {
      const crewMembers = [
        { full_name: 'John Doe', email: 'john@example.com' },
        { full_name: 'Jane Smith', email: 'jane@example.com' },
      ];

      const mockInvitations = [
        { ...mockInvitation, full_name: 'John Doe', email: 'john@example.com' },
        { ...mockInvitation, id: 'invitation-456', full_name: 'Jane Smith', email: 'jane@example.com' },
      ];

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: mockInvitations,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await CrewInvitationsService.bulkCreateInvitations(
        'project-123',
        'user-123',
        crewMembers
      );

      expect(results).toHaveLength(2);
      expect(results[0].full_name).toBe('John Doe');
      expect(results[1].full_name).toBe('Jane Smith');
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        {
          project_id: 'project-123',
          full_name: 'John Doe',
          email: 'john@example.com',
          invited_by: 'user-123',
        },
        {
          project_id: 'project-123',
          full_name: 'Jane Smith',
          email: 'jane@example.com',
          invited_by: 'user-123',
        },
      ]);
    });

    it('should return empty array when no crew members provided', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await CrewInvitationsService.bulkCreateInvitations(
        'project-123',
        'user-123',
        []
      );

      expect(results).toEqual([]);
    });

    it('should handle bulk creation errors', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Bulk creation failed' },
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await expect(
        CrewInvitationsService.bulkCreateInvitations('project-123', 'user-123', [
          { full_name: 'Test', email: 'test@example.com' },
        ])
      ).rejects.toThrow();
    });
  });
});
