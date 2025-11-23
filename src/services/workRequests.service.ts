import { supabase } from '@/lib/supabase';

export interface WorkRequestData {
  project_id: string;
  user_id: string;
  role_type: string;
  role_description?: string;
  experience_years?: number;
  portfolio_url?: string;
  availability?: string;
  message: string;
}

export class WorkRequestsService {
  static async createWorkRequest(requestData: WorkRequestData) {
    const { data, error } = await supabase
      .from('work_requests')
      .insert(requestData)
      .select(`
        *,
        applicant:profiles!user_id(display_name, avatar_url, id)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getWorkRequests(projectId: string) {
    const { data, error } = await supabase
      .from('work_requests')
      .select(`
        *,
        applicant:profiles!user_id(display_name, avatar_url, id)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateRequestStatus(requestId: string, status: string) {
    const { data, error } = await supabase
      .from('work_requests')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .select(`
        *,
        applicant:profiles!user_id(display_name, avatar_url, id)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async withdrawRequest(requestId: string) {
    const { error } = await supabase
      .from('work_requests')
      .update({
        status: 'withdrawn',
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) throw error;
  }

  static async getUserWorkRequests(userId: string) {
    const { data, error } = await supabase
      .from('work_requests')
      .select(`
        *,
        project:projects(id, title, author_id, author:profiles!author_id(display_name))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getWorkRequestsByProject(projectId: string, status?: string) {
    let query = supabase
      .from('work_requests')
      .select(`
        *,
        applicant:profiles!user_id(display_name, avatar_url, id, bio)
      `)
      .eq('project_id', projectId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async checkExistingRequest(projectId: string, userId: string) {
    const { data, error } = await supabase
      .from('work_requests')
      .select('id, status')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}
