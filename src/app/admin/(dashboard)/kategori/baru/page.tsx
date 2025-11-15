"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = "http://localhost:5000";

export default function TambahKategoriPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cek token sebelum render
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/admin/login");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Anda belum login sebagai admin.");
        return;
      }

      // FIX endpoint yang benar
      const response = await fetch(`${API_BASE_URL}/api/kategori`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nama_kategori: nama,
          deskripsi
        })
      });

      const result = await response.json();

      // Backend kategori TIDAK punya field success
      if (!response.ok) {
        setError(result.message || "Gagal menambah kategori");
        return;
      }

      router.push("/admin/kategori");

    } catch (err) {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-28 px-4 flex justify-center">
      <div className="bg-white shadow-lg border rounded-xl p-8 w-[380px]">

        <h2 className="text-center text-xl font-bold text-[#004A80] mb-6">
          Tambah Data Kategori
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* INPUT NAMA */}
          <div>
            <label className="text-sm font-semibold text-[#004A80] block mb-1">
              Nama Kategori
            </label>
            <input
              type="text"
              placeholder="Masukkan nama kategori"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2 text-sm text-black bg-white
                         border border-[#8bb2cc] rounded-md
                         placeholder:text-[#6c8391] outline-none
                         focus:border-[#0060A9] focus:ring-2 focus:ring-[#0060A9]/40"
              required
            />
          </div>

          {/* INPUT DESKRIPSI */}
          <div>
            <label className="text-sm font-semibold text-[#004A80] block mb-1">
              Deskripsi
            </label>
            <textarea
              placeholder="Tuliskan deskripsi kategori"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full px-4 py-2 text-sm text-black bg-white
                         border border-[#8bb2cc] rounded-md h-28
                         placeholder:text-[#6c8391] outline-none
                         focus:border-[#0060A9] focus:ring-2 focus:ring-[#0060A9]/40"
              required
            ></textarea>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-center text-red-600 text-sm">{error}</p>
          )}

          {/* BUTTON TAMBAH */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0060A9] text-white py-2 rounded-full text-sm 
                       hover:bg-[#004A80] transition font-semibold"
          >
            {loading ? "Memproses..." : "Tambah"}
          </button>
        </form>

        {/* BUTTON KEMBALI */}
        <div className="text-center mt-4">
          <Link href="/admin/kategori">
            <button className="bg-[#0060A9] text-white px-6 py-1.5 rounded-full text-sm hover:bg-[#004A80] transition">
              Kembali
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}
