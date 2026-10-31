import { Link } from 'react-router-dom';

interface EnConstructionProps {
  titre: string;
  message: string;
}

export default function EnConstruction({ titre, message }: EnConstructionProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{titre}</h1>
      <div className="mt-6 max-w-xl rounded-xl border border-dashed border-slate-300 bg-white p-6">
        <p className="text-sm text-slate-600">{message}</p>
        <Link
          to="/tickets"
          className="mt-4 inline-block text-sm font-medium text-blue-700 hover:underline"
        >
          Voir les tickets
        </Link>
      </div>
    </div>
  );
}