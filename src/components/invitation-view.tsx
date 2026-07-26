"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, Heart, MapPin, Navigation, X } from "lucide-react";
import type { Invitation } from "@/lib/demo-data";

type Language = "uz" | "ru" | "en";
const copy = {
  uz: { invite: "Sizni nikoh oqshomimizga taklif qilamiz", promise: "Birga bo‘lishga va’da berdik", details: "Tafsilotlarni ko‘rish", place: "Manzil va vaqt", map: "Xaritada ochish", route: "Yo‘nalish", calendar: "Taqvimga qo‘shish", until: "To‘yimizgacha", days: "kun", hours: "soat", minutes: "daqiqa", seconds: "soniya", reply: "Iltimos, javob bering", wait: "Sizni kutamizmi?", replyHelp: "Javobingizni belgilashingiz bizga tayyorgarlik ko‘rishda yordam beradi.", yes: "Ha, albatta boraman", no: "Afsuski, bora olmayman", welcome: "Ajoyib, sizni kutamiz!", thanks: "Javobingiz uchun rahmat", change: "Javobni o‘zgartirish", withLove: "Muhabbat bilan" },
  ru: { invite: "Приглашаем вас на вечер нашей свадьбы", promise: "Мы обещали быть вместе", details: "Посмотреть детали", place: "Место и время", map: "Открыть на карте", route: "Маршрут", calendar: "Добавить в календарь", until: "До нашей свадьбы", days: "дней", hours: "часов", minutes: "минут", seconds: "секунд", reply: "Пожалуйста, ответьте", wait: "Ждать ли вас?", replyHelp: "Ваш ответ поможет нам лучше подготовиться к празднику.", yes: "Да, я обязательно приду", no: "К сожалению, не смогу", welcome: "Прекрасно, мы вас ждём!", thanks: "Спасибо за ваш ответ", change: "Изменить ответ", withLove: "С любовью" },
  en: { invite: "We invite you to celebrate our wedding", promise: "We promised forever", details: "View the details", place: "Place and time", map: "Open in maps", route: "Directions", calendar: "Add to calendar", until: "Until our wedding", days: "days", hours: "hours", minutes: "minutes", seconds: "seconds", reply: "Please let us know", wait: "Will you join us?", replyHelp: "Your reply will help us prepare for the celebration.", yes: "Yes, I’ll be there", no: "Sadly, I can’t attend", welcome: "Wonderful, we’ll be waiting!", thanks: "Thank you for replying", change: "Change response", withLove: "With love" },
} as const;

function pad(value: number) { return String(value).padStart(2, "0"); }
function googleDate(date: Date) { return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`; }

export function InvitationView({ invitation }: { invitation: Invitation }) {
  const [language, setLanguage] = useState<Language>(invitation.defaultLanguage);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const eventDate = useMemo(() => new Date(`${invitation.date}T${invitation.time}:00+05:00`), [invitation.date, invitation.time]);
  const [remaining, setRemaining] = useState(() => Math.max(0, eventDate.getTime() - Date.now()));
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, eventDate.getTime() - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, [eventDate]);

  const locale = language === "uz" ? "uz-UZ" : language === "ru" ? "ru-RU" : "en-GB";
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "Asia/Tashkent" }).format(eventDate);
  const formattedDate = invitation.date.split("-").reverse().join(".");
  const messages = { uz: invitation.messageUz, ru: invitation.messageRu, en: invitation.messageEn };
  const customMessage = messages[language] || messages[invitation.defaultLanguage] || invitation.messageUz || invitation.messageRu || invitation.messageEn;
  const totalSeconds = Math.floor(remaining / 1000);
  const countdown = { days: Math.floor(totalSeconds / 86400), hours: Math.floor((totalSeconds % 86400) / 3600), minutes: Math.floor((totalSeconds % 3600) / 60), seconds: totalSeconds % 60 };
  const endDate = new Date(eventDate.getTime() + 4 * 60 * 60 * 1000);
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${invitation.partnerOne} & ${invitation.partnerTwo}`)}&dates=${googleDate(eventDate)}/${googleDate(endDate)}&location=${encodeURIComponent(`${invitation.venue}, ${invitation.address}`)}&details=${encodeURIComponent(customMessage || "")}`;
  const t = copy[language];

  return (
    <main className="grain relative min-h-screen overflow-hidden bg-[#f8f4ed] text-[#302820]">
      <div className="fixed right-4 top-4 z-30 flex rounded-full border border-[#d9cbbd] bg-white/85 p-1 shadow-lg backdrop-blur">
        {(["uz", "ru", "en"] as Language[]).map((item) => <button key={item} onClick={() => setLanguage(item)} className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase ${language === item ? "bg-[#302820] text-white" : "text-[#76685d]"}`}>{item}</button>)}
      </div>
      <section className="relative grid min-h-screen place-items-center px-5 py-14 text-center">
        <div className="absolute left-[-7rem] top-[-7rem] size-80 rounded-full border border-[#b99b82]/20" />
        <div className="absolute right-[-8rem] top-40 size-96 rounded-full border border-[#93a18b]/20" />
        <div className="relative z-10 max-w-2xl">
          <div className="mx-auto mb-10 flex size-12 items-center justify-center rounded-full border border-[#bb9e87]"><Heart size={18} className="text-[#9b6a4b]" /></div>
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#8e705b]">{t.invite}</p>
          <h1 className="mt-10 font-serif text-[clamp(4rem,16vw,8.5rem)] leading-[.75] tracking-[-.06em]">{invitation.partnerOne}<span className="my-6 block text-4xl font-normal italic text-[#a4785e]">&</span>{invitation.partnerTwo}</h1>
          {customMessage && <p className="mx-auto mt-12 max-w-lg font-serif text-xl italic leading-8 text-[#6e5f53]">“{customMessage}”</p>}
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            <span className="flex items-center gap-2"><CalendarDays size={16} className="text-[#a4785e]" /> {weekday}, {formattedDate}</span>
            <span className="flex items-center gap-2"><Clock3 size={16} className="text-[#a4785e]" /> {invitation.time}</span>
          </div>
          <a href="#details" className="mt-12 inline-block rounded-full border border-[#9b6a4b] px-7 py-3 text-xs font-bold uppercase tracking-[.16em] text-[#7d563f]">{t.details}</a>
        </div>
      </section>

      <section className="border-y border-[#dfd3c7] bg-white/45 px-5 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#96735c]">{t.until}</p>
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-4 gap-2">
          {([["days", countdown.days], ["hours", countdown.hours], ["minutes", countdown.minutes], ["seconds", countdown.seconds]] as const).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-[#e1d5c9] bg-white/65 px-2 py-5"><p className="font-serif text-3xl sm:text-5xl">{pad(value)}</p><p className="mt-2 text-[10px] uppercase tracking-wider text-[#85786d]">{t[key]}</p></div>
          ))}
        </div>
      </section>

      <section id="details" className="bg-[#2f332d] px-5 py-24 text-[#f7f2ea]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[.3em] text-[#b8c0b2]">{t.place}</p>
          <h2 className="mt-6 font-serif text-4xl sm:text-6xl">{invitation.venue}</h2>
          <p className="mx-auto mt-5 max-w-lg leading-7 text-white/60">{invitation.address}</p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            <a href={calendarUrl} target="_blank" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"><CalendarDays className="mx-auto mb-4 text-[#c59a7d]" /><p className="font-serif text-lg capitalize">{weekday}</p><p className="mt-1 text-sm text-white/50">{formattedDate} · {invitation.time}</p><p className="mt-3 text-xs text-[#c59a7d]">{t.calendar}</p></a>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6"><Clock3 className="mx-auto mb-4 text-[#c59a7d]" /><p className="font-serif text-xl">{invitation.time}</p><p className="mt-1 text-sm text-white/50">{formattedDate}</p></div>
            <a href={invitation.mapUrl} target="_blank" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"><MapPin className="mx-auto mb-4 text-[#c59a7d]" /><p className="font-serif text-xl">{t.map}</p><p className="mt-1 flex items-center justify-center gap-1 text-sm text-white/50">{t.route} <Navigation size={12} /></p></a>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <p className="text-xs uppercase tracking-[.3em] text-[#9b745a]">{t.reply}</p>
          <h2 className="mt-5 font-serif text-5xl">{t.wait}</h2>
          <p className="mt-4 text-[#766a61]">{t.replyHelp}</p>
          {rsvp ? <div className="mt-10 rounded-2xl border border-[#d8ccbf] bg-white/60 p-7"><div className="mx-auto grid size-11 place-items-center rounded-full bg-[#63765c] text-white">{rsvp === "yes" ? <Check /> : <X />}</div><p className="mt-4 font-serif text-2xl">{rsvp === "yes" ? t.welcome : t.thanks}</p><button onClick={() => setRsvp(null)} className="mt-3 text-xs underline">{t.change}</button></div>
          : <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => setRsvp("yes")} className="rounded-full bg-[#9b6a4b] px-8 py-4 font-semibold text-white">{t.yes}</button><button onClick={() => setRsvp("no")} className="rounded-full border border-[#bca895] px-8 py-4 font-semibold">{t.no}</button></div>}
        </div>
      </section>
      <footer className="border-t border-[#ddd1c5] px-5 py-10 text-center text-xs text-[#91857b]">
        <p>{t.withLove}, {invitation.partnerOne} & {invitation.partnerTwo} · Taklif.</p>
        <p className="mt-3 text-[10px] text-[#aaa097]">Created by LoneDevs · <a className="underline" href="https://t.me/lonedevs" target="_blank">t.me/lonedevs</a></p>
      </footer>
    </main>
  );
}
