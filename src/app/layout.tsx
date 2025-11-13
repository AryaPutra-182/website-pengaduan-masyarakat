// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast'; // ✅ Tambahkan ini

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
      <body className="antialiased bg-gray-50">
        {/* Semua konten halaman */}
        {children}

        {/* ✅ Toaster untuk notifikasi global */}
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
