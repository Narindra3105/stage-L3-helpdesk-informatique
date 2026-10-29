import CategoriesSection from '../components/parametres/CategoriesSection';
import SlaSection from '../components/parametres/SlaSection';

export default function ParametresPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
      <p className="mt-1 text-sm text-slate-500">Délais SLA et catégories</p>

      <div className="mt-6 space-y-6">
        <SlaSection />
        <CategoriesSection />
      </div>
    </div>
  );
}