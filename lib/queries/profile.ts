import { createClient } from "@/lib/supabase/server";

export interface Profile {
  id?: string;
  name: string;
  title: string;
  short_description: string;
  long_description?: string;
  photo_url: string;
  email: string;
  linkedin_url?: string;
  github_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_PROFILE: Profile = {
  name: "Reynold Andre",
  title: "Web Developer",
  short_description:
    "A Web Developer and Software Engineering Technology graduate from IPB University, with experience in web application development, a strong interest in Data Engineering, and expertise in ETL concepts, always seeking opportunities to enhance technical skills and contribute to innovative solutions.",
  long_description:
    "Graduated from IPB University majoring in Software Engineering Technology. Passionate about building robust web applications, data pipelines, ETL processes, and modern responsive user interfaces.",
  photo_url: "/image/andre.jpg",
  email: "reynold.dre@gmail.com",
  linkedin_url: "https://www.linkedin.com/in/reynoldandre/",
  github_url: "https://github.com/rey-andre",
  instagram_url: "https://www.instagram.com/reynold.sgn/",
  twitter_url: "https://twitter.com/rynld_ndr",
};

export async function getProfile(): Promise<Profile> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_PROFILE;
    }

    return {
      ...DEFAULT_PROFILE,
      ...data,
      photo_url: data.photo_url || DEFAULT_PROFILE.photo_url,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}
