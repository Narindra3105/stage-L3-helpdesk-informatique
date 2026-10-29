import { useState } from 'react';
import CategoriesSection from '../components/parametres/CategoriesSection';
import PrioritesSection from '../components/parametres/PrioritesSection';
import SlaSection from '../components/parametres/SlaSection';
import StatutsSection from '../components/parametres/StatutsSection';

export default function ParametresPage() {
  const [versionPriorites, setVersionPriorites] = useState<number>(0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
      <p className="mt-1 text-sm text-slate-500">
        Priorités, délais SLA, statuts et catégories
      </p>

      <div className="mt-6 space-y-6">
        <PrioritesSection onModification={() => setVersionPriorites((v) => v + 1)} />
        <SlaSection key={versionPriorites} />
        <StatutsSection />
        <CategoriesSection />
      </div>
    </div>
  );
}