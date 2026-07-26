import Link from "next/link";
import { CircleUserRound, Heart, LayoutDashboard, Settings, Users } from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  const isAdmin=user?.app_metadata?.role==="admin";
  return (
    <div className="min-h-screen bg-[#f5f5f3] text-[#252523]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[#e4e2dd] bg-white p-5 lg:flex">
        <Link href="/" className="px-3 py-3 font-serif text-2xl">Taklif<span className="text-[#a4775a]">.</span></Link>
        <nav className="mt-10 space-y-1 text-sm">
          <Link href="/admin" className="flex items-center gap-3 rounded-xl bg-[#f1ece7] px-4 py-3 font-semibold text-[#765641]"><LayoutDashboard size={18} /> Taklifnomalar</Link>
          <Link href="/admin/guests" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#77736e] transition hover:bg-[#f5f2ee]"><Users size={18} /> Mehmonlar</Link>
          {isAdmin&&<Link href="/admin/accounts" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#77736e] transition hover:bg-[#f5f2ee]"><CircleUserRound size={18}/>Hisoblar</Link>}
          <Link href="/admin/settings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#77736e] transition hover:bg-[#f5f2ee]"><Settings size={18} /> Sozlamalar</Link>
        </nav>
        <div className="mt-auto rounded-2xl bg-[#252523] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-[#a4775a]"><Heart size={17} fill="currentColor" /></div>
            <div><p className="text-sm font-semibold">Admin</p><p className="text-xs text-white/55">Demo rejimi</p></div>
          </div>
          <SignOutButton />
        </div>
      </aside>
      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
