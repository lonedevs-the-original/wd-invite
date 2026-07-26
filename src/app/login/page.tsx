"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [mode,setMode]=useState<"login"|"signup"|"reset">("login"); const [busy,setBusy]=useState(false); const [message,setMessage]=useState("");
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage("");const supabase=createClient();
    if(mode==="reset"){const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/auth/callback?next=/account/password`});setBusy(false);setMessage(error?error.message:"Parolni tiklash havolasi emailingizga yuborildi.");return}
    const result=mode==="login"?await supabase.auth.signInWithPassword({email,password}):await supabase.auth.signUp({email,password,options:{emailRedirectTo:`${location.origin}/auth/callback`}});
    setBusy(false);if(result.error){setMessage(result.error.message);return}if(mode==="signup"&&!result.data.session){setMessage("Tasdiqlash havolasi emailingizga yuborildi.");return}router.push("/admin");router.refresh();
  }
  return <main className="grid min-h-screen place-items-center bg-[#f5f0e9] px-6 py-14"><div className="w-full max-w-md"><Link href="/" className="font-serif text-2xl">Taklif<span className="text-[#a4775a]">.</span></Link><p className="mt-14 text-xs font-semibold uppercase tracking-[.2em] text-[#9a745a]">Boshqaruv paneli</p><h1 className="mt-3 text-4xl font-semibold">{mode==="reset"?"Parolni tiklash":mode==="login"?"Xush kelibsiz":"Hisob yarating"}</h1>
  <form onSubmit={submit} className="mt-9 space-y-4"><label className="block"><span className="mb-2 block text-sm font-medium">Email</span><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border bg-white px-4 py-3.5" /></label>{mode!=="reset"&&<label className="block"><span className="mb-2 block text-sm font-medium">Parol</span><input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-xl border bg-white px-4 py-3.5" placeholder="Kamida 8 ta belgi" /></label>}{message&&<p className="rounded-lg bg-white px-3 py-2 text-sm text-[#8a5d44]">{message}</p>}<button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#292823] py-4 font-semibold text-white">{busy?<LoaderCircle className="animate-spin"/>:<>{mode==="reset"?"Havolani yuborish":mode==="login"?"Kirish":"Ro‘yxatdan o‘tish"}<ArrowRight size={17}/></>}</button></form>
  <div className="mt-6 flex flex-col gap-3 text-left text-sm underline"><button onClick={()=>{setMode(mode==="signup"?"login":"signup");setMessage("")}}>{mode==="signup"?"Hisobingiz bormi? Kirish":"Hisobingiz yo‘qmi? Ro‘yxatdan o‘ting"}</button>{mode!=="signup"&&<button onClick={()=>{setMode(mode==="reset"?"login":"reset");setMessage("")}}>{mode==="reset"?"Kirishga qaytish":"Parolni unutdingizmi?"}</button>}</div></div></main>;
}
