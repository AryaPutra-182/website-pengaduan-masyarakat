// src/app/(public)/layout.tsx

"use client"; // Diperlukan karena AuthProvider & Navbar kemungkinan adalah Client Component

import '../globals.css'; 
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer';

// 1. IMPORT AUTHPROVIDER
import { AuthProvider } from '@/context/AuthContext';

// 2. HAPUS 'Inter' FONT DARI SINI (sudah ada di RootLayout)
// 3. HAPUS <html> DAN <body> DARI SINI

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 4. Gunakan React Fragment (<>) atau <div>, BUKAN <html>/<body>
    <>
      {/* 5. BUNGKUS SEMUANYA DENGAN AUTHPROVIDER */}
      <AuthProvider>
        <Navbar /> 
        <main>{children}</main>
        <Footer /> 
      </AuthProvider>
    </>
  );
}