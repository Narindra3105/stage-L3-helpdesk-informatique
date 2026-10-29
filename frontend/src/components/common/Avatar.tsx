interface AvatarProps {
  texte: string;
}

export default function Avatar({ texte }: AvatarProps) {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
      {texte.toUpperCase()}
    </div>
  );
}