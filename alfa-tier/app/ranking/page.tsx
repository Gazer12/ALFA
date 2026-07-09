import { supabase } from "@/lib/supabase";

// Forzamos a Next.js a que busque siempre datos frescos de Supabase en cada visita
export const dynamic = "force-dynamic";

export default async function RankingPage() {
  const { data: ranking } = await supabase
    .from("ranking_alfajores")
    .select("*")
    .order("puntaje_promedio", { ascending: false });

  const lista = ranking || [];
  const [primero, ...resto] = lista;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#e5e2e1]">
      <header className="w-full sticky top-0 bg-[#0F0F0F] border-b border-white/10 z-50 flex justify-between items-center px-4 md:px-24 py-6">
        <span className="text-2xl font-extrabold tracking-tighter text-[#ffb77d]">ALFA TIER</span>
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-[#dbc2b0] text-sm font-semibold" href="/dashboard">Mi Tierlist</a>
          <a className="text-[#ffb77d] text-sm font-semibold" href="/ranking">Ranking General</a>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-24 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#ffb77d] mb-2 text-xs uppercase tracking-widest font-semibold">
            ★ Hall of Fame
          </div>
          <h2 className="text-3xl font-bold mb-2">Ranking General</h2>
          <p className="text-[#dbc2b0] max-w-2xl">
            La autoridad máxima en el mundo del alfajor. Basado en los votos de la comunidad.
          </p>
        </div>

        {lista.length === 0 && (
          <p className="text-[#dbc2b0] italic">Todavía nadie clasificó ningún alfajor.</p>
        )}

        {primero && (
          <div className="relative overflow-hidden rounded-xl bg-[#1c1b1b] border border-[#ffb77d]/30 p-4 flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#ffb77d]"></div>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#ffb77d]/10 border border-[#ffb77d]/20 shrink-0 text-3xl">
              🏆
            </div>
            <div className="w-full md:w-48 h-48 md:h-32 rounded-lg overflow-hidden border border-white/5 shrink-0 bg-[#2a2a2a]">
              {primero.imagen_url && (
                <img src={primero.imagen_url} alt={primero.nombre} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-grow flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#ffb77d] font-bold">#1</span>
                <span className="text-[#dbc2b0] text-xs uppercase">
                  {primero.cantidad_votos} voto{primero.cantidad_votos === 1 ? "" : "s"}
                </span>
              </div>
              <h3 className="text-xl font-bold">{primero.nombre}</h3>
              <p className="text-[#dbc2b0]">{primero.marca}</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="text-[#ffb77d] text-4xl font-extrabold">{primero.puntaje_promedio}</div>
              <div className="text-[#dbc2b0] text-xs uppercase tracking-widest">Puntaje Alfa</div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {resto.map((alfajor, index) => (
            <div key={alfajor.id} className="bg-[#0e0e0e] border border-white/10 p-3 rounded-xl flex items-center gap-4">
              <div className="w-10 text-center font-bold text-[#dbc2b0] text-lg">#{index + 2}</div>
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/5 bg-[#2a2a2a]">
                {alfajor.imagen_url && (
                  <img src={alfajor.imagen_url} alt={alfajor.nombre} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold">{alfajor.nombre}</h4>
                <p className="text-[#dbc2b0] text-sm">{alfajor.marca}</p>
              </div>
              <div className="text-[#ffb77d] font-bold text-xl px-4">{alfajor.puntaje_promedio}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}