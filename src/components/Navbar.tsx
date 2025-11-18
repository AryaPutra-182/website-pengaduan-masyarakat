// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faXmark,
  faChevronDown,
  faFileSignature,
  faSearch,
  faClockRotateLeft, // ICON HISTORY
} from "@fortawesome/free-solid-svg-icons";

// Scroll untuk anchor
const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 100,
      behavior: "smooth",
    });
  }
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const handleAnchorClick = (e: any, href: string) => {
    e.preventDefault();
    const id = href.split("/#")[1];
    if (id) scrollToElement(id);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }

      const isToggleClicked = document
        .querySelector(".mobile-menu-toggle")
        ?.contains(target);

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !isToggleClicked
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "Lapor", href: "/#form-pengaduan", isAnchor: true },
    { name: "Lacak", href: "/lacak" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent">
      <div className="container mx-auto max-w-5xl px-4 md:px-6 py-2">
        <nav className="flex items-center justify-between rounded-full bg-[#0060A9]/80 backdrop-blur-sm px-6 py-3 text-white shadow-lg md:px-8 md:py-4 transition duration-300">

          {/* LOGO */}
          <Link href="/" className="text-xl font-bold md:text-2xl">
            LaporPak
          </Link>

          {/* MENU DESKTOP */}
          <ul className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={
                    link.isAnchor ? (e) => handleAnchorClick(e, link.href) : undefined
                  }
                  className="opacity-90 hover:opacity-100 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* PROFILE + MOBILE */}
          <div className="flex items-center space-x-3" ref={dropdownRef}>
            {user ? (
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white text-[#0060A9] hover:bg-gray-200 transition"
              >
                <FontAwesomeIcon icon={faUser} />
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`absolute -bottom-1 -right-1 text-xs transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  } bg-[#0060A9] rounded-full p-[1px]`}
                />
              </button>
            ) : (
              <div className="hidden md:flex space-x-4">
                <Link href="/login" className="px-5 py-2 text-sm rounded-full hover:bg-white/20">
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm bg-white text-[#0060A9] rounded-full hover:bg-gray-200"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* HAMBURGER */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-toggle md:hidden p-2 rounded-md hover:bg-white/20"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} className="h-6 w-6" />
            </button>

            {/* DROPDOWN PROFILE */}
            {isDropdownOpen && user && (
              <div className="absolute right-4 md:right-6 top-16 md:top-20 w-48 rounded-md bg-[#004A80] shadow-lg ring-1 ring-black/10 animate-fadeIn z-50">
                <div className="px-4 py-3 border-b border-blue-900">
                  <p className="text-sm font-medium text-white">Profil</p>
                  <p className="text-xs text-gray-300 truncate">
                    {user.nama || user.nama_lengkap || "Pengguna"}
                  </p>
                </div>

                <div className="py-1">
                  {/* Lapor Baru */}
                  <Link
                    href="/#form-pengaduan"
                    onClick={(e) => {
                      handleAnchorClick(e, "/#form-pengaduan");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-[#0060A9]"
                  >
                    <FontAwesomeIcon icon={faFileSignature} className="w-4 h-4 mr-3" />
                    Lapor Baru
                  </Link>

                  {/* Lacak */}
                  <Link
                    href="/lacak"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-[#0060A9]"
                  >
                    <FontAwesomeIcon icon={faSearch} className="w-4 h-4 mr-3" />
                    Lacak Aduan
                  </Link>

                  {/* RIWAYAT PENGADUAN — DITAMBAHKAN KEMBALI */}
                  <Link
                    href="/riwayat"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-[#0060A9]"
                  >
                    <FontAwesomeIcon icon={faClockRotateLeft} className="w-4 h-4 mr-3" />
                    Riwayat Pengaduan
                  </Link>

                  <div className="border-t border-blue-900 my-1"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#0060A9]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden absolute w-full bg-[#0060A9]/95 backdrop-blur-sm shadow-lg transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-96 opacity-100 py-3" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-3 pt-2 pb-3 space-y-1 text-white">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={
                link.isAnchor ? (e) => handleAnchorClick(e, link.href) : undefined
              }
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#004A80]"
            >
              {link.name}
            </Link>
          ))}

          {/* Masuk / Daftar */}
          {!user && (
            <div className="pt-2 border-t border-blue-700 space-y-2">
              <Link
                href="/login"
                className="block w-full text-center py-2 rounded-full text-[#0060A9] bg-white font-semibold"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="block w-full text-center py-2 rounded-full border border-white font-semibold"
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Tambahkan RIWAYAT di mobile menu jika butuh */}
          {user && (
            <Link
              href="/riwayat"
              className="block mt-2 px-3 py-2 rounded-md text-base font-medium hover:bg-[#004A80]"
            >
              Riwayat Pengaduan
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
