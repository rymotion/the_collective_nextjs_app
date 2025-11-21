import { ProjectsService } from '../projects.service';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

describe('ProjectsService', () => {
  const mockProject = {
    id: 'project-123',
    title: 'Test Film',
    author_id: 'user-123',
    synopsis: 'A test synopsis',
    genre: 'Drama',
    goal: 50000,
    raised: 10000,
    status: 'active' as const,
    is_published: true,
    country_of_origin: 'United States',
    funding_duration_days: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modified_at: new Date().toISOString(),
    deadline: new Date().toISOString(),
    image_url: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProjects', () => {
    it('should fetch all published projects with pagination', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: [mockProject],
          count: 1,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ProjectsService.getAllProjects(10, 0);

      expect(result.projects).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockSupabase.from).toHaveBeenCalledWith('projects');
      expect(mockSupabase.eq).toHaveBeenCalledWith('is_published', true);
    });

    it('should handle errors when fetching projects', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await expect(ProjectsService.getAllProjects(10, 0)).rejects.toThrow();
    });
  });

  describe('getProjectById', () => {
    it('should fetch a single project by id', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: mockProject,
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ProjectsService.getProjectById('project-123');

      expect(result).toEqual(mockProject);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'project-123');
    });

    it('should return null when project not found', async () => {
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

      const result = await ProjectsService.getProjectById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const projectData = {
        title: 'New Film',
        author_id: 'user-123',
        synopsis: 'Synopsis',
        genre: 'Drama',
        goal: 50000,
      };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...mockProject, ...projectData },
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ProjectsService.createProject(projectData);

      expect(result.title).toBe('New Film');
      expect(mockSupabase.insert).toHaveBeenCalledWith(projectData);
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
        ProjectsService.createProject({
          title: 'Test',
          synopsis: 'Test',
          genre: 'Drama',
          goal: 1000,
        })
      ).rejects.toThrow();
    });
  });

  describe('updateProject', () => {
    it('should update an existing project', async () => {
      const updates = { title: 'Updated Title' };

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...mockProject, ...updates },
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const result = await ProjectsService.updateProject('project-123', updates);

      expect(result.title).toBe('Updated Title');
      expect(mockSupabase.update).toHaveBeenCalledWith(updates);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'project-123');
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      await ProjectsService.deleteProject('project-123');

      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'project-123');
    });
  });

  describe('searchProjects', () => {
    it('should search projects by query', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        textSearch: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [mockProject],
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await ProjectsService.searchProjects('test');

      expect(results).toHaveLength(1);
      expect(mockSupabase.textSearch).toHaveBeenCalled();
    });
  });

  describe('getProjectsByGenre', () => {
    it('should fetch projects by genre', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [mockProject],
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await ProjectsService.getProjectsByGenre('Drama');

      expect(results).toHaveLength(1);
      expect(mockSupabase.eq).toHaveBeenCalledWith('genre', 'Drama');
    });
  });

  describe('getProjectsByAuthor', () => {
    it('should fetch projects by author id', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [mockProject],
          error: null,
        }),
      };

      (supabase.from as jest.Mock) = mockSupabase.from;

      const results = await ProjectsService.getProjectsByAuthor('user-123');

      expect(results).toHaveLength(1);
      expect(mockSupabase.eq).toHaveBeenCalledWith('author_id', 'user-123');
    });
  });
});
