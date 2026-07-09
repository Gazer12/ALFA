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
  const [arrastrando, setArrastrando] = useState<number | null>(null);

  function tierDeAlfajor(alfajorId: number) {
    return items.find((i) => i.alfajor_id === alfajorId)?.tier_id ?? null;
  }

  async function moverATier(alfajorId: number, tierId: number) {
    setItems((prev) => {
      const sinEsteAlfajor = prev.filter((i) => i.alfajor_id !== alfajorId);
      return [...sinEsteAlfajor, { alfajor_id: alfajorId, tier_id: tierId }];
    });
    await asignarTier(alfajorId, tierId, usuarioId);
  }

  // --- Handlers de drag & drop ---
  function handleDragStart(alfajorId: number) {
    setArrastrando(alfajorId);
  }

  function handleDragEnd() {
    setArrastrando(null);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault(); // obligatorio, sino el navegador no permite soltar
  }

  function handleDrop(e: React.DragEvent, tierId: number) {
    e.preventDefault();
    if (arrastrando !== null) {
      moverATier(arrastrando, tierId);
    }
    setArrastrando(null);
  }

  const coincide = (alfajor: Alfajor) =>
    alfajor.nombre.toLowerCase().includes(busqueda.toLowerCase());

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
            <p className="text-[#dbc2b0]">Arrastrá cada alfajor al tier que le corresponda.</p>
          </div>
          <input
            className="w-full md:w-80 bg-[#080808] border border-white/10 rounded-xl py-3 px-4 text-[#e5e2e1] placeholder:text-white/30"
            placeholder="Buscar alfajor..."
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </section>

        {/* Tierlist */}
        <div className="space-y-1 rounded-xl overflow-hidden border border-white/5 mb-12">
          {tiers.map((tier) => {
            const alfajoresDeEsteTier = alfajores.filter(
              (a) => tierDeAlfajor(a.id) === tier.id && coincide(a)
            );
            return (
              <div
                key={tier.id}
                className="flex"
                style={{ minHeight: "120px", background: "#1A1A1A" }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, tier.id)}
              >
                <div
                  className="w-24 flex items-center justify-center font-extrabold text-lg text-black text-center px-2 shrink-0"
                  style={{ backgroundColor: tier.color }}
                >
                  {tier.nombre}
                </div>
                <div className="flex-1 p-4 flex items-center gap-4 overflow-x-auto flex-wrap">
                  {alfajoresDeEsteTier.length === 0 && (
                    <span className="italic text-[#dbc2b0]/40 text-sm">
                      Soltá acá un alfajor.
                    </span>
                  )}
                  {alfajoresDeEsteTier.map((alfajor) => (
                    <div
                      key={alfajor.id}
                      draggable
                      onDragStart={() => handleDragStart(alfajor.id)}
                      onDragEnd={handleDragEnd}
                      className={`flex flex-col items-center gap-1 w-16 shrink-0 cursor-grab active:cursor-grabbing ${
                        arrastrando === alfajor.id ? "opacity-30" : ""
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full bg-[#201f1f] overflow-hidden border-2 border-white/10 pointer-events-none">
                        {alfajor.imagen_url && (
                          <img src={alfajor.imagen_url} alt={alfajor.nombre} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-[10px] text-center text-[#dbc2b0] pointer-events-none">
                        {alfajor.nombre}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Alfajores sin clasificar */}
        <h2 className="text-xl font-bold mb-4">Sin clasificar</h2>
        <div
          className="flex flex-wrap gap-4 min-h-[80px] p-2 rounded-xl border border-dashed border-white/10"
          onDragOver={handleDragOver}
          onDrop={(e) => {
            e.preventDefault();
            // Soltar acá "desclasifica": lo sacamos de items
            if (arrastrando !== null) {
              setItems((prev) => prev.filter((i) => i.alfajor_id !== arrastrando));
              setArrastrando(null);
            }
          }}
        >
          {alfajores
            .filter((a) => tierDeAlfajor(a.id) === null && coincide(a))
            .map((alfajor) => (
              <div
                key={alfajor.id}
                draggable
                onDragStart={() => handleDragStart(alfajor.id)}
                onDragEnd={handleDragEnd}
                className={`flex flex-col items-center gap-2 w-20 cursor-grab active:cursor-grabbing ${
                  arrastrando === alfajor.id ? "opacity-30" : ""
                }`}
              >
                <div className="w-20 h-20 rounded-full bg-[#201f1f] overflow-hidden border-2 border-white/10 pointer-events-none">
                  {alfajor.imagen_url && (
                    <img src={alfajor.imagen_url} alt={alfajor.nombre} className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="text-xs text-center text-[#dbc2b0] pointer-events-none">{alfajor.nombre}</span>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}