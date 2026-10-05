import { createClient } from "@/lib/supabase/client";

export async function uploadImage(
  file: File,
  folder: "profile" | "education" | "projects",
  subfolder?: string
): Promise<{ url: string; path: string }> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = subfolder
    ? `${folder}/${subfolder}/${fileName}`
    : `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("portfolio-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("portfolio-images").getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path,
  };
}

export async function deleteStorageImage(path: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from("portfolio-images").remove([path]);
  if (error) {
    console.error("Failed to delete storage file:", error);
  }
}
