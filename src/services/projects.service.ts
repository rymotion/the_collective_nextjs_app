import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];
type CastCrew = Database['public']['Tables']['cast_crew']['Row'];
type Accolade = Database['public']['Tables']['accolades']['Row'];

export interface ProjectWithDetails extends Project {
  author?: {
    display_name: string | null;
    avatar_url: string | null;
  };
  cast?: CastCrew[];
  crew?: CastCrew[];
  accolades?: Accolade[];
  contributions_count?: number;
}

export class ProjectsService {
  static async getAllProjects(
    limit = 50,
    offset = 0,
    genre?: string,
    status?: string
  ): Promise<{ projects: ProjectWithDetails[]; total: number }> {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          author:profiles!author_id(display_name, avatar_url),
          cast_crew(*),
          accolades(*)
        `, { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (genre) {
        query = query.eq('genre', genre);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const projects: ProjectWithDetails[] = (data || []).map((project: any) => ({
        ...project,
        cast: project.cast_crew?.filter((cc: CastCrew) => cc.type === 'cast'),
        crew: project.cast_crew?.filter((cc: CastCrew) => cc.type === 'crew'),
      }));

      return { projects, total: count || 0 };
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  static async getProject(projectId: string): Promise<ProjectWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          author:profiles!author_id(display_name, avatar_url),
          cast_crew(*),
          accolades(*),
          contributions(count)
        `)
        .eq('id', projectId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const project: ProjectWithDetails = {
        ...data,
        cast: data.cast_crew?.filter((cc: CastCrew) => cc.type === 'cast'),
        crew: data.cast_crew?.filter((cc: CastCrew) => cc.type === 'crew'),
        contributions_count: data.contributions?.[0]?.count || 0,
      };

      return project;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  static async createProject(project: ProjectInsert): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  static async updateProject(projectId: string, updates: ProjectUpdate): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  static async deleteProject(projectId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  static async searchProjects(query: string): Promise<ProjectWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          author:profiles!author_id(display_name, avatar_url),
          cast_crew(*),
          accolades(*)
        `)
        .or(`title.ilike.%${query}%,synopsis.ilike.%${query}%,genre.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const projects: ProjectWithDetails[] = (data || []).map((project: any) => ({
        ...project,
        cast: project.cast_crew?.filter((cc: CastCrew) => cc.type === 'cast'),
        crew: project.cast_crew?.filter((cc: CastCrew) => cc.type === 'crew'),
      }));

      return projects;
    } catch (error) {
      console.error('Error searching projects:', error);
      throw error;
    }
  }

  static async getProjectsByAuthor(authorId: string): Promise<ProjectWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          author:profiles!author_id(display_name, avatar_url),
          cast_crew(*),
          accolades(*)
        `)
        .eq('author_id', authorId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const projects: ProjectWithDetails[] = (data || []).map((project: any) => ({
        ...project,
        cast: project.cast_crew?.filter((cc: CastCrew) => cc.type === 'cast'),
        crew: project.cast_crew?.filter((cc: CastCrew) => cc.type === 'crew'),
      }));

      return projects;
    } catch (error) {
      console.error('Error fetching projects by author:', error);
      throw error;
    }
  }
}
