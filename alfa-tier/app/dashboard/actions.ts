"use server";

import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Guarda o actualiza el tier de un alfajor para el usuario actual
 */
export async function asignarTier(alfajorId: number, tierId: number, usuarioId: number) {
  try {
    const { error } = await supabase
      .from("tierlist_items")
      .upsert(
        {
          usuario_id: usuarioId,
          alfajor_id: alfajorId,
          tier_id: tierId,
        },
        { onConflict: "usuario_id,alfajor_id" }
      );

    if (error) throw error;

    revalidatePath("/ranking");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error en asignarTier:", error);
    return { success: false };
  }
}

/**
 * Borra TODOS los alfajores clasificados por el usuario
 */
export async function limpiarTierlist(usuarioId: number) {
  try {
    const { error } = await supabase
      .from("tierlist_items")
      .delete()
      .eq("usuario_id", usuarioId);

    if (error) throw error;

    // Rompemos la caché para que el dashboard y el ranking general se actualicen al toque
    revalidatePath("/ranking");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error en limpiarTierlist:", error);
    return { success: false };
  }
}

/**
 * Borra la cookie de sesión y redirige al login
 */
export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete("usuario_id");
  redirect("/login");
}