"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000";

export default function DetailPengaduanPage({ params }: any) {
  const router = useRouter();
  const { id } = params;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>(""); // State untuk menyimpan Role

  // 1. Ambil Data Pengaduan & Role User
  const fetchDetail = async () => {
    const token = localStorage.getItem("adminToken");
    const userString = localStorage.getItem("adminUser");

    if (!token || !userString) return router.push("/admin/login");

    // Parse role dari localStorage
    try {
      const userObj = JSON.parse(userString);
      setUserRole(userObj.role || "");
    } catch (e) {
      console.error("Gagal parsing user data");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pengaduan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      setData(result.data);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat detail pengaduan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  // 2. Fungsi Verifikasi (Khusus Admin)
  const handleVerifikasi = async (status: string) => {
    const token = localStorage.getItem("adminToken");
    if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${status}?`)) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/pengaduan/${id}/verifikasi`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }), // 'diterima' atau 'ditolak'
        }
      );

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      alert("Status berhasil diperbarui!");
      fetchDetail(); // Refresh data
    } catch (err: any) {
      alert(err.message || "Gagal update status");
    }
  };

  // 3. Fungsi Persetujuan (Khusus Pimpinan)
  const handlePersetujuan = async () => {
    const token = localStorage.getItem("adminToken");
    if (!confirm("Setujui aduan ini untuk dilaksanakan?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/pengaduan/${id}/persetujuan`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      alert("Aduan berhasil disetujui!");
      fetchDetail(); // Refresh data
    } catch (err: any) {
      alert(err.message || "Gagal menyetujui aduan");
    }
  };

  // 4. FUNGSI BARU: TANDAI SELESAI (Khusus Admin/Master Admin)
  const handleSelesai = async () => {
    const token = localStorage.getItem("adminToken");
    if (!confirm("Konfirmasi: Tandai aduan ini sudah benar-benar selesai?")) return;

    try {
      const res = await fetch(
        // Panggil endpoint baru /selesai
        `${API_BASE_URL}/api/admin/pengaduan/${id}/selesai`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      alert("Aduan berhasil ditutup dan ditandai SELESAI!");
      fetchDetail(); // Refresh data
    } catch (err: any) {
      alert(err.message || "Gagal menutup aduan");
    }
  };


  if (loading) return <div className="text-center mt-20">Memuat data...</div>;
  if (!data) return <div className="text-center mt-20">Data tidak ditemukan</div>;

  // Catatan: Anda perlu mendefinisikan fungsi isComplete jika menggunakan Status Tracker UI
  // Untuk saat ini, kita fokus pada tombol aksi.

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="bg-white w-full max-w-3xl rounded-xl p-8 shadow-md border border-gray-200">
        
        {/* HEADER & DETAIL DATA */}
        <h2 className="text-center text-xl font-bold text-[#004A80] mb-8">
          Detail Data Pengaduan
        </h2>

        {/* INFORMASI UTAMA */}
        <div className="space-y-5 text-sm">
          {/* ... (Data display logic) ... */}
          {[
            ["Id", data.id],
            ["Tanggal Lapor", new Date(data.createdAt).toLocaleDateString("id-ID")],
            ["NIK Pelapor", data.user?.nik || "-"],
            ["Nama Pelapor", data.user?.nama_lengkap || "-"],
            ["Kategori", data.kategori?.nama_kategori || "-"],
            ["Status Saat Ini", data.status],
            ["Judul Pengaduan", data.judul],
            ["Lokasi", data.lokasi],
          ].map(([label, value], index) => (
            <div key={index} className="border-b pb-3">
              <p className="font-semibold text-[#004A80]">{label}</p>
              <p className="mt-1 text-gray-700">{value}</p>
            </div>
          ))}

          {/* STATUS (Dengan Badge Warna) */}
          <div className="border-b pb-3">
            <p className="font-semibold text-[#004A80]">Status Saat Ini</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase
                ${data.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                ${data.status === "diterima" ? "bg-blue-100 text-blue-800" : ""}
                ${data.status === "diproses" ? "bg-indigo-100 text-indigo-800" : ""}
                ${data.status === "dilaksanakan" ? "bg-green-100 text-green-800" : ""}
                ${data.status === "selesai" ? "bg-gray-400 text-gray-800" : ""}
                ${data.status === "ditolak" ? "bg-red-100 text-red-800" : ""}
              `}
            >
              {data.status}
            </span>
          </div>

          {/* DESKRIPSI */}
          <div className="border-b pb-3">
            <p className="font-semibold text-[#004A80]">Deskripsi</p>
            <p className="mt-1 text-gray-700 leading-relaxed whitespace-pre-line">
              {data.deskripsi}
            </p>
          </div>
        </div>

        {/* LAMPIRAN / FOTO (Sudah Diperbaiki) */}
        <div className="border-b pb-3 mt-6">
          <p className="font-semibold text-[#004A80] mb-2">Lampiran</p>
          {data.lampiran && data.lampiran.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.lampiran.map((item: any, index: number) => {
                const imageUrl = `${API_BASE_URL}${item.filePath.replace(/\\/g, "/")}`;
                return (
                  <a
                    key={item.id}
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group relative overflow-hidden rounded-lg border border-gray-200"
                  >
                    <img
                      src={imageUrl}
                      alt={`Lampiran-${index}`}
                      className="w-full h-32 object-cover transition duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/150?text=Gagal";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-xs bg-black/50 px-2 py-1 rounded">Lihat</span>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">Tidak ada lampiran.</p>
          )}
        </div>


        {/* AREA TOMBOL AKSI (DINAMIS BERDASARKAN ROLE) */}
        <div className="mt-10 text-center">
          
          <h3 className="font-semibold text-[#004A80] mb-4">Aksi Penanganan</h3>

          {/* 5. LOGIKA UNTUK MENAMPILKAN TOMBOL AKSI */}

          {/* --- 1. MENU ADMIN / MASTER ADMIN (VERIFIKASI & SELESAI) --- */}
          {(userRole === "admin" || userRole === "master_admin") && (
            <>
              {/* Tombol Verifikasi (Hanya jika Pending) */}
              {data.status === "pending" && (
                <div className="mb-6 border-b pb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Verifikasi Awal</h4>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleVerifikasi("diterima")}
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-md"
                    >
                      Terima Aduan
                    </button>
                    <button
                      onClick={() => handleVerifikasi("ditolak")}
                      className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition shadow-md"
                    >
                      Tolak Aduan
                    </button>
                  </div>
                </div>
              )}

              {/* Tombol Tandai Selesai (Hanya jika Dilaksanakan) */}
              {data.status === "dilaksanakan" && (
                <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-700 mb-2">Penutupan Aduan</h4>
                    <button
                        onClick={handleSelesai}
                        className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition shadow-lg font-bold"
                    >
                        ✅ Tandai SELESAI
                    </button>
                </div>
              )}
            </>
          )}

          {/* --- 2. MENU PIMPINAN (PERSETUJUAN) --- */}
          {/* Hanya muncul jika status 'diterima' atau 'diproses' */}
          {userRole === "pimpinan" && (data.status === "diterima" || data.status === "diproses") && (
            <div className="mb-8 border-b pb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Persetujuan Pelaksanaan</h4>
              <button
                onClick={handlePersetujuan}
                className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition shadow-lg font-bold"
              >
                ✅ Setujui Pelaksanaan
              </button>
            </div>
          )}

          {/* --- 3. JIKA SUDAH FINAL (selesai / ditolak) --- */}
          {(data.status === "dilaksanakan" || data.status === "ditolak" || data.status === "selesai") && (
            <div className="mb-8 p-4 bg-gray-100 rounded-lg text-gray-600 italic">
              Aduan telah mencapai status final: **{data.status}**. Tidak ada aksi yang diperlukan.
            </div>
          )}

          {/* Tombol Kembali */}
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition mt-4"
          >
            Kembali
          </button>
        </div>

      </div>
    </div>
  );
}