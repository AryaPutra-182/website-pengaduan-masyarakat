"use client";

import { useState } from "react";
import Link from "next/link";

export default function LacakPage() {
    const [searchId, setSearchId] = useState("");

    const handleSearch = () => {
        if (searchId.trim() !== "") {
            window.location.href = `/riwayat/${searchId}`;
        }
    };

    return (
        <main className="pt-28 min-h-screen bg-transparant relative overflow-hidden">

            {/* Informasi Intro */}
            <div className="max-w-4xl mx-auto px-6 mb-10">
                <h1 className="text-3xl font-bold text-[#004A80] text-center mb-6">
                    Halo Warga Kecamatan Junrejo 👋
                </h1>
                <p className="text-gray-700 text-center leading-relaxed">
                    Fitur ini digunakan untuk melacak status laporan pengaduan yang telah Anda kirim melalui sistem. 
                    Dengan fitur ini, Anda dapat mengetahui sejauh mana laporan Anda telah diproses oleh pihak Petugas.
                </p>
            </div>

            {/* Panduan Penggunaan */}
            <div className="max-w-4xl mx-auto px-6 mb-8 bg-[#F8FAFF] rounded-xl p-6 shadow-sm border border-[#0060A9]/20">
                <h2 className="text-xl font-bold text-[#004A80] mb-3 text-center">
                    Panduan Penggunaan Fitur Lacak Pengaduan
                </h2>

                <h3 className="font-semibold text-[#004A80] mt-4 mb-2">Cara Menggunakan:</h3>
                <ol className="list-decimal pl-5 text-gray-700 space-y-1">
                    <li>Masukkan ID Laporan atau Judul Masalah pada kolom pencarian di bagian bawah.</li>
                    <li>Contoh ID: <span className="font-semibold">#99</span></li>
                    <li>Contoh Judul: <span className="font-semibold">Jalan Rusak di Depan SD Junrejo 2</span></li>
                    <li>Tekan ikon pencarian 🔍 atau tombol Enter untuk mulai melacak.</li>
                </ol>

                <h3 className="font-semibold text-[#004A80] mt-6 mb-2">Sistem Akan Menampilkan:</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Judul Masalah</li>
                    <li>Deskripsi Masalah</li>
                    <li>Tanggal Laporan</li>
                    <li>Lokasi Kejadian</li>
                    <li>Status Penanganan</li>
                </ul>

                <h3 className="font-semibold text-[#004A80] mt-6 mb-2">Keterangan Status:</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li><b>Diterima</b> → Laporan masuk dan menunggu verifikasi.</li>
                    <li><b>Diverifikasi</b> → Laporan sudah ditinjau petugas.</li>
                    <li><b>Dalam Proses</b> → Laporan sedang ditangani.</li>
                    <li><b>Selesai</b> → Masalah telah diselesaikan.</li>
                    <li><b>Ditolak</b> → Data kurang valid atau di luar kewenangan.</li>
                </ul>

                <h3 className="font-semibold text-[#004A80] mt-6 mb-2">Catatan:</h3>
                <p className="text-gray-700 leading-relaxed">
                    Jika laporan tidak muncul, pastikan ID atau Judul benar. 
                    Laporan baru mungkin membutuhkan waktu beberapa jam untuk muncul. Jika ditolak, silakan kirim ulang dengan data lebih lengkap atau hubungi petugas.
                </p>
            </div>

            {/* GARIS PEMBATAS */}
            <div className="w-full h-0.5 bg-[#0060A9] opacity-50 mb-10"></div>

            {/* SEARCH */}
            <h2 className="text-2xl font-bold text-[#004A80] text-center mb-6">
                Lacak Pengaduan Anda
            </h2>

            <div className="max-w-xl mx-auto px-6 mb-20">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Masukkan ID Pengaduan Anda..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="w-full border border-[#0060A9]/60 rounded-full px-4 py-3 pr-12 outline-none shadow text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-[#0060A9]"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0060A9]"
                    >
                        🔍
                    </button>
                </div>
            </div>
        </main>
    );
}
