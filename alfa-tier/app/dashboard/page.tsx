import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TierlistClient from "./TierlistClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const usuarioId = cookieStore.get("usuario_id")?.value;

  if (!usuarioId) {
    redirect("/login");
  }

  const { data: alfajores } = await supabase.from("alfajores").select("*");
  const { data: misItems } = await supabase
    .from("tierlist_items")
    .select("alfajor_id, tier_id")
    .eq("usuario_id", usuarioId);

  return (
    <TierlistClient
      alfajoresIniciales={alfajores || []}
      itemsIniciales={misItems || []}
      usuarioId={Number(usuarioId)}
    />
  );
}