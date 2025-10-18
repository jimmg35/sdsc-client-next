import { MemberData } from '@/lib/members';
import Link from 'next/link';
import Avatar from '../Avatar';

const ProfileCard = ({
  id,
  thumbnail,
  name,
  title,
  centerRole,
  advisor
}: MemberData) => {
  return (
    <Link
      href={`/member/${id}`}
      className="group glass-card flex w-[19.5rem] flex-col items-center overflow-hidden text-gold-100 transition duration-300 ease-out hover:-translate-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
    >
      <div className="relative flex w-full flex-col items-center gap-6 px-6 pb-10 pt-10 text-center">
        <span className="chip-gold">
          {centerRole ? centerRole : 'SDSC Member'}
        </span>
        <div className="halo transition-transform duration-300 ease-out group-hover:scale-[1.04]">
          <Avatar
            src={thumbnail}
            size={160}
            alt={`${name} portrait`}
            className="group-hover:scale-[1.02]"
          />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-semibold text-gold-50 text-glow">{name}</p>
          {title && <p className="text-sm text-gold-300/70">{title}</p>}
          {advisor && (
            <p className="text-xs text-gold-300/60">Advisor: {advisor}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
