import { createPublicClient } from "@/lib/supabase/server";
import type { Education } from "./education";

export async function getEducationList(): Promise<Education[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true })
      .order("start_year", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Failed to fetch education list:", err);
    return [];
  }
}
