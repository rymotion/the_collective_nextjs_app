import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type CrewInvitation = Database['public']['Tables']['crew_invitations']['Row'];
type CrewInvitationInsert = Database['public']['Tables']['crew_invitations']['Insert'];
type CrewInvitationUpdate = Database['public']['Tables']['crew_invitations']['Update'];

export class CrewInvitationsService {
  static async createInvitation(invitation: CrewInvitationInsert): Promise<CrewInvitation> {
    try {
      const { data, error } = await supabase
        .from('crew_invitations')
        .insert(invitation)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating crew invitation:', error);
      throw error;
    }
  }

  static async getProjectInvitations(projectId: string): Promise<CrewInvitation[]> {
    try {
      const { data, error } = await supabase
        .from('crew_invitations')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching project invitations:', error);
      throw error;
    }
  }

  static async updateInvitationStatus(
    invitationId: string,
    status: 'pending' | 'accepted' | 'declined'
  ): Promise<CrewInvitation> {
    try {
      const { data, error } = await supabase
        .from('crew_invitations')
        .update({ status })
        .eq('id', invitationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating invitation status:', error);
      throw error;
    }
  }

  static async deleteInvitation(invitationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('crew_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting invitation:', error);
      throw error;
    }
  }

  static async bulkCreateInvitations(
    projectId: string,
    invitedBy: string,
    crewMembers: Array<{ full_name: string; email: string }>
  ): Promise<CrewInvitation[]> {
    try {
      const invitations = crewMembers.map(member => ({
        project_id: projectId,
        full_name: member.full_name,
        email: member.email,
        invited_by: invitedBy,
      }));

      const { data, error } = await supabase
        .from('crew_invitations')
        .insert(invitations)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error bulk creating invitations:', error);
      throw error;
    }
  }
}
