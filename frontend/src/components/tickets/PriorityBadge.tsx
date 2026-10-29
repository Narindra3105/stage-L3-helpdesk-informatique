interface PriorityBadgeProps {
  nom: string;
  couleur: string;
}

export default function PriorityBadge({ nom, couleur }: PriorityBadgeProps) {
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${couleur}1A`, color: couleur }}
    >
      {nom}
    </span>
  );
}