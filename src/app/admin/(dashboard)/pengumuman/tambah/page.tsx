"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePengumuman() {
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      // ==========================================================
      // PERBAIKAN DI SINI: Ganti 'sessionStorage' menjadi 'localStorage'
      // ==========================================================
      const token = localStorage.getItem("adminToken"); // <-- DIUBAH

      // Validasi: Pastikan token ada
      if (!token) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        setLoading(false);
        router.push("/admin/login");
        return;
      }

      const form = new FormData();
      form.append("judul", judul);
      form.append("isi", isi);
      if (file) form.append("gambar", file);

      const response = await fetch("http://localhost:5000/api/pengumuman", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Format Bearer
        },
        body: form,
      });

      // Error Handling
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat pengumuman.");
      }

      alert("Pengumuman berhasil disimpan!");
      router.push("/admin/pengumuman");
    } catch (error: any) {
      console.error("Error submit pengumuman:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

return (
  <div className="p-6 md:p-8">
    <h1 className="text-2xl font-bold text-[#004A80] mb-6 text-center"> 
      {/* 1. TAMBAHKAN 'text-center' DI SINI */}
      Tambah Pengumuman Baru
    </h1>
    
    {/* 2. TAMBAHKAN 'mx-auto' DI SINI UNTUK MENENGELOLA CARD */}
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 md:p-8">
      <form className="space-y-5" onSubmit={handleSubmit}>
        
        {/* --- Judul --- */}
        <div>
          <label 
            htmlFor="judul" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Judul
          </label>
          <input
            id="judul"
            type="text"
            className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"
            placeholder="Judul Pengumuman"
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>

        {/* --- Isi Pengumuman --- */}
        <div>
          <label 
            htmlFor="isi" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Isi Pengumuman
          </label>
          <textarea
            id="isi"
            className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"
            placeholder="Tulis isi pengumuman di sini..."
            rows={5}
            onChange={(e) => setIsi(e.target.value)}
            required
          />
        </div>

        {/* --- Upload Gambar --- */}
        <div>
          <label 
            htmlFor="file" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Gambar (Opsional)
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-[#0060A9]
              hover:file:bg-blue-100"
          />
        </div>

        {/* --- Tombol Submit --- */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-[#0060A9] text-white w-full py-2.5 rounded-lg shadow-md hover:bg-[#004a80] transition-colors
              disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Pengumuman"}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}