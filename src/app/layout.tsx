// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// ==========================================================
// 1. IMPOR FONT 'INTER' DI SINI
// ==========================================================
import { Inter } from 'next/font/google';

// 2. Inisialisasi font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LaporPak - Layanan Pengaduan Masyarakat',
  description: 'Website untuk pengaduan masyarakat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* ========================================================== */}
      {/* 3. TERAPKAN FONT KE <body> DAN GABUNGKAN CLASS-NYA */}
      {/* ========================================================== */}
      <body className={`${inter.className} antialiased bg-gray-50`}>
        {/* Semua konten halaman */}
        {children}

        {/* Toaster untuk notifikasi global */}
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: '#4CAF50',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '8px',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#4CAF50',
              },
            },
            error: {
              style: {
                background: '#f44336',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '8px',
              },
            },
          }}
        />
      </body>
    </html>
  );
}