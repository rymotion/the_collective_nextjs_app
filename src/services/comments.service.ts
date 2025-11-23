import { supabase } from '@/lib/supabase';

export interface CommentData {
  project_id: string;
  user_id: string;
  content: string;
  parent_id?: string | null;
}

export interface CommentVoteData {
  comment_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
}

export class CommentsService {
  static async createComment(commentData: CommentData) {
    const { data, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select(`
        *,
        author:profiles!user_id(display_name, avatar_url, id)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getComments(projectId: string, sortBy: 'score' | 'created_at' = 'score') {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles!user_id(display_name, avatar_url, id),
        comment_votes(vote_type, user_id)
      `)
      .eq('project_id', projectId)
      .eq('is_deleted', false)
      .order(sortBy, { ascending: sortBy === 'created_at' ? false : false });

    if (error) throw error;
    return data || [];
  }

  static async updateComment(commentId: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .update({
        content,
        is_edited: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId)
      .select(`
        *,
        author:profiles!user_id(display_name, avatar_url, id)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteComment(commentId: string) {
    const { data, error } = await supabase
      .from('comments')
      .update({
        is_deleted: true,
        content: '[deleted]',
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async voteOnComment(voteData: CommentVoteData) {
    const { data: existingVote } = await supabase
      .from('comment_votes')
      .select('id, vote_type')
      .eq('comment_id', voteData.comment_id)
      .eq('user_id', voteData.user_id)
      .maybeSingle();

    if (existingVote) {
      if (existingVote.vote_type === voteData.vote_type) {
        const { error } = await supabase
          .from('comment_votes')
          .delete()
          .eq('id', existingVote.id);

        if (error) throw error;
        return { action: 'removed' };
      } else {
        const { data, error } = await supabase
          .from('comment_votes')
          .update({ vote_type: voteData.vote_type })
          .eq('id', existingVote.id)
          .select()
          .single();

        if (error) throw error;
        return { action: 'changed', data };
      }
    } else {
      const { data, error } = await supabase
        .from('comment_votes')
        .insert(voteData)
        .select()
        .single();

      if (error) throw error;
      return { action: 'added', data };
    }
  }

  static async getUserVote(commentId: string, userId: string) {
    const { data, error } = await supabase
      .from('comment_votes')
      .select('vote_type')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.vote_type || null;
  }

  static async getReplies(parentId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles!user_id(display_name, avatar_url, id),
        comment_votes(vote_type, user_id)
      `)
      .eq('parent_id', parentId)
      .eq('is_deleted', false)
      .order('score', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getCommentCount(projectId: string) {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .eq('is_deleted', false);

    if (error) throw error;
    return count || 0;
  }
}
