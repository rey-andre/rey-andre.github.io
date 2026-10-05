"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { getClientProfile, updateProfile, type Profile } from "@/lib/queries/profile";
import { uploadImage } from "@/lib/queries/storage";
import {
  User,
  Upload,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, startSaving] = useTransition();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getClientProfile();
        setProfile(data);
        setName(data.name || "");
        setTitle(data.title || "");
        setEmail(data.email || "");
        setShortDesc(data.short_description || "");
        setLongDesc(data.long_description || "");
        setPhotoUrl(data.photo_url || "");
        setLinkedinUrl(data.linkedin_url || "");
        setGithubUrl(data.github_url || "");
        setInstagramUrl(data.instagram_url || "");
        setTwitterUrl(data.twitter_url || "");
      } catch (err: unknown) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size exceeds 5MB limit." });
      return;
    }

    setUploadingPhoto(true);
    setMessage(null);

    try {
      const res = await uploadImage(file, "profile");
      setPhotoUrl(res.url);
      setMessage({ type: "success", text: "Profile image uploaded! Click 'Save Changes' to update." });
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : "Failed to upload image.";
      setMessage({ type: "error", text: errText });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startSaving(async () => {
      try {
        const updated = await updateProfile({
          name: name.trim(),
          title: title.trim(),
          email: email.trim(),
          short_description: shortDesc.trim(),
          long_description: longDesc.trim(),
          photo_url: photoUrl,
          linkedin_url: linkedinUrl.trim(),
          github_url: githubUrl.trim(),
          instagram_url: instagramUrl.trim(),
          twitter_url: twitterUrl.trim(),
        });
        setProfile(updated);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } catch (err: unknown) {
        const errText = err instanceof Error ? err.message : "Failed to save profile.";
        setMessage({ type: "error", text: errText });
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
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e1bee7]/15">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-[#ff3f81]" />
            <span>Profile Management</span>
          </h1>
          <p className="text-xs text-[#e1bee7]/80 mt-1">
            Update your public profile, bio, avatar, and social media links.
          </p>
        </div>
      </div>

      {/* Alerts */}
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
        {/* Photo Upload Card */}
        <div className="p-6 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider text-[#e1bee7]">
            Profile Picture
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#ff3f81] to-[#e1bee7] shadow-lg shadow-[#ff3f81]/20 shrink-0">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#070522]">
                <Image
                  src={photoUrl || "/image/andre.jpg"}
                  alt={name || "Profile"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <label
                htmlFor="photo-file"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#19153c] hover:bg-[#19153c]/80 border border-[#ff3f81] text-xs font-medium text-white cursor-pointer transition-colors shadow-sm"
              >
                {uploadingPhoto ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ff3f81]" />
                    <span>Uploading to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#ff3f81]" />
                    <span>Upload New Photo</span>
                  </>
                )}
                <input
                  id="photo-file"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  disabled={uploadingPhoto}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-gray-400">
                Recommended: JPG, PNG, or WebP. Max file size: 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="p-6 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider text-[#e1bee7]">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Reynold Andre"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Job Title / Profession *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Web Developer"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reynold.dre@gmail.com"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300">
                Short Description (Homepage Card Intro) *
              </label>
              <textarea
                rows={3}
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="A Web Developer and Software Engineering Technology graduate..."
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-300">
                Long Description (Portfolio About Section)
              </label>
              <textarea
                rows={4}
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                placeholder="Comprehensive background, achievements, and technical expertise..."
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-6 rounded-xl bg-[#070522]/90 border border-[#e1bee7]/15 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider text-[#e1bee7]">
            Social Media Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/reynoldandre/"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/rey-andre"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://www.instagram.com/reynold.sgn/"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-300">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://twitter.com/rynld_ndr"
                className="w-full px-3 py-2 bg-[#19153c] border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81]"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#ff3f81] hover:bg-[#e0326f] text-white text-sm font-medium transition-all shadow-lg shadow-[#ff3f81]/30 active:scale-95 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
