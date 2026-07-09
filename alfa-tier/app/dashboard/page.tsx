"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

export default function DashboardPage() {
  const [alfajores, setAlfajores] = useState<Alfajor[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      const { data } = await supabase.from("alfajores").select("*");
      setAlfajores(data || []);
    }
    cargarDatos();
  }, []);

  const alfajoresFiltrados = alfajores.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#e5e2e1]">
      <header className="w-full sticky top-0 bg-[#0F0F0F] border-b border-white/10 z-50 flex justify-between items-center px-4 md:px-24 py-6">
        <span className="text-2xl font-extrabold tracking-tighter text-[#ffb77d]">ALFA TIER</span>
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-[#ffb77d] text-sm font-semibold" href="#">Mi Tierlist</a>
          <a className="text-[#dbc2b0] text-sm font-semibold" href="#">Ranking General</a>
        </nav>
        <button className="text-[#dbc2b0]">Salir</button>
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

        {/* Tierlist (vacía por ahora, la llenamos en el próximo paso) */}
        <div className="space-y-1 rounded-xl overflow-hidden border border-white/5 mb-12">
          {tiers.map((tier) => (
            <div key={tier.id} className="flex" style={{ minHeight: "120px", background: "#1A1A1A" }}>
              <div
                className="w-24 flex items-center justify-center font-extrabold text-lg text-black text-center px-2"
                style={{ backgroundColor: tier.color }}
              >
                {tier.nombre}
              </div>
              <div className="flex-1 p-4 flex items-center gap-4 overflow-x-auto italic text-[#dbc2b0]/40 text-sm">
                Sin alfajores en este rango todavía.
              </div>
            </div>
          ))}
        </div>

        {/* Lista de todos los alfajores disponibles */}
        <h2 className="text-xl font-bold mb-4">Todos los alfajores</h2>
        <div className="flex flex-wrap gap-4">
          {alfajoresFiltrados.map((alfajor) => (
            <div
              key={alfajor.id}
              className="flex flex-col items-center gap-2 w-20"
            >
              <div className="w-20 h-20 rounded-full bg-[#201f1f] overflow-hidden border-2 border-white/10">
                {alfajor.imagen_url && (
                  <img
                    src={alfajor.imagen_url}
                    alt={alfajor.nombre}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="text-xs text-center text-[#dbc2b0]">{alfajor.nombre}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}