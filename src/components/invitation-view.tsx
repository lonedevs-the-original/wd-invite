"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, Heart, MapPin, Navigation, X } from "lucide-react";
import type { Invitation } from "@/lib/demo-data";

export function InvitationView({ invitation }: { invitation: Invitation }) {
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const formattedDate = useMemo(() => new Intl.DateTimeFormat("uz-UZ", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${invitation.date}T12:00:00`)), [invitation.date]);
  return (
    <main className="grain relative min-h-screen overflow-hidden bg-[#f8f4ed] text-[#302820]">
      <section className="relative grid min-h-screen place-items-center px-5 py-14 text-center">
        <div className="absolute left-[-7rem] top-[-7rem] size-80 rounded-full border border-[#b99b82]/20" />
        <div className="absolute right-[-8rem] top-40 size-96 rounded-full border border-[#93a18b]/20" />
        <div className="relative z-10 max-w-2xl">
          <div className="mx-auto mb-10 flex size-12 items-center justify-center rounded-full border border-[#bb9e87]"><Heart size={18} className="text-[#9b6a4b]" /></div>
          <p className="text-xs font-semibold uppercase tracking-[.35em] text-[#8e705b]">Sizni nikoh oqshomimizga taklif qilamiz</p>
          <h1 className="mt-10 font-serif text-[clamp(4rem,16vw,8.5rem)] leading-[.75] tracking-[-.06em]">{invitation.partnerOne}<span className="my-6 block text-4xl font-normal italic text-[#a4785e]">&</span>{invitation.partnerTwo}</h1>
          <p className="mx-auto mt-12 max-w-lg font-serif text-xl italic leading-8 text-[#6e5f53]">“{invitation.message}”</p>
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            <span className="flex items-center gap-2"><CalendarDays size={16} className="text-[#a4785e]" /> {formattedDate}</span>
            <span className="flex items-center gap-2"><Clock3 size={16} className="text-[#a4785e]" /> {invitation.time}</span>
          </div>
          <a href="#details" className="mt-12 inline-block rounded-full border border-[#9b6a4b] px-7 py-3 text-xs font-bold uppercase tracking-[.18em] text-[#7d563f]">Tafsilotlarni ko‘rish</a>
        </div>
      </section>

      <section id="details" className="bg-[#2f332d] px-5 py-24 text-[#f7f2ea]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[.3em] text-[#b8c0b2]">Manzil va vaqt</p>
          <h2 className="mt-6 font-serif text-4xl sm:text-6xl">{invitation.venue}</h2>
          <p className="mx-auto mt-5 max-w-lg leading-7 text-white/60">{invitation.address}</p>
          <div className="mx-auto mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6"><CalendarDays className="mx-auto mb-4 text-[#c59a7d]" /><p className="font-serif text-xl">{formattedDate}</p><p className="mt-1 text-sm text-white/50">{invitation.time} da</p></div>
            <a href={invitation.mapUrl} target="_blank" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"><MapPin className="mx-auto mb-4 text-[#c59a7d]" /><p className="font-serif text-xl">Xaritada ochish</p><p className="mt-1 flex items-center justify-center gap-1 text-sm text-white/50">Yo‘nalish <Navigation size={12} /></p></a>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-xs uppercase tracking-[.3em] text-[#9b745a]">Iltimos, javob bering</p>
          <h2 className="mt-5 font-serif text-5xl">Sizni kutamizmi?</h2>
          <p className="mt-4 text-[#766a61]">Javobingizni belgilashingiz bizga tayyorgarlik ko‘rishda yordam beradi.</p>
          {rsvp ? (
            <div className="mt-10 rounded-2xl border border-[#d8ccbf] bg-white/60 p-7">
              <div className="mx-auto grid size-11 place-items-center rounded-full bg-[#63765c] text-white">{rsvp === "yes" ? <Check /> : <X />}</div>
              <p className="mt-4 font-serif text-2xl">{rsvp === "yes" ? "Ajoyib, sizni kutamiz!" : "Javobingiz uchun rahmat"}</p>
              <button onClick={() => setRsvp(null)} className="mt-3 text-xs underline">Javobni o‘zgartirish</button>
            </div>
          ) : (
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => setRsvp("yes")} className="rounded-full bg-[#9b6a4b] px-8 py-4 font-semibold text-white">Ha, albatta boraman</button>
              <button onClick={() => setRsvp("no")} className="rounded-full border border-[#bca895] px-8 py-4 font-semibold">Afsuski, bora olmayman</button>
            </div>
          )}
        </div>
      </section>
      <footer className="border-t border-[#ddd1c5] px-5 py-10 text-center text-xs text-[#91857b]">Muhabbat bilan, {invitation.partnerOne} & {invitation.partnerTwo} · Taklif.</footer>
    </main>
  );
}
