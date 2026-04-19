import Image from 'next/image';

interface AvatarProps {
  src: string;
  size: number;
  alt?: string;
  className?: string;
  variant?: 'default' | 'soft';
}

const Avatar = ({
  src,
  size,
  alt = 'Member portrait',
  className,
  variant = 'default'
}: AvatarProps) => {
  const baseClasses =
    variant === 'soft'
      ? [
          'rounded-full',
          'aspect-square',
          'object-cover',
          'border',
          'border-white/85',
          'ring-2',
          'ring-rose-200/45',
          'shadow-[0_16px_28px_-20px_rgba(44,36,32,0.28)]',
          'transition-transform',
          'duration-300'
        ]
      : [
          'rounded-full',
          'aspect-square',
          'object-cover',
          'border-2',
          'border-garnet-500/60',
          'ring-4',
          'ring-gold-400/30',
          'shadow-[0_32px_60px_-34px_rgba(124,74,158,0.55)]',
          'transition-transform',
          'duration-300'
        ];

  if (className) {
    baseClasses.push(className);
  }

  return (
    <Image
      src={src}
      width={size}
      height={size}
      alt={alt}
      loading="lazy"
      className={baseClasses.join(' ')}
    />
  );
};

export default Avatar;
