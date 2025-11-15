"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = "http://localhost:5000";

// Style
const inputStyle =
  "w-full px-5 py-3 border border-gray-300 rounded-full text-base text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]";
const buttonBlueCapsule =
  "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400";

// ==========================
// POPUP ALERT COMPONENT
// ==========================
function PopupAlert({ text }: { text: string }) {
  return (
    <div className="fixed top-5 right-5 z-[999] animate-slideDown">
      <div className="bg-[#0060A9] text-white px-5 py-3 rounded-lg shadow-lg font-medium">
        {text}
      </div>

      <style jsx>{`
        .animate-slideDown {
          animation: slideDown 0.4s ease;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function EditKategoriPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  const [namaKategori, setNamaKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [popup, setPopup] = useState(""); // <-- popup state

  const showPopup = (msg: string) => {
    setPopup(msg);
    setTimeout(() => setPopup(""), 2000);
  };

  const safeJSON = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Server tidak mengembalikan JSON. Cek route backend.");
    }
  };

  // ==============================
  // GET DATA KATEGORI
  // ==============================
  useEffect(() => {
    const fetchKategori = async () => {
      if (!id) return;

      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/kategori/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await safeJSON(res);

        if (!res.ok) throw new Error(result.message);

        setNamaKategori(result.data.nama_kategori);
        setDeskripsi(result.data.deskripsi || "");
      } catch (err: any) {
        setError(err.message || "Gagal memuat data.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchKategori();
  }, [id, router]);

  // ==============================
  // UPDATE DATA KATEGORI
  // ==============================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/kategori/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama_kategori: namaKategori,
          deskripsi,
        }),
      });

      const result = await safeJSON(res);

      if (!res.ok) throw new Error(result.message);

      showPopup("Kategori berhasil diperbarui!");

      setTimeout(() => router.push("/admin/kategori"), 1500);
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui kategori.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen pt-28">

      {/* Popup alert muncul di pojok atas */}
      {popup && <PopupAlert text={popup} />}

      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-xl font-bold text-[#004A80]">
          Ubah Data Kategori
        </h2>

        {isLoadingData ? (
          <p className="text-center text-gray-500">Memuat data kategori...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama */}
            <div>
              <label className="text-sm font-semibold text-[#004A80] mb-1 block">
                Nama Kategori
              </label>
              <input
                type="text"
                className={inputStyle}
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="text-sm font-semibold text-[#004A80] mb-1 block">
                Deskripsi
              </label>
              <textarea
                className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9] h-28"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
              />
            </div>

            {/* Error */}
            {error && <p className="text-center text-red-600">{error}</p>}

            {/* Tombol Update */}
            <div className="text-center">
              <button
                type="submit"
                className={buttonBlueCapsule}
                disabled={isUpdating}
              >
                {isUpdating ? "Menyimpan..." : "Ubah"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tombol kembali */}
      <div className="mt-4 w-full max-w-lg text-right">
        <Link href="/admin/kategori">
          <button className={buttonBlueCapsule} disabled={isUpdating}>
            Kembali
          </button>
        </Link>
      </div>
    </div>
  );
}
