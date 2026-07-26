"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Heart, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const supabase = createClient();
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
    setBusy(false);
    if (result.error) return setMessage(result.error.message);
    if (mode === "signup" && !result.data.session) return setMessage("Tasdiqlash havolasi emailingizga yuborildi.");
    router.push("/admin"); router.refresh();
  }

  return (
    <main className="grid min-h-screen bg-[#f5f0e9] lg:grid-cols-2">
      <section className="hidden place-items-center bg-[#2f332d] p-12 text-center text-white lg:grid">
        <div><Heart className="mx-auto text-[#c59a7d]" size={30} /><p className="mt-8 font-serif text-5xl">Muhabbatning har bir<br />lahzasini saqlang.</p><p className="mt-5 text-sm text-white/50">Taklifnomalaringizni bir joyda boshqaring.</p></div>
      </section>
      <section className="grid place-items-center px-6 py-14">
        <div className="w-full max-w-md">
          <Link href="/" className="font-serif text-2xl">Taklif<span className="text-[#a4775a]">.</span></Link>
          <p className="mt-14 text-xs font-semibold uppercase tracking-[.2em] text-[#9a745a]">Admin panel</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">{mode === "login" ? "Xush kelibsiz" : "Hisob yarating"}</h1>
          <p className="mt-3 text-[#777169]">{mode === "login" ? "Taklifnomalaringizni boshqarish uchun kiring." : "Birinchi taklifnomangizni yaratishni boshlang."}</p>
          <form onSubmit={submit} className="mt-9 space-y-4">
            <label className="block"><span className="mb-2 block text-sm font-medium">Email</span><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-[#d9d2c9] bg-white px-4 py-3.5 outline-none focus:border-[#9a745a]" placeholder="siz@email.com" /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium">Parol</span><input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-[#d9d2c9] bg-white px-4 py-3.5 outline-none focus:border-[#9a745a]" placeholder="Kamida 6 ta belgi" /></label>
            {message && <p className="rounded-lg bg-white/70 px-3 py-2 text-sm text-[#8a5d44]">{message}</p>}
            <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#292823] py-4 font-semibold text-white disabled:opacity-60">{busy ? <LoaderCircle className="animate-spin" size={18} /> : <>{mode === "login" ? "Kirish" : "Ro‘yxatdan o‘tish"} <ArrowRight size={17} /></>}</button>
          </form>
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }} className="mt-6 text-sm text-[#706a63] underline">{mode === "login" ? "Hisobingiz yo‘qmi? Ro‘yxatdan o‘ting" : "Hisobingiz bormi? Kirish"}</button>
        </div>
      </section>
    </main>
  );
}
