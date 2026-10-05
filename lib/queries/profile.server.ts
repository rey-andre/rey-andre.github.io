import { createPublicClient } from "@/lib/supabase/server";
import { DEFAULT_PROFILE, type Profile } from "./profile";

export async function getProfile(): Promise<Profile> {
  try {
    const supabase = createPublicClient();
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
