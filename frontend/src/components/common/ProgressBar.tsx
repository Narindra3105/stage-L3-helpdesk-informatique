interface ProgressBarProps {
  pourcentage: number;
  danger?: boolean;
}

export default function ProgressBar({ pourcentage, danger = false }: ProgressBarProps) {
  return (
    <div className="h-2 rounded-full bg-slate-100">
      <div
        className={`h-2 rounded-full ${danger ? 'bg-red-500' : 'bg-blue-700'}`}
        style={{ width: `${pourcentage}%` }}
      />
    </div>
  );
}