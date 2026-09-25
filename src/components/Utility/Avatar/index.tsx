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
          'ring-primary-200/45',
          'shadow-lift-sm',
          'transition-transform',
          'duration-300'
        ]
      : [
          'rounded-full',
          'aspect-square',
          'object-cover',
          'border-2',
          'border-primary-500/60',
          'ring-4',
          'ring-accent-400/30',
          'shadow-glow-lg',
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
