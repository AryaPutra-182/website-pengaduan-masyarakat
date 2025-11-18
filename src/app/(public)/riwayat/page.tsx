"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const API_BASE_URL = "http://localhost:5000";

interface Lampiran {
  id: number;
  filePath: string;
}

interface PengaduanItem {
  id: number;
  judul: string;
  createdAt: string;
  status: string;
  lampiran: Lampiran[];
}

export default function RiwayatPage() {
  const { token, isLoading: authLoading } = useAuth();

  const [riwayat, setRiwayat] = useState<PengaduanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "MENUNGGU VERIFIKASI", bg: "bg-yellow-500" };
      case "diterima":
        return { text: "DITERIMA", bg: "bg-blue-500" };
      case "diproses":
        return { text: "DIPROSES", bg: "bg-indigo-500" };
      case "dilaksanakan":
        return { text: "DIPERBAIKI", bg: "bg-green-600" };
      case "selesai":
        return { text: "SELESAI", bg: "bg-gray-600" };
      case "ditolak":
        return { text: "DITOLAK", bg: "bg-red-600" };
      default:
        return { text: "TIDAK DIKETAHUI", bg: "bg-gray-400" };
    }
  };

  useEffect(() => {
    setIsClient(true);

    if (!token) {
      setError("Harus login terlebih dahulu.");
      setLoading(false);
      return;
    }

    const fetchRiwayat = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/pengaduan/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil riwayat pengaduan.");
        }

        setRiwayat(Array.isArray(result.data) ? result.data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, [token]);

  if (loading || authLoading)
    return (
      <div className="flex min-h-screen items-center justify-center pt-32">
        Memuat riwayat...
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center pt-32 text-red-600">
        {error}
      </div>
    );

  return (
    <main className="pt-32 min-h-screen bg-white relative overflow-hidden">
      <h1 className="text-3xl font-bold text-[#004A80] text-center mb-10">
        RIWAYAT PENGADUAN
      </h1>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {riwayat.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada pengaduan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {riwayat.map((item) => (
              <Link key={item.id} href={`/riwayat/${item.id}`}>
                <div className="cursor-pointer bg-white rounded-xl shadow-md border hover:shadow-lg transition overflow-hidden">

                  {/* === GAMBAR LAMPIRAN UTAMA (NEW STYLE) === */}
                  <a
                    href={
                      item.lampiran?.[0]
                        ? `${API_BASE_URL}${item.lampiran[0].filePath.replace(/\\/g, "/")}`
                        : "/placeholder-image.png"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block h-32 w-full overflow-hidden rounded-t-xl border-b group"
                  >
                    <img
                      src={
                        item.lampiran?.[0]
                          ? `${API_BASE_URL}${item.lampiran[0].filePath.replace(/\\/g, "/")}`
                          : "/placeholder-image.png"
                      }
                      alt="Lampiran Utama"
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/300x200?text=Gagal+Memuat";
                      }}
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs bg-black/50 px-2 py-1 rounded">
                        Lihat
                      </span>
                    </div>

                    <span
                      className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full text-white ${getStatusBadge(item.status).bg} shadow-md`}
                    >
                      {getStatusBadge(item.status).text}
                    </span>
                  </a>

                  <div className="p-4 text-center">
                    <p className="font-semibold text-sm text-[#0060A9] h-10 overflow-hidden">
                      {item.judul}
                    </p>

                    <p className="text-gray-600 text-sm mt-3">
                      {isClient
                        ? new Date(item.createdAt).toLocaleDateString("id-ID")
                        : "..."}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10 mb-16">
          <Link href="/">
            <button className="bg-[#0060A9] text-white px-8 py-2 rounded-full hover:bg-[#004a80] transition">
              Kembali
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
