import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  COULEUR_BARRE,
  COULEUR_GRILLE,
  COULEUR_SURVOL,
  COULEUR_TEXTE,
} from '../../utils/couleursGraphique';
import type { JourActivite } from '../../utils/activiteTechnicien';

interface ActivityChartProps {
  jours: JourActivite[];
}

export default function ActivityChart({ jours }: ActivityChartProps) {
  const aucuneDonnee = jours.every((j) => j.resolus === 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-900">Tickets résolus par jour</h2>

      {aucuneDonnee ? (
        <p className="mt-4 text-sm text-slate-500">Aucun ticket résolu cette semaine.</p>
      ) : (
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={jours} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={COULEUR_GRILLE} vertical={false} />
              <XAxis
                dataKey="jour"
                tick={{ fill: COULEUR_TEXTE, fontSize: 12 }}
                axisLine={{ stroke: COULEUR_GRILLE }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: COULEUR_TEXTE, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip cursor={{ fill: COULEUR_SURVOL }} />
              <Bar
                dataKey="resolus"
                name="Tickets résolus"
                fill={COULEUR_BARRE}
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}