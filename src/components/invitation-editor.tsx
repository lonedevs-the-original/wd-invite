"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Check, ExternalLink, MapPin, Save, Smartphone } from "lucide-react";
import type { Invitation } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const emptyInvitation: Invitation = {
  id: "", slug: "", partnerOne: "", partnerTwo: "", date: "2026-12-12", time: "18:00",
  venue: "", address: "", mapUrl: "", messageUz: "", messageRu: "", messageEn: "", defaultLanguage: "uz",
  cardNumber: "", cardHolder: "", themeStyle: "classic", coverUrl: "", galleryUrls: [], musicUrl: "",
  status: "draft", guests: 0, attending: 0,
};

export function InvitationEditor({ initial }: { initial?: Invitation }) {
  const router = useRouter();
  const [data, setData] = useState(initial ?? emptyInvitation);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading,setUploading]=useState(false);
  const set = (key: keyof Invitation, value: string | string[]) => { setSaved(false); setData((current) => ({ ...current, [key]: value } as Invitation)); };
  async function uploadImages(files: FileList | null) {
    if(!files?.length)return;setUploading(true);setError("");const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user){router.push("/login");return}
    const urls:string[]=[];
    for(const file of Array.from(files).slice(0,6)){const bitmap=await createImageBitmap(file);const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext("2d")?.drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",.82));if(!blob)continue;const path=`${user.id}/${crypto.randomUUID()}.webp`;const {error:uploadError}=await supabase.storage.from("wedding-media").upload(path,blob,{contentType:"image/webp"});if(uploadError){setError(uploadError.message);continue}urls.push(supabase.storage.from("wedding-media").getPublicUrl(path).data.publicUrl)}
    setUploading(false);if(urls.length){set("coverUrl",urls[0]);set("galleryUrls",[...urls,...(data.galleryUrls??[])].slice(0,6))}
  }
  const save = async () => {
    setBusy(true); setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    if (!initial) await supabase.rpc("cleanup_expired_invitations");
    const payload = {
      owner_id: user.id, slug: data.slug, partner_one: data.partnerOne, partner_two: data.partnerTwo,
      event_date: data.date, event_time: data.time, venue: data.venue, address: data.address,
      map_url: data.mapUrl, message: data.messageUz || data.messageRu || data.messageEn,
      message_uz: data.messageUz || null, message_ru: data.messageRu || null, message_en: data.messageEn || null,
      default_language: data.defaultLanguage, created_by_email: user.email, status: data.status,
      card_number: data.cardNumber?.replace(/\s+/g, " ").trim() || null, card_holder: data.cardHolder?.trim() || null,
      theme_style: data.themeStyle || "classic", cover_url: data.coverUrl?.trim() || null,
      gallery_urls: data.galleryUrls ?? [], music_url: data.musicUrl?.trim() || null,
    };
    const result = initial
      ? await supabase.from("invitations").update(payload).eq("id", initial.id)
      : await supabase.from("invitations").insert(payload).select("slug").single();
    setBusy(false);
    if (result.error) return setError(result.error.message);
    setSaved(true);
    if (!initial) router.replace(`/admin/invitations/${result.data?.slug ?? data.slug}`);
    router.refresh();
    window.setTimeout(() => setSaved(false), 2400);
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e3e0da] bg-[#f5f5f3]/90 px-5 py-4 backdrop-blur lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="rounded-lg border border-[#dedbd5] bg-white p-2"><ArrowLeft size={18} /></Link>
          <div><p className="text-xs text-[#8a857e]">{initial ? "Taklifnomani tahrirlash" : "Yangi taklifnoma"}</p><h1 className="font-semibold">{data.partnerOne || "Ism"} & {data.partnerTwo || "Ism"}</h1></div>
        </div>
        <div className="flex items-center gap-2">
          {initial && <Link href={`/i/${initial.slug}`} className="hidden items-center gap-2 rounded-lg border border-[#dedbd5] bg-white px-4 py-2.5 text-sm sm:flex"><ExternalLink size={15} /> Ko‘rish</Link>}
          <button onClick={save} disabled={busy || !data.partnerOne || !data.partnerTwo || !data.slug || !data.venue} className="flex items-center gap-2 rounded-lg bg-[#252523] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saved ? <Check size={16} /> : <Save size={16} />}{busy ? "Saqlanmoqda..." : saved ? "Saqlandi" : "Saqlash"}</button>
        </div>
      </header>
      <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[minmax(400px,1fr)_minmax(430px,.9fr)]">
        <section className="px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex gap-6 border-b border-[#dedbd5] text-sm">
              <a href="#main-details" className="border-b-2 border-[#8f654b] pb-3 font-semibold text-[#76513b]">Asosiy ma’lumotlar</a>
              <Link href="/admin/guests" className="pb-3 text-[#88827c]">Mehmonlar <span className="ml-1 rounded-full bg-[#e5e2dd] px-2 py-0.5 text-xs">{data.guests}</span></Link>
              <a href="#design" className="pb-3 text-[#88827c]">Dizayn</a>
            </div>
            <div className="space-y-8">
              {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <FormSection id="main-details" title="Juftlik" subtitle="Taklifnomada ko‘rinadigan ismlar">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Kuyovning ismi" value={data.partnerOne} onChange={(v) => set("partnerOne", v)} placeholder="Aziz" />
                  <Field label="Kelinning ismi" value={data.partnerTwo} onChange={(v) => set("partnerTwo", v)} placeholder="Diyora" />
                </div>
                <Field label="Havola nomi" value={data.slug} onChange={(v) => set("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="aziz-diyora" prefix="taklif.uz/i/" />
                <label className="block"><span className="mb-2 block text-sm font-medium">Taklifnomaning asosiy tili</span><select value={data.defaultLanguage} onChange={(e) => set("defaultLanguage", e.target.value)} className="w-full rounded-xl border border-[#dcd8d1] bg-white px-4 py-3 text-sm outline-none focus:border-[#9a745a]"><option value="uz">O‘zbekcha</option><option value="ru">Русский</option><option value="en">English</option></select><span className="mt-2 block text-xs text-[#8d8881]">Mehmon havolani ochganda shu til birinchi ko‘rinadi.</span></label>
                <div className="grid gap-4">
                  <MessageField label="Taklif matni — O‘zbekcha" value={data.messageUz} onChange={(v) => set("messageUz", v)} placeholder="Hayotimizning eng go‘zal kunini siz bilan..." />
                  <MessageField label="Текст приглашения — Русский" value={data.messageRu} onChange={(v) => set("messageRu", v)} placeholder="Будем счастливы разделить этот день с вами..." />
                  <MessageField label="Invitation text — English" value={data.messageEn} onChange={(v) => set("messageEn", v)} placeholder="We would be delighted to celebrate with you..." />
                  <p className="text-xs leading-5 text-[#8d8881]">Faqat bittasini kiritsangiz ham bo‘ladi — u qolgan tillar uchun standart matn sifatida ishlatiladi.</p>
                </div>
              </FormSection>
              <FormSection title="Sana va joy" subtitle="Mehmonlar uchun muhim tafsilotlar">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field type="date" label="To‘y sanasi" value={data.date} onChange={(v) => set("date", v)} />
                  <Field type="time" label="Boshlanish vaqti" value={data.time} onChange={(v) => set("time", v)} />
                </div>
                <Field label="To‘yxona nomi" value={data.venue} onChange={(v) => set("venue", v)} placeholder="Zarafshon tantanalar saroyi" />
                <Field label="To‘liq manzil" value={data.address} onChange={(v) => set("address", v)} placeholder="Toshkent shahri..." />
                <Field label="Xarita havolasi" value={data.mapUrl} onChange={(v) => set("mapUrl", v)} placeholder="https://maps.google.com/..." />
              </FormSection>
              <FormSection title="To‘yona" subtitle="Ixtiyoriy — karta kiritilsa, mehmonlarga ko‘rinadi">
                <Field label="Karta raqami" value={data.cardNumber ?? ""} onChange={(v) => set("cardNumber", v.replace(/[^\d ]/g, "").slice(0, 23))} placeholder="8600 0000 0000 0000" />
                <Field label="Karta egasi" value={data.cardHolder ?? ""} onChange={(v) => set("cardHolder", v)} placeholder="A. ABDULLAYEV" />
              </FormSection>
              <FormSection id="design" title="Dizayn va media" subtitle="Rasm va musiqa havolalari ixtiyoriy">
                <label className="block"><span className="mb-2 block text-sm font-medium">Uslub</span><select value={data.themeStyle ?? "classic"} onChange={(e)=>set("themeStyle",e.target.value)} className="w-full rounded-xl border bg-white px-4 py-3"><option value="classic">Classic</option><option value="garden">Garden</option><option value="midnight">Midnight</option></select></label>
                <Field label="Muqova rasmi URL" value={data.coverUrl ?? ""} onChange={(v)=>set("coverUrl",v)} placeholder="https://..." />
                <label className="block"><span className="mb-2 block text-sm font-medium">Rasmlarni yuklash (6 tagacha)</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e)=>void uploadImages(e.target.files)} className="w-full rounded-xl border bg-white px-4 py-3 text-sm"/><span className="mt-2 block text-xs text-[#8d8881]">{uploading?"Siqilmoqda va yuklanmoqda…":"Rasmlar avtomatik WebP formatiga siqiladi."}</span></label>
                <Field label="Fon musiqasi URL" value={data.musicUrl ?? ""} onChange={(v)=>set("musicUrl",v)} placeholder="https://.../music.mp3" />
                {initial&&<div className="rounded-xl border bg-[#faf9f7] p-4 text-center"><p className="mb-3 text-sm font-medium">Taklifnoma QR kodi</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="mx-auto size-40 rounded-lg" alt="Invitation QR code" src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(`${typeof window!=="undefined"?window.location.origin:"https://wd-invite-rouge.vercel.app"}/i/${data.slug}`)}`}/>
                  <p className="mt-2 text-xs text-[#8d8881]">Saqlash yoki chop etish uchun rasmni bosib turing.</p></div>}
              </FormSection>
              <FormSection title="Chop etish" subtitle="Tayyor bo‘lganda taklifnomani mehmonlar uchun oching">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => set("status", "draft")} className={`rounded-xl border px-5 py-3 text-sm font-semibold ${data.status === "draft" ? "border-[#8f654b] bg-[#f6eee8] text-[#76513b]" : "border-[#dedbd5]"}`}>Qoralama</button>
                  <button onClick={() => set("status", "published")} className={`rounded-xl border px-5 py-3 text-sm font-semibold ${data.status === "published" ? "border-[#4e795b] bg-[#e9f2eb] text-[#376344]" : "border-[#dedbd5]"}`}>Mehmonlar uchun ochiq</button>
                </div>
              </FormSection>
            </div>
          </div>
        </section>

        <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] place-items-center overflow-hidden bg-[#ded8cf] p-8 lg:grid">
          <div className="absolute right-8 top-6 flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs text-[#6f6962]"><Smartphone size={13} /> Jonli ko‘rinish</div>
          <div className="w-[330px] rounded-[2.8rem] border-[8px] border-[#262522] bg-white p-2 shadow-[0_35px_90px_rgba(50,42,35,.28)]">
            <div style={data.coverUrl?.startsWith("http")?{backgroundImage:`linear-gradient(rgba(255,255,255,.78),rgba(255,255,255,.78)),url("${data.coverUrl}")`,backgroundSize:"cover",backgroundPosition:"center"}:undefined} className={`relative flex aspect-[9/16] flex-col items-center justify-between overflow-hidden rounded-[2rem] px-6 py-10 text-center ${data.themeStyle==="midnight"?"bg-[#171815] text-white":data.themeStyle==="garden"?"bg-gradient-to-br from-[#edf4e8] via-[#fbf8f3] to-[#dce9d7]":"invitation-pattern"}`}>
              <div className="absolute top-3 h-5 w-20 rounded-full bg-[#262522]" />
              <p className="mt-4 text-[9px] uppercase tracking-[.24em] text-[#896d59]">Nikoh oqshomi</p>
              <div><p className="mb-4 font-serif text-sm italic text-[#9d7358]">Birga bo‘lishga va’da berdik</p><p className="font-serif text-5xl leading-[.8]">{data.partnerOne || "Aziz"}<span className="my-3 block text-xl italic text-[#9d7358]">&</span>{data.partnerTwo || "Diyora"}</p></div>
              <div className="space-y-2"><CalendarDays size={16} className="mx-auto text-[#9d7358]" /><p className="font-serif text-lg">{data.date ? data.date.split("-").reverse().join(".") : "18.09.2026"}</p><p className="flex items-center justify-center gap-1 text-[9px] uppercase tracking-[.12em] text-[#806f62]"><MapPin size={10} /> {data.venue || "To‘yxona nomi"}</p></div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function FormSection({ id, title, subtitle, children }: { id?: string; title: string; subtitle: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-28 rounded-2xl border border-[#e2dfd9] bg-white p-5 sm:p-6"><h2 className="font-semibold">{title}</h2><p className="mt-1 text-xs text-[#8d8881]">{subtitle}</p><div className="mt-6 space-y-4">{children}</div></section>;
}

function Field({ label, value, onChange, placeholder, prefix, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; prefix?: string; type?: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span><div className="flex rounded-xl border border-[#dcd8d1] bg-white focus-within:border-[#9a745a]">{prefix && <span className="border-r border-[#e2ded8] bg-[#f7f5f2] px-3 py-3 text-xs text-[#8e8880]">{prefix}</span>}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-sm outline-none" /></div></label>;
}

function MessageField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span><textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full resize-none rounded-xl border border-[#dcd8d1] bg-white px-4 py-3 text-sm outline-none focus:border-[#9a745a]" /></label>;
}
