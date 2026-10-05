import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProfile } from "@/lib/queries/profile.server";
import { getEducationList } from "@/lib/queries/education.server";
import { getProjectsList } from "@/lib/queries/projects.server";
import PortfolioNav from "@/components/portfolio/PortfolioNav";
import NetworkCanvas from "@/components/ui/NetworkCanvas";
import {
  GraduationCap,
  FolderGit2,
  ExternalLink,
  ArrowRight,
  Code2,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Portfolio – Reynold Andre",
  description:
    "Explore projects, web applications, and education history of Reynold Andre, Web Developer and Software Engineering Technology graduate from IPB University.",
};

export default async function PortfolioPage() {
  const [profile, educationList, projects] = await Promise.all([
    getProfile(),
    getEducationList(),
    getProjectsList(true), // Only published
  ]);

  return (
    <div className="min-h-screen bg-[#19153c] text-white selection:bg-[#ff3f81] selection:text-white relative">
      {/* Background network canvas */}
      <NetworkCanvas />

      {/* Main Container */}
      <div className="relative z-10">
        <PortfolioNav email={profile.email} />

        {/* Hero / About Section */}
        <section id="about" className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="profile-card p-6 sm:p-10 border border-[#e1bee7]/15">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Avatar */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-[#ff3f81] via-[#e1bee7] to-[#ff3f81] shadow-xl shadow-[#ff3f81]/25 shrink-0">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#070522]">
                  <Image
                    src={profile.photo_url || "/image/andre.jpg"}
                    alt={profile.name}
                    fill
                    sizes="(max-width: 768px) 144px, 176px"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Bio & Intro */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff3f81]/15 text-[#ff3f81] border border-[#ff3f81]/30 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Available for Opportunities</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                  {profile.name}
                </h1>
                <p className="text-base sm:text-lg font-medium text-[#e1bee7]">
                  {profile.title}
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-gray-300 font-normal max-w-3xl">
                  {profile.long_description || profile.short_description}
                </p>

                {/* Social Quick Links */}
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-md bg-[#19153c] hover:bg-[#ff3f81] text-xs font-medium text-white border border-[#e1bee7]/20 transition-all hover:shadow-md hover:shadow-[#ff3f81]/30"
                    >
                      GitHub
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-md bg-[#19153c] hover:bg-[#ff3f81] text-xs font-medium text-white border border-[#e1bee7]/20 transition-all hover:shadow-md hover:shadow-[#ff3f81]/30"
                    >
                      LinkedIn
                    </a>
                  )}
                  {profile.instagram_url && (
                    <a
                      href={profile.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-md bg-[#19153c] hover:bg-[#ff3f81] text-xs font-medium text-white border border-[#e1bee7]/20 transition-all hover:shadow-md hover:shadow-[#ff3f81]/30"
                    >
                      Instagram
                    </a>
                  )}
                  <a
                    href={`mailto:${profile.email}`}
                    className="px-4 py-2 rounded-md bg-[#ff3f81] hover:bg-[#e0326f] text-xs font-medium text-white transition-all shadow-md shadow-[#ff3f81]/30"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        {educationList.length > 0 && (
          <section id="education" className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-[#ff3f81] font-semibold text-xs uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Background</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Education & Qualifications
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationList.map((edu) => (
                <div
                  key={edu.id}
                  className="profile-card p-6 border border-[#e1bee7]/15 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#19153c] border border-[#e1bee7]/20 flex items-center justify-center text-[#ff3f81] shrink-0 font-bold">
                    {edu.logo_url ? (
                      <div className="relative w-10 h-10 rounded overflow-hidden">
                        <Image
                          src={edu.logo_url}
                          alt={edu.institution}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <GraduationCap className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-white">
                        {edu.institution}
                      </h3>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-[#e1bee7] shrink-0">
                        {edu.start_year} — {edu.end_year || "Present"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#ff3f81]">
                      {edu.degree} • {edu.field_of_study}
                    </p>
                    {edu.description && (
                      <p className="text-xs text-gray-300 leading-relaxed pt-1 font-normal">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Showcase Section */}
        <section id="projects" className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-[#ff3f81] font-semibold text-xs uppercase tracking-wider">
                <FolderGit2 className="w-4 h-4" />
                <span>Featured Works</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Selected Projects
              </h2>
            </div>
            <p className="text-xs text-[#e1bee7]/70">
              Showing {projects.length} published project(s)
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="profile-card p-12 text-center text-gray-400 text-sm border border-[#e1bee7]/15">
              No published projects available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="profile-card flex flex-col justify-between border border-[#e1bee7]/15 group"
                >
                  <div>
                    {/* Thumbnail Image */}
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="relative block w-full aspect-video overflow-hidden bg-[#19153c]"
                    >
                      {project.thumbnail_url ? (
                        <Image
                          src={project.thumbnail_url}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                          <Code2 className="w-8 h-8 mb-1" />
                          <span className="text-[11px]">Preview coming soon</span>
                        </div>
                      )}
                      {project.project_type && (
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-semibold text-[#e1bee7] border border-white/10">
                          {project.project_type}
                        </span>
                      )}
                    </Link>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="block group-hover:text-[#ff3f81] transition-colors"
                      >
                        <h3 className="font-bold text-lg text-white line-clamp-1">
                          {project.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                        {project.short_description}
                      </p>

                      {/* Technology Tags */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.technologies.slice(0, 4).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-[#19153c] text-[10px] font-medium text-[#e1bee7] border border-[#e1bee7]/20"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-1.5 py-0.5 text-[10px] text-gray-400">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between gap-2 mt-4">
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff3f81] hover:text-white transition-colors"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>

                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Live Demo"
                        className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-[#e1bee7]/15 py-8 px-4 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Reynold Andre. Built with Next.js, Supabase, and Tailwind CSS.</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <Link href="/" className="hover:text-[#ff3f81] transition-colors">
              Profile Card
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-[#ff3f81] transition-colors">
              Admin CMS
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
