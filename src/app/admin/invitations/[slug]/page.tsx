import { notFound } from "next/navigation";
import { InvitationEditor } from "@/components/invitation-editor";
import { createClient } from "@/lib/supabase/server";
export default async function EditInvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: row } = await supabase.from("invitations").select("*").eq("slug", slug).single();
  if (!row) notFound();
  const invitation = {
    id: row.id, slug: row.slug, partnerOne: row.partner_one, partnerTwo: row.partner_two,
    date: row.event_date, time: row.event_time.slice(0, 5), venue: row.venue, address: row.address,
    mapUrl: row.map_url, messageUz: row.message_uz ?? row.message ?? "", messageRu: row.message_ru ?? "",
    cardNumber: row.card_number ?? "", cardHolder: row.card_holder ?? "", themeStyle: row.theme_style ?? "classic",
    coverUrl: row.cover_url ?? "", galleryUrls: row.gallery_urls ?? [], musicUrl: row.music_url ?? "",
    messageEn: row.message_en ?? "", defaultLanguage: row.default_language ?? "uz",
    createdByEmail: row.created_by_email, deletedAt: row.deleted_at,
    status: row.status === "published" ? "published" as const : "draft" as const,
    guests: 0, attending: 0,
  };
  return <InvitationEditor initial={invitation} />;
}
