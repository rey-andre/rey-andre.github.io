import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import { LayoutDashboard, UserCheck, GraduationCap, FolderGit2, ArrowUpRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch quick stats
  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: publishedCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  const { count: educationCount } = await supabase
    .from("education")
    .select("*", { count: "exact", head: true });

  return (
    <div className="min-h-screen bg-[#19153c] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-[#e1bee7]/15 bg-[#070522]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff3f81] to-[#e1bee7] flex items-center justify-center font-bold text-white shadow-md shadow-[#ff3f81]/30">
            R
          </div>
          <div>
            <h1 className="font-semibold text-sm sm:text-base leading-none">CMS Dashboard</h1>
            <span className="text-[11px] text-[#e1bee7]/70">Reynold Andre Portfolio</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#e1bee7]/80 hover:text-white transition-colors"
          >
            <span>View Public Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Welcome Banner */}
        <div className="profile-card p-6 border border-[#e1bee7]/15 bg-gradient-to-r from-[#070522] via-[#070522] to-[#19153c]/70">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#ff3f81]/20 text-[#ff3f81] border border-[#ff3f81]/30">
                Authenticated
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-2">
                Welcome, {user.email}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Manage your portfolio information, projects, education, and images.
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="py-2 px-4 rounded-md bg-[#ff3f81] hover:bg-[#e0326f] text-white text-xs sm:text-sm font-medium transition-all shadow-md shadow-[#ff3f81]/30"
            >
              Manage Projects
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#070522]/80 border border-[#e1bee7]/15">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-medium uppercase tracking-wider text-[#e1bee7]">Total Projects</span>
              <FolderGit2 className="w-5 h-5 text-[#ff3f81]" />
            </div>
            <p className="text-3xl font-bold mt-3 text-white">{projectCount ?? 0}</p>
            <p className="text-[11px] text-gray-400 mt-1">{publishedCount ?? 0} published to public</p>
          </div>

          <div className="p-5 rounded-xl bg-[#070522]/80 border border-[#e1bee7]/15">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-medium uppercase tracking-wider text-[#e1bee7]">Education Entries</span>
              <GraduationCap className="w-5 h-5 text-[#ff3f81]" />
            </div>
            <p className="text-3xl font-bold mt-3 text-white">{educationCount ?? 0}</p>
            <p className="text-[11px] text-gray-400 mt-1">Active educational history</p>
          </div>

          <div className="p-5 rounded-xl bg-[#070522]/80 border border-[#e1bee7]/15">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-medium uppercase tracking-wider text-[#e1bee7]">Profile Status</span>
              <UserCheck className="w-5 h-5 text-[#ff3f81]" />
            </div>
            <p className="text-base font-semibold mt-3 text-green-400">Live & Synced</p>
            <p className="text-[11px] text-gray-400 mt-1">Supabase PostgreSQL connected</p>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/profile"
            className="p-5 rounded-xl bg-[#070522]/60 border border-[#e1bee7]/10 hover:border-[#ff3f81]/50 hover:bg-[#070522] transition-all group"
          >
            <h3 className="font-semibold text-sm group-hover:text-[#ff3f81] transition-colors">
              Edit Profile
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Update your personal bio, photo, contact, and social accounts.
            </p>
          </Link>

          <Link
            href="/admin/education"
            className="p-5 rounded-xl bg-[#070522]/60 border border-[#e1bee7]/10 hover:border-[#ff3f81]/50 hover:bg-[#070522] transition-all group"
          >
            <h3 className="font-semibold text-sm group-hover:text-[#ff3f81] transition-colors">
              Manage Education
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Add or reorder education entries, universities, and degrees.
            </p>
          </Link>

          <Link
            href="/admin/projects"
            className="p-5 rounded-xl bg-[#070522]/60 border border-[#e1bee7]/10 hover:border-[#ff3f81]/50 hover:bg-[#070522] transition-all group"
          >
            <h3 className="font-semibold text-sm group-hover:text-[#ff3f81] transition-colors">
              Manage Projects
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Add new projects, upload screenshots, tags, and URLs.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
