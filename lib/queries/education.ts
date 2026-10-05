import { createClient } from "@/lib/supabase/client";

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: string;
  end_year?: string | null;
  description?: string | null;
  logo_url?: string | null;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export type EducationInput = Omit<Education, "id" | "created_at" | "updated_at">;

export async function getClientEducationList(): Promise<Education[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("display_order", { ascending: true })
    .order("start_year", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function createEducation(input: EducationInput): Promise<Education> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("education")
    .insert([input])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateEducation(
  id: string,
  input: Partial<EducationInput>
): Promise<Education> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("education")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteEducation(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleEducationVisibility(
  id: string,
  isVisible: boolean
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("education")
    .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
