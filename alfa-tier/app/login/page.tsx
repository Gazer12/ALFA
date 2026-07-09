"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrarUsuario, loginUsuario } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState("login");
  const [mensaje, setMensaje] = useState<{ success: boolean; message: string } | null>(null);

  async function manejarRegistro(formData: FormData) {
    const resultado = await registrarUsuario(formData);
    setMensaje(resultado);
  }

  async function manejarLogin(formData: FormData) {
    const resultado = await loginUsuario(formData);
    setMensaje(resultado);
    if (resultado.success) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 md:px-24 bg-[#0F0F0F] text-[#e5e2e1]">
      <main className="w-full max-w-md z-10">
        <header className="flex flex-col items-center mb-16">
          <div className="w-16 h-16 mb-6 flex items-center justify-center bg-[#201f1f] rounded-full border border-white/5">
            <span className="text-[#ffb77d] text-4xl">🍪</span>
          </div>
          <h1 className="text-4xl font-extrabold text-[#ffb77d] tracking-tighter">ALFA TIER</h1>
          <p className="text-[#dbc2b0] mt-2 opacity-70">El archivo definitivo de alfajores.</p>
        </header>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 w-full">
          {/* Tabs */}
          <div className="flex p-1 bg-[#0e0e0e] rounded-lg mb-6 border border-white/5">
            <button
              onClick={() => {
                setModo("login");
                setMensaje(null);
              }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                modo === "login" ? "bg-[#ffb77d] text-[#4d2600]" : "text-[#dbc2b0]"
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => {
                setModo("registro");
                setMensaje(null);
              }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                modo === "registro" ? "bg-[#ffb77d] text-[#4d2600]" : "text-[#dbc2b0]"
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Formulario condicional */}
          {modo === "login" ? (
            <form action={manejarLogin} className="flex flex-col gap-4">
              <label className="text-xs text-[#dbc2b0] ml-1">Usuario</label>
              <input
                name="username"
                className="bg-[#0e0e0e] border border-white/10 text-[#e5e2e1] rounded-lg px-4 py-3 placeholder:text-white/20"
                placeholder="nombredeusuario"
                type="text"
                required
              />
              <label className="text-xs text-[#dbc2b0] ml-1">Contraseña</label>
              <input
                name="password"
                className="bg-[#0e0e0e] border border-white/10 text-[#e5e2e1] rounded-lg px-4 py-3 placeholder:text-white/20"
                placeholder="••••••••"
                type="password"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#ffb77d] text-[#4d2600] font-bold py-3 rounded-lg mt-4"
              >
                Ingresar
              </button>
              {mensaje && (
                <p
                  className={
                    mensaje.success
                      ? "text-green-400 text-sm text-center"
                      : "text-red-400 text-sm text-center"
                  }
                >
                  {mensaje.message}
                </p>
              )}
            </form>
          ) : (
            <form action={manejarRegistro} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="nombre"
                  className="bg-[#0e0e0e] border border-white/10 text-[#e5e2e1] rounded-lg px-4 py-3 placeholder:text-white/20"
                  placeholder="Nombre"
                  type="text"
                  required
                />
                <input
                  name="apellido"
                  className="bg-[#0e0e0e] border border-white/10 text-[#e5e2e1] rounded-lg px-4 py-3 placeholder:text-white/20"
                  placeholder="Apellido"
                  type="text"
                  required
                />
              </div>
              <input
                name="username"
                className="bg-[#0e0e0e] border border-white/10 text-[#e5e2e1] rounded-lg px-4 py-3 placeholder:text-white/20"
                placeholder="elegí_tu_alias"
                type="text"
                required
              />
              <input
                name="password"
                className="bg-[#0e0e0e] border border-white/10 text-[#e5e2e1] rounded-lg px-4 py-3 placeholder:text-white/20"
                placeholder="Mínimo 8 caracteres"
                type="password"
                required
                minLength={8}
              />
              <button
                type="submit"
                className="w-full bg-[#ffb77d] text-[#4d2600] font-bold py-3 rounded-lg mt-4"
              >
                Crear cuenta
              </button>
              {mensaje && (
                <p
                  className={
                    mensaje.success
                      ? "text-green-400 text-sm text-center"
                      : "text-red-400 text-sm text-center"
                  }
                >
                  {mensaje.message}
                </p>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}