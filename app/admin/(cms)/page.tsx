import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  FolderGit2,
  GraduationCap,
  User,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts and profile
  const [
    { count: projectCount },
    { count: publishedCount },
    { count: educationCount },
    { data: profile },
    { data: recentProjects },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("education").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*").limit(1).maybeSingle(),
    supabase.from("projects").select("id, title, slug, project_type, is_published, created_at").order("created_at", { ascending: false }).limit(4),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e1bee7]/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Welcome, Reynold</span>
            <Sparkles className="w-6 h-6 text-[#ff3f81]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#e1bee7]/80 mt-1">
            Overview of your portfolio content, statistics, and quick management links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff3f81] hover:bg-[#e0326f] text-white text-xs sm:text-sm font-medium transition-all shadow-lg shadow-[#ff3f81]/30 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Projects Stat */}
        <div className="p-5 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#e1bee7]">
              Projects
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#ff3f81]/15 text-[#ff3f81] flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{projectCount ?? 0}</span>
            <span className="text-xs text-[#ff3f81] font-medium">
              ({publishedCount ?? 0} Published)
            </span>
          </div>
          <Link
            href="/admin/projects"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#e1bee7]/70 hover:text-[#ff3f81] transition-colors"
          >
            <span>View all projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Education Stat */}
        <div className="p-5 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#e1bee7]">
              Education
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#e1bee7]/15 text-[#e1bee7] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{educationCount ?? 0}</span>
            <span className="text-xs text-gray-400 font-medium">Entries</span>
          </div>
          <Link
            href="/admin/education"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#e1bee7]/70 hover:text-[#ff3f81] transition-colors"
          >
            <span>Manage education</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Profile Card Summary */}
        <div className="p-5 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#e1bee7]">
              Profile Bio
            </span>
            <div className="w-9 h-9 rounded-lg bg-green-500/15 text-green-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#ff3f81]">
              <Image
                src={profile?.photo_url || "/image/andre.jpg"}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">
                {profile?.name || "Reynold Andre"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {profile?.title || "Web Developer"}
              </p>
            </div>
          </div>
          <Link
            href="/admin/profile"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#e1bee7]/70 hover:text-[#ff3f81] transition-colors"
          >
            <span>Edit profile details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Projects Table & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base text-white">Recent Projects</h2>
            <Link
              href="/admin/projects"
              className="text-xs text-[#ff3f81] hover:underline"
            >
              See All
            </Link>
          </div>

          {recentProjects && recentProjects.length > 0 ? (
            <div className="divide-y divide-[#e1bee7]/10">
              {recentProjects.map((p) => (
                <div
                  key={p.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="truncate">
                    <p className="text-sm font-medium text-white truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-[#e1bee7]/60">
                      {p.project_type || "Project"} • /{p.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        p.is_published
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      }`}
                    >
                      {p.is_published ? "Published" : "Draft"}
                    </span>
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="text-xs text-[#e1bee7]/80 hover:text-[#ff3f81] px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">
              No projects created yet. Click &quot;New Project&quot; to get started.
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 space-y-3">
            <h2 className="font-semibold text-base text-white">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/projects/create"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#19153c]/60 hover:bg-[#19153c] border border-[#e1bee7]/10 text-xs font-medium transition-all group"
              >
                <span className="flex items-center gap-2 text-gray-200 group-hover:text-white">
                  <Plus className="w-4 h-4 text-[#ff3f81]" />
                  Add New Project
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/profile"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#19153c]/60 hover:bg-[#19153c] border border-[#e1bee7]/10 text-xs font-medium transition-all group"
              >
                <span className="flex items-center gap-2 text-gray-200 group-hover:text-white">
                  <User className="w-4 h-4 text-[#e1bee7]" />
                  Update Profile Info
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/admin/education"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#19153c]/60 hover:bg-[#19153c] border border-[#e1bee7]/10 text-xs font-medium transition-all group"
              >
                <span className="flex items-center gap-2 text-gray-200 group-hover:text-white">
                  <GraduationCap className="w-4 h-4 text-green-400" />
                  Add Education Entry
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-[#070522] to-[#19153c] border border-[#ff3f81]/30">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#ff3f81]" />
              Live Previews
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Changes saved in this CMS instantly reflect on the public website.
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href="/"
                target="_blank"
                className="flex-1 text-center py-2 px-3 rounded bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10"
              >
                Homepage
              </Link>
              <Link
                href="/portfolio"
                target="_blank"
                className="flex-1 text-center py-2 px-3 rounded bg-[#ff3f81]/20 hover:bg-[#ff3f81]/30 text-xs text-[#ff3f81] border border-[#ff3f81]/40"
              >
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
