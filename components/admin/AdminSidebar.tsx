"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  FolderGit2,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: User,
  },
  {
    name: "Education",
    href: "/admin/education",
    icon: GraduationCap,
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FolderGit2,
  },
];

interface AdminSidebarProps {
  userEmail?: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#070522] border-b border-[#e1bee7]/15 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <Image
            src="/image/logoRey0.png"
            alt="Logo"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="font-semibold text-sm text-white">CMS Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#070522] border-r border-[#e1bee7]/15 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#e1bee7]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg p-0.5 bg-gradient-to-tr from-[#ff3f81] to-[#e1bee7] shadow-md shadow-[#ff3f81]/20">
              <div className="w-full h-full rounded-md bg-[#070522] flex items-center justify-center">
                <Image
                  src="/image/logoRey0.png"
                  alt="Logo"
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">
                Reynold Andre
              </h2>
              <span className="text-[11px] text-[#e1bee7]/70 font-medium">
                Portfolio CMS
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-gray-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#e1bee7]/40">
            Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-[#ff3f81] to-[#ff3f81]/80 text-white shadow-md shadow-[#ff3f81]/25 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-[#e1bee7]/70"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#e1bee7]/40">
            Public Website
          </div>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-[#ff3f81]" />
              View Live Profile
            </span>
          </Link>
          <Link
            href="/portfolio"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-[#e1bee7]" />
              View Portfolio
            </span>
          </Link>
        </nav>

        {/* Footer with User info & Logout */}
        <div className="p-4 border-t border-[#e1bee7]/10 bg-[#070522]/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="truncate mr-2">
              <p className="text-[11px] text-gray-400">Signed in as</p>
              <p className="text-xs font-medium text-white truncate">
                {userEmail || "Admin"}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
