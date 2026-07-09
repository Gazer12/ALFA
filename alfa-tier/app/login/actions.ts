"use server";

import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function registrarUsuario(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const apellido = formData.get("apellido") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const passwordHash = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("usuarios").insert({
    nombre,
    apellido,
    username,
    password_hash: passwordHash,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Cuenta creada con éxito" };
}

export async function loginUsuario(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const { data: usuario, error } = await supabase
    .from("usuarios")
    .select("id, nombre, password_hash")
    .eq("username", username)
    .single();

  if (error || !usuario) {
    return { success: false, message: "Usuario o contraseña incorrectos" };
  }

  const passwordCorrecta = await bcrypt.compare(password, usuario.password_hash);

  if (!passwordCorrecta) {
    return { success: false, message: "Usuario o contraseña incorrectos" };
  }

  const cookieStore = await cookies();
  cookieStore.set("usuario_id", usuario.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true, message: `¡Bienvenido, ${usuario.nombre}!` };
}