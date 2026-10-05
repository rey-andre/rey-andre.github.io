import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectsList } from "@/lib/queries/projects.server";
import { getProfile } from "@/lib/queries/profile.server";
import PortfolioNav from "@/components/portfolio/PortfolioNav";
import ImageCarousel from "@/components/portfolio/ImageCarousel";
import NetworkCanvas from "@/components/ui/NetworkCanvas";
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  Calendar,
  Sparkles,
  ArrowRight,
  Code2,
} from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found – Reynold Andre",
    };
  }

  const ogImages = project.thumbnail_url
    ? [{ url: project.thumbnail_url, alt: project.title }]
    : [];

  return {
    title: `${project.title} – Reynold Andre`,
    description: project.short_description,
    openGraph: {
      title: `${project.title} – Reynold Andre`,
      description: project.short_description,
      type: "article",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} – Reynold Andre`,
      description: project.short_description,
      images: ogImages.map((i) => i.url),
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, profile, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProfile(),
    getProjectsList(true),
  ]);

  if (!project) {
    notFound();
  }

  // Sort gallery images by display order
  const images = project.project_images
    ? [...project.project_images].sort((a, b) => a.display_order - b.display_order)
    : [];

  // Find next project for footer navigation
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject =
    currentIndex !== -1 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : allProjects[0] && allProjects[0].slug !== slug
      ? allProjects[0]
      : null;

  return (
    <div className="min-h-screen bg-[#19153c] text-white selection:bg-[#ff3f81] selection:text-white relative">
      <NetworkCanvas />

      <div className="relative z-10">
        <PortfolioNav email={profile.email} />

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          {/* Back button */}
          <div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#e1bee7]/70 hover:text-[#ff3f81] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to all projects</span>
            </Link>
          </div>

          {/* Project Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {project.project_type && (
                <span className="px-3 py-1 rounded-full bg-[#ff3f81]/15 text-[#ff3f81] border border-[#ff3f81]/30 text-xs font-semibold">
                  {project.project_type}
                </span>
              )}
              <span className="text-xs text-gray-400">/{project.slug}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#e1bee7] leading-relaxed max-w-3xl">
              {project.short_description}
            </p>
          </div>

          {/* Image Carousel */}
          <section className="pt-2">
            <ImageCarousel
              images={images}
              projectTitle={project.title}
              fallbackThumbnail={project.thumbnail_url}
            />
          </section>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            {/* Left 2 Cols: Full Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="profile-card p-6 sm:p-8 border border-[#e1bee7]/15 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ff3f81]" />
                  <span>About the Project</span>
                </h2>
                <div className="text-sm leading-relaxed text-gray-300 space-y-4 whitespace-pre-line font-normal">
                  {project.description}
                </div>
              </div>
            </div>

            {/* Right Column: Meta, Tech Stack, & Links */}
            <div className="space-y-6">
              {/* Actions & Links */}
              <div className="profile-card p-6 border border-[#e1bee7]/15 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#e1bee7]">
                  Project Links
                </h3>
                <div className="space-y-2.5">
                  {project.project_url ? (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#ff3f81] hover:bg-[#e0326f] text-white text-xs font-semibold transition-all shadow-lg shadow-[#ff3f81]/30 active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo & Website</span>
                    </a>
                  ) : (
                    <div className="text-xs text-gray-400 p-2.5 bg-[#19153c] rounded text-center border border-white/5">
                      Live demo not currently available
                    </div>
                  )}

                  {project.repository_url && (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#19153c] hover:bg-white/10 border border-[#e1bee7]/20 text-white text-xs font-semibold transition-all"
                    >
                      <svg className="w-4 h-4 fill-current text-[#e1bee7]" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>View Source Code</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="profile-card p-6 border border-[#e1bee7]/15 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#e1bee7] flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#ff3f81]" />
                    <span>Technologies</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-md bg-[#19153c] text-xs font-medium text-white border border-[#e1bee7]/20 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Project Footer */}
          {nextProject && (
            <div className="pt-8 border-t border-[#e1bee7]/15">
              <Link
                href={`/portfolio/${nextProject.slug}`}
                className="profile-card p-6 border border-[#e1bee7]/15 flex items-center justify-between group hover:border-[#ff3f81]/40"
              >
                <div>
                  <span className="text-[11px] text-[#e1bee7]/70 font-semibold uppercase tracking-wider">
                    Next Project
                  </span>
                  <h4 className="font-bold text-lg text-white group-hover:text-[#ff3f81] transition-colors mt-0.5">
                    {nextProject.title}
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#19153c] border border-[#e1bee7]/20 flex items-center justify-center text-[#ff3f81] group-hover:bg-[#ff3f81] group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </div>
          )}
        </main>

        <footer className="mt-20 border-t border-[#e1bee7]/15 py-8 px-4 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Reynold Andre. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
