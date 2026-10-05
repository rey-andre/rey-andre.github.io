import { createClient } from "@/lib/supabase/client";

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text?: string | null;
  display_order: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  technologies: string[];
  project_type?: string | null;
  project_url?: string | null;
  repository_url?: string | null;
  thumbnail_url?: string | null;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
  project_images?: ProjectImage[];
}

export type ProjectInput = Omit<
  Project,
  "id" | "created_at" | "updated_at" | "project_images"
>;

export async function getClientProjectsList(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getClientProjectById(id: string): Promise<Project | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert([input])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProject(
  id: string,
  input: Partial<ProjectInput>
): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function toggleProjectPublish(
  id: string,
  isPublished: boolean
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function addProjectImage(
  projectId: string,
  imageUrl: string,
  altText: string = "",
  displayOrder: number = 0
): Promise<ProjectImage> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_images")
    .insert([
      {
        project_id: projectId,
        image_url: imageUrl,
        alt_text: altText,
        display_order: displayOrder,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProjectImage(imageId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("project_images")
    .delete()
    .eq("id", imageId);

  if (error) throw new Error(error.message);
}
