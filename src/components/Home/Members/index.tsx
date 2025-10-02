import Avatar from '@/components/Utility/Avatar';
import { MemberData, getMemberById } from '@/lib/members';
import Link from 'next/link';
import Heading from '../Heading';

const resolveMembers = (entries: Array<MemberData | null>): MemberData[] =>
  entries.filter((entry): entry is MemberData => Boolean(entry));

const Members = () => {
  const featuredMembers = resolveMembers([
    getMemberById('stewart-fotheringham'),
    getMemberById('ziqi-li'),
    getMemberById('mason-mathews'),
    getMemberById('mehak-sachdeva')
  ]);

  return (
    <section className="surface-fade relative overflow-hidden px-6 py-12 md:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_-10%,_rgba(124,74,158,0.35),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_20%_-20%,_rgba(189,156,99,0.32),_transparent_60%)]" />

      <div className="relative flex flex-col items-center gap-6 text-center text-gold-100">
        <span className="chip-gold">People</span>
        <Heading title="The SDSC Collective" />
        <p className="max-w-2xl text-sm text-gold-200/75 md:text-base">
          A multidisciplinary team of faculty and graduate innovators shaping
          immersive spatial experiences, equitable analytics, and data
          storytelling.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
          {featuredMembers.map((member) => (
            <Link
              key={member.id}
              href={`/member/${member.id}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="halo transition-transform duration-300 ease-out group-hover:scale-[1.04]">
                <Avatar
                  src={member.thumbnail}
                  size={140}
                  alt={`${member.name} portrait`}
                  className="group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.26em] text-gold-200 transition-colors group-hover:text-gold-50">
                {member.name}
              </p>
              <p className="mt-1 text-[0.7rem] text-gold-300/70">
                {member.title}
              </p>
            </Link>
          ))}
          <Link
            className="group flex h-[140px] w-[140px] flex-col items-center justify-center rounded-full border border-garnet-500/30 bg-[#120922]/80 text-xs font-semibold uppercase tracking-[0.26em] text-gold-200 transition hover:border-garnet-400/40 hover:text-gold-50"
            href="/member"
          >
            Explore All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Members;
