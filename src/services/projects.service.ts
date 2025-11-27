import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
type CastCrew = Database["public"]["Tables"]["cast_crew"]["Row"];
type Accolade = Database["public"]["Tables"]["accolades"]["Row"];

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
        .from("projects")
        .select(
          `
          *,
          author:profiles!author_id(display_name, avatar_url)
        `,
          { count: "exact" }
        )
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: false });

      if (genre) {
        query = query.eq("genre", genre);
      }

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const projects: ProjectWithDetails[] = (data || []).map(
        (project: any) => ({
          ...project,
          cast: [],
          crew: [],
        })
      );

      return { projects, total: count || 0 };
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  static async getProject(
    projectId: string
  ): Promise<ProjectWithDetails | null> {
    console.log(
      "[ProjectsService.getProject] Starting fetch for projectId:",
      projectId
    );

    try {
      console.log(
        "[ProjectsService.getProject] Querying Supabase projects table..."
      );

      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          author:profiles!author_id(display_name, avatar_url)
        `
        )
        .eq("id", projectId)
        .maybeSingle();

      if (error) {
        console.error("[ProjectsService.getProject] Supabase error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      if (!data) {
        console.warn(
          "[ProjectsService.getProject] No project found with id:",
          projectId
        );
        return null;
      }

      console.log("[ProjectsService.getProject] Raw data received:", {
        id: data.id,
        title: data.title,
        author_id: data.author_id,
        is_pitch: data.is_pitch,
        is_published: data.is_published,
      });

      const project: ProjectWithDetails = {
        ...data,
        cast: [],
        crew: [],
        contributions_count: 0,
      };

      console.log("[ProjectsService.getProject] Transformed project:", {
        id: project.id,
        title: project.title,
      });

      return project;
    } catch (error) {
      console.error(
        "[ProjectsService.getProject] Error fetching project:",
        error
      );
      throw error;
    }
  }

  static async createProject(project: ProjectInsert): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  static async updateProject(
    projectId: string,
    updates: ProjectUpdate
  ): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  static async deleteProject(projectId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }

  static async searchProjects(query: string): Promise<ProjectWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          author:profiles!author_id(display_name, avatar_url)
        `
        )
        .or(
          `title.ilike.%${query}%,synopsis.ilike.%${query}%,genre.ilike.%${query}%`
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const projects: ProjectWithDetails[] = (data || []).map(
        (project: any) => ({
          ...project,
          cast: [],
          crew: [],
        })
      );

      return projects;
    } catch (error) {
      console.error("Error searching projects:", error);
      throw error;
    }
  }

  static async getProjectsByAuthor(
    authorId: string
  ): Promise<ProjectWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          author:profiles!author_id(display_name, avatar_url)
        `
        )
        .eq("author_id", authorId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const projects: ProjectWithDetails[] = (data || []).map(
        (project: any) => ({
          ...project,
          cast: [],
          crew: [],
        })
      );

      return projects;
    } catch (error) {
      console.error("Error fetching projects by author:", error);
      throw error;
    }
  }
}
