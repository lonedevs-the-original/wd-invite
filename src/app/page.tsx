"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Check, LayoutDashboard, Sparkles, Users } from "lucide-react";
import { CreatorActions } from "@/components/creator-actions";

type Lang = "uz" | "ru" | "en";
const words = {
  uz: { demo:"Namuna", login:"Panelga kirish", badge:"Muhabbat uchun yaratilgan", title:"Sizning to‘yingiz,", accent:"bir go‘zal havolada.", body:"Taklifnomani yarating, Telegram orqali ulashing va mehmonlar javoblarini kuzating.", create:"Taklifnoma yaratish", quick:"Bir necha daqiqada tayyor", evening:"Nikoh oqshomi", promise:"Birga bo‘lishga va’da berdik", place:"Toshkent · Zarafshon", replies:"Javob berdilar", people:"mehmon", features:[["Chiroyli taklifnoma","Har bir juftlik uchun nafis, mobilga mos sahifa."],["Qulay boshqaruv","Tafsilotlar va javoblarni bitta joyda boshqaring."],["Aniq RSVP","Mehmonning ismi, soni va izohi bilan javoblar."]] },
  ru: { demo:"Пример", login:"Войти в панель", badge:"Создано для любви", title:"Ваша свадьба —", accent:"в одной красивой ссылке.", body:"Создайте приглашение, поделитесь им в Telegram и следите за ответами гостей.", create:"Создать приглашение", quick:"Готово за несколько минут", evening:"Свадебный вечер", promise:"Мы обещали быть вместе", place:"Ташкент · Зарафшан", replies:"Ответили", people:"гостей", features:[["Красивое приглашение","Элегантная страница, удобная на телефоне."],["Удобное управление","Все детали и ответы в одном месте."],["Точные ответы","Имя гостя, количество людей и комментарий."]] },
  en: { demo:"Demo", login:"Open dashboard", badge:"Made for love", title:"Your wedding,", accent:"in one beautiful link.", body:"Create your invitation, share it on Telegram, and keep track of every guest response.", create:"Create invitation", quick:"Ready in a few minutes", evening:"Wedding evening", promise:"We promised forever", place:"Tashkent · Zarafshan", replies:"Responded", people:"guests", features:[["Beautiful invitation","An elegant, mobile-friendly page for every couple."],["Simple dashboard","Manage details and responses in one place."],["Clear RSVP","Guest name, party size, attendance, and comments."]] },
} as const;
const icons = [Sparkles, LayoutDashboard, Users];

export default function Home() {
  const [lang, setLang] = useState<Lang>("uz");
  const t = words[lang];
  return <main className="min-h-screen overflow-hidden bg-[#f7f3ec] text-[#27231f]">
    <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-6 lg:px-10">
      <Link href="/" className="font-serif text-2xl">Taklif<span className="text-[#9d7256]">.</span></Link>
      <div className="flex items-center gap-2">
        <div className="flex rounded-full border border-[#d9cbbd] bg-white/70 p-1">{(["uz","ru","en"] as Lang[]).map(x=><button key={x} onClick={()=>setLang(x)} className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${x===lang?"bg-[#27231f] text-white":""}`}>{x}</button>)}</div>
        <Link href="/i/aziz-diyora" className="hidden rounded-full px-4 py-2.5 text-sm sm:block">{t.demo}</Link>
        <Link href="/admin" className="rounded-full bg-[#27231f] px-4 py-2.5 text-sm font-medium text-white">{t.login}</Link>
      </div>
    </nav>
    <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-32 lg:pt-24">
      <div><div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d9cbbd] bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-[#765b49]"><Sparkles size={14}/>{t.badge}</div>
      <h1 className="max-w-3xl font-serif text-[clamp(3.5rem,8vw,7.2rem)] leading-[.88] tracking-[-.055em]">{t.title} <span className="italic text-[#a4775a]">{t.accent}</span></h1>
      <p className="mt-8 max-w-xl text-lg leading-8 text-[#6f665e]">{t.body}</p>
      <div className="mt-10 flex flex-wrap items-center gap-4"><Link href="/admin" className="inline-flex items-center gap-3 rounded-full bg-[#a4775a] px-7 py-4 font-semibold text-white">{t.create}<ArrowUpRight size={18}/></Link><span className="flex items-center gap-2 text-sm text-[#6f665e]"><Check size={16}/>{t.quick}</span></div></div>
      <div className="relative mx-auto w-full max-w-[520px]"><div className="rounded-[2.2rem] border border-white/80 bg-white/75 p-3 shadow-2xl"><div className="invitation-pattern flex aspect-[4/5] flex-col items-center justify-between rounded-[1.7rem] border border-[#dccfc3] px-8 py-10 text-center"><div className="text-xs uppercase tracking-[.28em] text-[#806957]">{t.evening}</div><div><p className="mb-3 font-serif text-2xl italic text-[#a4775a]">{t.promise}</p><h2 className="font-serif text-6xl">Aziz <span className="block text-3xl italic text-[#a4775a]">&</span> Diyora</h2></div><div><CalendarDays className="mx-auto text-[#a4775a]"/><p className="mt-2 font-serif text-2xl">18.09.2026</p><p className="mt-2 text-xs uppercase tracking-[.18em] text-[#806957]">{t.place}</p></div></div></div><div className="absolute -bottom-5 -left-3 rounded-2xl bg-white/95 p-4 shadow-xl"><p className="text-xs text-[#85786d]">{t.replies}</p><p className="font-serif text-2xl">128 {t.people}</p></div></div>
    </section>
    <section className="border-y border-[#ded4ca] bg-white/45"><div className="mx-auto grid max-w-7xl px-6 lg:grid-cols-3 lg:px-10">{t.features.map(([title,text],i)=>{const Icon=icons[i];return <div key={title} className="border-b border-[#ded4ca] py-10 lg:border-b-0 lg:border-l lg:px-10"><Icon className="mb-6 text-[#a4775a]"/><h3 className="font-serif text-2xl">{title}</h3><p className="mt-2 leading-7 text-[#746a62]">{text}</p></div>})}</div></section>
    <section className="px-6 py-12"><CreatorActions/></section>
  </main>;
}
