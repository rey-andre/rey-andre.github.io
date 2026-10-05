"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  getClientEducationList,
  createEducation,
  updateEducation,
  deleteEducation,
  toggleEducationVisibility,
  type Education,
  type EducationInput,
} from "@/lib/queries/education";
import { uploadImage } from "@/lib/queries/storage";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Upload,
} from "lucide-react";
import Image from "next/image";

export default function AdminEducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);

  // Form inputs
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const fetchList = async () => {
    try {
      const data = await getClientEducationList();
      setEducationList(data);
    } catch (err: unknown) {
      console.error("Failed to load education list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setStartYear(new Date().getFullYear().toString());
    setEndYear("");
    setDescription("");
    setLogoUrl("");
    setDisplayOrder(educationList.length + 1);
    setIsVisible(true);
    setModalOpen(true);
  };

  const openEditModal = (item: Education) => {
    setEditingItem(item);
    setInstitution(item.institution);
    setDegree(item.degree);
    setFieldOfStudy(item.field_of_study);
    setStartYear(item.start_year);
    setEndYear(item.end_year || "");
    setDescription(item.description || "");
    setLogoUrl(item.logo_url || "");
    setDisplayOrder(item.display_order);
    setIsVisible(item.is_visible);
    setModalOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const res = await uploadImage(file, "education");
      setLogoUrl(res.url);
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : "Failed to upload logo.";
      setMessage({ type: "error", text: errText });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const input: EducationInput = {
      institution: institution.trim(),
      degree: degree.trim(),
      field_of_study: fieldOfStudy.trim(),
      start_year: startYear.trim(),
      end_year: endYear.trim() || null,
      description: description.trim() || null,
      logo_url: logoUrl || null,
      display_order: Number(displayOrder) || 1,
      is_visible: isVisible,
    };

    startTransition(async () => {
      try {
        if (editingItem) {
          await updateEducation(editingItem.id, input);
          setMessage({ type: "success", text: "Education entry updated successfully!" });
        } else {
          await createEducation(input);
          setMessage({ type: "success", text: "New education entry created!" });
        }
        setModalOpen(false);
        fetchList();
      } catch (err: unknown) {
        const errText = err instanceof Error ? err.message : "Failed to save education entry.";
        setMessage({ type: "error", text: errText });
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    startTransition(async () => {
      try {
        await deleteEducation(id);
        setMessage({ type: "success", text: "Education entry deleted." });
        fetchList();
      } catch (err: unknown) {
        const errText = err instanceof Error ? err.message : "Failed to delete education entry.";
        setMessage({ type: "error", text: errText });
      }
    });
  };

  const handleToggle = async (item: Education) => {
    startTransition(async () => {
      try {
        await toggleEducationVisibility(item.id, !item.is_visible);
        fetchList();
      } catch (err: unknown) {
        console.error("Toggle error:", err);
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e1bee7]/15">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#ff3f81]" />
            <span>Education Management</span>
          </h1>
          <p className="text-xs text-[#e1bee7]/80 mt-1">
            Manage your academic history, degrees, certificates, and order of display.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ff3f81] hover:bg-[#e0326f] text-white text-xs sm:text-sm font-medium transition-all shadow-lg shadow-[#ff3f81]/30 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
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

      {/* List of Education Entries */}
      <div className="p-6 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15">
        {educationList.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No education entries yet. Click &quot;Add Education&quot; to create one.
          </div>
        ) : (
          <div className="divide-y divide-[#e1bee7]/10">
            {educationList.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#19153c] border border-[#e1bee7]/20 flex items-center justify-center text-[#ff3f81] shrink-0 font-bold">
                    {item.logo_url ? (
                      <div className="relative w-8 h-8 rounded overflow-hidden">
                        <Image
                          src={item.logo_url}
                          alt={item.institution}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <GraduationCap className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base text-white">
                        {item.institution}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#e1bee7]">
                        {item.start_year} — {item.end_year || "Present"}
                      </span>
                    </div>
                    <p className="text-xs text-[#ff3f81] font-medium mt-0.5">
                      {item.degree} • {item.field_of_study}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-300 mt-1 max-w-2xl">
                        {item.description}
                      </p>
                    )}
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Display Order: {item.display_order}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center shrink-0">
                  {/* Toggle Visibility */}
                  <button
                    onClick={() => handleToggle(item)}
                    title={item.is_visible ? "Visible on site" : "Hidden from site"}
                    className={`p-2 rounded-md border text-xs flex items-center gap-1 transition-colors ${
                      item.is_visible
                        ? "border-green-500/40 bg-green-500/10 text-green-300 hover:bg-green-500/20"
                        : "border-gray-500/40 bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                    }`}
                  >
                    {item.is_visible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[11px]">
                      {item.is_visible ? "Visible" : "Hidden"}
                    </span>
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 rounded-md border border-[#e1bee7]/20 hover:border-[#ff3f81] hover:bg-[#ff3f81]/10 text-white transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#e1bee7]" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id, item.institution)}
                    className="p-2 rounded-md border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-red-400 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#070522] border border-[#e1bee7]/20 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#e1bee7]/15">
              <h2 className="font-semibold text-base text-white">
                {editingItem ? "Edit Education Entry" : "Add Education Entry"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-300">
                  Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. IPB University"
                  className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-300">
                    Degree *
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. Sarjana Terapan (S.Tr.Kom)"
                    className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-300">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    required
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Software Engineering"
                    className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-300">
                    Start Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    placeholder="2020"
                    className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-300">
                    End Year (or blank if Present)
                  </label>
                  <input
                    type="text"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    placeholder="2024 or Present"
                    className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-300">
                  Description / GPA / Highlights
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Graduated with GPA 3.80. Focus on Software Engineering..."
                  className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-300">
                  Institution Logo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  {logoUrl && (
                    <div className="relative w-10 h-10 rounded border border-[#e1bee7]/20 overflow-hidden bg-[#19153c]">
                      <Image src={logoUrl} alt="Logo" fill className="object-contain" />
                    </div>
                  )}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#19153c] hover:bg-[#19153c]/80 border border-[#e1bee7]/30 rounded text-xs text-white cursor-pointer transition-colors">
                    {uploadingLogo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ff3f81]" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#ff3f81]" />
                    )}
                    <span>{logoUrl ? "Replace Logo" : "Upload Logo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingLogo}
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl("")}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
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

                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={(e) => setIsVisible(e.target.checked)}
                      className="w-4 h-4 rounded text-[#ff3f81] bg-[#19153c] border-gray-600 focus:ring-[#ff3f81]"
                    />
                    <span className="text-xs text-gray-200">Visible on Public Site</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e1bee7]/15">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-md border border-[#e1bee7]/20 text-xs text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-[#ff3f81] hover:bg-[#e0326f] text-xs font-medium text-white transition-all shadow-md shadow-[#ff3f81]/30 disabled:opacity-60"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Save Changes" : "Create Entry"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
