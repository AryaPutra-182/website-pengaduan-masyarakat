"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = "http://localhost:5000";

export default function EditPengumumanPage() {
  const router = useRouter();
  const params = useParams(); // Mengambil [id] dari URL
  const id = params.id;

  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true); // Loading untuk data awal
  const [submitting, setSubmitting] = useState(false); // Loading untuk tombol simpan

  // 1. Ambil data pengumuman yang ada saat halaman dimuat
  useEffect(() => {
    if (!id) return; // Jangan lakukan apa-apa jika ID belum siap

    const fetchData = async () => {
      const token = localStorage.getItem("adminToken"); // Ganti ke localStorage
      if (!token) {
        alert("Sesi berakhir. Silakan login kembali.");
        router.push("/admin/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/pengumuman/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal memuat data pengumuman");
        }

        const result = await response.json();
        
        // 2. Isi form dengan data yang ada
        setJudul(result.data.judul);
        setIsi(result.data.isi);
        setExistingImageUrl(result.data.gambar); // Simpan URL gambar yang ada

      } catch (error: any) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]); // Dependency array

  // 3. Fungsi untuk submit perubahan
  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Sesi berakhir. Silakan login kembali.");
        router.push("/admin/login");
        return;
      }

      const form = new FormData();
      form.append("judul", judul);
      form.append("isi", isi);
      
      // Hanya kirim file gambar JIKA user memilih file baru
      if (file) {
        form.append("gambar", file);
      }
      // Jika tidak ada file baru, backend harus cukup pintar
      // untuk tidak mengubah gambar yang ada.

      const response = await fetch(`${API_BASE_URL}/api/pengumuman/${id}`, {
        method: "PUT", // Gunakan PUT untuk update
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan perubahan.");
      }

      alert("Perubahan berhasil disimpan!");
      router.push("/admin/pengumuman"); // Kembali ke daftar pengumuman

    } catch (error: any) {
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  // Tampilan saat data awal sedang dimuat
  if (loading) {
    return <div className="p-8 text-center">Memuat data pengumuman...</div>;
  }

  // --- Tampilan Form (Styling sama dengan halaman "Tambah") ---
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-[#004A80] mb-6 text-center">
        Edit Pengumuman
      </h1>

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
              value={judul} // Tampilkan data yang ada
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
              value={isi} // Tampilkan data yang ada
              onChange={(e) => setIsi(e.target.value)}
              required
            />
          </div>

          {/* --- Gambar Saat Ini (Preview) --- */}
          {existingImageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar Saat Ini
              </label>
              <img
                src={`${API_BASE_URL}${existingImageUrl}`}
                alt="Gambar Pengumuman"
                className="w-full max-w-xs h-auto rounded-md border border-gray-200"
              />
            </div>
          )}

          {/* --- Upload Gambar Baru --- */}
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ganti Gambar (Opsional)
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
            <p className="text-xs text-gray-500 mt-1">
              Biarkan kosong jika tidak ingin mengubah gambar.
            </p>
          </div>

          {/* --- Tombol Submit --- */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()} // Tombol kembali
              className="bg-gray-200 text-gray-700 w-1/2 py-2.5 rounded-lg shadow-md hover:bg-gray-300 transition-colors
                disabled:bg-gray-100"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#0060A9] text-white w-1/2 py-2.5 rounded-lg shadow-md hover:bg-[#004a80] transition-colors
                disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}