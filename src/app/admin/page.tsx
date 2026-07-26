import Link from "next/link";
import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, Copy, Eye, MoreHorizontal, Plus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Invitation } from "@/lib/demo-data";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: rows } = await supabase.from("invitations").select("*, guests(count)");
  const invitations: Invitation[] = (rows ?? []).map((row) => ({
    id: row.id, slug: row.slug, partnerOne: row.partner_one, partnerTwo: row.partner_two,
    date: row.event_date, time: row.event_time.slice(0, 5), venue: row.venue,
    address: row.address, mapUrl: row.map_url, message: row.message,
    status: row.status === "published" ? "published" : "draft",
    guests: row.guests?.[0]?.count ?? 0, attending: 0,
  }));
  const totalGuests = invitations.reduce((sum, item) => sum + item.guests, 0);
  const attending = invitations.reduce((sum, item) => sum + item.attending, 0);
  return (
    <main className="px-5 pb-16 pt-6 sm:px-8 lg:px-12 lg:pt-10">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#9b7a63]">Boshqaruv paneli</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Taklifnomalar</h1></div>
        <Link href="/admin/invitations/new" className="flex items-center gap-2 rounded-xl bg-[#252523] px-4 py-3 text-sm font-semibold text-white shadow-lg"><Plus size={17} /> <span className="hidden sm:inline">Yangi taklifnoma</span></Link>
      </header>

      <section className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-3">
        {[
          { label: "Barcha to‘ylar", value: invitations.length, icon: CalendarDays, note: "1 tasi chop etilgan" },
          { label: "Taklif etilgan", value: totalGuests, icon: Users, note: "Barcha mehmonlar" },
          { label: "Ishtirok etadi", value: attending, icon: CheckCircle2, note: `${Math.round(attending / totalGuests * 100)}% tasdiqlangan` },
        ].map(({ label, value, icon: Icon, note }) => (
          <div key={label} className="rounded-2xl border border-[#e4e2dd] bg-white p-5 shadow-[0_3px_16px_rgba(0,0,0,.025)]">
            <div className="flex items-center justify-between"><p className="text-sm text-[#77736e]">{label}</p><Icon size={18} className="text-[#9b7a63]" /></div>
            <p className="mt-5 text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-[#96918b]">{note}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-2xl border border-[#e4e2dd] bg-white">
        <div className="flex items-center justify-between border-b border-[#eceae6] px-5 py-4">
          <div><h2 className="font-semibold">Sizning taklifnomalaringiz</h2><p className="mt-1 text-xs text-[#89847e]">Tafsilotlar, mehmonlar va javoblarni boshqaring.</p></div>
          <button className="rounded-lg border border-[#e4e2dd] p-2"><MoreHorizontal size={18} /></button>
        </div>
        <div className="divide-y divide-[#eceae6]">
          {invitations.length === 0 && (
            <div className="px-6 py-16 text-center"><CalendarDays className="mx-auto text-[#b4aaa0]" /><h3 className="mt-4 font-serif text-2xl">Birinchi taklifnomangizni yarating</h3><p className="mt-2 text-sm text-[#89847e]">Ismlar, sana va manzilni kiritish bir necha daqiqa oladi.</p><Link href="/admin/invitations/new" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#252523] px-5 py-3 text-sm font-semibold text-white"><Plus size={16} /> Yaratish</Link></div>
          )}
          {invitations.map((item) => (
            <div key={item.id} className="group grid gap-4 px-5 py-5 transition hover:bg-[#faf9f7] md:grid-cols-[1.5fr_1fr_.8fr_auto] md:items-center">
              <div className="flex items-center gap-4">
                <div className="invitation-pattern grid size-14 shrink-0 place-items-center rounded-xl border border-[#e4d7cb] font-serif text-lg text-[#8b6047]">{item.partnerOne[0]}&{item.partnerTwo[0]}</div>
                <div><Link href={`/admin/invitations/${item.slug}`} className="font-semibold hover:text-[#9b6c50]">{item.partnerOne} & {item.partnerTwo}</Link><p className="mt-1 flex items-center gap-1.5 text-xs text-[#89847e]"><Clock3 size={12} /> {item.date} · {item.time}</p></div>
              </div>
              <div><p className="text-xs text-[#89847e]">Mehmonlar</p><p className="mt-1 text-sm font-medium">{item.guests} taklif · {item.attending} ha</p></div>
              <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "published" ? "bg-[#e5f1e8] text-[#3e7450]" : "bg-[#f1ece5] text-[#876d59]"}`}>{item.status === "published" ? "Chop etilgan" : "Qoralama"}</span>
              <div className="flex gap-2">
                <Link href={`/i/${item.slug}`} aria-label="Ko‘rish" className="rounded-lg border border-[#e4e2dd] p-2 text-[#69645e]"><Eye size={16} /></Link>
                <button aria-label="Nusxa olish" className="rounded-lg border border-[#e4e2dd] p-2 text-[#69645e]"><Copy size={16} /></button>
                <Link href={`/admin/invitations/${item.slug}`} aria-label="Tahrirlash" className="rounded-lg bg-[#252523] p-2 text-white"><ArrowUpRight size={16} /></Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
