import { supabase } from "@/lib/supabase";

export interface PitchData {
  title: string;
  synopsis: string;
  genre: string;
  goal: number;
  author_id: string;
  is_pitch?: boolean;
  pitch_status?: string;
  is_published?: boolean;
}

export class PitchesService {
  static async getAllPitches(limit = 20, offset = 0) {
    try {
      const { data, error, count } = await supabase
        .from("projects")
        .select(
          `
          *,
          author:profiles!author_id(display_name, avatar_url),
          work_requests(count),
          comments(count)
        `,
          { count: "exact" }
        )
        .eq("is_pitch", true)
        .eq("is_published", true)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Error fetching pitches:", error);
        throw error;
      }

      // Transform the data to match expected structure with proper counts
      const transformedData = (data || []).map((pitch) => ({
        ...pitch,
        work_requests_count: Array.isArray(pitch.work_requests)
          ? pitch.work_requests.length
          : 0,
        comments_count: Array.isArray(pitch.comments)
          ? pitch.comments.length
          : 0,
      }));

      return transformedData;
    } catch (error) {
      console.error("Error in getAllPitches:", error);
      throw error;
    }
  }

  // Get featured pitches (for hero section or carousel)
  static async getFeaturedPitches(limit = 5) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          author:profiles!author_id(display_name, avatar_url),
          work_requests(count),
          comments(count)
        `
        )
        .eq("is_pitch", true)
        .eq("is_published", true)
        .eq("status", "active")
        .order("raised", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((pitch) => ({
        ...pitch,
        work_requests_count: Array.isArray(pitch.work_requests)
          ? pitch.work_requests.length
          : 0,
        comments_count: Array.isArray(pitch.comments)
          ? pitch.comments.length
          : 0,
      }));
    } catch (error) {
      console.error("Error fetching featured pitches:", error);
      return [];
    }
  }

  // Get pitches by genre
  static async getPitchesByGenre(genre: string, limit = 10) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          author:profiles!author_id(display_name, avatar_url),
          work_requests(count),
          comments(count)
        `
        )
        .eq("is_pitch", true)
        .eq("is_published", true)
        .eq("status", "active")
        .eq("genre", genre)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((pitch) => ({
        ...pitch,
        work_requests_count: Array.isArray(pitch.work_requests)
          ? pitch.work_requests.length
          : 0,
        comments_count: Array.isArray(pitch.comments)
          ? pitch.comments.length
          : 0,
      }));
    } catch (error) {
      console.error("Error fetching pitches by genre:", error);
      return [];
    }
  }

  static async getPitch(pitchId: string) {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        author:profiles!author_id(display_name, avatar_url, id),
        work_requests(
          id,
          role_type,
          role_description,
          user_id,
          status,
          created_at,
          experience_years,
          availability,
          message,
          applicant:profiles!user_id(display_name, avatar_url, id)
        ),
        comments(count)
      `
      )
      .eq("id", pitchId)
      .eq("is_pitch", true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async createPitch(pitchData: PitchData) {
    const shareToken = this.generateShareToken();

    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...pitchData,
        is_pitch: true,
        pitch_status: "draft",
        share_token: shareToken,
        external_sharing_enabled: true,
        work_requests_enabled: true,
      })
      .select(
        `
        *,
        author:profiles!author_id(display_name, avatar_url)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePitch(pitchId: string, updates: Partial<PitchData>) {
    const { data, error } = await supabase
      .from("projects")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pitchId)
      .select(
        `
        *,
        author:profiles!author_id(display_name, avatar_url)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  static async deletePitch(pitchId: string) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", pitchId);

    if (error) throw error;
  }

  static async publishPitch(pitchId: string) {
    return this.updatePitch(pitchId, {
      is_published: true,
      pitch_status: "published",
    } as Partial<PitchData>);
  }

  static async getPitchByShareToken(token: string) {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        author:profiles!author_id(display_name, avatar_url)
      `
      )
      .eq("share_token", token)
      .eq("external_sharing_enabled", true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async regenerateShareToken(pitchId: string) {
    const token = this.generateShareToken();

    const { data, error } = await supabase
      .from("projects")
      .update({ share_token: token })
      .eq("id", pitchId)
      .select("share_token")
      .single();

    if (error) throw error;
    return data.share_token;
  }

  static generateShareToken(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < 12; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  static async getUserPitches(userId: string) {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        work_requests(count),
        comments(count)
      `
      )
      .eq("author_id", userId)
      .eq("is_pitch", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
