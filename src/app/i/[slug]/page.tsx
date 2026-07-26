import { notFound } from "next/navigation";
import { getInvitation } from "@/lib/demo-data";
import { InvitationView } from "@/components/invitation-view";
import { createClient } from "@/lib/supabase/server";

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: row } = await supabase.from("invitations").select("*").eq("slug", slug).eq("status", "published").is("deleted_at", null).maybeSingle();
  const invitation = row ? {
    id: row.id, slug: row.slug, partnerOne: row.partner_one, partnerTwo: row.partner_two,
    date: row.event_date, time: row.event_time.slice(0, 5), venue: row.venue, address: row.address,
    mapUrl: row.map_url, messageUz: row.message_uz ?? row.message ?? "", messageRu: row.message_ru ?? "",
    messageEn: row.message_en ?? "", defaultLanguage: row.default_language ?? "uz",
    createdByEmail: row.created_by_email, deletedAt: row.deleted_at,
    status: "published" as const, guests: 0, attending: 0,
  } : getInvitation(slug);
  if (!invitation) notFound();
  return <InvitationView invitation={invitation} />;
}
