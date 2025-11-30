import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          imdb_profile_url: string | null;
          imdb_synced: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          imdb_profile_url?: string | null;
          imdb_synced?: boolean;
        };
        Update: {
          display_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          imdb_profile_url?: string | null;
          imdb_synced?: boolean;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          author_id: string | null;
          synopsis: string;
          genre: string;
          image_url: string | null;
          goal: number;
          raised: number;
          status: 'draft' | 'active' | 'funded' | 'completed' | 'cancelled';
          is_published: boolean;
          country_of_origin: string | null;
          funding_duration_days: number | null;
          created_at: string;
          updated_at: string;
          modified_at: string;
          deadline: string | null;
        };
        Insert: {
          title: string;
          author_id?: string | null;
          synopsis: string;
          genre: string;
          image_url?: string | null;
          goal: number;
          is_published?: boolean;
          country_of_origin?: string | null;
          funding_duration_days?: number | null;
          deadline?: string | null;
        };
        Update: {
          title?: string;
          synopsis?: string;
          genre?: string;
          image_url?: string | null;
          goal?: number;
          status?: 'draft' | 'active' | 'funded' | 'completed' | 'cancelled';
          is_published?: boolean;
          country_of_origin?: string | null;
          funding_duration_days?: number | null;
          deadline?: string | null;
        };
      };
      cast_crew: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          role: string;
          type: 'cast' | 'crew';
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          project_id: string;
          name: string;
          role: string;
          type: 'cast' | 'crew';
          image_url?: string | null;
        };
        Update: {
          name?: string;
          role?: string;
          image_url?: string | null;
        };
      };
      accolades: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          year: string;
          created_at: string;
        };
        Insert: {
          project_id: string;
          title: string;
          year: string;
        };
        Update: {
          title?: string;
          year?: string;
        };
      };
      contributions: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          amount: number;
          message: string | null;
          created_at: string;
        };
        Insert: {
          project_id: string;
          user_id: string;
          amount: number;
          message?: string | null;
        };
      };
      project_updates: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          content: string;
          created_at: string;
        };
        Insert: {
          project_id: string;
          title: string;
          content: string;
        };
        Update: {
          title?: string;
          content?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          project_id: string;
        };
      };
      crew_invitations: {
        Row: {
          id: string;
          project_id: string;
          full_name: string;
          email: string;
          invited_by: string;
          status: 'pending' | 'accepted' | 'declined';
          created_at: string;
          modified_at: string;
        };
        Insert: {
          project_id: string;
          full_name: string;
          email: string;
          invited_by: string;
          status?: 'pending' | 'accepted' | 'declined';
        };
        Update: {
          status?: 'pending' | 'accepted' | 'declined';
        };
      };
    };
  };
};
