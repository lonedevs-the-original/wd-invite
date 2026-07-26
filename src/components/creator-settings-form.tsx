"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export function CreatorSettingsForm({name,card}:{name:string;card:string}){
 const [creatorName,setCreatorName]=useState(name);const [cardNumber,setCardNumber]=useState(card);const [message,setMessage]=useState("");
 async function save(e:React.FormEvent){e.preventDefault();setMessage("Saqlanmoqda…");const {error}=await createClient().from("site_settings").update({creator_name:creatorName.trim(),card_number:cardNumber.replace(/\s+/g," ").trim()||null,updated_at:new Date().toISOString()}).eq("id","creator_support");setMessage(error?error.message:"Saqlandi.")}
 return <form onSubmit={save} className="mt-8 max-w-xl space-y-4 rounded-2xl border bg-white p-6"><label className="block"><span className="mb-2 block text-sm font-medium">Karta egasining nomi</span><input required value={creatorName} onChange={e=>setCreatorName(e.target.value)} className="w-full rounded-xl border px-4 py-3"/></label><label className="block"><span className="mb-2 block text-sm font-medium">Creator karta raqami</span><input value={cardNumber} onChange={e=>setCardNumber(e.target.value.replace(/[^\d ]/g,"").slice(0,23))} placeholder="8600 0000 0000 0000" className="w-full rounded-xl border px-4 py-3"/></label>{message&&<p className="text-sm text-[#765641]">{message}</p>}<button className="rounded-xl bg-[#252523] px-5 py-3 font-semibold text-white">Saqlash</button></form>
}
