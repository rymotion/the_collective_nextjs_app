import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type Favorite = Database['public']['Tables']['favorites']['Row'];
type FavoriteInsert = Database['public']['Tables']['favorites']['Insert'];

export interface FavoriteWithProject extends Favorite {
  project?: {
    id: string;
    title: string;
    image_url: string | null;
    genre: string;
    raised: number;
    goal: number;
  };
}

export class FavoritesService {
  static async addFavorite(userId: string, projectId: string): Promise<Favorite> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, project_id: projectId })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  static async removeFavorite(userId: string, projectId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('project_id', projectId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  static async getUserFavorites(userId: string): Promise<FavoriteWithProject[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          project:projects!project_id(id, title, image_url, genre, raised, goal)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  static async isFavorite(userId: string, projectId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('project_id', projectId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
}
