import Link from "next/link";
import { ArrowUpRight, CalendarDays, Check, LayoutDashboard, Sparkles, Users } from "lucide-react";

const features = [
  { icon: Sparkles, title: "Chiroyli taklifnoma", text: "Har bir juftlik uchun nafis, mobilga mos sahifa." },
  { icon: LayoutDashboard, title: "Bitta boshqaruv paneli", text: "Bir joyda bir nechta to‘y va barcha tafsilotlar." },
  { icon: Users, title: "Mehmonlar ro‘yxati", text: "Shaxsiy havolalar, RSVP javoblari va ishtirok nazorati." },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f3ec] text-[#27231f]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="font-serif text-2xl tracking-tight">Taklif<span className="text-[#9d7256]">.</span></Link>
        <div className="flex items-center gap-3">
          <Link href="/i/aziz-diyora" className="hidden rounded-full px-5 py-2.5 text-sm font-medium sm:block">Namuna</Link>
          <Link href="/admin" className="rounded-full bg-[#27231f] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#9d7256]">Panelga kirish</Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-32 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d9cbbd] bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-[#765b49]">
            <Sparkles size={14} /> Muhabbat uchun yaratilgan
          </div>
          <h1 className="max-w-3xl font-serif text-[clamp(3.5rem,8vw,7.2rem)] leading-[.88] tracking-[-.055em]">
            Sizning to‘yingiz, <span className="italic text-[#a4775a]">bir go‘zal havolada.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#6f665e]">
            Mehmonlaringizga unutilmas birinchi taassurot qoldiring. Taklifnomani yarating, ulashing va javoblarni kuzating.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/admin" className="group inline-flex items-center gap-3 rounded-full bg-[#a4775a] px-7 py-4 font-semibold text-white shadow-[0_12px_40px_rgba(103,72,51,.2)] transition hover:-translate-y-0.5">
              Taklifnoma yaratish <ArrowUpRight size={18} className="transition group-hover:rotate-45" />
            </Link>
            <span className="flex items-center gap-2 text-sm text-[#6f665e]"><Check size={16} /> Bir necha daqiqada tayyor</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-[#d7bca6]/40 blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-[#b4c1ab]/40 blur-3xl" />
          <div className="relative rotate-[2deg] rounded-[2.2rem] border border-white/80 bg-white/75 p-3 shadow-[0_35px_90px_rgba(76,58,45,.18)] backdrop-blur">
            <div className="invitation-pattern flex aspect-[4/5] flex-col items-center justify-between overflow-hidden rounded-[1.7rem] border border-[#dccfc3] px-8 py-10 text-center">
              <div className="text-xs uppercase tracking-[.28em] text-[#806957]">Nikoh oqshomi</div>
              <div>
                <p className="mb-3 font-serif text-2xl italic text-[#a4775a]">Birga bo‘lishga va’da berdik</p>
                <h2 className="font-serif text-6xl leading-none">Aziz <span className="block text-3xl italic text-[#a4775a]">&</span> Diyora</h2>
              </div>
              <div className="space-y-2">
                <CalendarDays className="mx-auto text-[#a4775a]" size={22} />
                <p className="font-serif text-2xl">18 · 09 · 2026</p>
                <p className="text-xs uppercase tracking-[.18em] text-[#806957]">Toshkent · Zarafshon</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-8 rounded-2xl border border-white bg-white/90 p-4 shadow-xl backdrop-blur">
            <p className="text-xs text-[#85786d]">Javob berdilar</p>
            <p className="mt-1 font-serif text-2xl">128 mehmon</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ded4ca] bg-white/45">
        <div className="mx-auto grid max-w-7xl gap-px px-6 lg:grid-cols-3 lg:px-10">
          {features.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className={`py-10 lg:px-10 ${index > 0 ? "border-t border-[#ded4ca] lg:border-l lg:border-t-0" : ""}`}>
              <Icon size={24} strokeWidth={1.5} className="mb-6 text-[#a4775a]" />
              <h3 className="font-serif text-2xl">{title}</h3>
              <p className="mt-2 max-w-xs leading-7 text-[#746a62]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
