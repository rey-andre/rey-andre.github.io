"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createProject,
  updateProject,
  addProjectImage,
  deleteProjectImage,
  type Project,
  type ProjectInput,
  type ProjectImage,
} from "@/lib/queries/projects";
import { uploadImage, deleteStorageImage } from "@/lib/queries/storage";
import {
  Save,
  ArrowLeft,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Plus,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

interface ProjectFormProps {
  initialData?: Project | null;
  isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [shortDesc, setShortDesc] = useState(initialData?.short_description || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [technologies, setTechnologies] = useState<string[]>(initialData?.technologies || []);
  const [techInput, setTechInput] = useState("");
  const [projectType, setProjectType] = useState(initialData?.project_type || "Web App");
  const [projectUrl, setProjectUrl] = useState(initialData?.project_url || "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repository_url || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || "");
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.display_order ?? 1);
  const [isPublished, setIsPublished] = useState<boolean>(initialData?.is_published ?? true);

  // Gallery images (from DB)
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>(
    initialData?.project_images || []
  );

  // Upload states
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Auto generate slug when title changes (only on create or if slug is empty)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit || !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(generated);
    }
  };

  const handleAddTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = techInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
      setTechInput("");
    }
  };

  const handleRemoveTech = (itemToRemove: string) => {
    setTechnologies(technologies.filter((t) => t !== itemToRemove));
  };

  // Upload single thumbnail image
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Thumbnail exceeds 5MB limit." });
      return;
    }

    setUploadingThumbnail(true);
    try {
      const res = await uploadImage(file, "projects", slug || "thumbnails");
      setThumbnailUrl(res.url);
      setMessage({ type: "success", text: "Thumbnail uploaded successfully!" });
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : "Failed to upload thumbnail.";
      setMessage({ type: "error", text: errText });
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Upload multiple gallery images
  const handleMultipleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setMessage(null);

    try {
      const uploadPromises = Array.from(files).map((f) =>
        uploadImage(f, "projects", slug || "gallery")
      );
      const results = await Promise.all(uploadPromises);

      // If editing an existing project, save images directly to DB
      if (initialData?.id) {
        const imageInsertPromises = results.map((res, index) =>
          addProjectImage(
            initialData.id,
            res.url,
            title,
            galleryImages.length + index + 1
          )
        );
        const newImages = await Promise.all(imageInsertPromises);
        setGalleryImages((prev) => [...prev, ...newImages]);
      } else {
        // If creating new project, temporarily hold them in memory with temporary ids
        const tempImages: ProjectImage[] = results.map((res, idx) => ({
          id: `temp-${Date.now()}-${idx}`,
          project_id: "",
          image_url: res.url,
          alt_text: title,
          display_order: galleryImages.length + idx + 1,
        }));
        setGalleryImages((prev) => [...prev, ...tempImages]);
      }

      setMessage({
        type: "success",
        text: `Uploaded ${results.length} image(s) successfully!`,
      });
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : "Failed to upload images.";
      setMessage({ type: "error", text: errText });
    } finally {
      setUploadingGallery(false);
    }
  };

  // Delete gallery image
  const handleDeleteGalleryImage = async (img: ProjectImage) => {
    if (!confirm("Are you sure you want to remove this image?")) return;

    if (img.id.startsWith("temp-")) {
      setGalleryImages(galleryImages.filter((i) => i.id !== img.id));
      return;
    }

    try {
      await deleteProjectImage(img.id);
      setGalleryImages(galleryImages.filter((i) => i.id !== img.id));
      setMessage({ type: "success", text: "Image removed from project gallery." });
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : "Failed to delete image.";
      setMessage({ type: "error", text: errText });
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const inputData: ProjectInput = {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      short_description: shortDesc.trim(),
      description: description.trim(),
      technologies: technologies,
      project_type: projectType.trim() || null,
      project_url: projectUrl.trim() || null,
      repository_url: repoUrl.trim() || null,
      thumbnail_url: thumbnailUrl.trim() || null,
      display_order: Number(displayOrder) || 1,
      is_published: isPublished,
    };

    startTransition(async () => {
      try {
        if (isEdit && initialData?.id) {
          await updateProject(initialData.id, inputData);
          setMessage({ type: "success", text: "Project updated successfully!" });
          router.refresh();
        } else {
          const newProject = await createProject(inputData);

          // If there were temporary uploaded images during creation, associate them now
          if (galleryImages.length > 0) {
            for (let i = 0; i < galleryImages.length; i++) {
              await addProjectImage(
                newProject.id,
                galleryImages[i].image_url,
                newProject.title,
                i + 1
              );
            }
          }

          router.push(`/admin/projects/${newProject.id}`);
          router.refresh();
        }
      } catch (err: unknown) {
        const errText = err instanceof Error ? err.message : "Failed to save project.";
        setMessage({ type: "error", text: errText });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e1bee7]/15">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-lg bg-[#070522] border border-[#e1bee7]/20 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {isEdit ? `Edit: ${initialData?.title}` : "Create New Project"}
            </h1>
            <p className="text-xs text-[#e1bee7]/80">
              {isEdit ? "Update project details, tags, and carousel images" : "Add a new work to your portfolio"}
            </p>
          </div>
        </div>

        {isEdit && initialData && (
          <Link
            href={`/portfolio/${initialData.slug}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e1bee7]/20 text-xs text-[#e1bee7] hover:text-white hover:border-[#ff3f81] transition-all"
          >
            <span>Live Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="p-6 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#e1bee7]">
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Employee Self Service Web App"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                placeholder="employee-self-service-web"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Project Type
              </label>
              <input
                type="text"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="Web App / Mobile App / API"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300">
                Short Description (Summary Card) *
              </label>
              <textarea
                rows={2}
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="One or two sentences describing the project..."
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300">
                Full Description (Detail Page) *
              </label>
              <textarea
                rows={6}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="In-depth explanation of problems solved, architecture, and results..."
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white focus:outline-none focus:border-[#ff3f81]"
              />
            </div>
          </div>
        </div>

        {/* Technologies (Tags) */}
        <div className="p-6 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#e1bee7]">
            Technologies & Tools
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleAddTech}
              placeholder="e.g. Next.js, PostgreSQL, Tailwind, Flutter (Press Enter to add)"
              className="flex-1 px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white focus:outline-none focus:border-[#ff3f81]"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="px-4 py-2 bg-[#19153c] hover:bg-[#ff3f81] border border-[#ff3f81] text-xs font-medium text-white rounded-md transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {technologies.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#19153c] border border-[#e1bee7]/20 text-xs text-gray-200"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(t)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {technologies.length === 0 && (
              <span className="text-xs text-gray-400">No technologies added yet.</span>
            )}
          </div>
        </div>

        {/* External Links */}
        <div className="p-6 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#e1bee7]">
            Project Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Live Demo / Website URL
              </label>
              <input
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Repository / GitHub URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/rey-andre/repo"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white focus:outline-none focus:border-[#ff3f81]"
              />
            </div>
          </div>
        </div>

        {/* Thumbnail & Gallery Images */}
        <div className="p-6 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#e1bee7]">
              Media & Images (Supabase Storage)
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Upload featured thumbnail and multiple carousel screenshots for this project.
            </p>
          </div>

          {/* Featured Thumbnail */}
          <div className="space-y-3 pb-6 border-b border-[#e1bee7]/10">
            <label className="block text-xs font-semibold text-white">
              Primary Thumbnail
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-32 h-20 rounded-lg bg-[#19153c] border border-[#e1bee7]/20 overflow-hidden shrink-0 flex items-center justify-center">
                {thumbnailUrl ? (
                  <Image
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                )}
              </div>

              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#19153c] hover:bg-[#19153c]/80 border border-[#ff3f81] text-xs font-medium text-white cursor-pointer transition-colors shadow-sm">
                  {uploadingThumbnail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ff3f81]" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-[#ff3f81]" />
                  )}
                  <span>{thumbnailUrl ? "Replace Thumbnail" : "Upload Thumbnail"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingThumbnail}
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </label>
                {thumbnailUrl && (
                  <button
                    type="button"
                    onClick={() => setThumbnailUrl("")}
                    className="ml-3 text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
                <p className="text-[11px] text-gray-400">
                  Recommended size: 1200x630 or 16:9 ratio.
                </p>
              </div>
            </div>
          </div>

          {/* Multiple Project Images (Carousel Gallery) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-semibold text-white">
                  Carousel Gallery ({galleryImages.length} images)
                </label>
                <p className="text-[11px] text-gray-400">
                  These images will be displayed in the project detail image carousel.
                </p>
              </div>

              <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#ff3f81] hover:bg-[#e0326f] text-xs font-medium text-white cursor-pointer transition-colors shadow-sm self-start sm:self-auto">
                {uploadingGallery ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>Upload Multiple Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={uploadingGallery}
                  onChange={handleMultipleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Gallery Grid */}
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {galleryImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative group rounded-lg overflow-hidden border border-[#e1bee7]/20 bg-[#19153c] aspect-video"
                  >
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || `Slide ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryImage(img)}
                        className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                        title="Delete this image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-[#e1bee7]/20 rounded-lg text-center text-xs text-gray-400">
                No gallery screenshots uploaded yet. Click &quot;Upload Multiple Images&quot; above to add images for the carousel slider.
              </div>
            )}
          </div>
        </div>

        {/* Publish Status & Actions */}
        <div className="p-6 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 rounded text-[#ff3f81] bg-[#19153c] border-gray-600 focus:ring-[#ff3f81]"
            />
            <div>
              <p className="text-xs font-semibold text-white">Publish this project</p>
              <p className="text-[11px] text-gray-400">
                When checked, this project is visible to the public on the portfolio page.
              </p>
            </div>
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#ff3f81] hover:bg-[#e0326f] text-white text-xs sm:text-sm font-medium transition-all shadow-lg shadow-[#ff3f81]/30 active:scale-95 disabled:opacity-60 self-end sm:self-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Project...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEdit ? "Update Project" : "Create Project"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
