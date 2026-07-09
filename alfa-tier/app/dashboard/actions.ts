"use server";

import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function asignarTier(alfajorId: number, tierId: number, usuarioId: number) {
  const { error } = await supabase
    .from("tierlist_items")
    .upsert(
      { usuario_id: usuarioId, alfajor_id: alfajorId, tier_id: tierId },
      { onConflict: "usuario_id,alfajor_id" }
    );

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true };
}

export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete("usuario_id");
  redirect("/login");
}