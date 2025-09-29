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
    'border-garnet-200/80',
    'ring-4',
    'ring-gold-100/80',
    'shadow-[0_26px_44px_-28px_rgba(120,47,64,0.32)]',
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
