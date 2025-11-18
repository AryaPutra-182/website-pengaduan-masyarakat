"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = "http://localhost:5000";

// Interface untuk data pengumuman
interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  gambar: string | null;
  dibuatPada: string;
  admin: {
    nama_lengkap: string;
  };
}

export default function ListPengumuman() {
  const [data, setData] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Ambil data saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. AMBIL TOKEN (sesuai file login Anda)
        const token = localStorage.getItem("adminToken"); 
        if (!token) {
          alert("Sesi berakhir. Silakan login kembali.");
          router.push("/admin/login");
          return;
        }

        // 2. KIRIM REQUEST DENGAN OTORISASI
        const response = await fetch(`${API_BASE_URL}/api/pengumuman`, {
          headers: {
            Authorization: `Bearer ${token}`, // <-- INI PENTING
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data");
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data pengumuman.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]); // Tambahkan router ke dependency array

  // ==========================================================
  // 3. FUNGSI UNTUK MENGHAPUS DATA
  // ==========================================================
  const handleDelete = async (id: number) => {
    // Konfirmasi sebelum menghapus
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Sesi berakhir. Silakan login kembali.");
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/pengumuman/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus.");
      }

      // 4. Hapus item dari state agar UI ter-update tanpa reload
      setData(currentData => currentData.filter(item => item.id !== id));
      alert("Pengumuman berhasil dihapus.");

    } catch (error: any) {
      console.error("Error menghapus:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 md:p-8">
      {/* === HEADER HALAMAN === */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#004A80]">
          Kelola Pengumuman
        </h1>
        <Link
          href="/admin/pengumuman/tambah" // Diperbaiki dari 'create'
          className="bg-[#0060A9] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#004a80] transition-colors"
        >
          + Tambah Pengumuman
        </Link>
      </div>

      {/* === TABEL DATA === */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full min-w-full divide-y divide-gray-200">
          {/* --- Table Head --- */}
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Judul
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Admin
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>

          {/* --- Table Body --- */}
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Belum ada pengumuman yang dibuat.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.judul}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {item.admin?.nama_lengkap}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {formatDate(item.dibuatPada)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* 5. Ganti <a href="#"> menjadi <Link> */}
                    <Link
                      href={`/admin/pengumuman/edit/${item.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </Link>
                    {/* 6. Panggil handleDelete saat diklik */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}