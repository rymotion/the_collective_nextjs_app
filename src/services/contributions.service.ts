import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type Contribution = Database['public']['Tables']['contributions']['Row'];
type ContributionInsert = Database['public']['Tables']['contributions']['Insert'];

export interface ContributionWithDetails extends Contribution {
  user?: {
    display_name: string | null;
    avatar_url: string | null;
  };
  project?: {
    title: string;
    image_url: string | null;
  };
}

export class ContributionsService {
  static async createContribution(contribution: ContributionInsert): Promise<Contribution> {
    try {
      const { data, error } = await supabase
        .from('contributions')
        .insert(contribution)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating contribution:', error);
      throw error;
    }
  }

  static async getProjectContributions(projectId: string): Promise<ContributionWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('contributions')
        .select(`
          *,
          user:profiles!user_id(display_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project contributions:', error);
      throw error;
    }
  }

  static async getUserContributions(userId: string): Promise<ContributionWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('contributions')
        .select(`
          *,
          project:projects!project_id(title, image_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user contributions:', error);
      throw error;
    }
  }

  static async getTotalContributed(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('contributions')
        .select('amount')
        .eq('user_id', userId);

      if (error) throw error;

      const total = data?.reduce((sum, contribution) => sum + Number(contribution.amount), 0) || 0;
      return total;
    } catch (error) {
      console.error('Error calculating total contributed:', error);
      throw error;
    }
  }
}
