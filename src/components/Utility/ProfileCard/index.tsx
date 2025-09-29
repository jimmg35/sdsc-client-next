import { MemberData } from '@/lib/members';
import { ArrowUpRight, UserRound } from 'lucide-react';
import Link from 'next/link';
import Avatar from '../Avatar';

const ProfileCard = ({ id, thumbnail, name, title, cvPath }: MemberData) => {
  return (
    <article className="group glass-card flex w-[19.5rem] flex-col justify-between overflow-hidden text-ink-900 transition duration-300 ease-out hover:-translate-y-3">
      <div className="relative flex flex-col items-center gap-6 px-6 pb-8 pt-10 text-center">
        <span className="chip-gold">SDSC Member</span>
        <div className="halo transition-transform duration-300 ease-out group-hover:scale-[1.04]">
          <Avatar
            src={thumbnail}
            size={160}
            alt={`${name} portrait`}
            className="group-hover:scale-[1.02]"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-semibold text-garnet-700 text-glow">
            {name}
          </p>
          {title && <p className="text-sm text-ink-500">{title}</p>}
        </div>
      </div>

      <div className="relative overflow-hidden border-t border-garnet-200/60 bg-white/70">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-garnet-300/40 via-transparent to-garnet-300/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative grid grid-cols-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
          <Link
            href={`/member/${id}`}
            className="flex items-center justify-center gap-2 py-4 text-garnet-600 transition duration-300 hover:bg-garnet-100/50 hover:text-garnet-700"
          >
            <UserRound size={16} className="-translate-y-[1px]" />
            Profile
          </Link>
          {cvPath ? (
            <Link
              href={cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 text-garnet-600 transition duration-300 hover:bg-garnet-100/50 hover:text-garnet-700"
            >
              <ArrowUpRight size={16} className="-translate-y-[1px]" />
              C.V.
            </Link>
          ) : (
            <span className="flex items-center justify-center gap-2 py-4 text-ink-300">
              <ArrowUpRight size={16} className="-translate-y-[1px]" />
              C.V.
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProfileCard;
