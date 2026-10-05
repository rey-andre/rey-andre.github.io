import { createClient } from "@/lib/supabase/server";
import type { Project } from "./projects";

export async function getProjectsList(onlyPublished: boolean = true): Promise<Project[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("projects")
      .select("*, project_images(*)")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (onlyPublished) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Failed to fetch projects list:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_images(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch (err) {
    console.error("Failed to fetch project by slug:", err);
    return null;
  }
}
