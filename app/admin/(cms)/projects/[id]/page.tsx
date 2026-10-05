import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";

import { ProjectImage } from "@/lib/queries/projects";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !project) {
    notFound();
  }

  // Sort project images by display_order
  if (project.project_images) {
    project.project_images.sort(
      (a: ProjectImage, b: ProjectImage) => a.display_order - b.display_order
    );
  }

  return <ProjectForm initialData={project} isEdit={true} />;
}
