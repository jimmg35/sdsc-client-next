import type { MemberBadge } from '@/lib/members';
import Image from 'next/image';
import Link from 'next/link';

/* Clarivate's guidance has the ribbon hang from the top-right edge of the
   picture. It straddles the frame's right edge rather than sitting inside it,
   so it covers the background and not the face. Put it inside the portrait
   frame's `relative` wrapper. */
export default function PortraitRibbon({ badge }: { badge: MemberBadge }) {
  const ribbon = (
    <Image
      src={badge.image}
      alt={badge.label}
      width={badge.width}
      height={badge.height}
      className="h-auto w-full"
    />
  );

  const className =
    'absolute right-0 top-0 z-10 block w-[5.5rem] translate-x-1/2 drop-shadow-[0_6px_10px_rgba(30,16,60,0.28)] transition-transform duration-300';

  if (!badge.href) {
    return <span className={className}>{ribbon}</span>;
  }

  const external = /^https?:\/\//.test(badge.href);

  return (
    <Link
      href={badge.href}
      title={badge.label}
      className={`${className} hover:translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/70`}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      {ribbon}
    </Link>
  );
}
