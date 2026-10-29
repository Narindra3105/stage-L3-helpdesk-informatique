type TailleAvatar = 'sm' | 'lg';

const tailles: Record<TailleAvatar, string> = {
  sm: 'h-7 w-7 text-xs',
  lg: 'h-12 w-12 text-lg',
};

interface AvatarProps {
  texte: string;
  taille?: TailleAvatar;
}

export default function Avatar({ texte, taille = 'sm' }: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700 ${tailles[taille]}`}
    >
      {texte.toUpperCase()}
    </div>
  );
}