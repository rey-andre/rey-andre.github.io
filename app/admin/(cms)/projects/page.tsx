"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getClientProjectsList,
  deleteProject,
  toggleProjectPublish,
  type Project,
} from "@/lib/queries/projects";
import {
  FolderGit2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProjects = async () => {
    try {
      const data = await getClientProjectsList();
      setProjects(data);
    } catch (err: unknown) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    startTransition(async () => {
      try {
        await deleteProject(id);
        setMessage({ type: "success", text: `Project "${title}" deleted.` });
        fetchProjects();
      } catch (err: unknown) {
        const errText = err instanceof Error ? err.message : "Failed to delete project.";
        setMessage({ type: "error", text: errText });
      }
    });
  };

  const handleTogglePublish = async (project: Project) => {
    startTransition(async () => {
      try {
        await toggleProjectPublish(project.id, !project.is_published);
        fetchProjects();
      } catch (err: unknown) {
        console.error("Toggle publish error:", err);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#ff3f81] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e1bee7]/15">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-[#ff3f81]" />
            <span>Projects Management</span>
          </h1>
          <p className="text-xs text-[#e1bee7]/80 mt-1">
            Create, edit, reorder, and publish your portfolio projects.
          </p>
        </div>

        <Link
          href="/admin/projects/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff3f81] hover:bg-[#e0326f] text-white text-xs sm:text-sm font-medium transition-all shadow-lg shadow-[#ff3f81]/30 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </Link>
      </div>

      {/* Alert */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-xs font-medium border ${
            message.type === "success"
              ? "bg-green-950/60 border-green-500/40 text-green-200"
              : "bg-red-950/60 border-red-500/40 text-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Projects Table / Cards */}
      <div className="p-6 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No projects found. Click &quot;Create New Project&quot; to add your first work!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#e1bee7]/15 text-[#e1bee7]/70 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="pb-3 pl-2">Thumbnail & Title</th>
                  <th className="pb-3 hidden md:table-cell">Technologies</th>
                  <th className="pb-3 hidden sm:table-cell">Type</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1bee7]/10">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Thumbnail & Title */}
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-[#19153c] border border-[#e1bee7]/20 overflow-hidden shrink-0">
                          {project.thumbnail_url ? (
                            <Image
                              src={project.thumbnail_url}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="font-semibold text-white group-hover:text-[#ff3f81] transition-colors line-clamp-1 text-sm"
                          >
                            {project.title}
                          </Link>
                          <p className="text-[11px] text-[#e1bee7]/60">
                            /{project.slug} • Order: {project.display_order}
                          </p>
                          {project.project_images && project.project_images.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                              <ImageIcon className="w-3 h-3 text-[#ff3f81]" />
                              {project.project_images.length} gallery image(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Technologies */}
                    <td className="py-4 hidden md:table-cell max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-[#19153c] text-[10px] text-gray-300 border border-[#e1bee7]/15"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies && project.technologies.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-gray-400">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 hidden sm:table-cell text-gray-300">
                      {project.project_type || "Web App"}
                    </td>

                    {/* Published Status Toggle */}
                    <td className="py-4">
                      <button
                        onClick={() => handleTogglePublish(project)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                          project.is_published
                            ? "bg-green-500/15 border-green-500/30 text-green-300 hover:bg-green-500/25"
                            : "bg-yellow-500/15 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/25"
                        }`}
                      >
                        {project.is_published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Live View link */}
                        <Link
                          href={`/portfolio/${project.slug}`}
                          target="_blank"
                          title="View on site"
                          className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/projects/${project.id}`}
                          title="Edit Project"
                          className="p-1.5 rounded-md hover:bg-[#ff3f81]/15 text-[#e1bee7] hover:text-[#ff3f81] transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          disabled={isPending}
                          title="Delete Project"
                          className="p-1.5 rounded-md hover:bg-red-500/15 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
