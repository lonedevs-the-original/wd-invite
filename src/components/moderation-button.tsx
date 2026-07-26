"use client";

import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function ModerationButton({ id, deleted }: { id: string; deleted: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function toggle() {
    if (!deleted && !window.confirm("Taklifnomani o‘chirish kerakmi? Uni keyin tiklash mumkin.")) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("invitations").update({ deleted_at: deleted ? null : new Date().toISOString() }).eq("id", id);
    setBusy(false); router.refresh();
  }
  return <button disabled={busy} onClick={toggle} title={deleted ? "Tiklash" : "O‘chirish"} className={`rounded-lg border p-2 ${deleted ? "border-emerald-200 text-emerald-700" : "border-red-200 text-red-600"}`}>{deleted ? <RotateCcw size={16} /> : <Trash2 size={16} />}</button>;
}
