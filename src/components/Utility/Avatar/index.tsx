import { withBasePath } from '@/lib/base-path';
import Image from 'next/image';

interface AvatarProps {
  src: string;
  size: number;
  alt?: string;
  className?: string;
}

const Avatar = ({
  src,
  size,
  alt = 'Member portrait',
  className
}: AvatarProps) => {
  const baseClasses = [
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
      src={withBasePath(src)}
      width={size}
      height={size}
      alt={alt}
      loading="lazy"
      className={baseClasses.join(' ')}
    />
  );
};

export default Avatar;
