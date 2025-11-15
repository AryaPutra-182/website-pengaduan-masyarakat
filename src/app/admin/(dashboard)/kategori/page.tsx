"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";


const API_BASE_URL = "http://localhost:5000";

interface Kategori {
  id: number;
  nama_kategori: string;
}

export default function DataKategoriPage() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================
  // GET DATA KATEGORI
  // ============================
  const fetchKategori = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/kategori`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setKategoriList(result.data.kategori || []);
      } else {
        setError(result.message || "Gagal mengambil data kategori.");
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  // ============================
  // DELETE KATEGORI
  // ============================
const handleDelete = async (id: number, nama: string) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    Swal.fire("Sesi Habis", "Silakan login ulang.", "warning");
    return;
  }

  const confirm = await Swal.fire({
    title: "Hapus Kategori?",
    text: `Kategori "${nama}" akan dihapus secara permanen.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/kategori/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (!result.success) {
      Swal.fire("Gagal", result.message || "Gagal menghapus kategori.", "error");
      return;
    }

    await Swal.fire("Berhasil", "Kategori berhasil dihapus.", "success");

    // WAIT agar tabel sempat update
    await fetchKategori();

  } catch (error) {
    Swal.fire("Error", "Server tidak merespons.", "error");
  }
};


  return (
    <main className="pt-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg border rounded-xl p-8">
        
        <h2 className="text-center text-2xl font-bold text-[#004A80] mb-6">
          Data Kategori
        </h2>

        {isLoading && <p className="text-center text-gray-600">Memuat data...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#004A80] text-white text-sm">
                  <th className="p-3 text-left rounded-tl-xl">No</th>
                  <th className="p-3 text-left">Kategori</th>
                  <th className="p-3 text-right rounded-tr-xl">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {kategoriList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      Belum ada kategori.
                    </td>
                  </tr>
                ) : (
                  kategoriList.map((kategori, index) => (
                    <tr key={kategori.id} className="border-b text-[#0060A9]">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{kategori.nama_kategori}</td>
                      <td className="p-3 text-right space-x-2">

                        <Link href={`/admin/kategori/edit/${kategori.id}`}>
                          <button className="bg-[#0060A9] px-5 py-1.5 rounded-full text-xs text-white hover:bg-[#004A80] transition">
                            Edit
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(kategori.id, kategori.nama_kategori)}
                          className="bg-red-600 px-5 py-1.5 rounded-full text-xs text-white hover:bg-red-700 transition"
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
        )}

        {!isLoading && (
          <div className="text-right mt-6">
            <Link href="/admin/kategori/baru">
              <button className="bg-[#0060A9] px-6 py-2.5 rounded-full text-sm text-white hover:bg-[#004A80] transition">
                Tambah Kategori
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
