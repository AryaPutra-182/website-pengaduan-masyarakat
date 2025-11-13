"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:5000";

const labelStyle =
  "block mb-2 text-sm font-medium text-[#0060A9]";
const inputStyle =
  "w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]";

export default function RegisterPage() {
  const router = useRouter();

  const [namaLengkap, setNamaLengkap] = useState("");
  const [nik, setNik] = useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = {
      nama_lengkap: namaLengkap,
      nik,
      no_hp: noHp,
      alamat,
      username,
      password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ Jika HTTP 200, anggap sukses
        await Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil 🎉",
          text: "Anda akan diarahkan ke halaman login...",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        router.push("/login");
      } else {
        // ❌ Kalau gagal (status bukan 200)
        const message =
          result?.errors?.[0]?.msg || result?.message || "Registrasi gagal.";
        setError(message);

        Swal.fire({
          icon: "error",
          title: "Registrasi Gagal!",
          text: message,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Tidak dapat terhubung ke server.");
      Swal.fire({
        icon: "error",
        title: "Koneksi Error!",
        text: "Tidak dapat terhubung ke server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center text-gray-800 py-12"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-black/10"></div>

      <main className="z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl md:p-10 mt-24">
        <form onSubmit={handleSubmit}>
          <h1 className="mb-8 text-center text-2xl font-bold text-[#0060A9]">
            DAFTAR AKUN BARU
          </h1>

          <div className="mb-4 text-left">
            <label htmlFor="nama" className={labelStyle}>
              Nama Lengkap*
            </label>
            <input
              type="text"
              id="nama"
              className={inputStyle}
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Nama Lengkap Anda"
              required
            />
          </div>

          <div className="mb-4 text-left">
            <label htmlFor="nik" className={labelStyle}>
              NIK*
            </label>
            <input
              type="text"
              id="nik"
              className={inputStyle}
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="16 digit NIK Anda"
              minLength={16}
              maxLength={16}
              required
            />
          </div>

          <div className="mb-4 text-left">
            <label htmlFor="no_hp" className={labelStyle}>
              No. HP*
            </label>
            <input
              type="tel"
              id="no_hp"
              className={inputStyle}
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="Contoh: 081234567890"
              required
            />
          </div>

          <div className="mb-4 text-left">
            <label htmlFor="alamat" className={labelStyle}>
              Alamat*
            </label>
            <textarea
              id="alamat"
              rows={3}
              className={inputStyle}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Alamat lengkap Anda"
              required
            />
          </div>

          <div className="mb-4 text-left">
            <label htmlFor="username" className={labelStyle}>
              Username*
            </label>
            <input
              type="text"
              id="username"
              className={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username untuk login"
              required
            />
          </div>

          <div className="mb-6 text-left">
            <label htmlFor="password" className={labelStyle}>
              Password*
            </label>
            <input
              type="password"
              id="password"
              className={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              minLength={8}
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-center text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-[#0060A9] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Mendaftarkan..." : "Daftar"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#0060A9] hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
