"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Menu, X, Mail } from "lucide-react";

interface PortfolioNavProps {
  email: string;
}

export default function PortfolioNav({ email }: PortfolioNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#19153c]/90 backdrop-blur-md border-b border-[#e1bee7]/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Profile back link */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group text-xs text-[#e1bee7]/80 hover:text-white transition-colors"
          >
            <div className="relative w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-[#ff3f81] to-[#e1bee7] shadow-sm">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#070522]">
                <Image
                  src="/image/andre.jpg"
                  alt="Reynold Andre"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-sm text-white group-hover:text-[#ff3f81] transition-colors">
                Reynold Andre
              </span>
              <span className="text-[10px] text-gray-400 block -mt-0.5">
                Web Developer
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-300">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[#e1bee7]/70 hover:text-[#ff3f81] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Profile Card</span>
          </Link>
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
          <a href="#education" className="hover:text-white transition-colors">
            Education
          </a>
          <a href="#projects" className="hover:text-white transition-colors">
            Projects
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ff3f81] hover:bg-[#e0326f] text-white text-xs font-medium transition-all shadow-md shadow-[#ff3f81]/30 active:scale-95"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070522] border-b border-[#e1bee7]/15 px-6 py-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-xs text-[#e1bee7] py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile Card</span>
          </Link>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-gray-300 hover:text-white py-1.5"
          >
            About
          </a>
          <a
            href="#education"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-gray-300 hover:text-white py-1.5"
          >
            Education
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-gray-300 hover:text-white py-1.5"
          >
            Projects
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#ff3f81] text-white text-xs font-medium"
          >
            <Mail className="w-4 h-4" />
            <span>Email Me</span>
          </a>
        </div>
      )}
    </header>
  );
}
