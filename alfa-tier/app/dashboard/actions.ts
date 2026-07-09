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
    // Insertamos o actualizamos si ya existe la combinación de usuario y alfajor
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

    // MANDATORIO: Le avisa a Next.js que limpie la caché de estas rutas
    // para que cuando vayas al ranking se vuelva a consultar la vista de Supabase con los datos nuevos.
    revalidatePath("/ranking");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error en asignarTier:", error);
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