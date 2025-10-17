import { ArrowDownToLine } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CURRENT_VERSION = '2.2.1';

interface AppCardProps {
  title: string;
  description: string;
  imageUrl: string;
  href?: string;
  meta?: string;
}

const AppCard = ({
  title,
  description,
  imageUrl,
  href,
  meta
}: AppCardProps) => {
  const card = (
    <div className="glass-card group relative flex h-full flex-col justify-between overflow-hidden px-6 py-8 text-left text-gold-100 transition duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-garnet-600/35 via-transparent to-gold-400/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start gap-4">
        <div className="halo">
          <Image
            src={imageUrl}
            alt={title}
            width={72}
            height={72}
            className="rounded-xl"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gold-50 text-glow">
            {title}
          </h3>
          {meta && (
            <p className="mt-1 text-xs uppercase tracking-[0.26em] text-gold-300/80">
              {meta}
            </p>
          )}
          <p className="mt-1 text-xs uppercase tracking-[0.26em] text-gold-300/60">
            Version {CURRENT_VERSION}
          </p>
        </div>
      </div>
      <p className="relative mt-6 text-sm text-gold-200/80">{description}</p>
      <div className="relative mt-8 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.26em] text-gold-300">
        <span>Download</span>
        <ArrowDownToLine
          size={18}
          className="transition-transform duration-300 group-hover:translate-y-0.5 group-hover:scale-110"
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block h-full"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {card}
      </Link>
    );
  }

  return card;
};

export default AppCard;
