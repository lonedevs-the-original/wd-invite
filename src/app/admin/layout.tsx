import Link from "next/link";
import { Heart, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f3] text-[#252523]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[#e4e2dd] bg-white p-5 lg:flex">
        <Link href="/" className="px-3 py-3 font-serif text-2xl">Taklif<span className="text-[#a4775a]">.</span></Link>
        <nav className="mt-10 space-y-1 text-sm">
          <Link href="/admin" className="flex items-center gap-3 rounded-xl bg-[#f1ece7] px-4 py-3 font-semibold text-[#765641]"><LayoutDashboard size={18} /> Taklifnomalar</Link>
          <span className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#77736e]"><Users size={18} /> Mehmonlar</span>
          <span className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#77736e]"><Settings size={18} /> Sozlamalar</span>
        </nav>
        <div className="mt-auto rounded-2xl bg-[#252523] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-[#a4775a]"><Heart size={17} fill="currentColor" /></div>
            <div><p className="text-sm font-semibold">Admin</p><p className="text-xs text-white/55">Demo rejimi</p></div>
          </div>
          <button className="mt-4 flex w-full items-center gap-2 border-t border-white/10 pt-3 text-xs text-white/55"><LogOut size={14} /> Chiqish</button>
        </div>
      </aside>
      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
