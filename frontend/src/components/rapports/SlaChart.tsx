import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SlaSemaine } from '../../types/stats';

const COULEUR_BARRE = '#6F8FBF';
const COULEUR_GRILLE = '#E5E9F0';
const COULEUR_TEXTE = '#64748B';
const COULEUR_SURVOL = '#F1F5F9';

interface SlaChartProps {
  semaines: SlaSemaine[];
}

export default function SlaChart({ semaines }: SlaChartProps) {
  const aucuneDonnee = semaines.every((s) => s.respect_sla === null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Respect du SLA par semaine (%)</h2>

      {aucuneDonnee ? (
        <p className="mt-4 text-sm text-slate-500">
          Aucun ticket avec un délai SLA sur cette période.
        </p>
      ) : (
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={semaines} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COULEUR_GRILLE} vertical={false} />
              <XAxis
                dataKey="semaine"
                tick={{ fill: COULEUR_TEXTE, fontSize: 12 }}
                axisLine={{ stroke: COULEUR_GRILLE }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(valeur) => `${valeur}%`}
                tick={{ fill: COULEUR_TEXTE, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip cursor={{ fill: COULEUR_SURVOL }} formatter={(valeur) => `${valeur} %`} />
              <Bar
                dataKey="respect_sla"
                name="Respect du SLA"
                fill={COULEUR_BARRE}
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-400">
        S6 correspond aux 7 derniers jours, S1 aux jours les plus anciens (6 semaines au total).
      </p>
    </div>
  );
}