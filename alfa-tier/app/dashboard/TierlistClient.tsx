"use client";

import { useState } from "react";
import { asignarTier, cerrarSesion } from "./actions";

const tiers = [
  { id: 5, nombre: "Le entrego mi sueldo", color: "#FFD700" },
  { id: 4, nombre: "Se ganó mi corazón", color: "#4ADE80" },
  { id: 3, nombre: "El campeón del pueblo", color: "#FACC15" },
  { id: 2, nombre: "Safa no es gran cosa", color: "#FB923C" },
  { id: 1, nombre: "Ni en mi peores antojos", color: "#F87171" },
];

type Alfajor = {
  id: number;
  nombre: string;
  marca: string;
  imagen_url: string | null;
};

type TierlistItem = {
  alfajor_id: number;
  tier_id: number;
};

export default function TierlistClient({
  alfajoresIniciales,
  itemsIniciales,
  usuarioId,
}: {
  alfajoresIniciales: Alfajor[];
  itemsIniciales: TierlistItem[];
  usuarioId: number;
}) {
  const [alfajores] = useState<Alfajor[]>(alfajoresIniciales);
  const [items, setItems] = useState<TierlistItem[]>(itemsIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

  function tierDeAlfajor(alfajorId: number) {
    return items.find((i) => i.alfajor_id === alfajorId)?.tier_id ?? null;
  }

  async function elegirTier(alfajorId: number, tierId: number) {
    setMenuAbierto(null);
    setItems((prev) => {
      const sinEsteAlfajor = prev.filter((i) => i.alfajor_id !== alfajorId);
      return [...sinEsteAlfajor, { alfajor_id: alfajorId, tier_id: tierId }];
    });
    await asignarTier(alfajorId, tierId, usuarioId);
  }

  const alfajoresFiltrados = alfajores.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  const sinClasificar = alfajoresFiltrados.filter((a) => tierDeAlfajor(a.id) === null);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#e5e2e1]">
      <header className="w-full sticky top-0 bg-[#0F0F0F] border-b border-white/10 z-50 flex justify-between items-center px-4 md:px-24 py-6">
        <span className="text-2xl font-extrabold tracking-tighter text-[#ffb77d]">ALFA TIER</span>
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-[#ffb77d] text-sm font-semibold" href="/dashboard">Mi Tierlist</a>
          <a className="text-[#dbc2b0] text-sm font-semibold" href="/ranking">Ranking General</a>
        </nav>
        <button onClick={() => cerrarSesion()} className="text-[#dbc2b0]">Salir</button>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-24 py-12">
        <section className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Mi Selección</h1>
            <p className="text-[#dbc2b0]">Organiza tus favoritos y definí tu paladar gourmet.</p>
          </div>
          <input
            className="w-full md:w-80 bg-[#080808] border border-white/10 rounded-xl py-3 px-4 text-[#e5e2e1] placeholder:text-white/30"
            placeholder="Buscar alfajor..."
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </section>

        <div className="space-y-1 rounded-xl overflow-hidden border border-white/5 mb-12">
          {tiers.map((tier) => {
            const alfajoresDeEsteTier = alfajores.filter((a) => tierDeAlfajor(a.id) === tier.id);
            return (
              <div key={tier.id} className="flex" style={{ minHeight: "120px", background: "#1A1A1A" }}>
                <div
                  className="w-24 flex items-center justify-center font-extrabold text-lg text-black text-center px-2"
                  style={{ backgroundColor: tier.color }}
                >
                  {tier.nombre}
                </div>
                <div className="flex-1 p-4 flex items-center gap-4 overflow-x-auto flex-wrap">
                  {alfajoresDeEsteTier.length === 0 && (
                    <span className="italic text-[#dbc2b0]/40 text-sm">Sin alfajores en este rango todavía.</span>
                  )}
                  {alfajoresDeEsteTier.map((alfajor) => (
                    <div key={alfajor.id} className="relative flex flex-col items-center gap-1 w-16 shrink-0">
                      <button
                        onClick={() => setMenuAbierto(menuAbierto === alfajor.id ? null : alfajor.id)}
                        className="w-16 h-16 rounded-full bg-[#201f1f] overflow-hidden border-2 border-white/10 hover:border-[#ffb77d] transition-all"
                      >
                        {alfajor.imagen_url && (
                          <img src={alfajor.imagen_url} alt={alfajor.nombre} className="w-full h-full object-cover" />
                        )}
                      </button>
                      <span className="text-[10px] text-center text-[#dbc2b0]">{alfajor.nombre}</span>
                      {menuAbierto === alfajor.id && (
                        <div className="absolute top-full mt-2 z-10 bg-[#1a1a1a] border border-white/10 rounded-lg p-2 flex flex-col gap-1 w-40">
                          {tiers.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => elegirTier(alfajor.id, t.id)}
                              className="text-xs text-left px-2 py-1 rounded hover:bg-white/10"
                              style={{ color: t.color }}
                            >
                              {t.nombre}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="text-xl font-bold mb-4">Sin clasificar</h2>
        <div className="flex flex-wrap gap-4">
          {sinClasificar.map((alfajor) => (
            <div key={alfajor.id} className="relative flex flex-col items-center gap-2 w-20">
              <button
                onClick={() => setMenuAbierto(menuAbierto === alfajor.id ? null : alfajor.id)}
                className="w-20 h-20 rounded-full bg-[#201f1f] overflow-hidden border-2 border-white/10 hover:border-[#ffb77d] transition-all"
              >
                {alfajor.imagen_url && (
                  <img src={alfajor.imagen_url} alt={alfajor.nombre} className="w-full h-full object-cover" />
                )}
              </button>
              <span className="text-xs text-center text-[#dbc2b0]">{alfajor.nombre}</span>
              {menuAbierto === alfajor.id && (
                <div className="absolute top-full mt-2 z-10 bg-[#1a1a1a] border border-white/10 rounded-lg p-2 flex flex-col gap-1 w-44">
                  {tiers.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => elegirTier(alfajor.id, t.id)}
                      className="text-xs text-left px-2 py-1 rounded hover:bg-white/10"
                      style={{ color: t.color }}
                    >
                      {t.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}