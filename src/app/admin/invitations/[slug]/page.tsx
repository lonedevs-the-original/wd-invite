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
    mapUrl: row.map_url, message: row.message, status: row.status === "published" ? "published" as const : "draft" as const,
    guests: 0, attending: 0,
  };
  return <InvitationEditor initial={invitation} />;
}
